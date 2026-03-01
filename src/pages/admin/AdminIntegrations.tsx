import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const integrations = [
  { name: "Catraca Henry", status: "connected", description: "Controle de acesso via catraca inteligente", icon: "🚪" },
  { name: "Gateway de Pagamento", status: "pending", description: "PIX + Cartão de Crédito", icon: "💳" },
  { name: "Gerador de Treinos IA", status: "connected", description: "Geração inteligente de programas de treino", icon: "🤖" },
  { name: "Webhooks", status: "disconnected", description: "Notificações em tempo real", icon: "🔔" },
];

const statusLabels: Record<string, { label: string; className: string }> = {
  connected: { label: "Conectado", className: "bg-success/15 text-success" },
  pending: { label: "Configurar", className: "bg-warning/15 text-warning" },
  disconnected: { label: "Desconectado", className: "bg-muted text-muted-foreground" },
};

export default function AdminIntegrations() {
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold text-foreground">Integrações</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((int) => {
          const config = statusLabels[int.status];
          return (
            <div key={int.name} className="rounded-2xl border border-border bg-card p-5 space-y-3 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{int.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{int.name}</p>
                    <p className="text-xs text-muted-foreground">{int.description}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${config.className}`}>{config.label}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">Configurar</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
