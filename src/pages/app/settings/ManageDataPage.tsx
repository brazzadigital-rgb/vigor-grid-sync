import { useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManageDataPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Gerenciar Dados</h1>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Exportar Dados</h3>
          <p className="text-xs text-muted-foreground">Baixe uma cópia de todos os seus dados</p>
          <Button variant="outline" size="sm"><Download className="w-4 h-4" /> Exportar</Button>
        </div>
        <div className="rounded-2xl bg-card border border-destructive/20 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-destructive">Limpar Dados</h3>
          <p className="text-xs text-muted-foreground">Remove todo histórico de treinos e progresso</p>
          <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4" /> Limpar</Button>
        </div>
      </div>
    </div>
  );
}
