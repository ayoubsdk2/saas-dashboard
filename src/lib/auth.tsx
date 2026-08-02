import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Auth placeholder. Swap the internals of this provider for a real auth client
 * (Lovable Cloud / Supabase, Auth.js, Clerk, ...) without touching consumers.
 */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  initials: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
};

const demoUser: AuthUser = {
  id: "usr_001",
  name: "Ada Kovač",
  email: "ada@northwind.io",
  role: "Owner",
  initials: "AK",
};

const AuthContext = createContext<AuthState>({
  user: demoUser,
  isAuthenticated: true,
  isLoading: false,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(demoUser);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: false,
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
