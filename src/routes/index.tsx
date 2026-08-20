import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useStats, useTasks } from "@/lib/workai-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkAI Dashboard — Work smarter. Spend less time on admin." },
      {
        name: "description",
        content:
          "WorkAI is an AI workplace assistant that writes emails, summarises meeting notes and plans your day.",
      },
      { property: "og:title", content: "WorkAI — Work smarter. Spend less time on admin." },
      {
        property: "og:description",
        content: "AI tools for emails, meeting summaries and daily task planning.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Write professional emails in seconds.",
    cta: "Generate Email",
  },
  {
    to: "/meetings",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Turn meeting notes into clear summaries and action items.",
    cta: "Summarize Meeting",
  },
  {
    to: "/tasks",
    icon: ListChecks,
    title: "AI Task Planner",
    body: "Prioritise your workload and plan your day.",
    cta: "Plan My Day",
  },
] as const;

function Dashboard() {
  const stats = useStats();
  const { tasks } = useTasks();
  const openTasks = tasks.filter((t) => !t.done).length;

  const cards = [
    { label: "Emails generated", value: stats.emails },
    { label: "Meetings summarised", value: stats.meetings },
    { label: "Tasks completed", value: stats.tasksCompleted },
    { label: "Tasks open", value: openTasks },
  ];

  return (
    <AppShell title="Dashboard" description="Your AI workplace assistant.">
      <section className="panel overflow-hidden">
        <div className="bg-brand-gradient px-6 py-10 text-brand-foreground lg:px-10">
          <h2 className="text-3xl font-extrabold lg:text-4xl">Good morning! 👋</h2>
          <p className="mt-2 max-w-xl text-sm opacity-90 lg:text-base">
            Save time on repetitive workplace tasks with AI.
          </p>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <TrendingUp className="size-4 text-brand" />
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, body, cta }) => (
          <div key={to} className="panel flex flex-col p-6 transition-shadow hover:shadow-lift">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{body}</p>
            <Button asChild className="mt-5 w-full">
              <Link to={to}>{cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
