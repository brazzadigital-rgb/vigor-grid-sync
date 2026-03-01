import { User, CreditCard, QrCode, Settings, LogOut, ChevronRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useMyMembership, useMyWorkoutStats, useMyCredential } from "@/hooks/use-supabase-data";

const menuItems = [
  { icon: TrendingUp, label: "Progresso", description: "Gráficos e evolução", to: "/app/profile/progress" },
  { icon: CreditCard, label: "Pagamentos", description: "Histórico e plano", to: "/app/profile/payments" },
  { icon: QrCode, label: "Credencial", description: "QR Code de acesso", to: "/app/profile/credential" },
  { icon: Settings, label: "Configurações", description: "Editar perfil", to: "/app/profile/settings" },
];

export default function StudentProfile() {
  const navigate = useNavigate();
  const { profile, signOut, isStaff } = useAuth();
  const { data: membership } = useMyMembership();
  const { data: stats } = useMyWorkoutStats();
  const { data: credential } = useMyCredential();

  const initials = profile?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto space-y-6">
      {/* Avatar & Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{profile?.name ?? "Aluno"}</h1>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full border border-primary/20">
              {membership?.plans?.name ?? "Sem plano"}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              membership?.status === "active"
                ? "bg-success/15 text-success border-success/20"
                : "bg-warning/15 text-warning border-warning/20"
            }`}>
              {membership?.status === "active" ? "Ativo" : "Inativo"}
            </span>
          </div>
        </div>
      </div>

      {/* QR Code Card */}
      <div
        className="rounded-2xl border border-primary/20 bg-card p-6 text-center space-y-3 glow-purple cursor-pointer hover:border-primary/40 transition-all"
        onClick={() => navigate("/app/profile/credential")}
      >
        <QrCode className="w-20 h-20 mx-auto text-primary" />
        <p className="text-sm font-medium text-foreground">Credencial de Acesso</p>
        <p className="text-xs text-muted-foreground">Apresente na catraca para entrar</p>
        <p className="text-xs font-mono text-primary/60">
          {credential ? `FP-${credential.id.slice(0, 8).toUpperCase()}` : "Sem credencial"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-3 text-center">
          <p className="text-lg font-bold text-foreground">{stats?.done ?? 0}</p>
          <p className="text-xs text-muted-foreground">Treinos</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 text-center">
          <p className="text-lg font-bold text-foreground">{stats?.streak ?? 0}</p>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 text-center">
          <p className="text-lg font-bold text-primary">{stats?.badgeCount ?? 0}</p>
          <p className="text-xs text-muted-foreground">Badges</p>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.to)}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </div>

      {/* Admin Link */}
      {isStaff && (
        <Button variant="outline" className="w-full" onClick={() => navigate("/admin")}>
          Painel Administrativo
        </Button>
      )}

      <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleLogout}>
        <LogOut className="w-4 h-4" /> Sair
      </Button>
    </div>
  );
}
