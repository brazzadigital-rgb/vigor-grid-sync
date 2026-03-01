import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Dumbbell, Clock, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const exercises = [
  { name: "Supino Reto — Barra", sets: 4, reps: "10-12", rest: "90s", intensity: "RPE 8" },
  { name: "Supino Inclinado — Halteres", sets: 3, reps: "12", rest: "60s", intensity: "RPE 7" },
  { name: "Crucifixo — Máquina", sets: 3, reps: "15", rest: "45s", intensity: "RPE 7" },
  { name: "Crossover — Cabo", sets: 3, reps: "15", rest: "45s", intensity: "RPE 8" },
  { name: "Tríceps Corda — Cabo", sets: 4, reps: "12", rest: "60s", intensity: "RPE 8" },
  { name: "Tríceps Francês — Haltere", sets: 3, reps: "12", rest: "60s", intensity: "RPE 7" },
  { name: "Mergulho — Paralelas", sets: 3, reps: "Max", rest: "90s", intensity: "RPE 9" },
  { name: "Extensão de Tríceps — Máquina", sets: 3, reps: "15", rest: "45s", intensity: "RPE 7" },
];

export default function WorkoutDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Treino A</h1>
          <p className="text-sm text-muted-foreground">Peito & Tríceps</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><Dumbbell className="w-4 h-4 text-primary" />{exercises.length} exercícios</span>
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />55 min</span>
        <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-warning" />Alta</span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
        <p className="text-xs text-muted-foreground font-medium">Observações do Coach</p>
        <p className="text-sm text-foreground">Foque na contração. Aqueça bem os ombros antes de começar o supino. Descanso entre séries: 60-90s.</p>
      </div>

      <Button variant="glow" size="lg" className="w-full" onClick={() => navigate(`/app/workouts/${id}/execute`)}>
        <Play className="w-5 h-5" /> Iniciar Treino
      </Button>

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Exercícios</h2>
        {exercises.map((ex, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{ex.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{ex.sets} × {ex.reps}</span>
                <span>🔄 {ex.rest}</span>
                <span>{ex.intensity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
