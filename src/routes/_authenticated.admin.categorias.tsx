import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/whatsapp";

export const Route = createFileRoute("/_authenticated/admin/categorias")({
  component: CategoriasPage,
});

function CategoriasPage() {
  const qc = useQueryClient();
  const { data: categories = [], refetch } = useQuery({
    queryKey: ["admin", "categories", "all"],
    queryFn: async () => (await supabase.from("categories").select("*").order("ordem")).data ?? [],
  });
  const [novo, setNovo] = useState({ nome: "", ordem: 0 });

  const add = async () => {
    if (!novo.nome.trim()) return;
    const { error } = await supabase.from("categories").insert({
      nome: novo.nome,
      slug: slugify(novo.nome),
      ordem: Number(novo.ordem) || (categories.length + 1),
      ativa: true,
    });
    if (error) return toast.error(error.message);
    setNovo({ nome: "", ordem: 0 });
    toast.success("Categoria adicionada");
    refetch();
  };

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("categories").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Categoria atualizada");
    refetch();
    qc.invalidateQueries({ queryKey: ["categories", "active"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir categoria?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Categoria excluída");
    refetch();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-3xl">
      <h1 className="font-display text-4xl">Categorias</h1>
      <p className="text-muted-foreground text-sm">Gerencie as categorias do menu</p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Nova categoria</label>
          <Input value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} placeholder="Nome" />
        </div>
        <div className="w-24">
          <label className="text-xs text-muted-foreground">Ordem</label>
          <Input type="number" value={novo.ordem} onChange={(e) => setNovo({ ...novo, ordem: Number(e.target.value) })} />
        </div>
        <Button onClick={add} className="rounded-full"><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
      </div>

      <div className="mt-6 space-y-2">
        {categories.map((c: any) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <Input className="max-w-xs" defaultValue={c.nome} onBlur={(e) => e.target.value !== c.nome && update(c.id, { nome: e.target.value, slug: slugify(e.target.value) })} />
            <span className="text-xs text-muted-foreground flex-1">/{c.slug}</span>
            <Input type="number" className="w-20" defaultValue={c.ordem} onBlur={(e) => Number(e.target.value) !== c.ordem && update(c.id, { ordem: Number(e.target.value) })} />
            <Switch checked={c.ativa} onCheckedChange={(v) => update(c.id, { ativa: v })} />
            <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
