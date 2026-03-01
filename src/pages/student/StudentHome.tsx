import { Flame, Calendar, ChevronRight, Dumbbell, Clock, TrendingUp, Trophy, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyMembership, useMyAssignedWorkouts, useMyWorkoutSessions, useMyWorkoutStats } from "@/hooks/use-supabase-data";

export default function StudentHome() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: membership } = useMyMembership();
  const { data: assignedWorkouts, isLoading } = useMyAssignedWorkouts();
  const { data: sessions } = useMyWorkoutSessions();
  const { data: stats } = useMyWorkoutStats();

  const todayWorkout = assignedWorkouts?.[0];
  const upcomingSessions = (sessions ?? [])
    .filter(s => s.status === "planned" && new Date(s.date) >= new Date())
    .slice(0, 3);

  const firstName = profile?.name?.split(" ")[0] || "Aluno";

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Olá,</p>
        <h1 className="text-2xl font-bold text-foreground">{firstName} 👋</h1>
      </div>

      {/* Plan Badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium bg-primary/15 text-primary border border-primary/20 px-3 py-1 rounded-full">
          {membership?.plans?.name ?? "Sem plano"}
        </span>
        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
          membership?.status === "active"
            ? "bg-success/15 text-success border-success/20"
            : "bg-warning/15 text-warning border-warning/20"
        }`}>
          {membership ? (membership.status === "active" ? "Ativo" : "Pendente") : "Inativo"}
        </span>
      </div>

      {/* Today's Workout Card */}
      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : todayWorkout ? (
        <div
          className="rounded-2xl border border-primary/20 bg-card p-5 space-y-4 cursor-pointer hover:border-primary/40 transition-all glow-purple"
          onClick={() => navigate(`/app/workouts/${todayWorkout.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Treino de Hoje</p>
                <h3 className="text-sm font-semibold text-foreground">{todayWorkout.workout_templates?.name}</h3>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <Button variant="glow" size="lg" className="w-full" onClick={(e) => { e.stopPropagation(); navigate(`/app/workouts/${todayWorkout.id}/execute`); }}>
            Iniciar Treino
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-2">
          <Dumbbell className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Nenhum treino atribuído ainda</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-2">
          <Flame className="w-5 h-5 mx-auto text-warning" />
          <p className="text-lg font-bold text-foreground">{stats?.streak ?? 0} dias</p>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-2">
          <TrendingUp className="w-5 h-5 mx-auto text-success" />
          <p className="text-lg font-bold text-foreground">{stats?.done ?? 0} treinos</p>
          <p className="text-xs text-muted-foreground">Concluídos</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-2">
          <Trophy className="w-5 h-5 mx-auto text-primary" />
          <p className="text-lg font-bold text-foreground">{stats?.badgeCount ?? 0} badges</p>
          <p className="text-xs text-muted-foreground">Conquistas</p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Próximas Sessões</h2>
          <button onClick={() => navigate("/app/schedule")} className="text-xs text-primary font-medium">Ver todas</button>
        </div>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-2">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex flex-col items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary mb-0.5" />
                  <span className="text-xs font-semibold text-foreground">{new Date(session.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.assigned_workouts?.workout_templates?.name ?? "Treino"}
                  </p>
                  <p className="text-xs text-muted-foreground">{session.status === "planned" ? "Agendado" : session.status}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma sessão agendada</p>
        )}
      </div>
    </div>
  );
}
