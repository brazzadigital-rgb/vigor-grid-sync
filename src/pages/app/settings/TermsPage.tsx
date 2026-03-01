import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-12 pb-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Termos de Serviço</h1>
      </div>
      <div className="prose prose-invert prose-sm max-w-none">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Ao utilizar este aplicativo, você concorda com os seguintes termos e condições de uso.
        </p>
        <h3 className="text-sm font-semibold text-foreground mt-6">Uso do Serviço</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O aplicativo fornece ferramentas de acompanhamento fitness e coaching por IA. O uso é pessoal e intransferível.
        </p>
        <h3 className="text-sm font-semibold text-foreground mt-6">Responsabilidade</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Consulte um profissional de saúde antes de iniciar qualquer programa de exercícios. O app não substitui orientação médica.
        </p>
      </div>
    </div>
  );
}
