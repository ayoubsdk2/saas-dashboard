import { createFileRoute } from "@tanstack/react-router";
import { Activity, CreditCard, DollarSign, Users as UsersIcon } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { Button } from "@/components/ui/button";
import { activityFeed } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Northwind Analytics Dashboard" },
      {
        name: "description",
        content:
          "Track revenue, active users, sessions and subscription growth in one clean SaaS analytics dashboard.",
      },
      { property: "og:title", content: "Overview — Northwind Analytics Dashboard" },
      {
        property: "og:description",
        content: "Track revenue, active users, sessions and subscription growth in one clean SaaS analytics dashboard.",
      },
    ],
  }),
  component: Overview,
});

const stats = [
  { label: "MRR", value: "$78,250", delta: "12.4%", trend: "up" as const, icon: DollarSign, hint: "vs. last month" },
  { label: "Active users", value: "2,841", delta: "8.1%", trend: "up" as const, icon: UsersIcon, hint: "of 5,000 seats" },
  { label: "Churn", value: "1.9%", delta: "0.4%", trend: "down" as const, icon: Activity, hint: "30-day rolling" },
  { label: "Avg. contract", value: "$1,120", delta: "3.2%", trend: "up" as const, icon: CreditCard, hint: "annualized" },
];

function Overview() {
  return (
    <DashboardShell title="Overview">
      <PageHeader
        eyebrow="All systems operational"
        title="Good evening, Ada"
        description="Here's how Northwind performed over the last 30 days."
        actions={
          <>
            <Button variant="outline" size="sm" className="rounded-xl">
              Export
            </Button>
            <Button
              size="sm"
              className="rounded-xl shadow-[0_10px_30px_-12px_var(--color-primary)]"
            >
              New report
            </Button>
          </>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="mt-5">
        <ChartsSection />
      </div>

      <section className="surface-raised rise-in mt-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-base font-semibold tracking-tight">Recent activity</h3>
          <span className="text-xs text-muted-foreground">Last 24 hours</span>
        </div>
        <ul className="mt-4 space-y-1">
          {activityFeed.map((item) => (
            <li
              key={item.id}
              className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted/40"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_currentColor] transition-transform group-hover:scale-150" />
              <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{item.actor}</span> {item.action}
              </p>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {item.time}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </DashboardShell>
  );
}

