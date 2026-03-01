import { useNavigate } from "react-router-dom";
import { ChevronLeft, TrendingUp, Target, Zap, ThumbsUp } from "lucide-react";

export default function AIFeedbackPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">AI Feedback</h1>
      </div>

      <div className="rounded-2xl bg-gradient-card border border-border p-6 space-y-4 glow-purple mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Zap className="w-7 h-7 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground">Análise de Performance</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete treinos para receber feedback personalizado da IA</p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { icon: TrendingUp, label: "Evolução", desc: "Nenhum dado disponível ainda", color: "text-success" },
          { icon: Target, label: "Áreas de Foco", desc: "Complete treinos para gerar análise", color: "text-info" },
          { icon: ThumbsUp, label: "Pontos Fortes", desc: "Dados insuficientes", color: "text-warning" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
