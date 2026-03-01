import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const unitSystems = [
  { id: "metric", label: "Métrico", desc: "kg, cm, km" },
  { id: "imperial", label: "Imperial", desc: "lbs, ft, mi" },
];

export default function UnitsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("metric");

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Unidades de Medida</h1>
      </div>

      <div className="space-y-3">
        {unitSystems.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelected(u.id)}
            className={cn(
              "flex items-center gap-4 w-full px-4 py-4 rounded-2xl border transition-all",
              selected === u.id ? "border-primary/50 bg-primary/10" : "border-border bg-card"
            )}
          >
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{u.label}</p>
              <p className="text-xs text-muted-foreground">{u.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
