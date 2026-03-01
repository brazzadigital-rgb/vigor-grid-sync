import { Flame, Calendar, ChevronRight, Dumbbell, TrendingUp, Trophy, Loader2, Sparkles, Target, Clock, Check } from "lucide-react";
import homeHero from "@/assets/home-hero.jpg";
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
  const todayStr = new Date().toISOString().split("T")[0];
  const todayDoneSessions = (sessions ?? []).filter(
    s => s.status === "done" && s.date === todayStr
  );
  const isTodayWorkoutDone = todayWorkout
    ? todayDoneSessions.some(s => s.assigned_workout_id === todayWorkout.id)
    : false;
  const upcomingSessions = (sessions ?? [])
    .filter(s => s.status === "planned" && new Date(s.date) >= new Date())
    .slice(0, 3);

  const firstName = profile?.name?.split(" ")[0] || "Aluno";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="px-5 pt-12 pb-6 max-w-lg mx-auto space-y-5">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        <img src={homeHero} alt="Fitness motivation" className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-sm">{getGreeting()},</p>
            <h1 className="text-2xl font-bold text-foreground">{firstName} 👋</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur border border-border rounded-full px-3 py-1.5">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-foreground">{stats?.streak ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Plan & Status Pills */}
      <div className="flex items-center gap-2 flex-wrap">
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
      </div>

      {/* Today's Workout Card */}
      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : todayWorkout ? (
        <div
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
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto">
            <Dumbbell className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Nenhum treino atribuído ainda</p>
          <p className="text-xs text-muted-foreground/60">Seu coach vai montar seu treino em breve</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Flame, value: `${stats?.streak ?? 0}`, label: "Streak", sublabel: "dias", color: "text-warning", bg: "bg-warning/10" },
          { icon: TrendingUp, value: `${stats?.done ?? 0}`, label: "Concluídos", sublabel: "treinos", color: "text-success", bg: "bg-success/10" },
          { icon: Trophy, value: `${stats?.badgeCount ?? 0}`, label: "Conquistas", sublabel: "badges", color: "text-primary", bg: "bg-primary/10" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4 text-center space-y-2 hover:border-primary/20 transition-colors">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mx-auto`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{stat.sublabel}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/app/workouts")}
          className="rounded-2xl border border-border bg-card p-4 text-left hover:border-primary/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-semibold text-foreground">Meus Treinos</p>
          <p className="text-xs text-muted-foreground mt-0.5">Ver programas</p>
        </button>
        <button
          onClick={() => navigate("/app/schedule")}
          className="rounded-2xl border border-border bg-card p-4 text-left hover:border-primary/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-info" />
          </div>
          <p className="text-sm font-semibold text-foreground">Agenda</p>
          <p className="text-xs text-muted-foreground mt-0.5">Ver calendário</p>
        </button>
      </div>

      {/* Upcoming Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Próximas Sessões</h2>
          <button onClick={() => navigate("/app/schedule")} className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">Ver todas</button>
        </div>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-2">
            {upcomingSessions.map((session) => (
              <div key={session.id}
                onClick={() => session.assigned_workout_id && navigate(`/app/workouts/${session.assigned_workout_id}`)}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/20 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex flex-col items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-primary mb-0.5" />
                  <span className="text-[10px] font-semibold text-foreground">{new Date(session.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.assigned_workouts?.workout_templates?.name ?? "Treino"}
                  </p>
                  <p className="text-xs text-muted-foreground">Agendado</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma sessão agendada</p>
          </div>
        )}
      </div>
    </div>
  );
}
