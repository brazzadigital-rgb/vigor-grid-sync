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
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || 
              (item.to !== "/app" && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_6px_hsl(258,82%,60%)]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
