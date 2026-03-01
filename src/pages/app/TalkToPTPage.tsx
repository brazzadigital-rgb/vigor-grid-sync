import { useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TalkToPTPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-10 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Falar com seu PT</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center glow-purple">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Chat com Personal</h2>
        <p className="text-sm text-muted-foreground text-center max-w-xs">Converse diretamente com seu personal trainer para tirar dúvidas e ajustar treinos</p>
        <Button variant="glow" size="lg" className="mt-4">Iniciar Conversa</Button>
      </div>
    </div>
  );
}
