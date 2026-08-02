import {
  CreditCard,
  FileText,
  KeyRound,
  UserPlus,
  Webhook,
  type LucideIcon,
} from "lucide-react";

const actions: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Invite teammate", description: "Send a seat invitation", icon: UserPlus },
  { title: "Create API key", description: "Scoped production token", icon: KeyRound },
  { title: "New webhook", description: "Subscribe to events", icon: Webhook },
  { title: "Export report", description: "CSV of last 30 days", icon: FileText },
  { title: "Manage billing", description: "Plans, invoices, tax", icon: CreditCard },
];

export function QuickActions() {
  return (
    <section className="surface-raised rise-in p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-base font-semibold tracking-tight">Quick actions</h3>
        <span className="shrink-0 text-xs text-muted-foreground">Shortcuts</span>
      </div>

      <div className="mt-5 grid gap-2.5">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-3.5 py-3 text-left transition-all duration-300 hover:-translate-y-px hover:border-primary/40 hover:bg-primary/8"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary">
              <action.icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{action.title}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {action.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
