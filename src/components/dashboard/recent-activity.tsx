import { AlertTriangle, CreditCard, ShieldCheck, Users, Zap, type LucideIcon } from "lucide-react";
import { activityFeed, type ActivityKind } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const kindMeta: Record<ActivityKind, { icon: LucideIcon; className: string }> = {
  billing: { icon: CreditCard, className: "text-chart-1 bg-chart-1/12 border-chart-1/25" },
  security: { icon: ShieldCheck, className: "text-chart-3 bg-chart-3/12 border-chart-3/25" },
  system: { icon: Zap, className: "text-chart-2 bg-chart-2/12 border-chart-2/25" },
  team: { icon: Users, className: "text-chart-5 bg-chart-5/12 border-chart-5/25" },
  incident: { icon: AlertTriangle, className: "text-warning bg-warning/12 border-warning/25" },
};

export function RecentActivity() {
  return (
    <section className="surface-raised rise-in p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-base font-semibold tracking-tight">Recent activity</h3>
        <span className="shrink-0 text-xs text-muted-foreground">Last 24 hours</span>
      </div>

      <ul className="mt-5 space-y-1">
        {activityFeed.map((item) => {
          const meta = kindMeta[item.kind];
          return (
            <li
              key={item.id}
              className="group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-xl px-2.5 py-3 transition-colors hover:bg-muted/40 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
            >
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-transform duration-300 group-hover:scale-105",
                  meta.className,
                )}
              >
                <meta.icon className="h-4 w-4" />
              </span>
              <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{item.actor}</span> {item.action}{" "}
                <span className="text-foreground/80">{item.target}</span>
                <span className="mt-0.5 block text-xs tabular-nums text-muted-foreground sm:hidden">
                  {item.time}
                </span>
              </p>
              <span className="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block">
                {item.time}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
