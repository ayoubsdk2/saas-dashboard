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
        content: "Revenue, users, sessions and subscription growth at a glance.",
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
        title="Good evening, Ada"
        description="Here's how Northwind performed over the last 30 days."
        actions={
          <>
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button size="sm">New report</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-4">
        <ChartsSection />
      </div>

      <section className="surface-panel mt-4 p-4">
        <h3 className="text-sm font-semibold">Recent activity</h3>
        <ul className="mt-3 divide-y divide-border">
          {activityFeed.map((item) => (
            <li key={item.id} className="flex items-start gap-3 py-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{item.actor}</span> {item.action}
              </p>
              <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </DashboardShell>
  );
}
