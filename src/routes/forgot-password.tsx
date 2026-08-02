import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset your password — Northwind" },
      {
        name: "description",
        content: "Request a secure password reset link for your Northwind dashboard account.",
      },
      { property: "og:title", content: "Reset your password — Northwind" },
      {
        property: "og:description",
        content: "Request a secure password reset link for your Northwind dashboard account.",
      },
    ],
  }),
  component: ForgotPassword,
});

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);

function ForgotPassword() {
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = emailSchema.safeParse(new FormData(event.currentTarget).get("email"));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    setPending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSentTo(parsed.data);
  }

  return (
    <AuthLayout
      title={sentTo ? "Check your inbox" : "Forgot your password?"}
      description={
        sentTo
          ? `We sent a password reset link to ${sentTo}. The link expires in 60 minutes.`
          : "Enter the email tied to your account and we'll send a secure reset link."
      }
      footer={
        <>
          Remembered it?{" "}
          <Link to="/auth" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sentTo ? (
        <div className="flex items-start gap-3 rounded-xl border border-success/25 bg-success/10 p-4">
          <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Didn't get it? Check your spam folder, or{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => setSentTo(null)}
            >
              try another email
            </button>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="h-11 rounded-xl"
              required
            />
          </div>
          <Button
            type="submit"
            className="h-11 w-full rounded-xl shadow-[0_10px_30px_-12px_var(--color-primary)]"
            disabled={pending}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
