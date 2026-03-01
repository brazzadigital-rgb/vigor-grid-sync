import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Pause, SkipForward, CheckCircle2, Trophy, Flame, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RoutinePhase = "ready" | "exercise" | "rest" | "success" | "summary";

const DEMO_EXERCISES = [
  { name: "Agachamento", duration: 45, rest: 30 },
  { name: "Flexão", duration: 40, rest: 25 },
  { name: "Prancha", duration: 60, rest: 30 },
  { name: "Burpee", duration: 30, rest: 30 },
];

export default function RoutineExecutionPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<RoutinePhase>("ready");
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = DEMO_EXERCISES[exerciseIdx];
  const totalExercises = DEMO_EXERCISES.length;

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (running && timeLeft === 0 && phase === "exercise") {
      setPhase("rest");
      setTimeLeft(current.rest);
    } else if (running && timeLeft === 0 && phase === "rest") {
      if (exerciseIdx < totalExercises - 1) {
        setExerciseIdx((i) => i + 1);
        setPhase("exercise");
        setTimeLeft(DEMO_EXERCISES[exerciseIdx + 1].duration);
      } else {
        setRunning(false);
        setPhase("success");
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, timeLeft, phase, exerciseIdx, current, totalExercises]);

  const startRoutine = () => {
    setPhase("exercise");
    setTimeLeft(DEMO_EXERCISES[0].duration);
    setRunning(true);
    setStartTime(Date.now());
    setExerciseIdx(0);
  };

  const skip = () => {
    setRunning(false);
    if (phase === "exercise") {
      setPhase("rest");
      setTimeLeft(current.rest);
      setRunning(true);
    } else if (phase === "rest") {
      if (exerciseIdx < totalExercises - 1) {
        setExerciseIdx((i) => i + 1);
        setPhase("exercise");
        setTimeLeft(DEMO_EXERCISES[exerciseIdx + 1].duration);
        setRunning(true);
      } else {
        setPhase("success");
      }
    }
  };

  const showSummary = () => setPhase("summary");
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const totalDuration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const estCalories = Math.round(totalDuration * 0.15);
  const score = Math.min(100, Math.round((totalDuration / (totalExercises * 60)) * 100));

  // Ready screen
  if (phase === "ready") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center px-4 pt-12 pb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-foreground">Rotina Diária</h1>
          <div className="w-9" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center glow-purple">
            <Play className="w-10 h-10 text-primary ml-1" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{totalExercises} exercícios</h2>
          <div className="space-y-2 w-full max-w-xs">
            {DEMO_EXERCISES.map((ex, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border">
                <span className="text-sm font-medium text-foreground">{ex.name}</span>
                <span className="text-xs text-muted-foreground">{ex.duration}s</span>
              </div>
            ))}
          </div>
          <Button variant="glow" size="xl" className="w-full max-w-xs mt-4" onClick={startRoutine}>
            Iniciar Rotina
          </Button>
        </div>
      </div>
    );
  }

  // Success popup
  if (phase === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 animate-scale-in">
        <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-6 animate-pulse-glow">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Treino Concluído!</h1>
        <p className="text-muted-foreground text-sm mb-8">Parabéns! Você completou sua rotina.</p>
        <Button variant="glow" size="lg" onClick={showSummary}>Ver Resumo</Button>
      </div>
    );
  }

  // Summary screen
  if (phase === "summary") {
    return (
      <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-10 animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground mb-8 text-center">Resumo do Treino</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: Clock, label: "Duração", value: formatTime(totalDuration), color: "text-info" },
            { icon: Flame, label: "Calorias", value: `${estCalories} kcal`, color: "text-warning" },
            { icon: Zap, label: "Performance", value: `${score}%`, color: "text-primary" },
            { icon: Trophy, label: "Exercícios", value: `${totalExercises}/${totalExercises}`, color: "text-success" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-card border border-border p-4 flex flex-col items-center gap-2">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        <Button variant="glow" size="lg" className="w-full" onClick={() => navigate("/app")}>
          Voltar ao Início
        </Button>
      </div>
    );
  }

  // Exercise / Rest phase
  const circumference = 2 * Math.PI * 120;
  const total = phase === "exercise" ? current.duration : current.rest;
  const progress = ((total - timeLeft) / total) * 100;
  const strokeOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-foreground">
          {exerciseIdx + 1}/{totalExercises}
        </h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <p className={cn("text-sm font-semibold uppercase tracking-wide", phase === "exercise" ? "text-primary" : "text-success")}>
          {phase === "exercise" ? current.name : "Descanso"}
        </p>

        <div className="relative w-56 h-56">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="120" stroke="hsl(var(--secondary))" strokeWidth="8" fill="none" />
            <circle cx="130" cy="130" r="120"
              stroke={phase === "exercise" ? "hsl(var(--primary))" : "hsl(var(--success))"}
              strokeWidth="8" fill="none" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeOffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-foreground">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setRunning((r) => !r)} className="w-16 h-16 rounded-full">
            {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={skip} className="w-12 h-12 rounded-xl">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
