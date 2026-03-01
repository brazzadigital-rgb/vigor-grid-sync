import { useNavigate } from "react-router-dom";
import { ChevronLeft, Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Treinos ilimitados com AI",
  "Planos personalizados avançados",
  "Análise de performance detalhada",
  "Suporte prioritário",
  "Sem anúncios",
  "Badges exclusivos",
];

export default function PremiumPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-10 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Go Premium</h1>
      </div>

      <div className="rounded-2xl bg-gradient-card border border-primary/30 p-6 space-y-4 glow-purple mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Crown className="w-7 h-7 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Premium</h2>
          <p className="text-3xl font-bold text-gradient-purple mt-1">R$ 29,90<span className="text-sm text-muted-foreground font-normal">/mês</span></p>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {features.map((f) => (
          <div key={f} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-success" />
            </div>
            <span className="text-sm text-foreground">{f}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <Button variant="glow" size="xl" className="w-full">Assinar Premium</Button>
      </div>
    </div>
  );
}
