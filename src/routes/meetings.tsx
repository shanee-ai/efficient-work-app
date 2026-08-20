import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/workai.functions";
import { bumpStat } from "@/lib/workai-store";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkAI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary, key points, decisions, action items and follow-ups.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkAI" },
      {
        property: "og:description",
        content: "AI meeting summaries with action items and owners, grounded in your notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

type Summary = {
  summary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: { task: string; owner: string; deadline: string }[];
  followUps: string[];
};

const DEMO_NOTES = `Priya opened with the Q3 revenue update - we are 8% below target, mainly due to the delayed Acme renewal.
Tom said the new onboarding flow shipped on Monday and early activation is up.
We agreed to push the pricing page redesign to Q4 so the team can focus on retention.
Priya will send the revised forecast to the exec team by Friday.
Tom to run a churn analysis on accounts under 20 seats - no date set.
Open question: do we still need a dedicated support hire this quarter? Nobody could answer without the churn numbers.`;

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {items.length ? (
        <ul className="mt-2 space-y-1.5 text-sm">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm italic text-muted-foreground">Nothing stated in the notes.</p>
      )}
    </div>
  );
}

function toText(title: string, s: Summary) {
  return [
    `Meeting: ${title || "Untitled"}`,
    ``,
    `SUMMARY`,
    s.summary,
    ``,
    `KEY POINTS`,
    ...s.keyPoints.map((k) => `- ${k}`),
    ``,
    `DECISIONS`,
    ...s.decisions.map((k) => `- ${k}`),
    ``,
    `ACTION ITEMS`,
    ...s.actionItems.map(
      (a) => `- ${a.task}${a.owner ? ` (owner: ${a.owner})` : ""}${a.deadline ? ` — due ${a.deadline}` : ""}`,
    ),
    ``,
    `FOLLOW-UP QUESTIONS`,
    ...s.followUps.map((k) => `- ${k}`),
  ].join("\n");
}

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const [title, setTitle] = useState("Q3 Revenue Review");
  const [participants, setParticipants] = useState("Priya Naidoo, Tom Ellis, You");
  const [notes, setNotes] = useState(DEMO_NOTES);
  const [result, setResult] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);

  async function summarize() {
    if (!notes.trim()) {
      toast.error("Please paste your meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { title, participants, notes } });
      setResult(res);
      bumpStat("meetings");
    } catch (e) {
      console.error(e);
      toast.error("We couldn't summarise those notes right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Turn meeting notes into clear summaries and action items."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="panel space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="participants">Participants</Label>
            <Input
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              rows={14}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" disabled={loading} onClick={summarize}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {loading ? "Summarising…" : "Summarize Meeting"}
            </Button>
            <Button variant="outline" onClick={() => setNotes("")}>
              Clear
            </Button>
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Summary</h2>
            {result && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    await navigator.clipboard.writeText(toText(title, result));
                    toast.success("Summary copied to clipboard");
                  }}
                >
                  <Copy className="size-4" /> Copy
                </Button>
                <Button size="sm" variant="secondary" disabled={loading} onClick={summarize}>
                  <RefreshCw className="size-4" /> Regenerate
                </Button>
              </div>
            )}
          </div>

          {!result && !loading && (
            <p className="mt-6 text-sm text-muted-foreground">
              Your structured summary will appear here. WorkAI only uses what is written in your
              notes — it will not invent decisions, owners or deadlines.
            </p>
          )}
          {loading && (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Reading your notes…
            </div>
          )}

          {result && (
            <div className="mt-5 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Summary
                </h3>
                <p className="mt-2 text-sm leading-relaxed">{result.summary}</p>
              </div>
              <List title="Key points" items={result.keyPoints} />
              <List title="Decisions" items={result.decisions} />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Action items
                </h3>
                {result.actionItems.length ? (
                  <ul className="mt-2 space-y-2">
                    {result.actionItems.map((a, i) => (
                      <li key={i} className="rounded-lg border border-border bg-secondary/50 p-3 text-sm">
                        <p className="font-medium">{a.task}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Owner: {a.owner || "Not stated"} · Deadline: {a.deadline || "Not stated"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm italic text-muted-foreground">
                    Nothing stated in the notes.
                  </p>
                )}
              </div>
              <List title="Follow-up questions" items={result.followUps} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
