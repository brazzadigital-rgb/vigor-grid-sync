import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const goalTypes = ["Perder peso", "Ganhar massa", "Correr 5km", "Treinar 5x/semana", "Outro"];

export default function NewGoalPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-10 animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Nova Meta</h1>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome da Meta</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Perder 5kg" className="h-12 bg-card border-border" />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-3 block">Tipo</label>
          <div className="space-y-2">
            {goalTypes.map((g) => (
              <button
                key={g}
                onClick={() => setType(g)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border transition-all",
                  type === g ? "border-primary/50 bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{g}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button variant="glow" size="lg" className="w-full" disabled={!name || !type}>
        Criar Meta
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
