import { useState } from "react";
import { Search, Plus, MoreHorizontal, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const members = [
  { id: 1, name: "João Silva", email: "joao@email.com", plan: "Hipertrofia", status: "active", phone: "(11) 99999-0001", joined: "12/01/2024" },
  { id: 2, name: "Maria Oliveira", email: "maria@email.com", plan: "Emagrecimento", status: "active", phone: "(11) 99999-0002", joined: "15/01/2024" },
  { id: 3, name: "Pedro Santos", email: "pedro@email.com", plan: "Performance", status: "active", phone: "(11) 99999-0003", joined: "20/01/2024" },
  { id: 4, name: "Ana Costa", email: "ana@email.com", plan: "Reabilitação", status: "pending", phone: "(11) 99999-0004", joined: "25/01/2024" },
  { id: 5, name: "Lucas Ferreira", email: "lucas@email.com", plan: "Hipertrofia", status: "inactive", phone: "(11) 99999-0005", joined: "01/02/2024" },
  { id: 6, name: "Camila Lima", email: "camila@email.com", plan: "Emagrecimento", status: "active", phone: "(11) 99999-0006", joined: "05/02/2024" },
  { id: 7, name: "Rafael Souza", email: "rafael@email.com", plan: "Performance", status: "active", phone: "(11) 99999-0007", joined: "10/02/2024" },
  { id: 8, name: "Juliana Alves", email: "juliana@email.com", plan: "Hipertrofia", status: "overdue", phone: "(11) 99999-0008", joined: "15/02/2024" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Ativo", className: "bg-success/15 text-success" },
  pending: { label: "Pendente", className: "bg-warning/15 text-warning" },
  inactive: { label: "Inativo", className: "bg-muted text-muted-foreground" },
  overdue: { label: "Inadimplente", className: "bg-destructive/15 text-destructive" },
};

const filters = ["Todos", "Ativos", "Pendentes", "Inadimplentes"];

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "Ativos") return matchSearch && m.status === "active";
    if (activeFilter === "Pendentes") return matchSearch && m.status === "pending";
    if (activeFilter === "Inadimplentes") return matchSearch && m.status === "overdue";
    return matchSearch;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestão de Alunos</h2>
          <p className="text-sm text-muted-foreground">{members.length} alunos cadastrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4" /> Exportar</Button>
          <Button size="sm"><Plus className="w-4 h-4" /> Novo Aluno</Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar aluno..."
            className="w-full h-10 rounded-xl bg-secondary border border-border pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <Button key={f} variant={activeFilter === f ? "pill-active" : "pill"} size="pill" onClick={() => setActiveFilter(f)}>
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aluno</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plano</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Telefone</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cadastro</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => {
                const config = statusConfig[member.status];
                return (
                  <tr key={member.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{member.plan}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${config.className}`}>{config.label}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{member.phone}</td>
                    <td className="py-3 px-4 text-muted-foreground">{member.joined}</td>
                    <td className="py-3 px-4">
                      <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
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
