import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Lock, Bot, Ruler, Database, Shield, FileText, Trash2 } from "lucide-react";

const settingsItems = [
  { to: "/app/profile/settings/password", icon: Lock, label: "Alterar Senha" },
  { to: "/app/profile/settings/ai-style", icon: Bot, label: "Estilo do AI Coach" },
  { to: "/app/profile/settings/units", icon: Ruler, label: "Unidades de Medida" },
  { to: "/app/profile/settings/data", icon: Database, label: "Gerenciar Dados" },
  { to: "/app/profile/settings/privacy", icon: Shield, label: "Política de Privacidade" },
  { to: "/app/profile/settings/terms", icon: FileText, label: "Termos de Serviço" },
  { to: "/app/profile/settings/delete", icon: Trash2, label: "Excluir Conta", danger: true },
];

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-12 pb-6 space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Configurações</h1>
      </div>

      <div className="space-y-1">
        {settingsItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-card transition-all"
          >
            <item.icon className={`w-5 h-5 ${item.danger ? "text-destructive" : "text-muted-foreground"}`} />
            <span className={`flex-1 text-sm font-medium ${item.danger ? "text-destructive" : "text-foreground"}`}>
              {item.label}
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
