import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Zap } from "lucide-react";
import { useBodyFocusExercises } from "@/hooks/use-home-data";

const categories = [
  { key: "all", label: "Todos" },
  { key: "legs", label: "Pernas", match: ["perna", "leg", "quadríceps", "glúteo", "posterior"] },
  { key: "chest", label: "Peito", match: ["peito", "chest", "peitoral"] },
  { key: "back", label: "Costas", match: ["costa", "back", "dorsal", "trapézio"] },
  { key: "shoulder", label: "Ombro", match: ["ombro", "shoulder", "deltóide"] },
  { key: "cardio", label: "Cardio", match: ["cardio", "aeróbico", "corrida", "bike"] },
];

export default function BodyFocusCarousel() {
  const { data: exercises } = useBodyFocusExercises();
  const [active, setActive] = useState("all");

  const filtered = (exercises ?? []).filter(ex => {
    if (active === "all") return true;
    const cat = categories.find(c => c.key === active);
    if (!cat || !cat.match) return false;
    const text = `${ex.muscle_group ?? ""} ${ex.category ?? ""}`.toLowerCase();
    return cat.match.some(m => text.includes(m));
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Body Focus</h2>
        <Zap className="w-4 h-4 text-warning" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              active === cat.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {filtered.length === 0 ? (
          <div className="w-full text-center py-8 text-sm text-muted-foreground">Nenhum exercício encontrado</div>
        ) : (
          filtered.slice(0, 10).map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0 w-36 rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all group cursor-pointer"
            >
              <div className="h-24 bg-gradient-card flex items-center justify-center relative overflow-hidden">
                {ex.media_url ? (
                  <img src={ex.media_url} alt={ex.name} className="w-full h-full object-cover" />
                ) : (
                  <Dumbbell className="w-8 h-8 text-muted-foreground/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="p-3 space-y-1">
                <p className="text-xs font-semibold text-foreground truncate">{ex.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{ex.muscle_group ?? "Geral"}</p>
                {ex.equipment && (
                  <span className="inline-block text-[9px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full mt-1">
                    {ex.equipment}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
