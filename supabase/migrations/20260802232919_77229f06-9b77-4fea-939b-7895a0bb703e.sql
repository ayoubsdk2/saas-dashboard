-- Monthly metrics
CREATE TABLE public.monthly_metrics (
  month_start date PRIMARY KEY,
  label text NOT NULL,
  revenue numeric NOT NULL DEFAULT 0,
  expenses numeric NOT NULL DEFAULT 0,
  mrr numeric NOT NULL DEFAULT 0,
  active_users integer NOT NULL DEFAULT 0,
  churn_rate numeric NOT NULL DEFAULT 0,
  avg_contract numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.monthly_metrics TO authenticated;
GRANT ALL ON public.monthly_metrics TO service_role;
ALTER TABLE public.monthly_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can view monthly metrics" ON public.monthly_metrics FOR SELECT TO authenticated USING (true);
CREATE TRIGGER monthly_metrics_updated_at BEFORE UPDATE ON public.monthly_metrics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Daily metrics
CREATE TABLE public.daily_metrics (
  day date PRIMARY KEY,
  label text NOT NULL,
  sessions integer NOT NULL DEFAULT 0,
  signups integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.daily_metrics TO authenticated;
GRANT ALL ON public.daily_metrics TO service_role;
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can view daily metrics" ON public.daily_metrics FOR SELECT TO authenticated USING (true);
CREATE TRIGGER daily_metrics_updated_at BEFORE UPDATE ON public.daily_metrics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Plan distribution
CREATE TABLE public.plan_distribution (
  plan text PRIMARY KEY,
  subscribers integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plan_distribution TO authenticated;
GRANT ALL ON public.plan_distribution TO service_role;
ALTER TABLE public.plan_distribution ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can view plan distribution" ON public.plan_distribution FOR SELECT TO authenticated USING (true);
CREATE TRIGGER plan_distribution_updated_at BEFORE UPDATE ON public.plan_distribution FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Team members
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  plan text NOT NULL,
  status text NOT NULL,
  last_active_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can view team members" ON public.team_members FOR SELECT TO authenticated USING (true);
CREATE TRIGGER team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Activity events
CREATE TABLE public.activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_name text NOT NULL,
  action text NOT NULL,
  target text NOT NULL,
  kind text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activity_events TO authenticated;
GRANT ALL ON public.activity_events TO service_role;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can view activity events" ON public.activity_events FOR SELECT TO authenticated USING (true);

-- Seed: monthly metrics (12 months)
INSERT INTO public.monthly_metrics (month_start, label, revenue, expenses, mrr, active_users, churn_rate, avg_contract) VALUES
  ('2025-09-01', 'Sep', 38420, 26180, 38400, 1980, 3.1, 842),
  ('2025-10-01', 'Oct', 41090, 27340, 41100, 2064, 3.0, 868),
  ('2025-11-01', 'Nov', 44760, 28110, 44800, 2131, 2.8, 891),
  ('2025-12-01', 'Dec', 47380, 30420, 47400, 2208, 2.9, 905),
  ('2026-01-01', 'Jan', 46120, 29870, 46100, 2246, 2.6, 912),
  ('2026-02-01', 'Feb', 50340, 31240, 50300, 2317, 2.5, 948),
  ('2026-03-01', 'Mar', 55810, 32680, 55800, 2402, 2.4, 972),
  ('2026-04-01', 'Apr', 54270, 33150, 54300, 2455, 2.3, 995),
  ('2026-05-01', 'May', 60930, 34720, 60900, 2568, 2.2, 1024),
  ('2026-06-01', 'Jun', 66480, 36010, 66500, 2661, 2.1, 1063),
  ('2026-07-01', 'Jul', 72150, 37460, 72200, 2748, 2.0, 1094),
  ('2026-08-01', 'Aug', 78250, 38940, 78300, 2841, 1.9, 1120);

-- Seed: daily metrics (last 7 days)
INSERT INTO public.daily_metrics (day, label, sessions, signups) VALUES
  ('2026-07-27', 'Mon', 3412, 186),
  ('2026-07-28', 'Tue', 4128, 241),
  ('2026-07-29', 'Wed', 3967, 213),
  ('2026-07-30', 'Thu', 4735, 289),
  ('2026-07-31', 'Fri', 5164, 317),
  ('2026-08-01', 'Sat', 2873, 138),
  ('2026-08-02', 'Sun', 2591, 124);

-- Seed: plan distribution
INSERT INTO public.plan_distribution (plan, subscribers, sort_order) VALUES
  ('Starter', 1842, 1),
  ('Growth', 1124, 2),
  ('Scale', 463, 3),
  ('Enterprise', 128, 4);

-- Seed: team members
INSERT INTO public.team_members (full_name, email, role, plan, status, last_active_at) VALUES
  ('Ada Kovač', 'ada@northwind.io', 'Owner', 'Enterprise', 'Active', now() - interval '2 minutes'),
  ('Milo Fenwick', 'milo@northwind.io', 'Admin', 'Scale', 'Active', now() - interval '18 minutes'),
  ('Priya Raman', 'priya@lumen.dev', 'Member', 'Growth', 'Active', now() - interval '1 hour'),
  ('Tobias Lund', 'tobias@lumen.dev', 'Member', 'Growth', 'Invited', NULL),
  ('Sofia Marchetti', 'sofia@orbital.co', 'Admin', 'Scale', 'Active', now() - interval '3 hours'),
  ('Ken Watanabe', 'ken@orbital.co', 'Member', 'Starter', 'Suspended', now() - interval '12 days'),
  ('Naomi Okafor', 'naomi@brightpath.ai', 'Member', 'Growth', 'Active', now() - interval '5 hours'),
  ('Elias Brandt', 'elias@brightpath.ai', 'Member', 'Starter', 'Invited', NULL);

-- Seed: activity events
INSERT INTO public.activity_events (actor_name, action, target, kind, occurred_at) VALUES
  ('Milo Fenwick', 'upgraded', 'Orbital workspace → Scale ($1,490/mo)', 'billing', now() - interval '18 minutes'),
  ('Priya Raman', 'created', 'production API key pk_live_7f2a', 'security', now() - interval '1 hour'),
  ('System', 'delivered', '2,481 webhooks · 99.94% success', 'system', now() - interval '2 hours'),
  ('Sofia Marchetti', 'invited', '3 teammates to Lumen', 'team', now() - interval '3 hours'),
  ('Naomi Okafor', 'resolved', 'incident #4821 · elevated p95 latency', 'incident', now() - interval '5 hours'),
  ('System', 'settled', 'payout of $46,218.40 to Stripe account', 'billing', now() - interval '9 hours');