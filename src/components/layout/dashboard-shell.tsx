import type { ReactNode } from "react";
import { SidebarNav } from "./sidebar-nav";
import { Topbar } from "./topbar";

export function DashboardShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div
        aria-hidden
        className="grid-backdrop pointer-events-none absolute inset-x-0 top-0 h-[36rem]"
      />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:block">
        <SidebarNav />
      </aside>
      <div className="relative lg:pl-64">
        <Topbar title={title} />
        <main className="ambient-glow mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
