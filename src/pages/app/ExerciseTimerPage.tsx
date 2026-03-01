import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "exercise" | "rest";

export default function ExerciseTimerPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("exercise");
  const [exerciseDuration, setExerciseDuration] = useState(45);
  const [restDuration, setRestDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(45);
  const [running, setRunning] = useState(false);
  const [sets, setSets] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalTime = phase === "exercise" ? exerciseDuration : restDuration;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      if (phase === "exercise") {
        setSets((s) => s + 1);
        setPhase("rest");
        setTimeLeft(restDuration);
      } else {
        setPhase("exercise");
        setTimeLeft(exerciseDuration);
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, timeLeft, phase, exerciseDuration, restDuration]);

  const toggleRunning = () => setRunning((r) => !r);
  const reset = () => { setRunning(false); setTimeLeft(phase === "exercise" ? exerciseDuration : restDuration); };
  const skip = () => {
    setRunning(false);
    if (phase === "exercise") { setSets((s) => s + 1); setPhase("rest"); setTimeLeft(restDuration); }
    else { setPhase("exercise"); setTimeLeft(exerciseDuration); }
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const circumference = 2 * Math.PI * 120;
  const strokeOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-foreground">
          {phase === "exercise" ? "Exercício" : "Descanso"}
        </h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        {/* Circular Timer */}
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="120" stroke="hsl(var(--secondary))" strokeWidth="8" fill="none" />
            <circle
              cx="130" cy="130" r="120"
              stroke={phase === "exercise" ? "hsl(var(--primary))" : "hsl(var(--success))"}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              className="transition-all duration-1000 ease-linear"
              style={{ filter: `drop-shadow(0 0 12px ${phase === "exercise" ? "hsl(258 82% 60% / 0.5)" : "hsl(152 60% 50% / 0.5)"})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-foreground tracking-tight">{formatTime(timeLeft)}</span>
            <span className={cn("text-sm font-medium mt-1", phase === "exercise" ? "text-primary" : "text-success")}>
              {phase === "exercise" ? "EXERCÍCIO" : "DESCANSO"}
            </span>
          </div>
        </div>

        {/* Sets counter */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{sets}</p>
            <p className="text-xs text-muted-foreground">Séries</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={reset} className="w-14 h-14 rounded-2xl">
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            variant="glow"
            size="icon"
            onClick={toggleRunning}
            className="w-20 h-20 rounded-full"
          >
            {running ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>
          <Button variant="outline" size="icon" onClick={skip} className="w-14 h-14 rounded-2xl">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Duration adjustors */}
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Exercício</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setExerciseDuration((d) => Math.max(10, d - 5))} className="w-8 h-8 rounded-lg bg-card border border-border text-foreground text-sm">-</button>
              <span className="text-sm font-medium text-foreground w-10 text-center">{exerciseDuration}s</span>
              <button onClick={() => setExerciseDuration((d) => d + 5)} className="w-8 h-8 rounded-lg bg-card border border-border text-foreground text-sm">+</button>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Descanso</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setRestDuration((d) => Math.max(5, d - 5))} className="w-8 h-8 rounded-lg bg-card border border-border text-foreground text-sm">-</button>
              <span className="text-sm font-medium text-foreground w-10 text-center">{restDuration}s</span>
              <button onClick={() => setRestDuration((d) => d + 5)} className="w-8 h-8 rounded-lg bg-card border border-border text-foreground text-sm">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
