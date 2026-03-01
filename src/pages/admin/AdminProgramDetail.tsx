import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, GripVertical, Loader2, Dumbbell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useWorkoutDays, useGymExercises } from "@/hooks/use-supabase-data";
import { useGymWorkoutTemplates } from "@/hooks/use-supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: templates } = useGymWorkoutTemplates();
  const { data: days, isLoading } = useWorkoutDays(id);
  const { data: exercises } = useGymExercises();

  const template = templates?.find((t: any) => t.id === id);

  // Day dialog
  const [dayDialogOpen, setDayDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<any>(null);
  const [dayTitle, setDayTitle] = useState("");

  // Item dialog
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [currentDayId, setCurrentDayId] = useState("");
  const [itemForm, setItemForm] = useState({ exercise_id: "", sets: 3, reps: "12", rest_seconds: 60, notes: "" });

  const [saving, setSaving] = useState(false);

  // --- Day CRUD ---
  const openCreateDay = () => {
    setEditingDay(null);
    setDayTitle("");
    setDayDialogOpen(true);
  };

  const openEditDay = (day: any) => {
    setEditingDay(day);
    setDayTitle(day.title);
    setDayDialogOpen(true);
  };

  const handleSaveDay = async () => {
    setSaving(true);
    try {
      if (editingDay) {
        await supabase.from("workout_days").update({ title: dayTitle }).eq("id", editingDay.id);
      } else {
        const nextIndex = (days?.length ?? 0);
        await supabase.from("workout_days").insert({ template_id: id!, title: dayTitle, day_index: nextIndex } as any);
      }
      qc.invalidateQueries({ queryKey: ["workout-days", id] });
      toast({ title: editingDay ? "Dia atualizado!" : "Dia criado!" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
    setSaving(false);
    setDayDialogOpen(false);
  };

  const handleDeleteDay = async (dayId: string) => {
    if (!confirm("Remover este dia e todos seus exercícios?")) return;
    await supabase.from("workout_items").delete().eq("workout_day_id", dayId);
    await supabase.from("workout_days").delete().eq("id", dayId);
    qc.invalidateQueries({ queryKey: ["workout-days", id] });
    toast({ title: "Dia removido!" });
  };

  // --- Item CRUD ---
  const openCreateItem = (dayId: string) => {
    setCurrentDayId(dayId);
    setEditingItem(null);
    setItemForm({ exercise_id: exercises?.[0]?.id ?? "", sets: 3, reps: "12", rest_seconds: 60, notes: "" });
    setItemDialogOpen(true);
  };

  const openEditItem = (item: any, dayId: string) => {
    setCurrentDayId(dayId);
    setEditingItem(item);
    setItemForm({
      exercise_id: item.exercise_id ?? "",
      sets: item.sets ?? 3,
      reps: item.reps ?? "12",
      rest_seconds: item.rest_seconds ?? 60,
      notes: item.notes ?? "",
    });
    setItemDialogOpen(true);
  };

  const handleSaveItem = async () => {
    setSaving(true);
    try {
      if (editingItem) {
        await supabase.from("workout_items").update({
          exercise_id: itemForm.exercise_id || null,
          sets: itemForm.sets,
          reps: itemForm.reps,
          rest_seconds: itemForm.rest_seconds,
          notes: itemForm.notes || null,
        }).eq("id", editingItem.id);
      } else {
        const dayItems = days?.find((d: any) => d.id === currentDayId)?.workout_items ?? [];
        await supabase.from("workout_items").insert({
          workout_day_id: currentDayId,
          exercise_id: itemForm.exercise_id || null,
          sets: itemForm.sets,
          reps: itemForm.reps,
          rest_seconds: itemForm.rest_seconds,
          notes: itemForm.notes || null,
          order_index: dayItems.length,
        } as any);
      }
      qc.invalidateQueries({ queryKey: ["workout-days", id] });
      toast({ title: editingItem ? "Exercício atualizado!" : "Exercício adicionado!" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
    setSaving(false);
    setItemDialogOpen(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    await supabase.from("workout_items").delete().eq("id", itemId);
    qc.invalidateQueries({ queryKey: ["workout-days", id] });
    toast({ title: "Exercício removido!" });
  };

  // Group exercises by muscle group for select
  const exercisesByGroup = (exercises ?? []).reduce((acc: Record<string, any[]>, ex: any) => {
    const group = ex.muscle_group ?? "Outros";
    if (!acc[group]) acc[group] = [];
    acc[group].push(ex);
    return acc;
  }, {});

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/admin/programs")} className="p-2 rounded-xl hover:bg-secondary text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">{template?.name ?? "Programa"}</h2>
          <p className="text-sm text-muted-foreground">
            {template?.level ?? "—"} • {template?.weeks ?? 0} semanas • {days?.length ?? 0} dias
          </p>
        </div>
        <Button size="sm" onClick={openCreateDay}><Plus className="w-4 h-4" /> Novo Dia</Button>
      </div>

      {/* Days */}
      {(days ?? []).length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-2">
          <Dumbbell className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Nenhum dia de treino criado</p>
          <Button variant="outline" size="sm" onClick={openCreateDay}><Plus className="w-4 h-4" /> Adicionar Dia</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {(days ?? []).map((day: any, dayIdx: number) => (
            <div key={day.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Day Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                    {String.fromCharCode(65 + dayIdx)}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{day.title}</h3>
                    <p className="text-xs text-muted-foreground">{day.workout_items?.length ?? 0} exercícios</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openCreateItem(day.id)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEditDay(day)}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteDay(day.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Items */}
              {(day.workout_items ?? [])
                .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
                .map((item: any, idx: number) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-secondary/30 transition-colors group">
                    <span className="text-xs text-muted-foreground w-6 text-center">{idx + 1}</span>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Dumbbell className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.exercises?.name ?? "Exercício não definido"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.sets}x{item.reps} • {item.rest_seconds}s descanso
                        {item.exercises?.muscle_group ? ` • ${item.exercises.muscle_group}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditItem(item, day.id)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 rounded-lg hover:bg-secondary text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

              {(day.workout_items ?? []).length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Nenhum exercício. </p>
                  <button onClick={() => openCreateItem(day.id)} className="text-xs text-primary font-medium hover:underline">
                    Adicionar exercício
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Day Dialog */}
      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingDay ? "Editar Dia" : "Novo Dia de Treino"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome do Dia</label>
              <input value={dayTitle} onChange={e => setDayTitle(e.target.value)} placeholder="Ex: A - Peito + Tríceps"
                className="w-full h-10 rounded-xl bg-secondary border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDayDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveDay} disabled={saving || !dayTitle.trim()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingItem ? "Editar Exercício" : "Adicionar Exercício"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Exercício</label>
              <select value={itemForm.exercise_id} onChange={e => setItemForm({ ...itemForm, exercise_id: e.target.value })}
                className="w-full h-10 rounded-xl bg-secondary border border-border px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all">
                <option value="">Selecione...</option>
                {Object.entries(exercisesByGroup).map(([group, exs]) => (
                  <optgroup key={group} label={group}>
                    {(exs as any[]).map((ex: any) => (
                      <option key={ex.id} value={ex.id}>{ex.name}{ex.equipment ? ` (${ex.equipment})` : ""}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Séries</label>
                <input type="number" value={itemForm.sets} onChange={e => setItemForm({ ...itemForm, sets: Number(e.target.value) })}
                  className="w-full h-10 rounded-xl bg-secondary border border-border px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Reps</label>
                <input value={itemForm.reps} onChange={e => setItemForm({ ...itemForm, reps: e.target.value })} placeholder="12"
                  className="w-full h-10 rounded-xl bg-secondary border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Descanso (s)</label>
                <input type="number" value={itemForm.rest_seconds} onChange={e => setItemForm({ ...itemForm, rest_seconds: Number(e.target.value) })}
                  className="w-full h-10 rounded-xl bg-secondary border border-border px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Observações</label>
              <textarea value={itemForm.notes} onChange={e => setItemForm({ ...itemForm, notes: e.target.value })} rows={2} placeholder="Ex: Até a falha, cadência 3-1-2..."
                className="w-full rounded-xl bg-secondary border border-border px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveItem} disabled={saving || !itemForm.exercise_id}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
