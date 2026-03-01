import { useNavigate } from "react-router-dom";
import { ChevronLeft, Ruler, TrendingUp, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MeasurementsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Minhas Medidas</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: Weight, label: "Peso", value: "-- kg", color: "text-primary" },
          { icon: Ruler, label: "Altura", value: "-- cm", color: "text-info" },
          { icon: TrendingUp, label: "% Gordura", value: "--%", color: "text-warning" },
          { icon: Ruler, label: "IMC", value: "--", color: "text-success" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl bg-card border border-border p-4 flex flex-col items-center gap-2">
            <m.icon className={`w-5 h-5 ${m.color}`} />
            <p className="text-lg font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border p-5 text-center mb-6">
        <p className="text-sm text-muted-foreground">Registre suas medidas para acompanhar sua evolução</p>
      </div>

      <Button variant="glow" size="lg" className="w-full">Registrar Nova Medida</Button>
    </div>
  );
}
