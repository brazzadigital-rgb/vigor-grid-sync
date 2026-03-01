import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import ScrollPicker from "@/components/onboarding/ScrollPicker";
import OptionGrid from "@/components/onboarding/OptionGrid";
import {
  User, Baby, Ruler, Weight, Activity, Target, Dumbbell,
  Wrench, Clock, MapPin, Sun, AlertTriangle, Bell
} from "lucide-react";

const TOTAL_STEPS = 13;

type OnboardingData = {
  gender: string;
  age: number;
  height: number;
  weight: number;
  activity_level: string;
  fitness_goal: string;
  experience_level: string;
  equipment: string[];
  workout_duration: string;
  workout_location: string;
  preferred_time: string;
  injuries: string[];
  reminders: string;
};

const DEFAULT_DATA: OnboardingData = {
  gender: "",
  age: 25,
  height: 170,
  weight: 70,
  activity_level: "",
  fitness_goal: "",
  experience_level: "",
  equipment: [],
  workout_duration: "",
  workout_location: "",
  preferred_time: "",
  injuries: [],
  reminders: "",
};

const ages = Array.from({ length: 63 }, (_, i) => ({ label: String(i + 13), value: i + 13 }));
const weights = Array.from({ length: 151 }, (_, i) => ({ label: String(i + 30), value: i + 30 }));
const heights = Array.from({ length: 81 }, (_, i) => {
  const cm = i + 140;
  const m = (cm / 100).toFixed(2).replace(".", ",");
  return { label: m, value: cm };
});

export default function OnboardingFlowPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing data
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("onboarding_data")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data: existing }) => {
        if (existing) {
          if (existing.completed) {
            navigate("/app", { replace: true });
            return;
          }
          setData({
            gender: existing.gender ?? "",
            age: existing.age ?? 25,
            height: existing.height ?? 170,
            weight: existing.weight ?? 70,
            activity_level: existing.activity_level ?? "",
            fitness_goal: existing.fitness_goal ?? "",
            experience_level: existing.experience_level ?? "",
            equipment: existing.equipment ?? [],
            workout_duration: existing.workout_duration ?? "",
            workout_location: existing.workout_location ?? "",
            preferred_time: existing.preferred_time ?? "",
            injuries: existing.injuries ?? [],
            reminders: existing.reminders ?? "",
          });
        }
        setLoading(false);
      });
  }, [user, navigate]);

  const update = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // Auto-save on step change
  const saveProgress = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    const payload = { ...data, user_id: user.id, updated_at: new Date().toISOString() };
    const { data: existing } = await supabase
      .from("onboarding_data")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase.from("onboarding_data").update(payload).eq("user_id", user.id);
    } else {
      await supabase.from("onboarding_data").insert(payload);
    }
    setSaving(false);
  }, [user, data]);

  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      await saveProgress();
      setStep(s => s + 1);
    } else {
      // Complete
      if (!user) return;
      setSaving(true);
      await supabase
        .from("onboarding_data")
        .update({ ...data, completed: true, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
      setSaving(false);
      toast.success("Perfil concluído! Vamos começar 💪");
      navigate("/app", { replace: true });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return !!data.gender;
      case 4: return !!data.activity_level;
      case 5: return !!data.fitness_goal;
      case 6: return !!data.experience_level;
      case 8: return !!data.workout_duration;
      case 9: return !!data.workout_location;
      case 10: return !!data.preferred_time;
      case 12: return !!data.reminders;
      default: return true;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stepContent = () => {
    switch (step) {
      case 0: // Gender
        return (
          <OnboardingShell step={0} totalSteps={TOTAL_STEPS} title="Conte sobre você!" subtitle="Escolha seu gênero ou identidade preferida." onNext={handleNext} canProceed={canProceed()} nextLabel="Próximo">
            <div className="flex flex-col items-center gap-6">
              {[
                { value: "male", label: "Masculino", icon: "♂" },
                { value: "female", label: "Feminino", icon: "♀" },
                { value: "other", label: "Outro", icon: "⚧" },
              ].map(g => (
                <button
                  key={g.value}
                  onClick={() => update("gender", g.value)}
                  className={`w-28 h-28 rounded-full border-2 flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    data.gender === g.value
                      ? "border-primary bg-primary/20 glow-purple-strong scale-110"
                      : "border-border bg-card hover:border-muted-foreground/50"
                  }`}
                >
                  <span className="text-3xl">{g.icon}</span>
                  <span className={`text-xs font-medium ${data.gender === g.value ? "text-primary" : "text-muted-foreground"}`}>{g.label}</span>
                </button>
              ))}
            </div>
          </OnboardingShell>
        );

      case 1: // Age
        return (
          <OnboardingShell step={1} totalSteps={TOTAL_STEPS} title="Quantos anos você tem?" subtitle="Isso nos ajuda a personalizar o app para você." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <ScrollPicker items={ages} value={data.age} onChange={v => update("age", v as number)} />
          </OnboardingShell>
        );

      case 2: // Weight
        return (
          <OnboardingShell step={2} totalSteps={TOTAL_STEPS} title="Qual seu peso?" subtitle="Não se preocupe, você pode alterar depois." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <ScrollPicker items={weights} value={data.weight} onChange={v => update("weight", v as number)} horizontal suffix=" kg" />
          </OnboardingShell>
        );

      case 3: // Height
        return (
          <OnboardingShell step={3} totalSteps={TOTAL_STEPS} title="Qual sua altura?" subtitle="Não se preocupe, você pode alterar depois." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <ScrollPicker items={heights} value={data.height} onChange={v => update("height", v as number)} suffix=" m" />
          </OnboardingShell>
        );

      case 4: // Activity Level
        return (
          <OnboardingShell step={4} totalSteps={TOTAL_STEPS} title="Nível de atividade" subtitle="Quão ativo você é no dia a dia?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <OptionGrid
              options={[
                { value: "sedentary", label: "Sedentário", icon: <span>🛋️</span>, description: "Pouco ou nenhum exercício" },
                { value: "light", label: "Leve", icon: <span>🚶</span>, description: "1-2x por semana" },
                { value: "moderate", label: "Moderado", icon: <span>🏃</span>, description: "3-4x por semana" },
                { value: "intense", label: "Intenso", icon: <span>🔥</span>, description: "5+ vezes por semana" },
              ]}
              value={data.activity_level}
              onChange={v => update("activity_level", v as string)}
            />
          </OnboardingShell>
        );

      case 5: // Fitness Goal
        return (
          <OnboardingShell step={5} totalSteps={TOTAL_STEPS} title="Qual seu objetivo?" subtitle="Selecione o que mais importa para você." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <OptionGrid
              options={[
                { value: "hipertrofia", label: "Ganhar músculo", icon: <span>💪</span> },
                { value: "emagrecimento", label: "Perder peso", icon: <span>🏋️</span> },
                { value: "performance", label: "Performance", icon: <span>⚡</span> },
                { value: "reabilitacao", label: "Reabilitação", icon: <span>🩹</span> },
                { value: "saude", label: "Saúde geral", icon: <span>❤️</span> },
                { value: "outro", label: "Outro", icon: <span>🎯</span> },
              ]}
              value={data.fitness_goal}
              onChange={v => update("fitness_goal", v as string)}
              columns={3}
            />
          </OnboardingShell>
        );

      case 6: // Experience
        return (
          <OnboardingShell step={6} totalSteps={TOTAL_STEPS} title="Nível de experiência" subtitle="Há quanto tempo você treina?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <OptionGrid
              options={[
                { value: "beginner", label: "Iniciante", icon: <span>🌱</span>, description: "Menos de 6 meses" },
                { value: "intermediate", label: "Intermediário", icon: <span>🌿</span>, description: "6 meses - 2 anos" },
                { value: "advanced", label: "Avançado", icon: <span>🌳</span>, description: "2+ anos" },
                { value: "athlete", label: "Atleta", icon: <span>🏆</span>, description: "Competidor" },
              ]}
              value={data.experience_level}
              onChange={v => update("experience_level", v as string)}
            />
          </OnboardingShell>
        );

      case 7: // Equipment
        return (
          <OnboardingShell step={7} totalSteps={TOTAL_STEPS} title="Equipamentos disponíveis" subtitle="Selecione todos que você tem acesso." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <OptionGrid
              options={[
                { value: "barbell", label: "Barra", icon: <span>🏋️</span> },
                { value: "dumbbell", label: "Halteres", icon: <span>💪</span> },
                { value: "machines", label: "Máquinas", icon: <span>⚙️</span> },
                { value: "cables", label: "Cabos", icon: <span>🔗</span> },
                { value: "bodyweight", label: "Peso corporal", icon: <span>🤸</span> },
                { value: "bands", label: "Elásticos", icon: <span>🎗️</span> },
              ]}
              value={data.equipment}
              onChange={v => update("equipment", v as string[])}
              multi
              columns={3}
            />
          </OnboardingShell>
        );

      case 8: // Workout Duration
        return (
          <OnboardingShell step={8} totalSteps={TOTAL_STEPS} title="Duração do treino" subtitle="Quanto tempo você tem disponível?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <OptionGrid
              options={[
                { value: "30min", label: "30 min", icon: <span>⏱️</span> },
                { value: "45min", label: "45 min", icon: <span>⏱️</span> },
                { value: "60min", label: "1 hora", icon: <span>⏱️</span> },
                { value: "90min", label: "1h30", icon: <span>⏱️</span> },
              ]}
              value={data.workout_duration}
              onChange={v => update("workout_duration", v as string)}
            />
          </OnboardingShell>
        );

      case 9: // Location
        return (
          <OnboardingShell step={9} totalSteps={TOTAL_STEPS} title="Onde você treina?" subtitle="Isso nos ajuda a sugerir exercícios adequados." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <OptionGrid
              options={[
                { value: "gym", label: "Academia", icon: <span>🏢</span> },
                { value: "home", label: "Em casa", icon: <span>🏠</span> },
                { value: "outdoor", label: "Ar livre", icon: <span>🌳</span> },
                { value: "mixed", label: "Misto", icon: <span>🔄</span> },
              ]}
              value={data.workout_location}
              onChange={v => update("workout_location", v as string)}
            />
          </OnboardingShell>
        );

      case 10: // Preferred Time
        return (
          <OnboardingShell step={10} totalSteps={TOTAL_STEPS} title="Horário preferido" subtitle="Quando você gosta de treinar?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <OptionGrid
              options={[
                { value: "morning", label: "Manhã", icon: <span>🌅</span>, description: "6h - 12h" },
                { value: "afternoon", label: "Tarde", icon: <span>☀️</span>, description: "12h - 18h" },
                { value: "evening", label: "Noite", icon: <span>🌙</span>, description: "18h - 22h" },
                { value: "flexible", label: "Flexível", icon: <span>🔄</span>, description: "Qualquer horário" },
              ]}
              value={data.preferred_time}
              onChange={v => update("preferred_time", v as string)}
            />
          </OnboardingShell>
        );

      case 11: // Injuries
        return (
          <OnboardingShell step={11} totalSteps={TOTAL_STEPS} title="Lesões ou limitações" subtitle="Selecione se houver. Pule se não tiver." onNext={handleNext} onBack={handleBack} canProceed={canProceed()}>
            <OptionGrid
              options={[
                { value: "shoulder", label: "Ombro", icon: <span>🦴</span> },
                { value: "knee", label: "Joelho", icon: <span>🦵</span> },
                { value: "back", label: "Coluna", icon: <span>🔙</span> },
                { value: "wrist", label: "Punho", icon: <span>✋</span> },
                { value: "ankle", label: "Tornozelo", icon: <span>🦶</span> },
                { value: "none", label: "Nenhuma", icon: <span>✅</span> },
              ]}
              value={data.injuries}
              onChange={v => update("injuries", v as string[])}
              multi
              columns={3}
            />
          </OnboardingShell>
        );

      case 12: // Reminders
        return (
          <OnboardingShell step={12} totalSteps={TOTAL_STEPS} title="Lembretes" subtitle="Quer receber notificações de treino?" onNext={handleNext} onBack={handleBack} canProceed={canProceed()} nextLabel="Concluir">
            <OptionGrid
              options={[
                { value: "yes", label: "Sim, quero!", icon: <span>🔔</span>, description: "Receber lembretes" },
                { value: "no", label: "Não, obrigado", icon: <span>🔕</span>, description: "Sem notificações" },
              ]}
              value={data.reminders}
              onChange={v => update("reminders", v as string)}
            />
          </OnboardingShell>
        );

      default:
        return null;
    }
  };

  return stepContent();
}
