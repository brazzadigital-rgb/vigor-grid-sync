import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { User, Bell, Flame, Target, Dumbbell, Bot, ChevronRight } from "lucide-react";

export default function HomePage() {
  const { profile } = useAuth();
  const firstName = profile?.name?.split(" ")[0] || "Atleta";

  return (
    <div className="px-5 pt-12 pb-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Olá,</p>
          <h1 className="text-2xl font-bold text-foreground">{firstName} 💪</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/app/notifications" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
          </Link>
          <Link to="/app/profile" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </Link>
        </div>
      </div>

      {/* Daily Progress Card */}
      <div className="rounded-2xl bg-gradient-card border border-border p-5 space-y-4 glow-purple">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Progresso Diário</h3>
          <Flame className="w-5 h-5 text-warning" />
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gradient-purple">0</p>
            <p className="text-xs text-muted-foreground">Treinos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">min</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Acesso Rápido</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: "/app/routine", icon: Dumbbell, label: "Iniciar Treino", color: "text-primary" },
            { to: "/app/goals", icon: Target, label: "Minhas Metas", color: "text-success" },
            { to: "/app/ai-coach", icon: Bot, label: "AI Coach", color: "text-info" },
            { to: "/app/profile", icon: User, label: "Meu Perfil", color: "text-warning" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Sugestões AI</h3>
          <Link to="/app/ai-coach" className="text-xs text-primary flex items-center gap-1">
            Ver mais <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Complete seu onboarding</p>
            <p className="text-xs text-muted-foreground">Personalize seu treino com IA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
