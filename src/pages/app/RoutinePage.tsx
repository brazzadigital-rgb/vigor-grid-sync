import { PlayCircle, Clock, Flame, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function RoutinePage() {
  return (
    <div className="px-5 pt-12 pb-6 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rotina Diária</h1>
        <p className="text-sm text-muted-foreground">Seu treino do dia</p>
      </div>

      {/* Today's Routine Card */}
      <div className="rounded-2xl bg-gradient-card border border-border p-6 space-y-5 glow-purple">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <PlayCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Treino do Dia</h3>
            <p className="text-xs text-muted-foreground">Nenhum treino atribuído</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-xs">-- min</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="w-4 h-4" />
            <span className="text-xs">-- kcal</span>
          </div>
        </div>

        <Link to="/app/routine/execute">
          <Button variant="glow" size="lg" className="w-full">
            Iniciar Treino
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Recent */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Treinos Recentes</h3>
        <div className="rounded-2xl bg-card border border-border p-5 text-center">
          <p className="text-sm text-muted-foreground">Nenhum treino concluído ainda</p>
        </div>
      </div>
    </div>
  );
}
