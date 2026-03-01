import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pause, Play, SkipForward, Check, Timer, Loader2, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyAssignedWorkouts, useWorkoutDays } from "@/hooks/use-supabase-data";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function WorkoutExecution() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { profile } = useAuth();
  const { data: assigned } = useMyAssignedWorkouts();

  const workout = assigned?.find(w => w.id === id);
  const templateId = workout?.template_id;
  const { data: days, isLoading } = useWorkoutDays(templateId);

  const exercises = (days ?? [])
    .sort((a, b) => a.day_index - b.day_index)
    .flatMap(d =>
      (d.workout_items ?? [])
        .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
        .map((item: any) => ({
          id: item.id,
          exerciseId: item.exercise_id,
          name: item.exercises?.name ?? "Exercício",
          sets: item.sets ?? 3,
          reps: item.reps ?? "12",
          rest: item.rest_seconds ?? 60,
          dayTitle: d.title,
          mediaUrl: item.exercises?.media_url ?? null,
          instructions: item.exercises?.instructions ?? null,
        }))
    );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const exercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex) / exercises.length) * 100 : 0;

  const saveSession = useMutation({
    mutationFn: async () => {
      if (!workout || !profile?.gym_id) return;
      const { error } = await supabase.from("workout_sessions").insert({
        member_id: profile.id,
        gym_id: profile.gym_id,
        assigned_workout_id: workout.id,
        date: new Date().toISOString().split("T")[0],
        status: "done" as const,
      });
      if (error) throw error;
    },
  });

  useEffect(() => {
    if (finished || isPaused) return;
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
      if (isResting) {
        setRestTime((r) => {
          if (r <= 1) { setIsResting(false); return 0; }
          return r - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isPaused, isResting, finished]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleCompleteSet = () => {
    if (!exercise) return;
    if (currentSet < exercise.sets) {
      setCurrentSet((s) => s + 1);
      setIsResting(true);
      setRestTime(exercise.rest);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    setShowTips(false);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setCurrentSet(1);
      setIsResting(false);
      setRestTime(0);
    } else {
      setFinished(true);
      saveSession.mutate();
    }
  };

  // Parse instructions
  const parsedInstructions = (() => {
    if (!exercise?.instructions) return null;
    try { return JSON.parse(exercise.instructions); } catch { return null; }
  })();

  if (isLoading) {
    return (
      <div className="px-5 pt-14 pb-6 max-w-lg mx-auto flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="px-5 pt-14 pb-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[80vh] space-y-4 text-center">
        <p className="text-sm text-muted-foreground">Nenhum exercício encontrado neste treino</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="px-5 pt-14 pb-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[80vh] space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-success/15 border border-success/30 flex items-center justify-center glow-purple">
          <Check className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Treino Concluído! 🎉</h1>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-lg font-bold text-foreground">{formatTime(elapsed)}</p>
            <p className="text-xs text-muted-foreground">Duração</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-lg font-bold text-foreground">{exercises.length}</p>
            <p className="text-xs text-muted-foreground">Exercícios</p>
          </div>
        </div>
        <Button variant="glow" size="lg" className="w-full" onClick={() => navigate("/app/workouts")}>
          Voltar aos Treinos
        </Button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-12 pb-6 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-secondary text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm font-mono text-foreground">
          <Timer className="w-4 h-4 text-primary" />
          {formatTime(elapsed)}
        </div>
        <span className="text-sm text-muted-foreground">{currentIndex + 1}/{exercises.length}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full bg-gradient-purple transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Rest Timer */}
      {isResting && (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center space-y-2 glow-purple animate-pulse-glow">
          <p className="text-sm text-primary font-medium">Descanso</p>
          <p className="text-5xl font-bold text-foreground font-mono">{formatTime(restTime)}</p>
          <Button variant="ghost" size="sm" onClick={() => { setIsResting(false); setRestTime(0); }}>
            Pular descanso
          </Button>
        </div>
      )}

      {/* Current Exercise */}
      {!isResting && exercise && (
        <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden glow-purple">
          {/* Exercise Image */}
          {exercise.mediaUrl && (
            <div className="w-full h-48 bg-secondary overflow-hidden">
              <img
                src={exercise.mediaUrl}
                alt={exercise.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}
          <div className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-primary font-medium uppercase tracking-wider">Exercício {currentIndex + 1}</p>
              <h2 className="text-xl font-bold text-foreground">{exercise.name}</h2>
            </div>
            <div className="flex items-center justify-center gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{exercise.reps}</p>
                <p className="text-xs text-muted-foreground">Reps</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-bold text-primary">{currentSet}/{exercise.sets}</p>
                <p className="text-xs text-muted-foreground">Série</p>
              </div>
            </div>

            {/* Tips toggle */}
            {parsedInstructions && (
              <div className="border-t border-border pt-3">
                <button onClick={() => setShowTips(!showTips)} className="flex items-center gap-2 text-xs text-primary font-medium w-full justify-center">
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showTips ? "Ocultar dicas" : "Ver como executar"}
                  {showTips ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showTips && (
                  <div className="mt-3 space-y-2 animate-slide-up text-left">
                    {parsedInstructions.steps?.map((step: string, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        <span className="text-primary font-semibold">{i + 1}.</span> {step}
                      </p>
                    ))}
                    {parsedInstructions.tips && (
                      <div className="pt-2 space-y-1">
                        {parsedInstructions.tips.map((tip: string, i: number) => (
                          <p key={i} className="text-xs text-warning/80">💡 {tip}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl" onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </Button>
        <Button variant="glow" size="lg" className="flex-1 h-14" onClick={handleCompleteSet} disabled={isResting}>
          {exercise && currentSet < exercise.sets ? "Concluir Série" : "Próximo Exercício"}
        </Button>
        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl" onClick={handleNext}>
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>

      {/* Exercise List Mini */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Próximos</p>
        {exercises.slice(currentIndex + 1, currentIndex + 4).map((ex, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
            {ex.mediaUrl && (
              <img src={ex.mediaUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
            )}
            {!ex.mediaUrl && <span className="w-8 text-xs text-center">{currentIndex + 2 + i}.</span>}
            <span className="truncate flex-1">{ex.name}</span>
            <span className="ml-auto text-xs">{ex.sets}×{ex.reps}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
