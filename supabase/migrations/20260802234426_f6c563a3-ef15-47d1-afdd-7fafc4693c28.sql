
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_workspace_user(uuid) FROM PUBLIC, anon;

-- new users become members of the demo workspace
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- backfill existing users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'member' FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

-- tighten data policies to workspace members only
DROP POLICY IF EXISTS "Signed-in users can view monthly metrics" ON public.monthly_metrics;
CREATE POLICY "Workspace users can view monthly metrics"
  ON public.monthly_metrics FOR SELECT TO authenticated
  USING (public.is_workspace_user(auth.uid()));

DROP POLICY IF EXISTS "Signed-in users can view daily metrics" ON public.daily_metrics;
CREATE POLICY "Workspace users can view daily metrics"
  ON public.daily_metrics FOR SELECT TO authenticated
  USING (public.is_workspace_user(auth.uid()));

DROP POLICY IF EXISTS "Signed-in users can view plan distribution" ON public.plan_distribution;
CREATE POLICY "Workspace users can view plan distribution"
  ON public.plan_distribution FOR SELECT TO authenticated
  USING (public.is_workspace_user(auth.uid()));

DROP POLICY IF EXISTS "Signed-in users can view activity events" ON public.activity_events;
CREATE POLICY "Workspace users can view activity events"
  ON public.activity_events FOR SELECT TO authenticated
  USING (public.is_workspace_user(auth.uid()));

-- team directory: raw rows admin-only
DROP POLICY IF EXISTS "Signed-in users can view team members" ON public.team_members;
CREATE POLICY "Admins can view team members"
  ON public.team_members FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.team_directory()
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  role text,
  plan text,
  status text,
  last_active_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id,
    t.full_name,
    CASE
      WHEN public.has_role(auth.uid(), 'admin') THEN t.email
      ELSE regexp_replace(t.email, '^(.).*(@.*)$', '\1•••••\2')
    END AS email,
    t.role,
    t.plan,
    t.status,
    t.last_active_at
  FROM public.team_members t
  WHERE public.is_workspace_user(auth.uid())
  ORDER BY t.created_at ASC
$$;

REVOKE EXECUTE ON FUNCTION public.team_directory() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.team_directory() TO authenticated;
