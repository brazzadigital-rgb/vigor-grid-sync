import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "super_admin" | "owner" | "coach" | "member";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: { id: string; name: string; email: string; gym_id: string | null; avatar_url: string | null } | null;
  roles: AppRole[];
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isStaff: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndRoles = useCallback(async (userId: string) => {
    const [profileRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("id, name, email, gym_id, avatar_url").eq("id", userId).single(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    if (profileRes.data) setProfile(profileRes.data);
    if (rolesRes.data) setRoles(rolesRes.data.map((r: any) => r.role as AppRole));
  }, []);

  const syncOnboardingFromLocalStorage = useCallback(async (userId: string) => {
    const saved = localStorage.getItem("onboarding_progress");
    const done = localStorage.getItem("onboarding_steps_done");
    if (!done || done !== "true") return;

    let answers: Record<string, any> = {};
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers) answers = parsed.answers;
      } catch {}
    }

    // Also try to get answers even if onboarding_progress was already cleared
    if (Object.keys(answers).length === 0) {
      // Already cleared, nothing to sync
      localStorage.removeItem("onboarding_steps_done");
      return;
    }

    const payload = {
      user_id: userId,
      gender: answers.gender || null,
      age: answers.age || null,
      height: answers.height || null,
      weight: answers.weight || null,
      activity_level: answers.activity_level || null,
      fitness_goal: answers.fitness_goal || null,
      experience_level: answers.experience_level || null,
      equipment: answers.equipment || [],
      workout_duration: answers.workout_duration || null,
      workout_location: answers.workout_location || null,
      preferred_time: answers.preferred_time || null,
      injuries: answers.injuries || [],
      reminders: answers.reminders || null,
      completed: true,
    };

    const { error } = await supabase.from("onboarding_data").upsert(payload, { onConflict: "user_id" });
    if (!error) {
      localStorage.removeItem("onboarding_progress");
      localStorage.removeItem("onboarding_steps_done");
      console.log("Onboarding data synced to Supabase");
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndRoles(session.user.id).finally(() => setLoading(false));
        syncOnboardingFromLocalStorage(session.user.id);
      } else {
        setProfile(null);
        setRoles([]);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndRoles(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfileAndRoles]);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setRoles([]);
  };

  const isStaff = roles.includes("owner") || roles.includes("coach") || roles.includes("super_admin");
  const isAdmin = roles.includes("owner") || roles.includes("super_admin");

  return (
    <AuthContext.Provider value={{ session, user, profile, roles, loading, signUp, signIn, signOut, isStaff, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
