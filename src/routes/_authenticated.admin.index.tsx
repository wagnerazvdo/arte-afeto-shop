import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Tags, Star, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [products, categories, destaques, recents] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("destaque", true),
        supabase.from("products").select("id, nome, codigo, created_at, ativo").order("created_at", { ascending: false }).limit(5),
      ]);
      return {
        produtos: products.count ?? 0,
        categorias: categories.count ?? 0,
        destaques: destaques.count ?? 0,
        recents: recents.data ?? [],
      };
    },
  });

  return (
    <div className="p-8 lg:p-10">
      <h1 className="font-display text-4xl">Olá!</h1>
      <p className="mt-1 text-muted-foreground">Visão geral do ateliê.</p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card icon={Package} label="Produtos" value={stats?.produtos ?? "—"} />
        <Card icon={Tags} label="Categorias" value={stats?.categorias ?? "—"} />
        <Card icon={Star} label="Em destaque" value={stats?.destaques ?? "—"} />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> Últimos produtos</h2>
          <Link to="/admin/produtos" className="text-sm text-primary">Ver todos →</Link>
        </div>
        <div className="divide-y divide-border">
          {(stats?.recents ?? []).map((p: any) => (
            <div key={p.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{p.nome}</p>
                <p className="text-xs text-muted-foreground">Cód. {p.codigo}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${p.ativo ? "bg-sage/20 text-foreground" : "bg-muted text-muted-foreground"}`}>
                {p.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
          ))}
          {(stats?.recents ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">Nenhum produto cadastrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <Icon className="h-5 w-5 text-accent" />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-4xl">{value}</p>
    </div>
  );
}
