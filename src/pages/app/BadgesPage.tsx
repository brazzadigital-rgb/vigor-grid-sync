import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, Lock } from "lucide-react";

const badges = [
  { name: "Primeiro Treino", desc: "Complete seu primeiro treino", locked: true },
  { name: "Consistência", desc: "7 dias seguidos de treino", locked: true },
  { name: "Força Total", desc: "Complete 50 treinos", locked: true },
  { name: "Maratonista", desc: "100 treinos completados", locked: true },
  { name: "Mestre do Timer", desc: "Use o timer 20 vezes", locked: true },
  { name: "Social", desc: "Compartilhe seu progresso", locked: true },
];

export default function BadgesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Minhas Conquistas</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {badges.map((b) => (
          <div key={b.name} className="rounded-2xl bg-card border border-border p-4 flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
              {b.locked ? <Lock className="w-5 h-5 text-muted-foreground" /> : <Trophy className="w-5 h-5 text-warning" />}
            </div>
            <p className="text-xs font-semibold text-foreground">{b.name}</p>
            <p className="text-[10px] text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
