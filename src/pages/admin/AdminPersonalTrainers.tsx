import { useState } from "react";
import { Loader2, Plus, Trash2, User, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGymCoaches } from "@/hooks/use-gym-coaches";
import { useGymProfiles } from "@/hooks/use-supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminPersonalTrainers() {
  const { data: coaches, isLoading } = useGymCoaches();
  const { data: allProfiles } = useGymProfiles();
  const { profile } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  const nonCoachProfiles = (allProfiles ?? []).filter(
    (p) => !(coaches ?? []).some((c) => c.id === p.id) && p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCoach = async (userId: string) => {
    setAdding(true);
    try {
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        gym_id: profile!.gym_id!,
        role: "coach",
      } as any);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["gym-coaches"] });
      toast({ title: "Personal adicionado!" });
      setDialogOpen(false);
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveCoach = async (userId: string) => {
    if (!confirm("Remover este personal trainer?")) return;
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("gym_id", profile!.gym_id!)
        .eq("role", "coach");
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["gym-coaches"] });
      toast({ title: "Personal removido!" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Personal Trainers</h2>
          <p className="text-sm text-muted-foreground">{coaches?.length ?? 0} profissionais cadastrados</p>
        </div>
        <Button size="sm" onClick={() => { setSearch(""); setDialogOpen(true); }}>
          <UserPlus className="w-4 h-4" /> Adicionar Personal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(coaches ?? []).map((coach) => (
          <div key={coach.id} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 hover:border-primary/30 transition-all">
            <Avatar className="w-14 h-14 border-2 border-primary/30">
              <AvatarImage src={coach.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                {coach.name?.charAt(0) ?? "P"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{coach.name}</p>
              <p className="text-xs text-muted-foreground truncate">{coach.email}</p>
              <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
                {coach.role === "owner" ? "Proprietário" : "Coach"}
              </span>
            </div>
            {coach.role !== "owner" && (
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleRemoveCoach(coach.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {(coaches ?? []).length === 0 && (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center space-y-2">
            <User className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Nenhum personal cadastrado</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Personal Trainer</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar membro por nome..."
                className="w-full h-10 rounded-xl bg-secondary border border-border pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {nonCoachProfiles.slice(0, 20).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleAddCoach(p.id)}
                  disabled={adding}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-left"
                >
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={p.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                      {p.name?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                  </div>
                  <Plus className="w-4 h-4 text-primary shrink-0" />
                </button>
              ))}
              {nonCoachProfiles.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum membro encontrado</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
