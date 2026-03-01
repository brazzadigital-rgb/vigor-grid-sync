import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pause, Play, SkipForward, Check, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const exercises = [
  { name: "Supino Reto — Barra", sets: 4, reps: "10-12", rest: 90 },
  { name: "Supino Inclinado — Halteres", sets: 3, reps: "12", rest: 60 },
  { name: "Crucifixo — Máquina", sets: 3, reps: "15", rest: 45 },
  { name: "Crossover — Cabo", sets: 3, reps: "15", rest: 45 },
  { name: "Tríceps Corda — Cabo", sets: 4, reps: "12", rest: 60 },
  { name: "Tríceps Francês — Haltere", sets: 3, reps: "12", rest: 60 },
  { name: "Mergulho — Paralelas", sets: 3, reps: "Max", rest: 90 },
  { name: "Extensão de Tríceps — Máquina", sets: 3, reps: "15", rest: 45 },
];

export default function WorkoutExecution() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const exercise = exercises[currentIndex];
  const progress = ((currentIndex) / exercises.length) * 100;

  useEffect(() => {
    if (finished || isPaused) return;
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
      if (isResting) {
        setRestTime((r) => {
          if (r <= 1) {
            setIsResting(false);
            return 0;
          }
          return r - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isPaused, isResting, finished]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleCompleteSet = () => {
    if (currentSet < exercise.sets) {
      setCurrentSet((s) => s + 1);
      setIsResting(true);
      setRestTime(exercise.rest);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setCurrentSet(1);
      setIsResting(false);
      setRestTime(0);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="px-5 pt-14 pb-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[80vh] space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-success/15 border border-success/30 flex items-center justify-center glow-purple">
          <Check className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Treino Concluído! 🎉</h1>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-lg font-bold text-foreground">{formatTime(elapsed)}</p>
            <p className="text-xs text-muted-foreground">Duração</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-lg font-bold text-foreground">{exercises.length}</p>
            <p className="text-xs text-muted-foreground">Exercícios</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-lg font-bold text-primary">~320</p>
            <p className="text-xs text-muted-foreground">Calorias</p>
          </div>
        </div>
        <Button variant="glow" size="lg" className="w-full" onClick={() => navigate("/app/workouts")}>
          Voltar aos Treinos
        </Button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
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
      {!isResting && (
        <div className="rounded-2xl border border-primary/20 bg-card p-6 space-y-4 glow-purple">
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
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-2xl"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </Button>
        <Button
          variant="glow"
          size="lg"
          className="flex-1 h-14"
          onClick={handleCompleteSet}
          disabled={isResting}
        >
          {currentSet < exercise.sets ? "Concluir Série" : "Próximo Exercício"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-2xl"
          onClick={handleNext}
        >
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>

      {/* Exercise List Mini */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Próximos</p>
        {exercises.slice(currentIndex + 1, currentIndex + 4).map((ex, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="w-6 text-xs">{currentIndex + 2 + i}.</span>
            <span className="truncate">{ex.name}</span>
            <span className="ml-auto text-xs">{ex.sets}×{ex.reps}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
