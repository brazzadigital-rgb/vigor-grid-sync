import { Bot, MessageCircle, Zap, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AICoachPage() {
  return (
    <div className="px-5 pt-12 pb-6 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Coach</h1>
        <p className="text-sm text-muted-foreground">Seu personal trainer inteligente</p>
      </div>

      {/* Welcome Card */}
      <div className="rounded-2xl bg-gradient-card border border-border p-6 space-y-4 glow-purple">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-lg font-bold text-foreground">Bem-vindo ao AI Coach</h2>
          <p className="text-sm text-muted-foreground">Treinos personalizados, feedback adaptativo e coaching inteligente</p>
        </div>
        <Link to="/app/ai-coach/chat">
          <Button variant="glow" size="lg" className="w-full">
            <MessageCircle className="w-4 h-4" />
            Iniciar Chat
          </Button>
        </Link>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Recursos</h3>
        {[
          { icon: Sparkles, label: "Treinos Personalizados", desc: "Gerados com base no seu perfil", to: "/app/ai-coach/dashboard" },
          { icon: MessageCircle, label: "Chat com AI", desc: "Tire dúvidas em tempo real", to: "/app/ai-coach/chat" },
          { icon: Zap, label: "Feedback Inteligente", desc: "Análise de performance", to: "/app/ai-coach/feedback" },
        ].map((item) => (
          <Link key={item.label} to={item.to} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
