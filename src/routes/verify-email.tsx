import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const searchSchema = z.object({ email: z.string().email().optional() });

export const Route = createFileRoute("/verify-email")({
  ssr: false,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Verify your email — Northwind" },
      {
        name: "description",
        content: "Confirm your email address to activate your Northwind dashboard account.",
      },
      { property: "og:title", content: "Verify your email — Northwind" },
      {
        property: "og:description",
        content: "Confirm your email address to activate your Northwind dashboard account.",
      },
    ],
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [pending, setPending] = useState(false);
  const address = email ?? user?.email ?? "your email address";

  useEffect(() => {
    if (isAuthenticated && user?.emailVerified) {
      void navigate({ to: "/dashboard", replace: true });
    }
  }, [isAuthenticated, user?.emailVerified, navigate]);

  async function resend() {
    if (!email) {
      toast.error("Start from the sign-up form to resend the link.");
      return;
    }
    setPending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Verification email sent");
  }

  return (
    <AuthLayout
      title="Verify your email"
      description={`We sent a confirmation link to ${address}. Click it to activate your workspace.`}
      footer={
        <>
          Wrong address?{" "}
          <Link to="/auth" className="font-medium text-primary hover:underline">
            Sign up again
          </Link>
        </>
      }
    >
      <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/10 p-4">
        <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          The link expires in 24 hours. Once confirmed you'll be signed straight into the
          dashboard.
        </p>
      </div>

      <div className="mt-6 grid gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl"
          onClick={resend}
          disabled={pending}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Resend verification email
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-11 w-full rounded-xl"
          onClick={() => navigate({ to: "/auth" })}
        >
          Back to sign in
        </Button>
      </div>
    </AuthLayout>
  );
}
