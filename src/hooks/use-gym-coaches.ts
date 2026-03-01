import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useGymCoaches() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["gym-coaches", profile?.gym_id],
    enabled: !!profile?.gym_id,
    queryFn: async () => {
      // Get user_roles with role = 'coach' or 'owner' for this gym
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("gym_id", profile!.gym_id!)
        .in("role", ["coach", "owner"]);
      if (error) throw error;
      if (!roles || roles.length === 0) return [];

      const userIds = roles.map((r) => r.user_id);
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, name, email, avatar_url, phone")
        .in("id", userIds);
      if (pErr) throw pErr;

      return (profiles ?? []).map((p) => ({
        ...p,
        role: roles.find((r) => r.user_id === p.id)?.role ?? "coach",
      }));
    },
  });
}
