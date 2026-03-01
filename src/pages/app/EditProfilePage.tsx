import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [email] = useState(profile?.email || "");

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Editar Perfil</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-card border border-border flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 bg-card border-border" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
          <Input value={email} disabled className="h-12 bg-card border-border opacity-60" />
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Button variant="glow" size="lg" className="w-full">Salvar Alterações</Button>
      </div>
    </div>
  );
}
