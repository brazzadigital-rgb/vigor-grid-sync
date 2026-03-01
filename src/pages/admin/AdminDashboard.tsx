import { Users, DollarSign, TrendingUp, TrendingDown, Activity, ArrowUpRight, UserPlus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

const stats = [
  { label: "Alunos Ativos", value: "487", change: "+12%", icon: Users, trend: "up" },
  { label: "Receita Mensal", value: "R$ 48.700", change: "+8%", icon: DollarSign, trend: "up" },
  { label: "Novos Cadastros", value: "32", change: "+5%", icon: UserPlus, trend: "up" },
  { label: "Churn Rate", value: "3.2%", change: "-0.8%", icon: TrendingDown, trend: "down" },
];

const revenueData = [
  { month: "Jul", value: 38200 }, { month: "Ago", value: 41500 }, { month: "Set", value: 39800 },
  { month: "Out", value: 43200 }, { month: "Nov", value: 45600 }, { month: "Dez", value: 42800 },
  { month: "Jan", value: 46100 }, { month: "Fev", value: 48700 },
];

const accessData = [
  { day: "Seg", entries: 142 }, { day: "Ter", entries: 128 }, { day: "Qua", entries: 156 },
  { day: "Qui", entries: 134 }, { day: "Sex", entries: 168 }, { day: "Sáb", entries: 95 }, { day: "Dom", entries: 42 },
];

const plansData = [
  { name: "Hipertrofia", members: 145, color: "hsl(258, 82%, 60%)" },
  { name: "Emagrecimento", members: 122, color: "hsl(152, 60%, 50%)" },
  { name: "Performance", members: 89, color: "hsl(210, 90%, 60%)" },
  { name: "Reabilitação", members: 67, color: "hsl(38, 92%, 60%)" },
  { name: "Outro", members: 64, color: "hsl(225, 15%, 55%)" },
];

const recentMembers = [
  { name: "Maria Oliveira", plan: "Hipertrofia", date: "Hoje", status: "active" },
  { name: "Pedro Santos", plan: "Emagrecimento", date: "Ontem", status: "active" },
  { name: "Ana Costa", plan: "Performance", date: "2 dias", status: "pending" },
  { name: "Lucas Ferreira", plan: "Hipertrofia", date: "3 dias", status: "active" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                {stat.change}
                <ArrowUpRight className={`w-3 h-3 ${stat.trend === "down" ? "rotate-90" : ""}`} />
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Receita</h3>
            <span className="text-xs text-muted-foreground">Últimos 8 meses</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(258, 82%, 60%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(258, 82%, 60%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 20%, 16%)" />
                <XAxis dataKey="month" stroke="hsl(225, 15%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(225, 15%, 55%)" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(225, 25%, 9%)", border: "1px solid hsl(225, 20%, 16%)", borderRadius: "12px", color: "hsl(220, 20%, 95%)" }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Receita"]}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(258, 82%, 60%)" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Access Chart */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Acessos na Catraca</h3>
            <span className="text-xs text-muted-foreground">Esta semana</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 20%, 16%)" />
                <XAxis dataKey="day" stroke="hsl(225, 15%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(225, 15%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(225, 25%, 9%)", border: "1px solid hsl(225, 20%, 16%)", borderRadius: "12px", color: "hsl(220, 20%, 95%)" }}
                />
                <Bar dataKey="entries" fill="hsl(258, 82%, 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Plans Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Alunos por Plano</h3>
          <div className="space-y-3">
            {plansData.map((plan) => (
              <div key={plan.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{plan.name}</span>
                  <span className="text-muted-foreground">{plan.members}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(plan.members / 145) * 100}%`, backgroundColor: plan.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Members */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Novos Alunos</h3>
          <div className="space-y-3">
            {recentMembers.map((member) => (
              <div key={member.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.plan}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${member.status === "active" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                    {member.status === "active" ? "Ativo" : "Pendente"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">{member.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
