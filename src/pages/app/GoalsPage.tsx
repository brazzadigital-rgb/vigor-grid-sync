import { Target, Plus, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function GoalsPage() {
  return (
    <div className="px-5 pt-12 pb-6 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Metas</h1>
          <p className="text-sm text-muted-foreground">Acompanhe seus objetivos</p>
        </div>
        <Link to="/app/goals/new">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4" />
            Nova Meta
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      <div className="rounded-2xl bg-card border border-border p-8 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Nenhuma meta criada</h3>
          <p className="text-sm text-muted-foreground mt-1">Defina suas metas e acompanhe seu progresso</p>
        </div>
        <Link to="/app/goals/new">
          <Button variant="glow">
            <Plus className="w-4 h-4" />
            Criar Primeira Meta
          </Button>
        </Link>
      </div>

      {/* Badges */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">Conquistas</h3>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5 text-center">
          <p className="text-sm text-muted-foreground">Complete metas para desbloquear conquistas</p>
        </div>
      </div>
    </div>
  );
}
