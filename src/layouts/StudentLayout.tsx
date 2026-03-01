import { NavLink, useLocation } from "react-router-dom";
import { Home, Calendar, Search, Dumbbell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/app", icon: Home, label: "Home" },
  { to: "/app/schedule", icon: Calendar, label: "Agenda" },
  { to: "/app/search", icon: Search, label: "Buscar" },
  { to: "/app/workouts", icon: Dumbbell, label: "Treinos" },
  { to: "/app/profile", icon: User, label: "Perfil" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-card/90 backdrop-blur-2xl">
        <div className="flex items-center justify-around h-[72px] max-w-lg mx-auto px-4 pb-safe">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || 
              (item.to !== "/app" && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 relative",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-primary" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-all",
                  isActive && "drop-shadow-[0_0_8px_hsl(258,82%,60%)]"
                )} />
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive && "font-semibold"
                )}>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
