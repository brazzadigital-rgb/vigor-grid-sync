import { NavLink, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Users, Dumbbell, CreditCard, Shield,
  BarChart3, Settings, Zap, ChevronLeft, Menu, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/users", icon: Users, label: "Usuários" },
  { to: "/admin/programs", icon: Dumbbell, label: "Programas" },
  { to: "/admin/plans", icon: DollarSign, label: "Planos" },
  { to: "/admin/payments", icon: CreditCard, label: "Pagamentos" },
  { to: "/admin/access", icon: Shield, label: "Controle Acesso" },
  { to: "/admin/reports", icon: BarChart3, label: "Relatórios" },
  { to: "/admin/integrations", icon: Zap, label: "Integrações" },
  { to: "/admin/settings", icon: Settings, label: "Configurações" },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border bg-card/50 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!collapsed && (
            <span className="text-lg font-bold text-gradient-purple">FitAdmin</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300", collapsed ? "ml-16" : "ml-64")}>
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center px-6">
          <h2 className="text-lg font-semibold text-foreground">
            {sidebarItems.find((i) => i.end ? location.pathname === i.to : location.pathname.startsWith(i.to))?.label || "Admin"}
          </h2>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
