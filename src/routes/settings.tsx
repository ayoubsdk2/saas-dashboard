import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Northwind Dashboard" },
      {
        name: "description",
        content: "Update your profile, workspace preferences, appearance and notification settings.",
      },
      { property: "og:title", content: "Settings — Northwind Dashboard" },
      {
        property: "og:description",
        content: "Profile, workspace, appearance and notification preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-raised rise-in p-6">
      <h3 className="font-display text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <DashboardShell title="Settings">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Manage your account and workspace preferences."
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg">Profile</TabsTrigger>
          <TabsTrigger value="workspace" className="rounded-lg">Workspace</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg">Appearance</TabsTrigger>
        </TabsList>


        <TabsContent value="profile" className="mt-5 space-y-5">
          <Section title="Profile" description="This information is visible to your teammates.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" defaultValue={user?.name ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email ?? ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} defaultValue="Building infrastructure at Northwind." />
            </div>
            <Button size="sm" className="rounded-xl">Save changes</Button>
          </Section>
        </TabsContent>

        <TabsContent value="workspace" className="mt-5 space-y-5">
          <Section title="Workspace" description="Defaults applied to every project.">
            <div className="space-y-2">
              <Label htmlFor="workspace">Workspace name</Label>
              <Input id="workspace" defaultValue="Northwind" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Require SSO</p>
                <p className="text-xs text-muted-foreground">
                  Members must sign in through your identity provider.
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Weekly digest</p>
                <p className="text-xs text-muted-foreground">
                  Email a summary of usage every Monday.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="appearance" className="mt-5 space-y-5">
          <Section title="Appearance" description="Customize how the dashboard looks for you.">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-xs text-muted-foreground">
                  Currently using the {theme} theme.
                </p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Compact tables</p>
                <p className="text-xs text-muted-foreground">Reduce row height in data tables.</p>
              </div>
              <Switch />
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
