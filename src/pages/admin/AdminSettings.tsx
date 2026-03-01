import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold text-foreground">Configurações</h2>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-base font-semibold text-foreground">Dados da Academia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Nome</label>
            <input defaultValue="FitPro Academy" className="w-full h-10 rounded-xl bg-secondary border border-border px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Horário de Funcionamento</label>
            <input defaultValue="06:00 — 22:00" className="w-full h-10 rounded-xl bg-secondary border border-border px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" />
          </div>
        </div>
        <Button size="sm">Salvar</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-base font-semibold text-foreground">Regras de Acesso</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-foreground">Bloquear catraca para inadimplentes</span>
            <div className="w-10 h-6 bg-primary rounded-full relative">
              <div className="w-4 h-4 bg-primary-foreground rounded-full absolute right-1 top-1" />
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-foreground">Restringir acesso fora do horário</span>
            <div className="w-10 h-6 bg-primary rounded-full relative">
              <div className="w-4 h-4 bg-primary-foreground rounded-full absolute right-1 top-1" />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
