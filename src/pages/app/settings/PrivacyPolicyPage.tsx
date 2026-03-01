import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Política de Privacidade</h1>
      </div>
      <div className="prose prose-invert prose-sm max-w-none">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Esta política de privacidade descreve como coletamos, usamos e protegemos suas informações pessoais.
          Ao usar nosso aplicativo, você concorda com a coleta e uso de informações de acordo com esta política.
        </p>
        <h3 className="text-sm font-semibold text-foreground mt-6">Informações Coletadas</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Coletamos informações que você fornece diretamente, como nome, email, dados de treino e métricas corporais.
        </p>
        <h3 className="text-sm font-semibold text-foreground mt-6">Uso das Informações</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Utilizamos seus dados para personalizar treinos, gerar recomendações via IA e melhorar sua experiência no app.
        </p>
      </div>
    </div>
  );
}
