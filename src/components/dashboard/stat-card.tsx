import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

function Sparkline({ points, trend }: { points: number[]; trend: "up" | "down" }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const w = 100;
  const h = 28;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / span) * (h - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const stroke = trend === "up" ? "var(--color-success)" : "var(--color-destructive)";
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="h-7 w-full opacity-70 transition-opacity duration-300 group-hover:opacity-100"
    >
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  hint,
  series,
  index = 0,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
  hint: string;
  series?: number[];
  index?: number;
}) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <div
      className="surface-raised card-hover rise-in group flex flex-col p-5 sm:p-6"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="flex items-start justify-between gap-3">
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/12 group-hover:text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <p className="mt-5 font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">
        {value}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold ring-1 ring-inset",
            trend === "up"
              ? "bg-success/12 text-success ring-success/25"
              : "bg-destructive/12 text-destructive ring-destructive/25",
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {delta}
        </span>
        <span className="truncate text-muted-foreground">{hint}</span>
      </div>

      {series ? (
        <div className="mt-5">
          <Sparkline points={series} trend={trend} />
        </div>
      ) : null}
    </div>
  );
}
