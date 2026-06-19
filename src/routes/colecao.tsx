import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Input } from "@/components/ui/input";
import { fetchActiveCategories, fetchProductsWithCover } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/colecao")({
  head: () => ({
    meta: [
      { title: "Coleção — Ateliê Arte e Afeto" },
      {
        name: "description",
        content:
          "Toda a coleção de peças artesanais Arte e Afeto: vasos, cerâmicas, decoração e personalizados.",
      },
      { property: "og:title", content: "Coleção — Ateliê Arte e Afeto" },
      { property: "og:description", content: "Explore peças únicas feitas à mão." },
      { property: "og:url", content: "/colecao" },
    ],
    links: [{ rel: "canonical", href: "/colecao" }],
  }),
  component: ColecaoPage,
});

function ColecaoPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const { data: products = [] } = useQuery({
    queryKey: ["products", "all"],
    queryFn: fetchProductsWithCover,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "active"],
    queryFn: fetchActiveCategories,
  });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat && p.categories?.slug !== cat) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.nome.toLowerCase().includes(q) ||
          p.codigo.toLowerCase().includes(q) ||
          (p.descricao_curta ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, cat, search]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="container-wide py-12 lg:py-16">
        <span className="text-xs tracking-[0.3em] uppercase text-accent">Catálogo</span>
        <h1 className="mt-2 font-display text-5xl">Nossa coleção</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Cada peça é feita à mão, em pequenas quantidades, com escolha cuidadosa de cada detalhe.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, código..."
              className="pl-9 rounded-full bg-card"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCat(null)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                cat === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-accent"
              }`}
            >
              Todas
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.slug)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  cat === c.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-accent"
                }`}
              >
                {c.nome}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              nome={p.nome}
              descricao_curta={p.descricao_curta}
              preco={p.preco}
              categoria={p.categories?.nome}
              imagens={p.product_images}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Nenhuma peça encontrada.</p>
            <Link
              to="/colecao"
              className="text-primary text-sm mt-2 inline-block"
              onClick={() => {
                setSearch("");
                setCat(null);
              }}
            >
              Limpar filtros
            </Link>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
