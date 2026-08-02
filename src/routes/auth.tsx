import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthLayout, GoogleIcon } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Northwind Dashboard" },
      {
        name: "description",
        content: "Sign in or create your Northwind account to access your analytics workspace.",
      },
      { property: "og:title", content: "Sign in — Northwind Dashboard" },
      {
        property: "og:description",
        content: "Sign in or create your Northwind account to access your analytics workspace.",
      },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);
const nameSchema = z.string().trim().min(1, "Enter your name").max(100);

function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [pending, setPending] = useState<null | "signin" | "signup" | "google">(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) void navigate({ to: "/dashboard", replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  async function handleGoogle() {
    setPending("google");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setPending(null);
      toast.error(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/dashboard", replace: true });
  }

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = emailSchema.safeParse(form.get("email"));
    const password = passwordSchema.safeParse(form.get("password"));
    if (!email.success) {
      toast.error(email.error.issues[0]!.message);
      return;
    }
    if (!password.success) {
      toast.error(password.error.issues[0]!.message);
      return;
    }

    setPending("signin");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.data,
      password: password.data,
    });
    setPending(null);
    if (error) {
      toast.error(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : error.message,
      );
      return;
    }
    toast.success("Welcome back");
    void navigate({ to: "/dashboard", replace: true });
  }

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = nameSchema.safeParse(form.get("name"));
    const email = emailSchema.safeParse(form.get("email"));
    const password = passwordSchema.safeParse(form.get("password"));
    if (!name.success) {
      toast.error(name.error.issues[0]!.message);
      return;
    }
    if (!email.success) {
      toast.error(email.error.issues[0]!.message);
      return;
    }
    if (!password.success) {
      toast.error(password.error.issues[0]!.message);
      return;
    }

    setPending("signup");
    const { data, error } = await supabase.auth.signUp({
      email: email.data,
      password: password.data,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name.data },
      },
    });
    setPending(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      void navigate({ to: "/dashboard", replace: true });
      return;
    }
    void navigate({ to: "/verify-email", search: { email: email.data } });
  }

  return (
    <AuthLayout
      title="Welcome to Northwind"
      description="Sign in to your workspace or create a new account in seconds."
      footer={
        <>
          By continuing you agree to the Northwind terms and privacy policy.
        </>
      }
    >
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-xl"
        onClick={handleGoogle}
        disabled={pending !== null}
      >
        {pending === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Tabs defaultValue="signin">
        <TabsList className="grid w-full grid-cols-2 rounded-xl">
          <TabsTrigger value="signin" className="rounded-lg">
            Sign in
          </TabsTrigger>
          <TabsTrigger value="signup" className="rounded-lg">
            Sign up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="mt-6">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="signin-password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="signin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-xl shadow-[0_10px_30px_-12px_var(--color-primary)]"
              disabled={pending !== null}
            >
              {pending === "signin" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign in
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="mt-6">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input
                id="signup-name"
                name="name"
                autoComplete="name"
                placeholder="Ada Kovač"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Work email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-xl shadow-[0_10px_30px_-12px_var(--color-primary)]"
              disabled={pending !== null}
            >
              {pending === "signup" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Create account
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}
