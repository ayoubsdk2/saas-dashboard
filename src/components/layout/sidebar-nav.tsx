import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Settings, LifeBuoy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { title: "Overview", to: "/", icon: LayoutDashboard },
  { title: "Users", to: "/users", icon: Users },
  { title: "Settings", to: "/settings", icon: Settings },
] as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="relative flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative flex h-16 items-center gap-3 px-5">
        <span className="brand-mark grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[15px] font-semibold tracking-tight text-foreground">
            Northwind
          </span>
          <span className="block truncate text-[11px] text-muted-foreground">Scale workspace</span>
        </span>
      </div>

      <nav className="relative mt-3 flex flex-1 flex-col gap-1 px-3">
        <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
          Workspace
        </p>
        {navItems.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300",
                active
                  ? "bg-primary/12 font-medium text-foreground ring-1 ring-inset ring-primary/25"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-all duration-300",
                  active ? "opacity-100 shadow-[0_0_10px_currentColor]" : "opacity-0",
                )}
              />
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-primary" : "group-hover:text-foreground",
                )}
              />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="relative p-3">
        <div className="surface-raised p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">Trial ends in 9 days</p>
            <span className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold text-warning">
              57%
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            2,841 of 5,000 monthly active users.
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[57%] rounded-full bg-linear-to-r from-primary to-chart-5 shadow-[0_0_12px_-2px_currentColor]" />
          </div>
        </div>
        <a
          href="#"
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/70 hover:text-foreground"
        >
          <LifeBuoy className="h-4 w-4 shrink-0" />
          Support
        </a>
      </div>
    </div>
  );
}
