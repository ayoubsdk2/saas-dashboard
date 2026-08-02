
DROP POLICY IF EXISTS "Workspace users can view monthly metrics" ON public.monthly_metrics;
CREATE POLICY "Workspace users can view monthly metrics"
  ON public.monthly_metrics FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()));

DROP POLICY IF EXISTS "Workspace users can view daily metrics" ON public.daily_metrics;
CREATE POLICY "Workspace users can view daily metrics"
  ON public.daily_metrics FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()));

DROP POLICY IF EXISTS "Workspace users can view plan distribution" ON public.plan_distribution;
CREATE POLICY "Workspace users can view plan distribution"
  ON public.plan_distribution FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()));

DROP POLICY IF EXISTS "Workspace users can view activity events" ON public.activity_events;
CREATE POLICY "Workspace users can view activity events"
  ON public.activity_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()));

DROP POLICY IF EXISTS "Workspace users can view team directory" ON public.team_members;
CREATE POLICY "Workspace users can view team directory"
  ON public.team_members FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can view team contacts" ON public.team_member_contacts;
CREATE POLICY "Admins can view team contacts"
  ON public.team_member_contacts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

DROP FUNCTION IF EXISTS public.is_workspace_user(uuid);
