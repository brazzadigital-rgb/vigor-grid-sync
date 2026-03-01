import { CreditCard, Search, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const payments = [
  { id: 1, member: "João Silva", plan: "Hipertrofia Total", amount: 199, status: "paid", date: "01/02/2024", method: "PIX" },
  { id: 2, member: "Maria Oliveira", plan: "Emagrecer com Saúde", amount: 249, status: "paid", date: "01/02/2024", method: "Cartão" },
  { id: 3, member: "Pedro Santos", plan: "Alta Performance", amount: 349, status: "paid", date: "01/02/2024", method: "PIX" },
  { id: 4, member: "Ana Costa", plan: "Recuperação Funcional", amount: 299, status: "pending", date: "01/02/2024", method: "—" },
  { id: 5, member: "Lucas Ferreira", plan: "Hipertrofia Total", amount: 199, status: "overdue", date: "01/01/2024", method: "—" },
  { id: 6, member: "Camila Lima", plan: "Emagrecer com Saúde", amount: 249, status: "paid", date: "01/02/2024", method: "Cartão" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Pago", className: "bg-success/15 text-success" },
  pending: { label: "Pendente", className: "bg-warning/15 text-warning" },
  overdue: { label: "Atrasado", className: "bg-destructive/15 text-destructive" },
};

export default function AdminPayments() {
  const [filter, setFilter] = useState("Todos");

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Pagamentos</h2>
          <p className="text-sm text-muted-foreground">Gestão financeira</p>
        </div>
        <Button variant="outline" size="sm"><Download className="w-4 h-4" /> Exportar</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Recebido (mês)</p>
          <p className="text-xl font-bold text-success">R$ 48.700</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Pendente</p>
          <p className="text-xl font-bold text-warning">R$ 2.490</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Atrasado</p>
          <p className="text-xl font-bold text-destructive">R$ 1.194</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["Todos", "Pagos", "Pendentes", "Atrasados"].map((f) => (
          <Button key={f} variant={filter === f ? "pill-active" : "pill"} size="pill" onClick={() => setFilter(f)}>{f}</Button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Aluno</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Plano</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Valor</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Método</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Data</th>
              </tr>
            </thead>
            <tbody>
              {payments
                .filter((p) => {
                  if (filter === "Pagos") return p.status === "paid";
                  if (filter === "Pendentes") return p.status === "pending";
                  if (filter === "Atrasados") return p.status === "overdue";
                  return true;
                })
                .map((p) => {
                  const config = statusConfig[p.status];
                  return (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{p.member}</td>
                      <td className="py-3 px-4 text-muted-foreground">{p.plan}</td>
                      <td className="py-3 px-4 text-foreground font-medium">R$ {p.amount}</td>
                      <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${config.className}`}>{config.label}</span></td>
                      <td className="py-3 px-4 text-muted-foreground">{p.method}</td>
                      <td className="py-3 px-4 text-muted-foreground">{p.date}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
