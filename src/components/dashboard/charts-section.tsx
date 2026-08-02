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
  legend,
  className,
  children,
}: {
  title: string;
  subtitle: string;
  legend?: { label: string; color: string }[];
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`surface-raised rise-in flex flex-col p-5 ${className ?? ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {legend ? (
          <div className="flex shrink-0 items-center gap-3">
            {legend.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-5 h-60 w-full">{children}</div>
    </section>
  );
}

const tooltipStyle = {
  backgroundColor: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: "12px",
  fontSize: "12px",
  color: "var(--color-popover-foreground)",
  boxShadow: "0 18px 40px -20px rgb(0 0 0 / 0.6)",
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
      <div className="grid gap-5 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="surface-raised h-[21rem] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <ChartPanel
        title="Revenue vs. expenses"
        subtitle="Last 8 months, USD"
        className="lg:col-span-2"
        legend={[
          { label: "Revenue", color: "var(--color-chart-1)" },
          { label: "Expenses", color: "var(--color-chart-2)" },
        ]}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueSeries} margin={{ left: -18, right: 4, top: 4 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" {...axisProps} dy={6} />
            <YAxis {...axisProps} tickFormatter={(v: number) => `${v / 1000}k`} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--color-primary)", strokeOpacity: 0.35 }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-chart-1)"
              strokeWidth={2.5}
              fill="url(#revFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--color-background)" }}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              strokeDasharray="5 4"
              fill="url(#expFill)"
              dot={false}
              isAnimationActive={false}
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
              innerRadius="62%"
              outerRadius="86%"
              paddingAngle={4}
              cornerRadius={6}
              stroke="none"
              isAnimationActive={false}
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
        legend={[
          { label: "Sessions", color: "var(--color-chart-1)" },
          { label: "Signups", color: "var(--color-chart-3)" },
        ]}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activitySeries} margin={{ left: -18, right: 4, top: 4 }} barGap={4}>
            <CartesianGrid strokeDasharray="4 6" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="day" {...axisProps} dy={6} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} />
            <Bar dataKey="sessions" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} maxBarSize={26} isAnimationActive={false} />
            <Bar dataKey="signups" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} maxBarSize={26} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>
    </div>
  );
}
