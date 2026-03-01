import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, BellOff } from "lucide-react";

export default function NotificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Notificações</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center">
          <BellOff className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
      </div>
    </div>
  );
}
