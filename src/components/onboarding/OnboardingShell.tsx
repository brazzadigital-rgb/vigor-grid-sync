import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onNext: () => void;
  onBack?: () => void;
  canProceed?: boolean;
  children: React.ReactNode;
  nextLabel?: string;
}

export default function OnboardingShell({
  step,
  totalSteps,
  title,
  subtitle,
  onNext,
  onBack,
  canProceed = true,
  children,
  nextLabel = "Próximo",
}: OnboardingShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-14 pb-2">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full flex-1 transition-all duration-500",
                i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">{step + 1} / {totalSteps}</p>
      </div>

      {/* Header */}
      <div className="px-6 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-4 animate-fade-in" key={step}>
        {children}
      </div>

      {/* Footer */}
      <div className="px-6 pb-10 pt-4 flex gap-3">
        {onBack && (
          <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
        )}
        <Button
          variant="glow"
          size="lg"
          onClick={onNext}
          disabled={!canProceed}
          className={cn("flex-1", !onBack && "w-full")}
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
