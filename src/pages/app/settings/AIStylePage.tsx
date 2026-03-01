import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const styles = [
  { id: "motivational", label: "Motivacional", desc: "Energético e encorajador" },
  { id: "strict", label: "Rígido", desc: "Disciplinado e direto" },
  { id: "friendly", label: "Amigável", desc: "Casual e acolhedor" },
  { id: "technical", label: "Técnico", desc: "Focado em dados e ciência" },
];

export default function AIStylePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("motivational");

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Estilo do AI Coach</h1>
      </div>

      <div className="space-y-3">
        {styles.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={cn(
              "flex items-center gap-4 w-full px-4 py-4 rounded-2xl border transition-all",
              selected === s.id ? "border-primary/50 bg-primary/10 glow-purple" : "border-border bg-card"
            )}
          >
            <Bot className={cn("w-5 h-5", selected === s.id ? "text-primary" : "text-muted-foreground")} />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
