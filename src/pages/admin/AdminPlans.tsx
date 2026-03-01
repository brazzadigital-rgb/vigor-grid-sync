import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGymPlans } from "@/hooks/use-supabase-data";

const goalIcons: Record<string, string> = {
  hipertrofia: "💪",
  emagrecimento: "🔥",
  performance: "⚡",
  reabilitacao: "🩹",
  outro: "🎯",
};

const billingLabels: Record<string, string> = {
  monthly: "Mensal",
  semiannual: "Semestral",
  annual: "Anual",
  one_time: "Programa",
};

export default function AdminPlans() {
  const { data: plans, isLoading } = useGymPlans();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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
        {(plans ?? []).map((plan: any) => (
          <div key={plan.id} className={`rounded-2xl border bg-card p-5 space-y-4 transition-all cursor-pointer ${plan.active ? "border-border hover:border-primary/30" : "border-border/50 opacity-60"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{goalIcons[plan.goal_type] ?? "🎯"}</span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{plan.goal_type} • {plan.level ?? "—"}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${plan.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                {plan.active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-secondary p-2">
                <p className="text-sm font-bold text-foreground">R$ {((plan.price_cents ?? 0) / 100).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">{billingLabels[plan.billing_cycle] ?? plan.billing_cycle}</p>
              </div>
              <div className="rounded-xl bg-secondary p-2">
                <p className="text-sm font-bold text-foreground">{plan.duration_weeks ?? "—"}s</p>
                <p className="text-xs text-muted-foreground">Duração</p>
              </div>
            </div>
          </div>
        ))}
        {(plans ?? []).length === 0 && (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhum plano criado</p>
          </div>
        )}
      </div>
    </div>
  );
}
