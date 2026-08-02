import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Northwind — SaaS Analytics Dashboard" },
      {
        name: "description",
        content:
          "Northwind is a premium analytics workspace for revenue, users and subscription growth.",
      },
      { property: "og:title", content: "Northwind — SaaS Analytics Dashboard" },
      {
        property: "og:description",
        content:
          "Northwind is a premium analytics workspace for revenue, users and subscription growth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    void navigate({ to: isAuthenticated ? "/dashboard" : "/auth", replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}
