import { ShoppingBag, Shirt, Dumbbell, Pill, Crown, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Suplementos",
    description: "Whey, creatina, pré-treino e mais",
    icon: Pill,
    color: "from-green-500/20 to-green-600/5",
    iconColor: "text-green-400",
    items: 24,
  },
  {
    title: "Roupas Fitness",
    description: "Camisetas, shorts, leggings",
    icon: Shirt,
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
    items: 18,
  },
  {
    title: "Acessórios",
    description: "Luvas, cintos, straps, shakers",
    icon: Dumbbell,
    color: "from-orange-500/20 to-orange-600/5",
    iconColor: "text-orange-400",
    items: 32,
  },
  {
    title: "Upgrade de Plano",
    description: "Desbloqueie recursos premium",
    icon: Crown,
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    items: 4,
  },
  {
    title: "Produtos Digitais",
    description: "E-books, planilhas, guias",
    icon: Sparkles,
    color: "from-pink-500/20 to-pink-600/5",
    iconColor: "text-pink-400",
    items: 12,
  },
];

const featuredProducts = [
  { name: "Whey Protein 1kg", price: "R$ 149,90", badge: "Mais vendido" },
  { name: "Camiseta Dry-Fit", price: "R$ 79,90", badge: "Novo" },
  { name: "Luvas Pro Grip", price: "R$ 59,90", badge: null },
  { name: "Plano Premium", price: "R$ 199/mês", badge: "Upgrade" },
];

export default function StudentStore() {
  return (
    <div className="px-4 pt-6 pb-8 space-y-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Loja da Academia</h1>
        </div>
        <p className="text-sm text-muted-foreground">Suplementos, roupas, acessórios e mais</p>
      </div>

      {/* Featured */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Destaques</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {featuredProducts.map((p) => (
            <div
              key={p.name}
              className="min-w-[150px] rounded-2xl p-4 space-y-3 flex-shrink-0"
              style={{
                background: "linear-gradient(145deg, hsl(225 25% 12%), hsl(225 25% 8%))",
                border: "1px solid hsl(225 20% 16%)",
              }}
            >
              <div className="w-full h-20 rounded-xl bg-secondary/50 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
              </div>
              {p.badge && (
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                  {p.badge}
                </span>
              )}
              <div>
                <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                <p className="text-sm font-bold text-primary">{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categorias</h2>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.title}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200",
                "hover:scale-[1.01] active:scale-[0.99]"
              )}
              style={{
                background: "linear-gradient(145deg, hsl(225 25% 11%), hsl(225 25% 8%))",
                border: "1px solid hsl(225 20% 16%)",
              }}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br", cat.color)}>
                <cat.icon className={cn("w-5 h-5", cat.iconColor)} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{cat.title}</p>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-xs">{cat.items}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
