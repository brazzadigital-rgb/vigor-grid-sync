import { Shield, CheckCircle2, XCircle, Clock, Search, Activity } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const accessLogs = [
  { time: "08:15", member: "João Silva", device: "Catraca 01", decision: "allow", reason: "Plano ativo" },
  { time: "08:22", member: "Maria Oliveira", device: "Catraca 01", decision: "allow", reason: "Plano ativo" },
  { time: "08:30", member: "Lucas Ferreira", device: "Catraca 02", decision: "deny", reason: "Pagamento atrasado" },
  { time: "08:45", member: "Pedro Santos", device: "Catraca 01", decision: "allow", reason: "Plano ativo" },
  { time: "09:01", member: "Ana Costa", device: "Catraca 02", decision: "deny", reason: "Fora do horário" },
  { time: "09:15", member: "Camila Lima", device: "Catraca 01", decision: "allow", reason: "Plano ativo" },
  { time: "09:30", member: "Rafael Souza", device: "Catraca 01", decision: "allow", reason: "Plano ativo" },
];

const devices = [
  { name: "Catraca 01", location: "Entrada Principal", status: "online", todayEntries: 87 },
  { name: "Catraca 02", location: "Entrada Lateral", status: "online", todayEntries: 42 },
];

export default function AdminAccessControl() {
  const [tokenTest, setTokenTest] = useState("");

  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold text-foreground">Controle de Acesso</h2>

      {/* Devices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {devices.map((d) => (
          <div key={d.name} className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.location}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-success">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {d.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span>{d.todayEntries} entradas hoje</span>
            </div>
          </div>
        ))}
      </div>

      {/* Simulator */}
      <div className="rounded-2xl border border-primary/20 bg-card p-5 space-y-3">
        <h3 className="text-base font-semibold text-foreground">🧪 Modo Simulador</h3>
        <p className="text-xs text-muted-foreground">Teste a validação sem catraca física</p>
        <div className="flex gap-2">
          <input
            value={tokenTest}
            onChange={(e) => setTokenTest(e.target.value)}
            placeholder="Token ou ID do aluno"
            className="flex-1 h-10 rounded-xl bg-secondary border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
          <Button size="sm">Simular</Button>
        </div>
      </div>

      {/* Access Logs */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Logs de Acesso — Hoje</h3>
          <span className="text-xs text-muted-foreground">{accessLogs.length} registros</span>
        </div>
        <div className="divide-y divide-border/50">
          {accessLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/50 transition-colors">
              <span className="text-xs font-mono text-muted-foreground w-12">{log.time}</span>
              {log.decision === "allow" ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive shrink-0" />
              )}
              <span className="text-sm text-foreground flex-1">{log.member}</span>
              <span className="text-xs text-muted-foreground">{log.device}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${log.decision === "allow" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                {log.reason}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
