import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Copy, Star } from "lucide-react";
import { toast } from "sonner";
import { formatBRL, slugify } from "@/lib/whatsapp";

export const Route = createFileRoute("/_authenticated/admin/produtos/")({
  component: ProdutosListPage,
});

function ProdutosListPage() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, categories(nome)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produto excluído");
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
  };

  const handleDuplicate = async (p: any) => {
    const newCode = `${p.codigo}-${Math.random().toString(36).slice(2, 6)}`;
    const newSlug = slugify(`${p.nome} ${newCode}`);
    const { error } = await supabase.from("products").insert({
      nome: `${p.nome} (cópia)`,
      slug: newSlug,
      codigo: newCode,
      descricao_curta: p.descricao_curta,
      descricao_completa: p.descricao_completa,
      category_id: p.category_id,
      preco: p.preco,
      destaque: false,
      prazo_producao: p.prazo_producao,
      ativo: false,
    });
    if (error) return toast.error(error.message);
    toast.success("Produto duplicado");
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl">Produtos</h1>
          <p className="text-muted-foreground text-sm">Gerencie sua coleção</p>
        </div>
        <Button asChild className="rounded-full"><Link to="/admin/produtos/novo"><Plus className="h-4 w-4 mr-2" /> Novo produto</Link></Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p: any) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {p.destaque && <Star className="h-3.5 w-3.5 fill-accent text-accent" />}
                    <span className="font-medium">{p.nome}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.codigo}</td>
                <td className="px-4 py-3">{p.categories?.nome ?? "—"}</td>
                <td className="px-4 py-3">{p.preco != null ? formatBRL(p.preco) : <span className="italic text-muted-foreground">consulta</span>}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.ativo ? "bg-sage/20" : "bg-muted text-muted-foreground"}`}>
                    {p.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button asChild size="icon" variant="ghost"><Link to="/admin/produtos/$id" params={{ id: p.id }}><Edit className="h-4 w-4" /></Link></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDuplicate(p)}><Copy className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum produto. Cadastre o primeiro!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
