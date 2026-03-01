import { Target, Plus, Trophy, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function GoalsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery({
    queryKey: ["user_goals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase.from("user_goals").delete().eq("id", goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_goals"] });
      toast.success("Meta removida");
    },
    onError: () => toast.error("Erro ao remover meta"),
  });

  const activeGoals = goals?.filter((g) => g.status === "active") ?? [];
  const completedGoals = goals?.filter((g) => g.status === "completed") ?? [];

  return (
    <div className="px-5 pt-12 pb-6 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Metas</h1>
          <p className="text-sm text-muted-foreground">Acompanhe seus objetivos</p>
        </div>
        <Link to="/app/goals/new">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4" />
            Nova Meta
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : activeGoals.length === 0 && completedGoals.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Nenhuma meta criada</h3>
            <p className="text-sm text-muted-foreground mt-1">Defina suas metas e acompanhe seu progresso</p>
          </div>
          <Link to="/app/goals/new">
            <Button variant="glow">
              <Plus className="w-4 h-4" />
              Criar Primeira Meta
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Ativas</h3>
              {activeGoals.map((goal) => {
                const progress = goal.target_value
                  ? Math.min(100, Math.round(((goal.current_value ?? 0) / goal.target_value) * 100))
                  : 0;
                return (
                  <div key={goal.id} className="rounded-2xl bg-card border border-border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{goal.name}</h4>
                          <p className="text-xs text-muted-foreground">{goal.type}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Link to={`/app/goals/${goal.id}/edit`}>
                          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteMutation.mutate(goal.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {goal.target_value && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{goal.current_value ?? 0} {goal.unit}</span>
                          <span>{goal.target_value} {goal.unit}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {completedGoals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Concluídas</h3>
              {completedGoals.map((goal) => (
                <div key={goal.id} className="rounded-2xl bg-card border border-border p-4 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{goal.name}</h4>
                      <p className="text-xs text-muted-foreground">{goal.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">Conquistas</h3>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5 text-center">
          <p className="text-sm text-muted-foreground">Complete metas para desbloquear conquistas</p>
        </div>
      </div>
    </div>
  );
}
