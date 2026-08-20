import { useCallback, useEffect, useState } from "react";

export type Task = {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  duration: string;
  done: boolean;
};

export const DEMO_TASKS: Task[] = [
  {
    id: "t1",
    name: "Complete quarterly report",
    description: "Finalise Q3 numbers and write the executive summary.",
    deadline: "Today 17:00",
    priority: "Urgent",
    duration: "2h",
    done: false,
  },
  {
    id: "t2",
    name: "Reply to client proposal",
    description: "Respond to Acme Ltd with revised pricing.",
    deadline: "Tomorrow",
    priority: "High",
    duration: "45m",
    done: false,
  },
  {
    id: "t3",
    name: "Prepare presentation",
    description: "Slides for Friday's stakeholder review.",
    deadline: "Friday",
    priority: "High",
    duration: "1h 30m",
    done: false,
  },
  {
    id: "t4",
    name: "Review team performance",
    description: "Draft feedback notes for three direct reports.",
    deadline: "Next week",
    priority: "Medium",
    duration: "1h",
    done: false,
  },
  {
    id: "t5",
    name: "Schedule project meeting",
    description: "Find a slot with design and engineering.",
    deadline: "Today",
    priority: "Low",
    duration: "15m",
    done: true,
  },
];

type Stats = { emails: number; meetings: number; tasksCompleted: number };

const KEY_TASKS = "workai.tasks";
const KEY_STATS = "workai.stats";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function bumpStat(key: keyof Stats, by = 1) {
  if (typeof window === "undefined") return;
  const stats = read<Stats>(KEY_STATS, { emails: 0, meetings: 0, tasksCompleted: 0 });
  stats[key] = Math.max(0, (stats[key] ?? 0) + by);
  window.localStorage.setItem(KEY_STATS, JSON.stringify(stats));
  window.dispatchEvent(new Event("workai:stats"));
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({ emails: 0, meetings: 0, tasksCompleted: 0 });
  useEffect(() => {
    const sync = () => setStats(read<Stats>(KEY_STATS, { emails: 0, meetings: 0, tasksCompleted: 0 }));
    sync();
    window.addEventListener("workai:stats", sync);
    return () => window.removeEventListener("workai:stats", sync);
  }, []);
  return stats;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTasks(read<Task[]>(KEY_TASKS, DEMO_TASKS));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEY_TASKS, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const toggle = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        bumpStat("tasksCompleted", t.done ? -1 : 1);
        return { ...t, done: !t.done };
      }),
    );
  }, []);

  return { tasks, setTasks, toggle, hydrated };
}
