import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — Northwind" },
      {
        name: "description",
        content: "Choose a new password to finish recovering your Northwind dashboard account.",
      },
      { property: "og:title", content: "Set a new password — Northwind" },
      {
        property: "og:description",
        content: "Choose a new password to finish recovering your Northwind dashboard account.",
      },
    ],
  }),
  component: ResetPassword,
});

const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

function ResetPassword() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const isRecovery = hash.includes("type=recovery");
    void supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session) || isRecovery);
    });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = passwordSchema.safeParse(form.get("password"));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    if (parsed.data !== form.get("confirm")) {
      toast.error("Passwords do not match");
      return;
    }
    setPending(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    void navigate({ to: "/dashboard", replace: true });
  }

  return (
    <AuthLayout
      title="Set a new password"
      description="Choose a strong password you haven't used on this account before."
      footer={
        <Link to="/auth" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      {ready === false ? (
        <div className="rounded-xl border border-warning/25 bg-warning/10 p-4 text-sm leading-relaxed text-muted-foreground">
          This reset link is invalid or has expired.{" "}
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Request a new one
          </Link>
          .
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="h-11 rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              className="h-11 rounded-xl"
              required
            />
          </div>
          <Button
            type="submit"
            className="h-11 w-full rounded-xl shadow-[0_10px_30px_-12px_var(--color-primary)]"
            disabled={pending}
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            Update password
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
