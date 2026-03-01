import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, ChevronRight, Clock, Zap, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyAssignedWorkouts, useMyWorkoutSessions } from "@/hooks/use-supabase-data";

export default function StudentWorkouts() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const { data: assigned, isLoading } = useMyAssignedWorkouts();
  const { data: sessions } = useMyWorkoutSessions();

  const filters = ["all", "active", "done"];
  const filterLabels: Record<string, string> = { all: "Todos", active: "Ativos", done: "Concluídos" };

  const filteredWorkouts = (assigned ?? []).filter(w => {
    if (filter === "active") return w.status === "active";
    if (filter === "done") return w.status !== "active";
    return true;
  });

  // Check if a workout has completed sessions
  const getWorkoutStatus = (assignedId: string) => {
    const s = sessions?.filter(s => s.assigned_workout_id === assignedId);
    const done = s?.some(s => s.status === "done");
    return done ? "done" : "active";
  };

  if (isLoading) {
    return (
      <div className="px-5 pt-14 pb-6 max-w-lg mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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
      {filteredWorkouts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-2">
          <Dumbbell className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Nenhum treino encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWorkouts.map((workout) => {
            const status = getWorkoutStatus(workout.id);
            const isDone = status === "done";
            return (
              <div
                key={workout.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-all"
                onClick={() => navigate(`/app/workouts/${workout.id}`)}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Dumbbell className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{workout.workout_templates?.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{workout.workout_templates?.level ?? "—"}</span>
                    <span>{workout.workout_templates?.weeks ?? 0} semanas</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    isDone
                      ? "bg-success/15 text-success border-success/20"
                      : "bg-primary/15 text-primary border-primary/20"
                  }`}>
                    {isDone ? "Concluído" : "Ativo"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
