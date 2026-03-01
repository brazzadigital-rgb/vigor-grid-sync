import { NavLink, useLocation, Outlet } from "react-router-dom";
import { Home, Dumbbell, PlayCircle, Target, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/app", icon: Home, label: "Home", end: true },
  { to: "/app/exercises", icon: Dumbbell, label: "Exercícios" },
  { to: "/app/routine", icon: PlayCircle, label: "Rotina" },
  { to: "/app/goals", icon: Target, label: "Metas" },
  { to: "/app/ai-coach", icon: Bot, label: "AI Coach" },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-24 overflow-y-auto">
        <Outlet />
      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto">
        <div className="flex items-center justify-around h-16 rounded-2xl bg-card/90 backdrop-blur-2xl border border-border/60 shadow-xl shadow-background/50">
          {navItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 relative",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-primary glow-purple" />
                )}
                <item.icon className={cn("w-5 h-5 transition-all", isActive && "drop-shadow-[0_0_8px_hsl(258,82%,60%)]")} />
                <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
