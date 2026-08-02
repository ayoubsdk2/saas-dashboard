import { useEffect, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { activitySeries, planSplit, revenueSeries } from "@/lib/mock-data";

function ChartPanel({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`surface-panel flex flex-col p-4 ${className ?? ""}`}>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold">{title}</h3>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="mt-4 h-56 w-full">{children}</div>
    </section>
  );
}

const tooltipStyle = {
  backgroundColor: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: "10px",
  fontSize: "12px",
  color: "var(--color-popover-foreground)",
};

const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export function ChartsSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="surface-panel h-[19rem] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ChartPanel
        title="Revenue vs. expenses"
        subtitle="Last 8 months, USD"
        className="lg:col-span-2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueSeries} margin={{ left: -18, right: 4, top: 4 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v: number) => `${v / 1000}k`} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--color-border)" }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              fill="url(#revFill)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              fill="url(#expFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartPanel>

      <ChartPanel title="Plan distribution" subtitle="Active subscriptions">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={planSplit}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={3}
              stroke="none"
            >
              {planSplit.map((_, i) => (
                <Cell key={i} fill={`var(--color-chart-${i + 1})`} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </ChartPanel>

      <ChartPanel
        title="Weekly activity"
        subtitle="Sessions and signups"
        className="lg:col-span-3"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activitySeries} margin={{ left: -18, right: 4, top: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="day" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
            <Bar dataKey="sessions" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="signups" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>
    </div>
  );
}
