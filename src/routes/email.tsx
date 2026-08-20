import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, RefreshCw, Sparkles, Scissors, BadgeCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/workai.functions";
import { bumpStat } from "@/lib/workai-store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkAI" },
      {
        name: "description",
        content: "Generate professional workplace emails with AI in seconds using WorkAI.",
      },
      { property: "og:title", content: "Smart Email Generator — WorkAI" },
      {
        property: "og:description",
        content: "Describe the purpose and key points, and WorkAI drafts the email for you.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Formal", "Concise", "Persuasive"];
const LENGTHS = ["Short", "Medium", "Long"];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState(
    "Request a one-week extension on the quarterly report deadline",
  );
  const [recipient, setRecipient] = useState("Sarah Chen, Head of Finance");
  const [keyPoints, setKeyPoints] = useState(
    "- Data from the new CRM arrived late\n- Draft is 70% complete\n- Can deliver by next Friday",
  );
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate(adjustment?: string) {
    if (!purpose.trim()) {
      toast.error("Please describe the purpose of the email.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({
        data: {
          purpose,
          recipient,
          keyPoints,
          tone,
          length,
          ...(adjustment ? { adjustment, previous: result } : {}),
        },
      });
      setResult(res.text.trim());
      bumpStat("emails");
    } catch (e) {
      console.error(e);
      toast.error("We couldn't generate that email right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    toast.success("Email copied to clipboard");
  }

  return (
    <AppShell
      title="Smart Email Generator"
      description="Write professional emails in seconds."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="panel space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Textarea
              id="purpose"
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea
              id="points"
              rows={5}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Desired length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full" disabled={loading} onClick={() => generate()}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? "Generating…" : "Generate Email"}
          </Button>
          <p className="text-xs text-muted-foreground">
            WorkAI never sends emails automatically — you always review and send yourself.
          </p>
        </div>

        <div className="panel flex flex-col p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Generated email</h2>
            <span className="text-xs text-muted-foreground">Editable draft</span>
          </div>
          <Textarea
            className="mt-4 min-h-[340px] flex-1 font-mono text-[13px]"
            placeholder="Your AI-generated email will appear here…"
            value={loading && !result ? "Generating your email…" : result}
            onChange={(e) => setResult(e.target.value)}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" disabled={!result} onClick={copy}>
              <Copy className="size-4" /> Copy
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={loading || !result}
              onClick={() => generate("Regenerate a fresh version with different phrasing.")}
            >
              <RefreshCw className="size-4" /> Regenerate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={loading || !result}
              onClick={() => generate("Make the email noticeably shorter while keeping all key points.")}
            >
              <Scissors className="size-4" /> Make shorter
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={loading || !result}
              onClick={() => generate("Make the email more formal and professional in tone.")}
            >
              <BadgeCheck className="size-4" /> Make more professional
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
