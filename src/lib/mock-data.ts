export const revenueSeries = [
  { month: "Jan", revenue: 42100, expenses: 28400 },
  { month: "Feb", revenue: 45800, expenses: 29100 },
  { month: "Mar", revenue: 51200, expenses: 30500 },
  { month: "Apr", revenue: 49600, expenses: 31200 },
  { month: "May", revenue: 58300, expenses: 33800 },
  { month: "Jun", revenue: 64900, expenses: 35100 },
  { month: "Jul", revenue: 71400, expenses: 36700 },
  { month: "Aug", revenue: 78250, expenses: 38200 },
];

export const activitySeries = [
  { day: "Mon", sessions: 3200, signups: 180 },
  { day: "Tue", sessions: 4100, signups: 240 },
  { day: "Wed", sessions: 3800, signups: 205 },
  { day: "Thu", sessions: 4700, signups: 288 },
  { day: "Fri", sessions: 5200, signups: 312 },
  { day: "Sat", sessions: 2900, signups: 141 },
  { day: "Sun", sessions: 2600, signups: 126 },
];

export const planSplit = [
  { name: "Starter", value: 1840 },
  { name: "Growth", value: 1120 },
  { name: "Scale", value: 460 },
  { name: "Enterprise", value: 128 },
];

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

export const activityFeed = [
  { id: 1, actor: "Milo Fenwick", action: "upgraded the Orbital workspace to Scale", time: "18 min ago" },
  { id: 2, actor: "Priya Raman", action: "created a new API key for production", time: "1 hr ago" },
  { id: 3, actor: "System", action: "processed 2,481 webhook deliveries", time: "2 hrs ago" },
  { id: 4, actor: "Sofia Marchetti", action: "invited 3 teammates to Lumen", time: "3 hrs ago" },
  { id: 5, actor: "Naomi Okafor", action: "resolved incident #4821", time: "5 hrs ago" },
];
