import { useState } from "react";
import { Search, Plus, MoreHorizontal, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGymMemberships } from "@/hooks/use-supabase-data";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Ativo", className: "bg-success/15 text-success" },
  paused: { label: "Pausado", className: "bg-warning/15 text-warning" },
  cancelled: { label: "Cancelado", className: "bg-muted text-muted-foreground" },
  expired: { label: "Expirado", className: "bg-destructive/15 text-destructive" },
};

const filters = ["Todos", "Ativos", "Pausados", "Expirados"];

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const { data: memberships, isLoading } = useGymMemberships();

  const filtered = (memberships ?? []).filter((m: any) => {
    const name = m.profiles?.name ?? "";
    const email = m.profiles?.email ?? "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "Ativos") return matchSearch && m.status === "active";
    if (activeFilter === "Pausados") return matchSearch && m.status === "paused";
    if (activeFilter === "Expirados") return matchSearch && (m.status === "expired" || m.status === "cancelled");
    return matchSearch;
  });

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
          <h2 className="text-xl font-bold text-foreground">Gestão de Alunos</h2>
          <p className="text-sm text-muted-foreground">{memberships?.length ?? 0} alunos cadastrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4" /> Exportar</Button>
          <Button size="sm"><Plus className="w-4 h-4" /> Novo Aluno</Button>
        </div>
      </div>

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
              {filtered.map((member: any) => {
                const config = statusConfig[member.status] ?? statusConfig.active;
                const name = member.profiles?.name ?? "—";
                const email = member.profiles?.email ?? "";
                const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
                return (
                  <tr key={member.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{name}</p>
                          <p className="text-xs text-muted-foreground">{email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{member.plans?.name ?? "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${config.className}`}>{config.label}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{member.profiles?.phone ?? "—"}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {member.created_at ? new Date(member.created_at).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">Nenhum aluno encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
