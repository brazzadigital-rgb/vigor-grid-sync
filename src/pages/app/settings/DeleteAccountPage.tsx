import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [confirm, setConfirm] = useState("");

  const handleDelete = async () => {
    // Placeholder - real deletion would call supabase
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-10 animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-destructive">Excluir Conta</h1>
      </div>

      <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-5 space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h3 className="text-sm font-semibold text-destructive">Ação irreversível</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Todos os seus dados serão permanentemente excluídos, incluindo treinos, progresso, conquistas e configurações.
        </p>
      </div>

      <div className="space-y-4 flex-1">
        <label className="text-xs font-medium text-muted-foreground block">
          Digite "EXCLUIR" para confirmar
        </label>
        <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="EXCLUIR" className="h-12 bg-card border-border" />
      </div>

      <Button variant="destructive" size="lg" className="w-full" disabled={confirm !== "EXCLUIR"} onClick={handleDelete}>
        Excluir Minha Conta
      </Button>
    </div>
  );
}
