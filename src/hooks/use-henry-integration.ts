import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

function useGymId() {
  const { profile } = useAuth();
  return profile?.gym_id ?? null;
}

export function useCreateDevice() {
  const qc = useQueryClient();
  const gymId = useGymId();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: { name: string; location?: string }) => {
      const { error } = await supabase.from("devices").insert({
        name: data.name,
        location: data.location ?? null,
        gym_id: gymId!,
        type: "henry_turnstile" as const,
        status: "active",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gym-devices"] });
      toast({ title: "Dispositivo adicionado!" });
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });
}

export function useSimulateAccess() {
  const gymId = useGymId();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { credential_token: string }) => {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/henry-webhook`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: anonKey,
          },
          body: JSON.stringify({
            event: "access_request",
            credential_token: data.credential_token,
            gym_id: gymId,
            simulate: true,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      return res.json() as Promise<{
        decision: "allow" | "deny";
        reason: string;
        member_name?: string;
        simulate?: boolean;
      }>;
    },
    onError: (e: any) => toast({ title: "Erro na simulação", description: e.message, variant: "destructive" }),
  });
}
