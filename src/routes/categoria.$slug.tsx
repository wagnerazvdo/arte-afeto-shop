import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { fetchActiveProducts } from "@/lib/queries";

export const Route = createFileRoute("/categoria/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", params.slug)
      .eq("ativa", true)
      .maybeSingle();
    if (!data) throw notFound();
    return { category: data as { id: string; nome: string; slug: string } };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category.nome ?? "Categoria"} — Arte e Afeto` },
      { name: "description", content: `Peças da categoria ${loaderData?.category.nome ?? ""} do Ateliê Arte e Afeto.` },
      { property: "og:title", content: `${loaderData?.category.nome} — Arte e Afeto` },
      { property: "og:url", content: `/categoria/${loaderData?.category.slug}` },
    ],
    links: [{ rel: "canonical", href: `/categoria/${loaderData?.category.slug}` }],
  }),
  errorComponent: ErrorView,
  notFoundComponent: NotFoundView,
  component: CategoriaPage,
});

function ErrorView() {
  return <div className="container-wide py-20">Erro ao carregar categoria.</div>;
}
function NotFoundView() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="container-wide py-24 text-center">
        <h1 className="font-display text-4xl">Categoria não encontrada</h1>
      </div>
      <SiteFooter />
    </div>
  );
}

function CategoriaPage() {
  const { category } = Route.useLoaderData();
  const { data: products = [] } = useQuery({
    queryKey: ["products", "category", category.slug],
    queryFn: () => fetchActiveProducts({ categorySlug: category.slug }),
  });

  // need images for cards
  const { data: withImages = [] } = useQuery({
    queryKey: ["products", "category-images", category.slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, product_images(url, principal, ordem)")
        .eq("ativo", true)
        .eq("category_id", category.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const list = withImages.length ? withImages : products;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="container-wide py-12 lg:py-16">
        <span className="text-xs tracking-[0.3em] uppercase text-accent">Categoria</span>
        <h1 className="mt-2 font-display text-5xl">{category.nome}</h1>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((p: any) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              nome={p.nome}
              descricao_curta={p.descricao_curta}
              preco={p.preco}
              categoria={category.nome}
              imagens={p.product_images}
            />
          ))}
        </div>
        {list.length === 0 && (
          <p className="text-center py-20 text-muted-foreground">Em breve, novas peças nesta categoria.</p>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
