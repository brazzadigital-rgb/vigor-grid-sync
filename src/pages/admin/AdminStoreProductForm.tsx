import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminProductById, useAdminProductMutations } from "@/hooks/use-admin-store";
import { useAdminCategories } from "@/hooks/use-admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminStoreProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: existingProduct } = useAdminProductById(id);
  const { data: categories } = useAdminCategories();
  const { upsert } = useAdminProductMutations();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: "",
    short_description: "",
    description: "",
    price_cents: 0,
    compare_at_price_cents: null as number | null,
    stock_quantity: 0,
    sku: "",
    is_featured: false,
    is_active: true,
    tags: "",
    images: "",
    benefits: "",
    ingredients_or_materials: "",
    usage_instructions: "",
  });

  useEffect(() => {
    if (existingProduct) {
      setForm({
        name: existingProduct.name,
        slug: existingProduct.slug,
        category_id: existingProduct.category_id ?? "",
        short_description: existingProduct.short_description ?? "",
        description: existingProduct.description ?? "",
        price_cents: existingProduct.price_cents,
        compare_at_price_cents: existingProduct.compare_at_price_cents,
        stock_quantity: existingProduct.stock_quantity,
        sku: existingProduct.sku ?? "",
        is_featured: existingProduct.is_featured,
        is_active: existingProduct.is_active,
        tags: (existingProduct.tags ?? []).join(", "),
        images: ((existingProduct.images as string[]) ?? []).join("\n"),
        benefits: ((existingProduct.benefits as string[]) ?? []).join("\n"),
        ingredients_or_materials: ((existingProduct.ingredients_or_materials as string[]) ?? []).join("\n"),
        usage_instructions: existingProduct.usage_instructions ?? "",
      });
    }
  }, [existingProduct]);

  const handleSave = () => {
    if (!form.name) { toast.error("Nome obrigatório"); return; }
    const payload = {
      ...(isEdit ? { id } : {}),
      name: form.name,
      slug: form.slug || slugify(form.name),
      category_id: form.category_id || null,
      short_description: form.short_description || null,
      description: form.description || null,
      price_cents: form.price_cents,
      compare_at_price_cents: form.compare_at_price_cents || null,
      stock_quantity: form.stock_quantity,
      sku: form.sku || null,
      is_featured: form.is_featured,
      is_active: form.is_active,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      images: form.images ? form.images.split("\n").map((u) => u.trim()).filter(Boolean) : [],
      benefits: form.benefits ? form.benefits.split("\n").map((b) => b.trim()).filter(Boolean) : [],
      ingredients_or_materials: form.ingredients_or_materials ? form.ingredients_or_materials.split("\n").map((i) => i.trim()).filter(Boolean) : [],
      usage_instructions: form.usage_instructions || null,
    };
    upsert.mutate(payload as any, {
      onSuccess: () => { toast.success("Salvo!"); navigate("/admin/store/products"); },
    });
  };

  const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/admin/store/products")} className="p-2 rounded-xl bg-secondary/60 border border-border">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-lg font-bold text-foreground">{isEdit ? "Editar" : "Novo"} Produto</h2>
      </div>

      <div className="space-y-4 p-5 rounded-2xl bg-card border border-border">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Nome *</Label><Input value={form.name} onChange={(e) => { set("name", e.target.value); if (!isEdit) set("slug", slugify(e.target.value)); }} /></div>
          <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} /></div>
        </div>

        <div>
          <Label>Categoria</Label>
          <Select value={form.category_id} onValueChange={(v) => set("category_id", v)}>
            <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
            <SelectContent>
              {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div><Label>Descrição curta</Label><Input value={form.short_description} onChange={(e) => set("short_description", e.target.value)} /></div>
        <div><Label>Descrição completa</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} /></div>

        <div className="grid grid-cols-3 gap-4">
          <div><Label>Preço (centavos) *</Label><Input type="number" value={form.price_cents} onChange={(e) => set("price_cents", parseInt(e.target.value) || 0)} /></div>
          <div><Label>Preço "de" (centavos)</Label><Input type="number" value={form.compare_at_price_cents ?? ""} onChange={(e) => set("compare_at_price_cents", parseInt(e.target.value) || null)} /></div>
          <div><Label>Estoque</Label><Input type="number" value={form.stock_quantity} onChange={(e) => set("stock_quantity", parseInt(e.target.value) || 0)} /></div>
        </div>

        <div><Label>SKU</Label><Input value={form.sku} onChange={(e) => set("sku", e.target.value)} /></div>
        <div><Label>Tags (separadas por vírgula)</Label><Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="whey, proteina, isolado" /></div>
        <div><Label>Imagens (URLs, uma por linha)</Label><Textarea value={form.images} onChange={(e) => set("images", e.target.value)} rows={3} placeholder="https://..." /></div>
        <div><Label>Benefícios (um por linha)</Label><Textarea value={form.benefits} onChange={(e) => set("benefits", e.target.value)} rows={3} /></div>
        <div><Label>Ingredientes/Material (um por linha)</Label><Textarea value={form.ingredients_or_materials} onChange={(e) => set("ingredients_or_materials", e.target.value)} rows={3} /></div>
        <div><Label>Instruções de uso</Label><Textarea value={form.usage_instructions} onChange={(e) => set("usage_instructions", e.target.value)} rows={3} /></div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(c) => set("is_featured", c)} /><Label>Destaque</Label></div>
          <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(c) => set("is_active", c)} /><Label>Ativo</Label></div>
        </div>

        <Button className="w-full" size="lg" onClick={handleSave} disabled={upsert.isPending}>
          {isEdit ? "Atualizar produto" : "Criar produto"}
        </Button>
      </div>
    </div>
  );
}
