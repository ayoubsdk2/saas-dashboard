import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/northwind-logo.png";

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background px-4 py-12">
      <div
        aria-hidden
        className="grid-backdrop pointer-events-none absolute inset-x-0 top-0 h-[32rem]"
      />
      <div className="ambient-glow relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] border border-border/70 bg-card/60 shadow-[0_8px_24px_-12px_var(--color-primary)]">
              <img src={logo} alt="Northwind logo" width={816} height={816} className="h-7 w-7" />
            </span>
            <span className="font-display text-lg font-semibold tracking-[-0.02em]">Northwind</span>
          </Link>
        </div>

        <div className="surface-raised rise-in p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold tracking-[-0.03em]">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-7">{children}</div>
        </div>

        {footer ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        ) : null}
      </div>
    </div>
  );
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.1h6.6c-.1 1.1-.9 2.8-2.5 3.9l3.8 2.9c2.3-2.1 3.6-5.2 3.6-8.7z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5l-3.9 3C3.4 21.3 7.4 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.6.4-2.4l-4-3C.5 8.3 0 10.1 0 12s.5 3.7 1.3 5.4l4-3z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7c2.2 0 3.7.9 4.5 1.7l3.3-3.2C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.3 6.6l4 3c.9-2.9 3.6-4.9 6.7-4.9z"
      />
    </svg>
  );
}
