import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  hint,
  index = 0,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
  hint: string;
  index?: number;
}) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <div
      className="surface-raised card-hover rise-in group p-5"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="flex items-start justify-between gap-3">
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/12 group-hover:text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 font-display text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums">
        {value}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs">
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
    </div>
  );
}
