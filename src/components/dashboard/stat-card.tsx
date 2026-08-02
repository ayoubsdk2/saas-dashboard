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
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
  hint: string;
}) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="surface-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
      <p className="mt-3 font-display text-2xl font-semibold tabular-nums">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
            trend === "up"
              ? "bg-success/12 text-success"
              : "bg-destructive/12 text-destructive",
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
