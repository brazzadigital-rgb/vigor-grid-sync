import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, ChevronRight, Clock, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const workoutWeeks = [
  { week: "Semana Atual", workouts: [
    { id: "1", name: "Treino A — Peito & Tríceps", exercises: 8, duration: "55 min", status: "today" },
    { id: "2", name: "Treino B — Costas & Bíceps", exercises: 7, duration: "50 min", status: "done" },
    { id: "3", name: "Treino C — Pernas", exercises: 9, duration: "60 min", status: "upcoming" },
    { id: "4", name: "Treino D — Ombros & Abs", exercises: 6, duration: "45 min", status: "upcoming" },
  ]},
  { week: "Próxima Semana", workouts: [
    { id: "5", name: "Treino A — Peito & Tríceps", exercises: 8, duration: "55 min", status: "upcoming" },
    { id: "6", name: "Treino B — Costas & Bíceps", exercises: 7, duration: "50 min", status: "upcoming" },
  ]},
];

const statusConfig = {
  today: { label: "Hoje", className: "bg-primary/15 text-primary border-primary/20" },
  done: { label: "Concluído", className: "bg-success/15 text-success border-success/20" },
  upcoming: { label: "Próximo", className: "bg-secondary text-muted-foreground border-border" },
};

export default function StudentWorkouts() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const filters = ["all", "today", "done", "upcoming"];
  const filterLabels: Record<string, string> = { all: "Todos", today: "Hoje", done: "Concluídos", upcoming: "Próximos" };

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Meus Treinos</h1>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <Button
            key={f}
            variant={filter === f ? "pill-active" : "pill"}
            size="pill"
            onClick={() => setFilter(f)}
          >
            {filterLabels[f]}
          </Button>
        ))}
      </div>

      {/* Workout List */}
      {workoutWeeks.map((week) => (
        <div key={week.week} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">{week.week}</h2>
          {week.workouts
            .filter((w) => filter === "all" || w.status === filter)
            .map((workout) => {
              const config = statusConfig[workout.status as keyof typeof statusConfig];
              return (
                <div
                  key={workout.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-all"
                  onClick={() => navigate(`/app/workouts/${workout.id}`)}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    {workout.status === "done" ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Dumbbell className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{workout.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" />{workout.exercises}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{workout.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full border ${config.className}`}>
                      {config.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
}
