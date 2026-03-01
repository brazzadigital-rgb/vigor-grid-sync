import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DailyMetrics {
  id: string;
  calories_burned: number;
  calories_goal: number;
  active_minutes: number;
  workout_time_minutes: number;
  workouts_completed_today: number;
  workouts_completed_week: number;
  streak_days: number;
  intensity_score: number;
  distance_km: number;
  weekly_workout_goal: number;
  steps: number;
  avg_pace: string | null;
}

const defaultMetrics: DailyMetrics = {
  id: "",
  calories_burned: 0,
  calories_goal: 2500,
  active_minutes: 0,
  workout_time_minutes: 0,
  workouts_completed_today: 0,
  workouts_completed_week: 0,
  streak_days: 0,
  intensity_score: 0,
  distance_km: 0,
  weekly_workout_goal: 5,
  steps: 0,
  avg_pace: null,
};

export function useDailyMetrics() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("daily-metrics-rt")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_daily_metrics",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ["daily-metrics", user.id] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, qc]);

  // Also listen to workout_sessions for instant updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("sessions-metrics-rt")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workout_sessions",
          filter: `member_id=eq.${user.id}`,
        },
        () => {
          // Small delay to let the trigger run
          setTimeout(() => {
            qc.invalidateQueries({ queryKey: ["daily-metrics", user.id] });
          }, 500);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, qc]);

  return useQuery({
    queryKey: ["daily-metrics", user?.id, today],
    enabled: !!user,
    queryFn: async (): Promise<DailyMetrics> => {
      // Try to trigger calculation
      await supabase.rpc("calculate_daily_metrics", {
        _user_id: user!.id,
        _day: today,
      });

      const { data, error } = await supabase
        .from("user_daily_metrics")
        .select("*")
        .eq("user_id", user!.id)
        .eq("day", today)
        .maybeSingle();

      if (error) throw error;
      if (!data) return defaultMetrics;

      return {
        id: data.id,
        calories_burned: data.calories_burned,
        calories_goal: data.calories_goal,
        active_minutes: data.active_minutes,
        workout_time_minutes: data.workout_time_minutes,
        workouts_completed_today: data.workouts_completed_today,
        workouts_completed_week: data.workouts_completed_week,
        streak_days: data.streak_days,
        intensity_score: data.intensity_score,
        distance_km: Number(data.distance_km),
        weekly_workout_goal: data.weekly_workout_goal,
        steps: data.steps,
        avg_pace: data.avg_pace,
      };
    },
    refetchInterval: 60000,
  });
}

export function useHourlyActivity() {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["hourly-activity", user?.id, today],
    enabled: !!user,
    queryFn: async () => {
      const { data: sessions } = await supabase
        .from("workout_sessions")
        .select("id, created_at")
        .eq("member_id", user!.id)
        .eq("date", today)
        .eq("status", "done");

      if (!sessions || sessions.length === 0) {
        return Array.from({ length: 24 }, (_, i) => ({ hour: i, calories: 0, intensity: 0 }));
      }

      const { data: logs } = await supabase
        .from("workout_logs")
        .select("calories_estimated, duration_seconds, created_at")
        .in("session_id", sessions.map((s) => s.id));

      const hourly = Array.from({ length: 24 }, (_, i) => ({ hour: i, calories: 0, intensity: 0 }));

      (logs ?? []).forEach((log) => {
        const h = new Date(log.created_at).getHours();
        const cal = log.calories_estimated && log.calories_estimated > 0
          ? log.calories_estimated
          : Math.round(((log.duration_seconds ?? 0) / 60) * 8);
        hourly[h].calories += cal;
        hourly[h].intensity = Math.min(100, hourly[h].intensity + Math.round(cal / 5));
      });

      return hourly;
    },
  });
}
