import { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, Star, Flame, ChevronRight } from "lucide-react";
import { useDailyMetrics } from "@/hooks/use-performance-data";
import { useMyWorkoutStats } from "@/hooks/use-supabase-data";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default memo(function ProgressCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: metrics } = useDailyMetrics();
  const { data: stats } = useMyWorkoutStats();

  const { data: goals } = useQuery({
    queryKey: ["my-goals-summary", user?.id],
    enabled: !!user,
    staleTime: 300_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_goals")
        .select("id, status")
        .eq("user_id", user!.id);
      if (error) throw error;
      const total = data?.length ?? 0;
      const done = data?.filter(g => g.status === "done").length ?? 0;
      return { total, done };
    },
  });

  const workoutMin = metrics?.workout_time_minutes ?? 0;
  const streak = metrics?.streak_days ?? 0;
  const goalsDone = goals?.done ?? 0;
  const goalsTotal = goals?.total ?? 0;

  // Weekly workout progress for the ring
  const weekDone = metrics?.workouts_completed_week ?? 0;
  const weekGoal = metrics?.weekly_workout_goal ?? 5;
  const pct = weekGoal > 0 ? Math.min(Math.round((weekDone / weekGoal) * 100), 100) : 0;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const items = [
    { icon: <Calendar className="w-3.5 h-3.5" />, value: `${workoutMin} min`, label: "Treino Hoje", accent: "hsl(210 90% 60%)" },
    { icon: <Star className="w-3.5 h-3.5" />, value: `${goalsDone}/${goalsTotal}`, label: "Metas Completas", accent: "hsl(152 60% 50%)" },
    { icon: <Flame className="w-3.5 h-3.5" />, value: `${streak} dias`, label: "Dias Seguidos", accent: "hsl(38 92% 60%)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-border/50 p-5 cursor-pointer hover:border-primary/30 transition-all"
      style={{ background: "linear-gradient(145deg, hsl(225 25% 10% / 0.9), hsl(225 25% 8%))" }}
      onClick={() => navigate("/app/progress-today")}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Progresso</h3>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="flex items-center gap-5">
        {/* Left metrics */}
        <div className="flex-1 space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${item.accent}15`, color: item.accent }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">{item.value}</p>
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right ring */}
        <div className="relative w-28 h-28 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(225 20% 14%)" strokeWidth="7" />
            <motion.circle
              cx="50" cy="50" r={radius}
              fill="none" stroke="url(#progressRingGrad)" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
            />
            <defs>
              <linearGradient id="progressRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(210 90% 50%)" />
                <stop offset="100%" stopColor="hsl(210 90% 65%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold tabular-nums text-foreground">{pct}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
