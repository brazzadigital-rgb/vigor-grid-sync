import { useNavigate } from "react-router-dom";
import { ChevronLeft, TrendingUp, BarChart3, Zap, MessageCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Treinos esta semana", value: "0", icon: BarChart3, color: "text-primary" },
  { label: "Streak atual", value: "0 dias", icon: Zap, color: "text-warning" },
  { label: "Score de aderência", value: "--", icon: TrendingUp, color: "text-success" },
];

export default function AICoachDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">AI Dashboard</h1>
      </div>

      <div className="space-y-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Link to="/app/ai-coach/chat" className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-card border border-border glow-purple mt-6">
        <MessageCircle className="w-6 h-6 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Conversar com AI</p>
          <p className="text-xs text-muted-foreground">Peça treinos, dicas ou análises</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </Link>
    </div>
  );
}
