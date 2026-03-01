import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function EditGoalPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (!id || !user) return;
    supabase
      .from("user_goals")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Meta não encontrada");
          navigate("/app/goals");
          return;
        }
        setName(data.name);
        setCurrentValue(String(data.current_value ?? ""));
        setTargetValue(String(data.target_value ?? ""));
        setUnit(data.unit ?? "");
        setStatus(data.status);
        setLoading(false);
      });
  }, [id, user, navigate]);

  const handleSave = async () => {
    if (!name || !id) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_goals")
      .update({
        name,
        current_value: currentValue ? Number(currentValue) : 0,
        target_value: targetValue ? Number(targetValue) : null,
        unit: unit || null,
        status,
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar");
      return;
    }
    toast.success("Meta atualizada!");
    navigate("/app/goals");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-10 animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Editar Meta</h1>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 bg-card border-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Progresso atual</label>
            <Input type="number" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} placeholder="0" className="h-12 bg-card border-border" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Valor alvo</label>
            <Input type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} className="h-12 bg-card border-border" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Unidade</label>
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg, km, etc." className="h-12 bg-card border-border" />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-3 block">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {["active", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  status === s
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {s === "active" ? "Ativa" : "Concluída"}
                {status === s && <Check className="w-4 h-4 inline ml-2" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button variant="glow" size="lg" className="w-full" disabled={!name || saving} onClick={handleSave}>
        {saving ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </div>
  );
}
