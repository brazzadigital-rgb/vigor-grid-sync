import { motion } from "framer-motion";
import { Flame, ChevronRight, Dumbbell, Clock, Sparkles, Check, Loader2, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyMembership, useMyAssignedWorkouts, useMyWorkoutSessions, useMyWorkoutStats } from "@/hooks/use-supabase-data";
import { useGymInfo } from "@/hooks/use-home-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import NotificationBell from "./NotificationBell";
import CaloriesCard from "./CaloriesCard";
import WorkoutMetrics from "./WorkoutMetrics";
import TrainerCard from "./TrainerCard";
import BodyFocusCarousel from "./BodyFocusCarousel";

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: membership } = useMyMembership();
  const { data: assignedWorkouts, isLoading } = useMyAssignedWorkouts();
  const { data: sessions } = useMyWorkoutSessions();
  const { data: stats } = useMyWorkoutStats();
  const { data: gym } = useGymInfo();

  const todayWorkout = assignedWorkouts?.[0];
  const todayStr = new Date().toISOString().split("T")[0];
  const isTodayWorkoutDone = todayWorkout
    ? (sessions ?? []).some(s => s.status === "done" && s.date === todayStr && s.assigned_workout_id === todayWorkout.id)
    : false;

  const firstName = profile?.name?.split(" ")[0] || "Aluno";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="px-5 pt-12 pb-6 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-primary/30">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">{getGreeting()},</p>
            <h1 className="text-lg font-bold text-foreground">{firstName} 👋</h1>
            {gym?.name && (
              <p className="text-[10px] text-muted-foreground/60">Bem-vindo à {gym.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur border border-border rounded-full px-3 py-1.5">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-foreground">{stats?.streak ?? 0}</span>
          </div>
          <NotificationBell />
        </div>
      </motion.div>

      {/* Plan pill */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-2 flex-wrap"
      >
        <span className="text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Target className="w-3 h-3" />
          {membership?.plans?.name ?? "Sem plano"}
        </span>
        <span className={`text-xs font-medium px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 ${
          membership?.status === "active"
            ? "bg-success/10 text-success border-success/20"
            : "bg-warning/10 text-warning border-warning/20"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${membership?.status === "active" ? "bg-success" : "bg-warning"}`} />
          {membership ? (membership.status === "active" ? "Ativo" : "Pendente") : "Inativo"}
        </span>
      </motion.div>

      {/* Calories Card */}
      <CaloriesCard />

      {/* Metrics */}
      <WorkoutMetrics />

      {/* Today's Workout */}
      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : todayWorkout ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-2xl border border-primary/20 bg-gradient-card p-5 space-y-4 cursor-pointer hover:border-primary/40 transition-all glow-purple group"
          onClick={() => navigate(`/app/workouts/${todayWorkout.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Treino de Hoje</p>
                <h3 className="text-base font-semibold text-foreground mt-0.5">{todayWorkout.workout_templates?.name}</h3>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {todayWorkout.workout_templates?.weeks ?? 4} sem</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> {todayWorkout.workout_templates?.level ?? "Intermediário"}</span>
          </div>
          {isTodayWorkoutDone ? (
            <Button variant="outline" size="lg" className="w-full" disabled>
              <Check className="w-4 h-4" />
              Treino Concluído Hoje ✓
            </Button>
          ) : (
            <Button variant="glow" size="lg" className="w-full" onClick={(e) => { e.stopPropagation(); navigate(`/app/workouts/${todayWorkout.id}/execute`); }}>
              <Dumbbell className="w-4 h-4" />
              Iniciar Treino
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card p-8 text-center space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto">
            <Dumbbell className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Nenhum treino atribuído ainda</p>
          <p className="text-xs text-muted-foreground/60">Seu coach vai montar seu treino em breve</p>
        </motion.div>
      )}

      {/* Trainer Card - shown only if coach exists (future: conditional on plan) */}
      {/* For now we show a placeholder that checks if the user has a coach assigned */}

      {/* Body Focus */}
      <BodyFocusCarousel />
    </div>
  );
}
