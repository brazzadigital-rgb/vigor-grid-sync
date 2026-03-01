import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Bell, Crown, MessageCircle, Ruler, Target,
  Trophy, Settings, LogOut, ChevronRight, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { to: "/app/profile/edit", icon: User, label: "Editar Perfil" },
  { to: "/app/notifications", icon: Bell, label: "Notificações" },
  { to: "/app/premium", icon: Crown, label: "Go Premium", accent: true },
  { to: "/app/profile/talk-pt", icon: MessageCircle, label: "Falar com seu PT" },
  { to: "/app/profile/measurements", icon: Ruler, label: "Minhas Medidas" },
  { to: "/app/goals", icon: Target, label: "Minhas Metas" },
  { to: "/app/profile/badges", icon: Trophy, label: "Minhas Conquistas" },
  { to: "/app/profile/settings", icon: Settings, label: "Configurações" },
];

export default function ProfilePage() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="px-5 pt-12 pb-6 space-y-6 animate-slide-up">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center overflow-hidden">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{profile?.name || "Atleta"}</h1>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all",
              item.accent
                ? "bg-primary/10 border border-primary/20 hover:bg-primary/15"
                : "hover:bg-card"
            )}
          >
            <item.icon className={cn("w-5 h-5", item.accent ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("flex-1 text-sm font-medium", item.accent ? "text-primary" : "text-foreground")}>
              {item.label}
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl w-full hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="text-sm font-medium text-destructive">Sair</span>
        </button>
      </div>
    </div>
  );
}
