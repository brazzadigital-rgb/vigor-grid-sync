import { BarChart3 } from "lucide-react";

export default function AdminReports() {
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold text-foreground">Relatórios</h2>
      <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
        <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground" />
        <p className="text-foreground font-medium">Em breve</p>
        <p className="text-sm text-muted-foreground">Relatórios detalhados de receita, frequência e aderência</p>
      </div>
    </div>
  );
}
