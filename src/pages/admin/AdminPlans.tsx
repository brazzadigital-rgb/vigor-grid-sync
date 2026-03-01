import { Plus, DollarSign, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { id: 1, name: "Hipertrofia Total", goal: "Hipertrofia", duration: 12, level: "Intermediário", price: 19900, billing: "Mensal", active: true, members: 89 },
  { id: 2, name: "Emagrecer com Saúde", goal: "Emagrecimento", duration: 16, level: "Iniciante", price: 24900, billing: "Mensal", active: true, members: 67 },
  { id: 3, name: "Alta Performance", goal: "Performance", duration: 8, level: "Avançado", price: 34900, billing: "Mensal", active: true, members: 34 },
  { id: 4, name: "Recuperação Funcional", goal: "Reabilitação", duration: 6, level: "Iniciante", price: 29900, billing: "Programa", active: true, members: 22 },
  { id: 5, name: "Anual Premium", goal: "Hipertrofia", duration: 48, level: "Todos", price: 14900, billing: "Anual", active: false, members: 45 },
];

const goalIcons: Record<string, string> = {
  "Hipertrofia": "💪",
  "Emagrecimento": "🔥",
  "Performance": "⚡",
  "Reabilitação": "🩹",
};

export default function AdminPlans() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Planos por Resultado</h2>
          <p className="text-sm text-muted-foreground">Configure planos baseados em objetivos</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> Novo Plano</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className={`rounded-2xl border bg-card p-5 space-y-4 transition-all cursor-pointer ${plan.active ? "border-border hover:border-primary/30" : "border-border/50 opacity-60"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{goalIcons[plan.goal]}</span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.goal} • {plan.level}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${plan.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                {plan.active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-secondary p-2">
                <p className="text-sm font-bold text-foreground">R$ {(plan.price / 100).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">{plan.billing}</p>
              </div>
              <div className="rounded-xl bg-secondary p-2">
                <p className="text-sm font-bold text-foreground">{plan.duration}s</p>
                <p className="text-xs text-muted-foreground">Duração</p>
              </div>
              <div className="rounded-xl bg-secondary p-2">
                <p className="text-sm font-bold text-primary">{plan.members}</p>
                <p className="text-xs text-muted-foreground">Alunos</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
