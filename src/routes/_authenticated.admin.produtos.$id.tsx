import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/whatsapp";
import { ProductImage } from "@/components/ProductImage";

export const Route = createFileRoute("/_authenticated/admin/produtos/$id")({
  component: ProdutoEdit,
});

function ProdutoEdit() {
  const { id } = useParams({ from: "/_authenticated/admin/produtos/$id" });
  const isNew = id === "novo";
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    nome: "", slug: "", codigo: "", descricao_curta: "", descricao_completa: "",
    category_id: "", preco: "", destaque: false, prazo_producao: "", ativo: true,
  });
  const [productId, setProductId] = useState<string | null>(isNew ? null : id);
  const [loading, setLoading] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("ordem")).data ?? [],
  });

  const { data: product } = useQuery({
    queryKey: ["admin", "product", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      return data;
    },
    enabled: !isNew,
  });

  const { data: images = [], refetch: refetchImages } = useQuery({
    queryKey: ["admin", "product-images", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data } = await supabase.from("product_images").select("*").eq("product_id", productId).order("ordem");
      return data ?? [];
    },
    enabled: !!productId,
  });

  useEffect(() => {
    if (product) {
      setForm({
        nome: product.nome,
        slug: product.slug,
        codigo: product.codigo,
        descricao_curta: product.descricao_curta ?? "",
        descricao_completa: product.descricao_completa ?? "",
        category_id: product.category_id ?? "",
        preco: product.preco != null ? String(product.preco) : "",
        destaque: product.destaque,
        prazo_producao: product.prazo_producao ?? "",
        ativo: product.ativo,
      });
    }
  }, [product]);

  const save = async () => {
    setLoading(true);
    try {
      const payload: any = {
        nome: form.nome,
        slug: form.slug || slugify(form.nome),
        codigo: form.codigo,
        descricao_curta: form.descricao_curta || null,
        descricao_completa: form.descricao_completa || null,
        category_id: form.category_id || null,
        preco: form.preco ? Number(form.preco) : null,
        destaque: form.destaque,
        prazo_producao: form.prazo_producao || null,
        ativo: form.ativo,
      };
      if (isNew) {
        const { data, error } = await supabase.from("products").insert(payload).select().single();
        if (error) throw error;
        setProductId(data.id);
        toast.success("Produto criado! Adicione imagens.");
        navigate({ to: "/admin/produtos/$id", params: { id: data.id } });
      } else {
        const { error } = await supabase.from("products").update(payload).eq("id", id);
        if (error) throw error;
        toast.success("Salvo!");
      }
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!productId) return toast.error("Salve o produto primeiro");
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${productId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("products").upload(path, file);
      if (upErr) { toast.error(upErr.message); continue; }
      await supabase.from("product_images").insert({
        product_id: productId,
        url: `products/${path}`,
        ordem: images.length,
        principal: images.length === 0,
      });
    }
    refetchImages();
    e.target.value = "";
  };

  const removeImg = async (imgId: string, url: string) => {
    await supabase.from("product_images").delete().eq("id", imgId);
    const path = url.replace(/^products\//, "");
    await supabase.storage.from("products").remove([path]);
    refetchImages();
  };

  const setPrincipal = async (imgId: string) => {
    if (!productId) return;
    await supabase.from("product_images").update({ principal: false }).eq("product_id", productId);
    await supabase.from("product_images").update({ principal: true }).eq("id", imgId);
    refetchImages();
  };

  return (
    <div className="p-8 lg:p-10 max-w-4xl">
      <Link to="/admin/produtos" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Link>
      <h1 className="font-display text-4xl mt-3">{isNew ? "Novo produto" : "Editar produto"}</h1>

      <div className="mt-8 grid gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome *">
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value, slug: form.slug || slugify(e.target.value) })} />
          </Field>
          <Field label="Slug">
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
          </Field>
          <Field label="Código *">
            <Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
          </Field>
          <Field label="Categoria">
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="h-10 w-full rounded-md border border-input bg-card px-3">
              <option value="">—</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Field>
          <Field label="Preço (R$) — deixe vazio para 'consultar'">
            <Input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} />
          </Field>
          <Field label="Prazo de produção">
            <Input value={form.prazo_producao} onChange={(e) => setForm({ ...form, prazo_producao: e.target.value })} placeholder="ex.: 7 a 10 dias" />
          </Field>
        </div>
        <Field label="Descrição curta">
          <Textarea rows={2} value={form.descricao_curta} onChange={(e) => setForm({ ...form, descricao_curta: e.target.value })} />
        </Field>
        <Field label="Descrição completa">
          <Textarea rows={6} value={form.descricao_completa} onChange={(e) => setForm({ ...form, descricao_completa: e.target.value })} />
        </Field>
        <div className="flex gap-6">
          <label className="flex items-center gap-2"><Switch checked={form.destaque} onCheckedChange={(v) => setForm({ ...form, destaque: v })} /> Destaque</label>
          <label className="flex items-center gap-2"><Switch checked={form.ativo} onCheckedChange={(v) => setForm({ ...form, ativo: v })} /> Ativo</label>
        </div>

        {!isNew && (
          <div>
            <Label className="mb-2 block">Imagens</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img: any) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                  <ProductImage src={img.url} alt="" className="h-full w-full object-cover" />
                  {img.principal && <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">Principal</span>}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                    {!img.principal && (
                      <Button size="icon" variant="secondary" onClick={() => setPrincipal(img.id)}><Star className="h-4 w-4" /></Button>
                    )}
                    <Button size="icon" variant="destructive" onClick={() => removeImg(img.id, img.url)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-secondary/40">
                <Upload className="h-5 w-5" />
                <span className="text-xs mt-1">Enviar</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button onClick={save} disabled={loading} className="rounded-full px-8">{loading ? "Salvando..." : "Salvar"}</Button>
          <Button variant="outline" asChild className="rounded-full"><Link to="/admin/produtos">Cancelar</Link></Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}
