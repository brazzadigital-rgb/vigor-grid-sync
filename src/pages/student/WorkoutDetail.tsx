import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Dumbbell, Clock, Zap, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyAssignedWorkouts, useWorkoutDays } from "@/hooks/use-supabase-data";

export default function WorkoutDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: assigned } = useMyAssignedWorkouts();

  const workout = assigned?.find(w => w.id === id);
  const templateId = workout?.template_id;
  const { data: days, isLoading } = useWorkoutDays(templateId);

  const allItems = days?.flatMap(d => d.workout_items ?? []) ?? [];
  const template = workout?.workout_templates;

  if (isLoading) {
    return (
      <div className="px-5 pt-14 pb-6 max-w-lg mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{template?.name ?? "Treino"}</h1>
          <p className="text-sm text-muted-foreground">{template?.goal_type ?? ""} • {template?.level ?? ""}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><Dumbbell className="w-4 h-4 text-primary" />{allItems.length} exercícios</span>
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{template?.weeks ?? 0} semanas</span>
      </div>

      {template?.notes && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Observações</p>
          <p className="text-sm text-foreground">{template.notes}</p>
        </div>
      )}

      <Button variant="glow" size="lg" className="w-full" onClick={() => navigate(`/app/workouts/${id}/execute`)}>
        <Play className="w-5 h-5" /> Iniciar Treino
      </Button>

      {/* Workout Days */}
      {(days ?? []).map((day) => (
        <div key={day.id} className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">{day.title || `Dia ${day.day_index + 1}`}</h2>
          {(day.workout_items ?? [])
            .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((item: any, i: number) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.exercises?.name ?? "Exercício"}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{item.sets} × {item.reps}</span>
                  <span>🔄 {item.rest_seconds}s</span>
                  {item.intensity && <span>{item.intensity}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {allItems.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">Nenhum exercício cadastrado neste treino</p>
        </div>
      )}
    </div>
  );
}
