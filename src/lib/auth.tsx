import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string | null;
  job_title: string | null;
  company: string | null;
  avatar_url: string | null;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  emailVerified: boolean;
};

type AuthState = {
  session: Session | null;
  authUser: User | null;
  profile: Profile | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  authUser: null,
  profile: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

function initialsFrom(name: string) {
  const parts = name.trim().split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0]![0]! + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setIsLoading(false);
    });
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, job_title, company, avatar_url")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data ?? null);
  }, [userId]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthState>(() => {
    const authUser = session?.user ?? null;
    const email = authUser?.email ?? "";
    const name =
      profile?.full_name ||
      (authUser?.user_metadata?.["full_name"] as string | undefined) ||
      email.split("@")[0] ||
      "";
    return {
      session,
      authUser,
      profile,
      user: authUser
        ? {
            id: authUser.id,
            name,
            email,
            initials: initialsFrom(name || email),
            emailVerified: Boolean(authUser.email_confirmed_at),
          }
        : null,
      isAuthenticated: Boolean(authUser),
      isLoading,
      refreshProfile: loadProfile,
      signOut,
    };
  }, [session, profile, isLoading, loadProfile, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
