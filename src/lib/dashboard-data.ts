import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MonthlyMetric = {
  month_start: string;
  label: string;
  revenue: number;
  expenses: number;
  mrr: number;
  active_users: number;
  churn_rate: number;
  avg_contract: number;
};

export type DailyMetric = { day: string; label: string; sessions: number; signups: number };
export type PlanRow = { plan: string; subscribers: number };
export type TeamMemberRow = {
  id: string;
  full_name: string;
  /** Only visible to workspace admins; null when redacted. */
  email: string | null;
  role: string;
  plan: string;
  status: string;
  last_active_at: string | null;
};
export type ActivityKind = "billing" | "security" | "system" | "team" | "incident";
export type ActivityRow = {
  id: string;
  actor_name: string;
  action: string;
  target: string;
  kind: ActivityKind;
  occurred_at: string;
};

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return (result.data ?? []) as T;
}

export const monthlyMetricsQuery = queryOptions({
  queryKey: ["monthly_metrics"],
  queryFn: async () =>
    unwrap<MonthlyMetric[]>(
      await supabase
        .from("monthly_metrics")
        .select("month_start, label, revenue, expenses, mrr, active_users, churn_rate, avg_contract")
        .order("month_start", { ascending: true }),
    ),
});

export const dailyMetricsQuery = queryOptions({
  queryKey: ["daily_metrics"],
  queryFn: async () =>
    unwrap<DailyMetric[]>(
      await supabase
        .from("daily_metrics")
        .select("day, label, sessions, signups")
        .order("day", { ascending: true }),
    ),
});

export const planDistributionQuery = queryOptions({
  queryKey: ["plan_distribution"],
  queryFn: async () =>
    unwrap<PlanRow[]>(
      await supabase
        .from("plan_distribution")
        .select("plan, subscribers")
        .order("sort_order", { ascending: true }),
    ),
});

export const teamMembersQuery = queryOptions({
  queryKey: ["team_members"],
  queryFn: async (): Promise<TeamMemberRow[]> => {
    const { data, error } = await supabase
      .from("team_members")
      .select("id, full_name, role, plan, status, last_active_at, team_member_contacts(email)")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((m) => {
      const contacts = m.team_member_contacts as unknown as
        | { email: string }[]
        | { email: string }
        | null;
      const email = Array.isArray(contacts) ? (contacts[0]?.email ?? null) : (contacts?.email ?? null);
      return {
        id: m.id,
        full_name: m.full_name,
        email,
        role: m.role,
        plan: m.plan,
        status: m.status,
        last_active_at: m.last_active_at,
      };
    });
  },
});

export const activityEventsQuery = queryOptions({
  queryKey: ["activity_events"],
  queryFn: async () =>
    unwrap<ActivityRow[]>(
      (await supabase
        .from("activity_events")
        .select("id, actor_name, action, target, kind, occurred_at")
        .order("occurred_at", { ascending: false })
        .limit(8)) as unknown as { data: ActivityRow[] | null; error: { message: string } | null },
    ),
});

/* ---------- derived helpers ---------- */

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0]![0]! + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function relativeTime(iso: string | null) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function pctChange(current: number, previous: number) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

export type Kpi = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  hint: string;
  series: number[];
};

export function buildKpis(months: MonthlyMetric[]): Kpi[] {
  if (months.length === 0) return [];
  const last = months[months.length - 1]!;
  const prev = months[months.length - 2] ?? last;
  const fmtPct = (n: number) => `${Math.abs(n).toFixed(1)}%`;

  return [
    {
      label: "MRR",
      value: `$${Math.round(Number(last.mrr)).toLocaleString("en-US")}`,
      delta: fmtPct(pctChange(Number(last.mrr), Number(prev.mrr))),
      trend: Number(last.mrr) >= Number(prev.mrr) ? "up" : "down",
      hint: "vs. last month",
      series: months.map((m) => Number(m.mrr) / 1000),
    },
    {
      label: "Active users",
      value: last.active_users.toLocaleString("en-US"),
      delta: fmtPct(pctChange(last.active_users, prev.active_users)),
      trend: last.active_users >= prev.active_users ? "up" : "down",
      hint: "of 5,000 seats",
      series: months.map((m) => m.active_users),
    },
    {
      label: "Churn",
      value: `${Number(last.churn_rate).toFixed(1)}%`,
      delta: `${Math.abs(Number(last.churn_rate) - Number(prev.churn_rate)).toFixed(1)}%`,
      trend: Number(last.churn_rate) <= Number(prev.churn_rate) ? "down" : "up",
      hint: "30-day rolling",
      series: months.map((m) => Number(m.churn_rate)),
    },
    {
      label: "Avg. contract",
      value: `$${Math.round(Number(last.avg_contract)).toLocaleString("en-US")}`,
      delta: fmtPct(pctChange(Number(last.avg_contract), Number(prev.avg_contract))),
      trend: Number(last.avg_contract) >= Number(prev.avg_contract) ? "up" : "down",
      hint: "annualized",
      series: months.map((m) => Number(m.avg_contract)),
    },
  ];
}
