import { Plus, Dumbbell, Copy, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const templates = [
  { id: 1, name: "Hipertrofia Iniciante", goal: "Hipertrofia", level: "Iniciante", weeks: 8, days: "A/B/C", assigned: 23 },
  { id: 2, name: "Emagrecimento Avançado", goal: "Emagrecimento", level: "Avançado", weeks: 12, days: "A/B/C/D", assigned: 18 },
  { id: 3, name: "Performance Atlética", goal: "Performance", level: "Intermediário", weeks: 6, days: "A/B/C/D/E", assigned: 12 },
  { id: 4, name: "Reabilitação Ombro", goal: "Reabilitação", level: "Iniciante", weeks: 4, days: "A/B", assigned: 7 },
  { id: 5, name: "Full Body Express", goal: "Emagrecimento", level: "Intermediário", weeks: 8, days: "A/B/C", assigned: 31 },
];

const goalColors: Record<string, string> = {
  "Hipertrofia": "bg-primary/15 text-primary",
  "Emagrecimento": "bg-success/15 text-success",
  "Performance": "bg-info/15 text-info",
  "Reabilitação": "bg-warning/15 text-warning",
};

export default function AdminPrograms() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Programas de Treino</h2>
          <p className="text-sm text-muted-foreground">{templates.length} templates criados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Wand2 className="w-4 h-4" /> Gerar com IA</Button>
          <Button size="sm"><Plus className="w-4 h-4" /> Novo Programa</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-5 space-y-4 hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${goalColors[t.goal]}`}>{t.goal}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t.level} • {t.weeks} semanas • {t.days}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">{t.assigned} alunos atribuídos</span>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><Copy className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
