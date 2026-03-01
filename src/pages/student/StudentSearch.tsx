import { Search as SearchIcon, MapPin, Star, Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const categories = ["Todos", "Coaches", "Aulas", "Unidades"];

const coaches = [
  { name: "Carlos Ribeiro", specialty: "Hipertrofia", rating: 4.9, sessions: 234, avatar: "CR" },
  { name: "Ana Santos", specialty: "Funcional", rating: 4.8, sessions: 189, avatar: "AS" },
  { name: "Marcos Lima", specialty: "Performance", rating: 4.7, sessions: 156, avatar: "ML" },
];

const classes = [
  { name: "Spinning", time: "07:00 — 08:00", spots: 5, total: 20 },
  { name: "Yoga", time: "09:00 — 10:00", spots: 8, total: 15 },
  { name: "CrossFit", time: "18:00 — 19:00", spots: 2, total: 12 },
];

export default function StudentSearch() {
  const [active, setActive] = useState("Todos");
  const [query, setQuery] = useState("");

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Buscar</h1>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Coaches, aulas, unidades..."
          className="w-full h-12 rounded-xl bg-secondary border border-border pl-11 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary/10 text-primary">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2">
        {categories.map((cat) => (
          <Button key={cat} variant={active === cat ? "pill-active" : "pill"} size="pill" onClick={() => setActive(cat)}>
            {cat}
          </Button>
        ))}
      </div>

      {/* Coaches */}
      {(active === "Todos" || active === "Coaches") && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Coaches</h2>
          {coaches.map((coach) => (
            <div key={coach.name} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                {coach.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{coach.name}</p>
                <p className="text-xs text-muted-foreground">{coach.specialty} • {coach.sessions} sessões</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-warning">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-medium">{coach.rating}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Classes */}
      {(active === "Todos" || active === "Aulas") && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Aulas</h2>
          {classes.map((cls) => (
            <div key={cls.name} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{cls.name}</p>
                <p className="text-xs text-muted-foreground">{cls.time}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{cls.spots}/{cls.total} vagas</p>
                <Button variant="outline" size="sm" className="mt-1 h-7 text-xs">Reservar</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
