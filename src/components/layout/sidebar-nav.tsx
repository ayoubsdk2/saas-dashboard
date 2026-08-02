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
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="truncate font-display text-[15px] font-semibold tracking-tight">
          Northwind
        </span>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-3">
        <p className="px-2 pb-2 pt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
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
                "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-lg border border-sidebar-border bg-background/40 p-3">
          <p className="text-xs font-medium">Trial ends in 9 days</p>
          <p className="mt-1 text-xs text-muted-foreground">
            2,841 of 5,000 monthly active users.
          </p>
          <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[57%] rounded-full bg-primary" />
          </div>
        </div>
        <a
          href="#"
          className="mt-2 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LifeBuoy className="h-4 w-4 shrink-0" />
          Support
        </a>
      </div>
    </div>
  );
}
