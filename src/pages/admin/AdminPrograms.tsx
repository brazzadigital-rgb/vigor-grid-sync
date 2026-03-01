import { Plus, Dumbbell, Copy, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGymWorkoutTemplates } from "@/hooks/use-supabase-data";

const goalColors: Record<string, string> = {
  hipertrofia: "bg-primary/15 text-primary",
  emagrecimento: "bg-success/15 text-success",
  performance: "bg-info/15 text-info",
  reabilitacao: "bg-warning/15 text-warning",
  outro: "bg-muted text-muted-foreground",
};

const goalLabels: Record<string, string> = {
  hipertrofia: "Hipertrofia",
  emagrecimento: "Emagrecimento",
  performance: "Performance",
  reabilitacao: "Reabilitação",
  outro: "Outro",
};

export default function AdminPrograms() {
  const { data: templates, isLoading } = useGymWorkoutTemplates();

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
          <h2 className="text-xl font-bold text-foreground">Programas de Treino</h2>
          <p className="text-sm text-muted-foreground">{templates?.length ?? 0} templates criados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Wand2 className="w-4 h-4" /> Gerar com IA</Button>
          <Button size="sm"><Plus className="w-4 h-4" /> Novo Programa</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(templates ?? []).map((t: any) => {
          const goalKey = t.goal_type ?? "outro";
          return (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-5 space-y-4 hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${goalColors[goalKey] ?? goalColors.outro}`}>
                  {goalLabels[goalKey] ?? goalKey}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{t.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.level ?? "—"} • {t.weeks ?? 0} semanas
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Por {(t.profiles as any)?.name ?? "—"}
                </span>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><Copy className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
        {(templates ?? []).length === 0 && (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center">
            <Dumbbell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum programa criado</p>
          </div>
        )}
      </div>
    </div>
  );
}
