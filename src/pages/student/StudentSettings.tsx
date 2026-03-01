import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Save, User, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function StudentSettings() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: fullProfile } = useQuery({
    queryKey: ["my-full-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (fullProfile) {
      setName(fullProfile.name ?? "");
      setPhone(fullProfile.phone ?? "");
    }
  }, [fullProfile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ name, phone: phone || null })
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-full-profile"] });
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      toast({ title: "Perfil atualizado!" });
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Configurações</h1>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" /> Nome
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 rounded-xl bg-secondary border border-border px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" /> Email
          </label>
          <input
            value={profile?.email ?? ""}
            disabled
            className="w-full h-12 rounded-xl bg-secondary border border-border px-4 text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" /> Telefone
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full h-12 rounded-xl bg-secondary border border-border px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      <Button
        variant="glow"
        size="lg"
        className="w-full"
        onClick={() => updateProfile.mutate()}
        disabled={updateProfile.isPending}
      >
        {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Salvar</>}
      </Button>
    </div>
  );
}
