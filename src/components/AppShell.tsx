import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Sparkles,
  ShieldAlert,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/tasks", label: "Task Planner", icon: ListChecks },
] as const;

export function ResponsibleAiNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-border bg-accent/40 p-4 text-xs leading-relaxed text-accent-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0" />
      <p>
        <span className="font-semibold">Responsible AI:</span> AI-generated content may contain
        errors or omissions. Always review AI-generated emails, meeting summaries and task
        recommendations before relying on them. Do not enter confidential or sensitive information
        unless permitted by your organisation.
      </p>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-primary font-semibold",
          }}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient text-brand-foreground shadow-card">
        <Sparkles className="size-4.5" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-extrabold">WorkAI</span>
        <span className="block text-[11px] text-muted-foreground">
          Work smarter. Less admin.
        </span>
      </span>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <div className="px-2 py-2">
          <Brand />
        </div>
        <div className="mt-6 flex-1">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <NavLinks />
        </div>
        <p className="px-3 text-[11px] text-muted-foreground">
          Powered by Lovable AI · outputs are recommendations, not guaranteed facts.
        </p>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-5 py-4 lg:px-8">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg border border-border p-2 lg:hidden"
              aria-label="Toggle navigation"
            >
              <Menu className="size-4" />
            </button>
            <div className="lg:hidden">
              <Brand />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          {open && (
            <div className="border-t border-border bg-sidebar px-4 py-3 lg:hidden">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          )}
        </header>

        <main className="mx-auto max-w-6xl px-5 py-6 lg:px-8 lg:py-8">
          <div className="mb-6 lg:hidden">
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
          <ResponsibleAiNotice className="mt-8" />
        </main>
      </div>
    </div>
  );
}
