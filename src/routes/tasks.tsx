import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Plus, Sparkles, Trash2, RotateCcw, Star, Copy } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planDay } from "@/lib/workai.functions";
import { DEMO_TASKS, useTasks, type Task } from "@/lib/workai-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkAI" },
      {
        name: "description",
        content:
          "Add your tasks and let WorkAI prioritise them into a recommended schedule for the day.",
      },
      { property: "og:title", content: "AI Task Planner — WorkAI" },
      {
        property: "og:description",
        content: "Prioritise your workload and plan your day with AI.",
      },
    ],
  }),
  component: TasksPage,
});

const PRIORITIES = ["Urgent", "High", "Medium", "Low"] as const;

const PRIORITY_STYLES: Record<string, string> = {
  Urgent: "bg-destructive/10 text-destructive border-destructive/20",
  High: "bg-chart-3/15 text-chart-3 border-chart-3/25",
  Medium: "bg-accent text-accent-foreground border-border",
  Low: "bg-secondary text-secondary-foreground border-border",
};

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        PRIORITY_STYLES[priority] ?? PRIORITY_STYLES["Medium"],
      )}
    >
      {priority}
    </span>
  );
}

type Plan = {
  topPriority: { task: string; reason: string };
  schedule: { time: string; task: string; priority: string; note: string }[];
  advice: string;
};

function TasksPage() {
  const run = useServerFn(planDay);
  const { tasks, setTasks, toggle } = useTasks();
  const [draft, setDraft] = useState<Omit<Task, "id" | "done">>({
    name: "",
    description: "",
    deadline: "",
    priority: "Medium",
    duration: "",
  });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  function addTask() {
    if (!draft.name.trim()) {
      toast.error("Give the task a name first.");
      return;
    }
    setTasks((prev) => [...prev, { ...draft, id: crypto.randomUUID(), done: false }]);
    setDraft({ name: "", description: "", deadline: "", priority: "Medium", duration: "" });
  }

  async function generatePlan() {
    const open = tasks.filter((t) => !t.done);
    if (!open.length) {
      toast.error("Add at least one open task before planning your day.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({
        data: {
          tasks: open.map((t) => ({
            name: t.name,
            description: t.description,
            deadline: t.deadline,
            priority: t.priority,
            duration: t.duration,
          })),
        },
      });
      setPlan(res);
    } catch (e) {
      console.error(e);
      toast.error("We couldn't build your plan right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="AI Task Planner" description="Prioritise your workload and plan your day.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Your tasks</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setTasks(DEMO_TASKS)}>
                  <RotateCcw className="size-4" /> Demo data
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setTasks([])}>
                  <Trash2 className="size-4" /> Clear
                </Button>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {tasks.length === 0 && (
                <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No tasks yet — add one below.
                </li>
              )}
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3.5"
                >
                  <Checkbox
                    className="mt-0.5"
                    checked={t.done}
                    onCheckedChange={() => toggle(t.id)}
                    aria-label={`Mark ${t.name} complete`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={cn("font-medium", t.done && "text-muted-foreground line-through")}>
                        {t.name}
                      </p>
                      <PriorityBadge priority={t.priority} />
                    </div>
                    {t.description && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.deadline ? `Due ${t.deadline}` : "No deadline"} ·{" "}
                      {t.duration || "No estimate"}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove task"
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                    onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel space-y-4 p-6">
            <h2 className="text-base font-bold">Add a task</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Task name</Label>
                <Input
                  id="name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  placeholder="e.g. Today 17:00"
                  value={draft.deadline}
                  onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g. 45m"
                  value={draft.duration}
                  onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Priority</Label>
                <Select
                  value={draft.priority}
                  onValueChange={(v) => setDraft({ ...draft, priority: v as Task["priority"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={addTask}>
              <Plus className="size-4" /> Add task
            </Button>
          </div>
        </div>

        <div className="panel p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Your AI day plan</h2>
            {plan && (
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `Today's priority: ${plan.topPriority.task}\n\n${plan.schedule
                      .map((s) => `${s.time} — ${s.task} (${s.priority})`)
                      .join("\n")}`,
                  );
                  toast.success("Plan copied to clipboard");
                }}
              >
                <Copy className="size-4" /> Copy
              </Button>
            )}
          </div>

          <Button className="mt-4 w-full" disabled={loading} onClick={generatePlan}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Planning…" : "Plan My Day"}
          </Button>

          {!plan && !loading && (
            <p className="mt-5 text-sm text-muted-foreground">
              WorkAI will rank your open tasks by urgency, importance, deadlines and duration, then
              suggest a schedule. Recommendations only — adjust to fit your day.
            </p>
          )}

          {plan && (
            <div className="mt-6 space-y-6">
              <div className="rounded-xl border border-brand/25 bg-accent/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                  <Star className="size-3.5" /> Today's priority
                </div>
                <p className="mt-2 font-semibold">{plan.topPriority.task}</p>
                <p className="mt-1 text-sm text-muted-foreground">{plan.topPriority.reason}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Recommended schedule
                </h3>
                <ul className="mt-3 space-y-2">
                  {plan.schedule.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-border p-3.5"
                    >
                      <span className="w-28 shrink-0 text-xs font-semibold text-brand">
                        {s.time}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{s.task}</p>
                          <PriorityBadge priority={s.priority} />
                        </div>
                        {s.note && (
                          <p className="mt-0.5 text-sm text-muted-foreground">{s.note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.advice && <p className="text-sm text-muted-foreground">{plan.advice}</p>}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
