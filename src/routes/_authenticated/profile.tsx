import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogOut, ShieldCheck, MailWarning } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Northwind Dashboard" },
      {
        name: "description",
        content: "Manage your Northwind account details, role, company and session security.",
      },
      { property: "og:title", content: "Your profile — Northwind Dashboard" },
      {
        property: "og:description",
        content: "Manage your Northwind account details, role, company and session security.",
      },
    ],
  }),
  component: ProfilePage,
});

const schema = z.object({
  full_name: z.string().trim().min(1, "Enter your name").max(100),
  job_title: z.string().trim().max(100),
  company: z.string().trim().max(100),
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({ full_name: "", job_title: "", company: "" });

  useEffect(() => {
    setForm({
      full_name: profile?.full_name ?? user?.name ?? "",
      job_title: profile?.job_title ?? "",
      company: profile?.company ?? "",
    });
  }, [profile, user?.name]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    if (!user) return;
    setPending(true);
    const { error } = await supabase
      .from("profiles")
      .update(parsed.data)
      .eq("id", user.id);
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshProfile();
    toast.success("Profile updated");
  }

  async function handleSignOut() {
    await signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <DashboardShell title="Profile">
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description="Update how your name appears across the workspace and manage your session."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={handleSave} className="surface-raised space-y-5 p-6">
          <div className="flex items-center gap-4">
            <span className="brand-mark grid h-14 w-14 shrink-0 place-items-center rounded-full text-base font-semibold text-white">
              {user?.initials ?? "?"}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold tracking-[-0.02em]">
                {form.full_name || user?.email}
              </p>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                className="h-11 rounded-xl"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_title">Job title</Label>
              <Input
                id="job_title"
                value={form.job_title}
                onChange={(e) => setForm((f) => ({ ...f, job_title: e.target.value }))}
                placeholder="Head of Growth"
                className="h-11 rounded-xl"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="Northwind Inc."
                className="h-11 rounded-xl"
                maxLength={100}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email ?? ""}
                readOnly
                disabled
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-11 rounded-xl shadow-[0_10px_30px_-12px_var(--color-primary)]"
            disabled={pending}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save changes
          </Button>
        </form>

        <div className="space-y-6">
          <div className="surface-raised p-6">
            <h2 className="font-display text-sm font-semibold tracking-[-0.01em]">
              Account status
            </h2>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-border/70 bg-muted/20 p-4">
              {user?.emailVerified ? (
                <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success" />
              ) : (
                <MailWarning className="mt-0.5 h-4.5 w-4.5 shrink-0 text-warning" />
              )}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {user?.emailVerified
                  ? "Your email is verified and your account is fully active."
                  : "Your email isn't verified yet. Check your inbox for the confirmation link."}
              </p>
            </div>
          </div>

          <div className="surface-raised p-6">
            <h2 className="font-display text-sm font-semibold tracking-[-0.01em]">Session</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Sign out of this device. You'll need to sign in again to reach the dashboard.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 h-11 w-full rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
