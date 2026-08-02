
DROP FUNCTION IF EXISTS public.team_directory();

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_workspace_user(uuid) FROM authenticated, anon, PUBLIC;

-- separate sensitive contact details from the general directory
CREATE TABLE public.team_member_contacts (
  member_id uuid PRIMARY KEY REFERENCES public.team_members(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.team_member_contacts TO authenticated;
GRANT ALL ON public.team_member_contacts TO service_role;

ALTER TABLE public.team_member_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view team contacts"
  ON public.team_member_contacts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.team_member_contacts (member_id, email)
SELECT id, email FROM public.team_members
ON CONFLICT (member_id) DO NOTHING;

ALTER TABLE public.team_members DROP COLUMN email;

DROP POLICY IF EXISTS "Admins can view team members" ON public.team_members;
CREATE POLICY "Workspace users can view team directory"
  ON public.team_members FOR SELECT TO authenticated
  USING (public.is_workspace_user(auth.uid()));
