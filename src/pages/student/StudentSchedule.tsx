import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const today = new Date();

const events = [
  { day: today.getDate(), time: "08:00", title: "Treino A — Peito", type: "workout" },
  { day: today.getDate() + 1, time: "09:00", title: "Treino B — Costas", type: "workout" },
  { day: today.getDate() + 2, time: "14:00", title: "Sessão com Coach Carlos", type: "session" },
  { day: today.getDate() + 3, time: "08:00", title: "Treino C — Pernas", type: "workout" },
  { day: today.getDate() + 5, time: "16:00", title: "Avaliação Física", type: "assessment" },
];

const typeColors: Record<string, string> = {
  workout: "bg-primary/15 border-primary/20 text-primary",
  session: "bg-info/15 border-info/20 text-info",
  assessment: "bg-warning/15 border-warning/20 text-warning",
};

export default function StudentSchedule() {
  const [month] = useState(today.getMonth());
  const year = today.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = new Date(year, month).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Agenda</h1>

      {/* Calendar */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-semibold text-foreground capitalize">{monthName}</span>
          <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map((d) => (
            <span key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</span>
          ))}
          {days.map((day, i) => {
            const hasEvent = day && events.some((e) => e.day === day);
            const isToday = day === today.getDate();
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
        <h2 className="text-base font-semibold text-foreground">Próximos Eventos</h2>
        {events.map((event, i) => (
          <div key={i} className={`flex items-center gap-4 rounded-2xl border p-4 ${typeColors[event.type]}`}>
            <div className="w-12 text-center shrink-0">
              <p className="text-lg font-bold">{event.day}</p>
              <p className="text-xs opacity-70">{event.time}</p>
            </div>
            <p className="text-sm font-medium">{event.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
