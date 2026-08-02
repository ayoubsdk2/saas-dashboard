export const revenueSeries = [
  { month: "Sep", revenue: 38420, expenses: 26180 },
  { month: "Oct", revenue: 41090, expenses: 27340 },
  { month: "Nov", revenue: 44760, expenses: 28110 },
  { month: "Dec", revenue: 47380, expenses: 30420 },
  { month: "Jan", revenue: 46120, expenses: 29870 },
  { month: "Feb", revenue: 50340, expenses: 31240 },
  { month: "Mar", revenue: 55810, expenses: 32680 },
  { month: "Apr", revenue: 54270, expenses: 33150 },
  { month: "May", revenue: 60930, expenses: 34720 },
  { month: "Jun", revenue: 66480, expenses: 36010 },
  { month: "Jul", revenue: 72150, expenses: 37460 },
  { month: "Aug", revenue: 78250, expenses: 38940 },
];

export const activitySeries = [
  { day: "Mon", sessions: 3412, signups: 186 },
  { day: "Tue", sessions: 4128, signups: 241 },
  { day: "Wed", sessions: 3967, signups: 213 },
  { day: "Thu", sessions: 4735, signups: 289 },
  { day: "Fri", sessions: 5164, signups: 317 },
  { day: "Sat", sessions: 2873, signups: 138 },
  { day: "Sun", sessions: 2591, signups: 124 },
];

export const planSplit = [
  { name: "Starter", value: 1842 },
  { name: "Growth", value: 1124 },
  { name: "Scale", value: 463 },
  { name: "Enterprise", value: 128 },
];

/** Sparkline data for each KPI tile — 12 points, most recent last. */
export const kpiSparklines = {
  mrr: [38.4, 41.1, 44.8, 47.4, 46.1, 50.3, 55.8, 54.3, 60.9, 66.5, 72.2, 78.3],
  users: [1980, 2064, 2131, 2208, 2246, 2317, 2402, 2455, 2568, 2661, 2748, 2841],
  churn: [3.1, 3.0, 2.8, 2.9, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9],
  contract: [842, 868, 891, 905, 912, 948, 972, 995, 1024, 1063, 1094, 1120],
};

export type TeamUser = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  plan: "Starter" | "Growth" | "Scale" | "Enterprise";
  status: "Active" | "Invited" | "Suspended";
  lastActive: string;
  initials: string;
};

export const users: TeamUser[] = [
  { id: "usr_001", name: "Ada Kovač", email: "ada@northwind.io", role: "Owner", plan: "Enterprise", status: "Active", lastActive: "2 min ago", initials: "AK" },
  { id: "usr_002", name: "Milo Fenwick", email: "milo@northwind.io", role: "Admin", plan: "Scale", status: "Active", lastActive: "18 min ago", initials: "MF" },
  { id: "usr_003", name: "Priya Raman", email: "priya@lumen.dev", role: "Member", plan: "Growth", status: "Active", lastActive: "1 hr ago", initials: "PR" },
  { id: "usr_004", name: "Tobias Lund", email: "tobias@lumen.dev", role: "Member", plan: "Growth", status: "Invited", lastActive: "—", initials: "TL" },
  { id: "usr_005", name: "Sofia Marchetti", email: "sofia@orbital.co", role: "Admin", plan: "Scale", status: "Active", lastActive: "3 hrs ago", initials: "SM" },
  { id: "usr_006", name: "Ken Watanabe", email: "ken@orbital.co", role: "Member", plan: "Starter", status: "Suspended", lastActive: "12 days ago", initials: "KW" },
  { id: "usr_007", name: "Naomi Okafor", email: "naomi@brightpath.ai", role: "Member", plan: "Growth", status: "Active", lastActive: "5 hrs ago", initials: "NO" },
  { id: "usr_008", name: "Elias Brandt", email: "elias@brightpath.ai", role: "Member", plan: "Starter", status: "Invited", lastActive: "—", initials: "EB" },
];

export type ActivityKind = "billing" | "security" | "system" | "team" | "incident";

export type ActivityItem = {
  id: number;
  actor: string;
  initials: string;
  action: string;
  target: string;
  kind: ActivityKind;
  time: string;
};

export const activityFeed: ActivityItem[] = [
  { id: 1, actor: "Milo Fenwick", initials: "MF", action: "upgraded", target: "Orbital workspace → Scale ($1,490/mo)", kind: "billing", time: "18 min ago" },
  { id: 2, actor: "Priya Raman", initials: "PR", action: "created", target: "production API key pk_live_7f2a", kind: "security", time: "1 hr ago" },
  { id: 3, actor: "System", initials: "SY", action: "delivered", target: "2,481 webhooks · 99.94% success", kind: "system", time: "2 hrs ago" },
  { id: 4, actor: "Sofia Marchetti", initials: "SM", action: "invited", target: "3 teammates to Lumen", kind: "team", time: "3 hrs ago" },
  { id: 5, actor: "Naomi Okafor", initials: "NO", action: "resolved", target: "incident #4821 · elevated p95 latency", kind: "incident", time: "5 hrs ago" },
  { id: 6, actor: "System", initials: "SY", action: "settled", target: "payout of $46,218.40 to Stripe account", kind: "billing", time: "9 hrs ago" },
];
