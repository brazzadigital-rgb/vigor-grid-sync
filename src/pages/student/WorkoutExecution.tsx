import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pause, Play, SkipForward, Check, Timer, Loader2, Lightbulb, ChevronDown, ChevronUp, Flame, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyAssignedWorkouts, useWorkoutDays, useMyWorkoutSessions } from "@/hooks/use-supabase-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function WorkoutExecution() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { data: assigned } = useMyAssignedWorkouts();
  const { data: sessions } = useMyWorkoutSessions();

  const workout = assigned?.find(w => w.id === id);
  const templateId = workout?.template_id;
  const { data: days, isLoading } = useWorkoutDays(templateId);

  const todayStr = new Date().toISOString().split("T")[0];
  const alreadyDoneToday = (sessions ?? []).some(
    s => s.assigned_workout_id === id && s.status === "done" && s.date === todayStr
  );

  const exercises = (days ?? [])
    .sort((a, b) => a.day_index - b.day_index)
    .flatMap(d =>
      (d.workout_items ?? [])
        .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
        .map((item: any) => ({
          id: item.id,
          exerciseId: item.exercise_id,
          name: item.exercises?.name ?? "Exercício",
          category: item.exercises?.category ?? null,
          muscleGroup: item.exercises?.muscle_group ?? null,
          sets: item.sets ?? 3,
          reps: item.reps ?? "12",
          rest: item.rest_seconds ?? 60,
          dayTitle: d.title,
          mediaUrl: item.exercises?.media_url ?? null,
          instructions: item.exercises?.instructions ?? null,
        }))
    );

  // Realistic kcal/min rates by exercise category (based on ACSM / exercise physiology data)
  // Accounts for work intervals + rest periods within sets
  const getKcalPerMin = (category: string | null, muscleGroup: string | null) => {
    const cat = (category ?? "").toLowerCase();
    const mg = (muscleGroup ?? "").toLowerCase();
    if (cat.includes("aerób") || cat.includes("cardio") || mg.includes("cardio")) return 10;
    if (cat.includes("compound") || cat.includes("composto")) return 6.5;
    if (cat.includes("isométr")) return 3.5;
    // isolamento or unknown
    if (cat.includes("isolamento") || cat.includes("isolation")) return 4.5;
    // default for unknown category - moderate estimate
    return 5;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showTips, setShowTips] = useState(false);
  // Track weight per exercise per set: { [exerciseIndex]: { [setNumber]: weight } }
  const [weightLog, setWeightLog] = useState<Record<number, Record<number, string>>>({});
  const [currentWeight, setCurrentWeight] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // When exercise or set changes, load the saved weight
  useEffect(() => {
    const saved = weightLog[currentIndex]?.[currentSet] ?? "";
    setCurrentWeight(saved);
  }, [currentIndex, currentSet]);

  const handleWeightChange = useCallback((value: string) => {
    // Allow only numbers and decimal point, max 6 chars
    const sanitized = value.replace(/[^0-9.]/g, "").slice(0, 6);
    setCurrentWeight(sanitized);
    setWeightLog(prev => ({
      ...prev,
      [currentIndex]: {
        ...(prev[currentIndex] ?? {}),
        [currentSet]: sanitized,
      },
    }));
  }, [currentIndex, currentSet]);

  const exercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex) / exercises.length) * 100 : 0;

  const saveSession = useMutation({
    mutationFn: async () => {
      if (!workout || !profile?.gym_id) return;

      // 1. Create the session
      const { data: session, error } = await supabase.from("workout_sessions").insert({
        member_id: profile.id,
        gym_id: profile.gym_id,
        assigned_workout_id: workout.id,
        date: new Date().toISOString().split("T")[0],
        status: "done" as const,
      }).select("id").single();
      if (error) throw error;

      // 2. Save workout_logs for each exercise with realistic calorie estimation
      if (session && exercises.length > 0) {
        const avgDurationPerExercise = Math.max(30, Math.round(elapsed / exercises.length));
        const logs = exercises.map((ex, exIdx) => {
          const durationSecs = avgDurationPerExercise;
          const durationMin = durationSecs / 60;
          const kcalPerMin = getKcalPerMin(ex.category, ex.muscleGroup);

          // Base calories from duration × category rate
          let calEst = Math.round(durationMin * kcalPerMin);

          // Weight intensity bonus: heavier loads = more energy expenditure
          // ~0.5% bonus per kg for compound, ~0.3% for isolation
          const loggedWeight = parseFloat(weightLog[exIdx]?.[1] || "0") || 0;
          if (loggedWeight > 0) {
            const bonusFactor = (ex.category ?? "").toLowerCase().includes("compound") ? 0.005 : 0.003;
            calEst = Math.round(calEst * (1 + loggedWeight * bonusFactor));
          }

          // Minimum floor: at least 5 kcal per exercise
          calEst = Math.max(5, calEst);
          return {
            session_id: session.id,
            exercise_id: ex.exerciseId || null,
            duration_seconds: durationSecs,
            calories_estimated: calEst,
            performed_sets: JSON.stringify(
              Array.from({ length: ex.sets }, (_, i) => ({
                set: i + 1,
                reps: ex.reps,
                weight_kg: parseFloat(weightLog[exIdx]?.[i + 1] || "0") || null,
                completed: true,
              }))
            ),
          };
        });
        await supabase.from("workout_logs").insert(logs);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["hourly-activity"] });
      queryClient.invalidateQueries({ queryKey: ["my-workout-sessions"] });
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

  if (alreadyDoneToday && !finished) {
    return (
      <div className="px-5 pt-14 pb-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[80vh] space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Treino já concluído hoje</h2>
        <p className="text-sm text-muted-foreground">Você já completou este treino hoje. Volte amanhã!</p>
        <Button variant="outline" onClick={() => navigate("/app")}>Voltar ao Início</Button>
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

  // Real-time calorie estimate based on elapsed time and exercise categories
  const estimatedCalories = (() => {
    if (exercises.length === 0) return 0;
    const completedExercises = exercises.slice(0, currentIndex);
    const avgTimePerEx = elapsed / Math.max(1, currentIndex + 1);
    let total = 0;
    // Completed exercises: full duration
    completedExercises.forEach(ex => {
      total += (avgTimePerEx / 60) * getKcalPerMin(ex.category, ex.muscleGroup);
    });
    // Current exercise: partial
    if (exercise) {
      const currentElapsed = elapsed - (currentIndex * avgTimePerEx);
      total += (Math.max(0, currentElapsed) / 60) * getKcalPerMin(exercise.category, exercise.muscleGroup);
    }
    return Math.round(total);
  })();
  const performanceScore = Math.min(100, Math.round((exercises.length / Math.max(1, exercises.length)) * 80 + Math.min(20, elapsed / 60)));

  if (finished) {
    const particles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * 360;
      const distance = 60 + Math.random() * 40;
      const tx = Math.cos((angle * Math.PI) / 180) * distance;
      const ty = Math.sin((angle * Math.PI) / 180) * distance;
      const colors = ["hsl(258 82% 60%)", "hsl(38 92% 60%)", "hsl(152 60% 50%)", "hsl(280 80% 55%)"];
      return { tx, ty, color: colors[i % colors.length], delay: i * 0.05, size: 4 + Math.random() * 4 };
    });

    return (
      <div className="px-5 pt-10 pb-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[85vh] space-y-8 text-center overflow-hidden">
        {/* Hero Completion Animation */}
        <div className="relative flex items-center justify-center">
          {/* Expanding pulse rings */}
          <div className="absolute w-32 h-32 rounded-full border border-primary/30 animate-completion-pulse-ring" />
          <div className="absolute w-32 h-32 rounded-full border border-primary/20 animate-completion-pulse-ring" style={{ animationDelay: "0.5s" }} />
          <div className="absolute w-32 h-32 rounded-full border border-primary/10 animate-completion-pulse-ring" style={{ animationDelay: "1s" }} />

          {/* Particles */}
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-completion-particle"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                "--tx": `${p.tx}px`,
                "--ty": `${p.ty}px`,
                animationDelay: `${0.6 + p.delay}s`,
                opacity: 0,
              } as any}
            />
          ))}

          {/* Main circle */}
          <div className="relative w-28 h-28 animate-completion-ring">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-accent to-primary/80 p-[3px]">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <Check className="w-12 h-12 text-primary animate-completion-check" />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 animate-completion-slide-up" style={{ animationDelay: "0.6s" }}>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Treino Concluído
          </h1>
          <p className="text-sm text-muted-foreground">Você deu mais um passo rumo ao seu objetivo</p>
        </div>

        {/* Performance Score — large hero stat */}
        <div className="animate-completion-slide-up w-full" style={{ animationDelay: "0.8s" }}>
          <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer pointer-events-none" />
            <p className="text-xs text-primary font-semibold uppercase tracking-[0.2em] mb-3">Score de Performance</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-6xl font-black text-gradient-purple animate-completion-counter" style={{ animationDelay: "1.2s" }}>
                {performanceScore}
              </span>
              <span className="text-lg font-medium text-muted-foreground">/100</span>
            </div>
            <p className="text-sm mt-2">
              {performanceScore >= 90
                ? <span className="text-gradient-gold font-semibold">🏆 Performance Excepcional</span>
                : performanceScore >= 70
                  ? <span className="text-success font-medium">💪 Muito Bom</span>
                  : <span className="text-info font-medium">🎯 Continue Evoluindo</span>
              }
            </p>
          </div>
        </div>

        {/* Stats Grid — glass cards */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { icon: <Timer className="w-5 h-5" />, value: formatTime(elapsed), label: "Duração", color: "text-info", delay: "1s" },
            { icon: <Flame className="w-5 h-5" />, value: `${estimatedCalories}`, label: "Calorias", color: "text-warning", delay: "1.1s" },
            { icon: <Check className="w-5 h-5" />, value: `${exercises.length}`, label: "Exercícios", color: "text-success", delay: "1.2s" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 text-center space-y-1.5 animate-completion-counter"
              style={{ animationDelay: stat.delay }}
            >
              <div className={`mx-auto ${stat.color}`}>{stat.icon}</div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="w-full space-y-3 pt-2 animate-completion-slide-up" style={{ animationDelay: "1.4s" }}>
          <Button variant="glow" size="lg" className="w-full h-14 text-base font-semibold" onClick={() => navigate("/app")}>
            Voltar ao Início
          </Button>
          <Button variant="outline" size="lg" className="w-full h-12" onClick={() => navigate("/app/workouts")}>
            Ver Treinos
          </Button>
        </div>
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
            <div className="w-full bg-secondary">
              <img
                src={exercise.mediaUrl}
                alt={exercise.name}
                className="w-full h-auto object-contain"
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

            {/* Weight input */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <div className="flex items-center gap-2 bg-secondary/60 border border-border rounded-xl px-4 py-2.5">
                <Weight className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={currentWeight}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  className="w-16 bg-transparent text-center text-lg font-bold text-foreground outline-none placeholder:text-muted-foreground/40"
                />
                <span className="text-xs text-muted-foreground font-medium">kg</span>
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
