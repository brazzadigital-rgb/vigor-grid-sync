import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-10 animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Alterar Senha</h1>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Senha Atual</label>
          <div className="relative">
            <Input type={show ? "text" : "password"} value={current} onChange={(e) => setCurrent(e.target.value)} className="h-12 bg-card border-border pr-10" />
            <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nova Senha</label>
          <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="h-12 bg-card border-border" placeholder="Min. 6 caracteres" />
        </div>
      </div>

      <Button variant="glow" size="lg" className="w-full" disabled={!current || newPass.length < 6}>Atualizar Senha</Button>
    </div>
  );
}
