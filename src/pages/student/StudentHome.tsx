import { Flame, Calendar, ChevronRight, Dumbbell, Clock, TrendingUp, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const todayWorkout = {
  name: "Treino A — Peito & Tríceps",
  exercises: 8,
  duration: "55 min",
  intensity: "Alta",
};

const upcomingSessions = [
  { time: "14:00", title: "Treino B — Costas & Bíceps", coach: "Carlos R." },
  { time: "16:30", title: "Funcional — Circuito", coach: "Ana S." },
];

const stats = [
  { label: "Streak", value: "12 dias", icon: Flame, color: "text-warning" },
  { label: "Este mês", value: "18 treinos", icon: TrendingUp, color: "text-success" },
  { label: "Conquistas", value: "7 badges", icon: Trophy, color: "text-primary" },
];

export default function StudentHome() {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Olá,</p>
        <h1 className="text-2xl font-bold text-foreground">João Silva 👋</h1>
      </div>

      {/* Plan Badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium bg-primary/15 text-primary border border-primary/20 px-3 py-1 rounded-full">
          Plano Premium
        </span>
        <span className="text-xs font-medium bg-success/15 text-success border border-success/20 px-3 py-1 rounded-full">
          Ativo
        </span>
      </div>

      {/* Today's Workout Card */}
      <div
        className="rounded-2xl border border-primary/20 bg-card p-5 space-y-4 cursor-pointer hover:border-primary/40 transition-all glow-purple"
        onClick={() => navigate("/app/workouts/1")}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Treino de Hoje</p>
              <h3 className="text-sm font-semibold text-foreground">{todayWorkout.name}</h3>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> {todayWorkout.exercises} exercícios</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {todayWorkout.duration}</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {todayWorkout.intensity}</span>
        </div>
        <Button variant="glow" size="lg" className="w-full" onClick={(e) => { e.stopPropagation(); navigate("/app/workouts/1/execute"); }}>
          Iniciar Treino
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4 text-center space-y-2">
            <stat.icon className={`w-5 h-5 mx-auto ${stat.color}`} />
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Próximas Sessões</h2>
          <button onClick={() => navigate("/app/schedule")} className="text-xs text-primary font-medium">Ver todas</button>
        </div>
        <div className="space-y-2">
          {upcomingSessions.map((session, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex flex-col items-center justify-center">
                <Calendar className="w-4 h-4 text-primary mb-0.5" />
                <span className="text-xs font-semibold text-foreground">{session.time}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{session.title}</p>
                <p className="text-xs text-muted-foreground">Coach {session.coach}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
