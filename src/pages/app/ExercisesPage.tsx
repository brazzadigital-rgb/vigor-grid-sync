import { Dumbbell, Search, Timer, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Peito", count: 0, color: "text-primary" },
  { name: "Costas", count: 0, color: "text-info" },
  { name: "Pernas", count: 0, color: "text-success" },
  { name: "Ombros", count: 0, color: "text-warning" },
  { name: "Braços", count: 0, color: "text-destructive" },
  { name: "Core", count: 0, color: "text-primary" },
];

export default function ExercisesPage() {
  return (
    <div className="px-5 pt-12 pb-6 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exercícios</h1>
        <p className="text-sm text-muted-foreground">Explore e execute treinos</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 px-4 h-12 rounded-xl bg-card border border-border">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input placeholder="Buscar exercício..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Categorias</h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all cursor-pointer">
              <Dumbbell className={`w-5 h-5 ${cat.color}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.count} exercícios</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timer CTA */}
      <Link to="/app/exercises/timer" className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-card border border-border glow-purple">
        <Timer className="w-8 h-8 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Exercise Timer</p>
          <p className="text-xs text-muted-foreground">Cronômetro com descanso automático</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </Link>
    </div>
  );
}
