import { createFileRoute } from "@tanstack/react-router";
import { Activity, CreditCard, DollarSign, Users as UsersIcon } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Button } from "@/components/ui/button";
import { kpiSparklines } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
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
  { label: "MRR", value: "$78,250", delta: "12.4%", trend: "up" as const, icon: DollarSign, hint: "vs. last month", series: kpiSparklines.mrr },
  { label: "Active users", value: "2,841", delta: "8.1%", trend: "up" as const, icon: UsersIcon, hint: "of 5,000 seats", series: kpiSparklines.users },
  { label: "Churn", value: "1.9%", delta: "0.4%", trend: "down" as const, icon: Activity, hint: "30-day rolling", series: kpiSparklines.churn },
  { label: "Avg. contract", value: "$1,120", delta: "3.2%", trend: "up" as const, icon: CreditCard, hint: "annualized", series: kpiSparklines.contract },
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

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="mt-5 sm:mt-6">
        <ChartsSection />
      </div>

      <div className="mt-5 grid gap-5 sm:mt-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <RecentActivity />
        <QuickActions />
      </div>
    </DashboardShell>
  );
}


