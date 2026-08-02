import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { users } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users — Northwind Dashboard" },
      {
        name: "description",
        content: "Manage workspace members, roles, plans and access status across your team.",
      },
      { property: "og:title", content: "Users — Northwind Dashboard" },
      {
        property: "og:description",
        content: "Manage workspace members, roles, plans and access status.",
      },
    ],
  }),
  component: UsersPage,
});

const statusStyles: Record<string, string> = {
  Active: "bg-success/12 text-success",
  Invited: "bg-warning/15 text-warning",
  Suspended: "bg-destructive/12 text-destructive",
};

function UsersPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <DashboardShell title="Users">
      <PageHeader
        eyebrow="Team directory"
        title="Users"
        description={`${users.length} members across 4 workspaces.`}
        actions={
          <Button size="sm" className="rounded-xl shadow-[0_10px_30px_-12px_var(--color-primary)]">
            Invite member
          </Button>
        }
      />

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="h-11 rounded-xl pl-9"
        />
      </div>

      <div className="surface-raised rise-in">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-5 py-3.5 font-semibold">Member</th>
                <th className="px-5 py-3.5 font-semibold">Role</th>
                <th className="px-5 py-3.5 font-semibold">Plan</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="brand-mark grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white">
                        {user.initials}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{user.role}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{user.plan}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                        statusStyles[user.status],
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{user.lastActive}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">

                    No members match "{query}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
