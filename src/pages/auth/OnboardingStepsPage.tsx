import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OptionsStep = {
  key: string;
  title: string;
  subtitle: string;
  options: string[];
  multi?: boolean;
  type?: never;
};

type SliderStep = {
  key: string;
  title: string;
  subtitle: string;
  type: "slider";
  min: number;
  max: number;
  default: number;
  unit: string;
  options?: never;
  multi?: never;
};

type OnboardingStep = OptionsStep | SliderStep;

const STEPS: OnboardingStep[] = [
  {
    key: "gender",
    title: "Qual é o seu gênero?",
    subtitle: "Isso nos ajuda a personalizar seu treino",
    options: ["Masculino", "Feminino", "Outro", "Prefiro não dizer"],
  },
  {
    key: "age",
    title: "Qual a sua idade?",
    subtitle: "Adaptamos a intensidade ao seu perfil",
    type: "slider",
    min: 14,
    max: 80,
    default: 25,
    unit: "anos",
  },
  {
    key: "height",
    title: "Qual a sua altura?",
    subtitle: "Para calcular métricas personalizadas",
    type: "slider",
    min: 140,
    max: 220,
    default: 170,
    unit: "cm",
  },
  {
    key: "weight",
    title: "Qual o seu peso atual?",
    subtitle: "Base para acompanhar sua evolução",
    type: "slider",
    min: 40,
    max: 180,
    default: 70,
    unit: "kg",
  },
  {
    key: "activity_level",
    title: "Qual o seu nível de atividade?",
    subtitle: "Seu dia-a-dia importa no plano",
    options: ["Sedentário", "Levemente ativo", "Moderadamente ativo", "Muito ativo"],
  },
  {
    key: "fitness_goal",
    title: "Qual seu objetivo principal?",
    subtitle: "Focamos no que é mais importante pra você",
    options: ["Perder peso", "Ganhar massa", "Manter forma", "Performance", "Saúde geral"],
  },
  {
    key: "experience_level",
    title: "Qual sua experiência com treino?",
    subtitle: "Ajustamos a complexidade dos exercícios",
    options: ["Iniciante", "Intermediário", "Avançado"],
  },
  {
    key: "equipment",
    title: "Que equipamentos você tem?",
    subtitle: "Selecione todos que se aplicam",
    options: ["Nenhum", "Halteres", "Barra", "Elásticos", "Máquinas (academia)"],
    multi: true,
  },
  {
    key: "workout_duration",
    title: "Quanto tempo para treinar?",
    subtitle: "Montamos treinos no seu tempo",
    options: ["15-30 min", "30-45 min", "45-60 min", "60+ min"],
  },
  {
    key: "workout_location",
    title: "Onde você prefere treinar?",
    subtitle: "Adaptamos ao seu ambiente",
    options: ["Casa", "Academia", "Ar livre", "Qualquer lugar"],
  },
  {
    key: "preferred_time",
    title: "Horário preferido para treinar?",
    subtitle: "Para lembretes no momento certo",
    options: ["Manhã", "Tarde", "Noite", "Flexível"],
  },
  {
    key: "injuries",
    title: "Possui alguma lesão ou restrição?",
    subtitle: "Sua segurança é prioridade",
    options: ["Nenhuma", "Joelho", "Coluna", "Ombro", "Outra"],
    multi: true,
  },
  {
    key: "reminders",
    title: "Quer receber lembretes?",
    subtitle: "Notificações para manter a consistência",
    options: ["Sim, por favor!", "Talvez depois", "Não, obrigado"],
  },
];

export default function OnboardingStepsPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  // Resume from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("onboarding_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.step != null) setStep(parsed.step);
        if (parsed.answers) setAnswers(parsed.answers);
      } catch {}
    }
  }, []);

  // Auto-save
  useEffect(() => {
    localStorage.setItem("onboarding_progress", JSON.stringify({ step, answers }));
  }, [step, answers]);

  const handleSelect = (value: string) => {
    if (current.multi) {
      const prev = (answers[current.key] as string[]) || [];
      const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      setAnswers({ ...answers, [current.key]: next });
    } else {
      setAnswers({ ...answers, [current.key]: value });
    }
  };

  const handleSliderChange = (value: number) => {
    setAnswers({ ...answers, [current.key]: value });
  };

  const canProceed = () => {
    const val = answers[current.key];
    if (current.multi) return Array.isArray(val) && val.length > 0;
    if (current.type === "slider") return val != null;
    return !!val;
  };

  const saveOnboardingToSupabase = async (data: Record<string, any>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Will save after signup if not logged in yet

    const payload = {
      user_id: user.id,
      gender: data.gender || null,
      age: data.age || null,
      height: data.height || null,
      weight: data.weight || null,
      activity_level: data.activity_level || null,
      fitness_goal: data.fitness_goal || null,
      experience_level: data.experience_level || null,
      equipment: data.equipment || [],
      workout_duration: data.workout_duration || null,
      workout_location: data.workout_location || null,
      preferred_time: data.preferred_time || null,
      injuries: data.injuries || [],
      reminders: data.reminders || null,
      completed: true,
    };

    const { error } = await supabase.from("onboarding_data").upsert(payload, { onConflict: "user_id" });
    if (error) {
      console.error("Error saving onboarding:", error);
      toast.error("Erro ao salvar dados do onboarding");
    }
  };

  const goNext = () => {
    if (!canProceed()) return;
    setAnimating(true);
    setTimeout(async () => {
      if (step === STEPS.length - 1) {
        await saveOnboardingToSupabase(answers);
        localStorage.setItem("onboarding_steps_done", "true");
        localStorage.removeItem("onboarding_progress");
        navigate("/signup");
      } else {
        setStep(step + 1);
      }
      setAnimating(false);
    }, 200);
  };

  const goBack = () => {
    if (step === 0) {
      navigate("/");
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setStep(step - 1);
      setAnimating(false);
    }, 200);
  };

  const sliderValue = current.type === "slider" ? (answers[current.key] ?? current.default) : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={goBack} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 mx-4">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {step + 1}/{STEPS.length}
        </span>
      </div>

      {/* Content */}
      <div className={cn("flex-1 flex flex-col px-6 pt-8 pb-6 transition-all duration-200", animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0")}>
        <h1 className="text-2xl font-bold text-foreground mb-2">{current.title}</h1>
        <p className="text-muted-foreground text-sm mb-8">{current.subtitle}</p>

        {current.type === "slider" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="text-center">
              <span className="text-6xl font-bold text-gradient-purple">{sliderValue}</span>
              <span className="text-xl text-muted-foreground ml-2">{current.unit}</span>
            </div>
            <input
              type="range"
              min={current.min}
              max={current.max}
              value={sliderValue}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30"
            />
            <div className="flex justify-between w-full text-xs text-muted-foreground">
              <span>{current.min}{current.unit}</span>
              <span>{current.max}{current.unit}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-3">
            {(current as OptionsStep).options?.map((option) => {
              const step = current as OptionsStep;
              const isSelected = step.multi
                ? ((answers[step.key] as string[]) || []).includes(option)
                : answers[step.key] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex items-center gap-3 px-5 py-4 rounded-2xl border text-left transition-all duration-200",
                    isSelected
                      ? "border-primary/50 bg-primary/10 text-foreground glow-purple"
                      : "border-border bg-card hover:border-primary/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}>
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className="font-medium text-sm">{option}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-10">
        <Button
          variant="glow"
          size="lg"
          className="w-full"
          onClick={goNext}
          disabled={!canProceed()}
        >
          {step === STEPS.length - 1 ? "Finalizar" : "Continuar"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
