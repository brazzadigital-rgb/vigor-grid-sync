import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMyWorkoutSessions } from "@/hooks/use-supabase-data";

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const typeColors: Record<string, string> = {
  planned: "bg-primary/15 border-primary/20 text-primary",
  done: "bg-success/15 border-success/20 text-success",
  missed: "bg-destructive/15 border-destructive/20 text-destructive",
};

export default function StudentSchedule() {
  const [monthOffset, setMonthOffset] = useState(0);
  const { data: sessions, isLoading } = useMyWorkoutSessions();

  const now = new Date();
  const viewMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = viewMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const events = (sessions ?? []).filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const getEventsForDay = (day: number) =>
    events.filter(e => new Date(e.date).getDate() === day);

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Agenda</h1>

      {/* Calendar */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setMonthOffset(o => o - 1)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-foreground capitalize">{monthName}</span>
          <button onClick={() => setMonthOffset(o => o + 1)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map((d) => (
            <span key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</span>
          ))}
          {days.map((day, i) => {
            const hasEvent = day ? getEventsForDay(day).length > 0 : false;
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            return (
              <div
                key={i}
                className={`relative h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                  !day ? "" :
                  isToday ? "bg-primary text-primary-foreground font-bold" :
                  "text-foreground hover:bg-secondary cursor-pointer"
                }`}
              >
                {day}
                {hasEvent && !isToday && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Sessões do Mês</h2>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : events.length > 0 ? (
          events.map((session) => {
            const d = new Date(session.date);
            return (
              <div key={session.id} className={`flex items-center gap-4 rounded-2xl border p-4 ${typeColors[session.status] ?? typeColors.planned}`}>
                <div className="w-12 text-center shrink-0">
                  <p className="text-lg font-bold">{d.getDate()}</p>
                  <p className="text-xs opacity-70">{d.toLocaleDateString("pt-BR", { weekday: "short" })}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{session.assigned_workouts?.workout_templates?.name ?? "Treino"}</p>
                  <p className="text-xs opacity-70 capitalize">{session.status}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma sessão neste mês</p>
        )}
      </div>
    </div>
  );
}
