import { createFileRoute } from "@tanstack/react-router";
import { Activity, CreditCard, DollarSign, Users as UsersIcon } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { buildKpis, monthlyMetricsQuery } from "@/lib/dashboard-data";
import { useAuth } from "@/lib/auth";

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


const kpiIcons = [DollarSign, UsersIcon, Activity, CreditCard];

function Overview() {
  const { user } = useAuth();
  const { data: months, isPending } = useQuery(monthlyMetricsQuery);
  const stats = buildKpis(months ?? []);
  const firstName = (user?.name ?? "").split(" ")[0] || "there";

  return (
    <DashboardShell title="Overview">
      <PageHeader
        eyebrow="All systems operational"
        title={`Welcome back, ${firstName}`}
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
        {isPending
          ? [0, 1, 2, 3].map((i) => (
              <div key={i} className="surface-raised h-[9.5rem] animate-pulse" />
            ))
          : stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} icon={kpiIcons[i] ?? Activity} index={i} />
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


