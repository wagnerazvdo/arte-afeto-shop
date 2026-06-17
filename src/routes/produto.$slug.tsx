import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, Share2, MessageCircle, Hourglass, Tag } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import {
  fetchProductBySlug,
  fetchRelatedProducts,
  fetchSiteSettings,
} from "@/lib/queries";
import {
  buildWhatsAppUrl,
  formatBRL,
  mensagemComprar,
  mensagemConsultar,
} from "@/lib/whatsapp";
import { toast } from "sonner";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return {};
    const cover = (p.product_images ?? []).sort((a, b) => Number(b.principal) - Number(a.principal) || a.ordem - b.ordem)[0]?.url;
    const description = p.descricao_curta ?? "Peça artesanal exclusiva do Ateliê Arte e Afeto.";
    return {
      meta: [
        { title: `${p.nome} — Arte e Afeto` },
        { name: "description", content: description },
        { property: "og:title", content: p.nome },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/produto/${p.slug}` },
        ...(cover && /^https?:\/\/|^\//.test(cover) ? [{ property: "og:image", content: cover }] : []),
      ],
      links: [{ rel: "canonical", href: `/produto/${p.slug}` }],
    };
  },
  errorComponent: () => <div className="container-wide py-20">Erro ao carregar produto.</div>,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="container-wide py-24 text-center">
        <h1 className="font-display text-4xl">Peça não encontrada</h1>
        <Link to="/colecao" className="mt-4 inline-block text-primary">Ver coleção</Link>
      </div>
      <SiteFooter />
    </div>
  ),
  component: ProdutoPage,
});

function ProdutoPage() {
  const { product } = Route.useLoaderData();
  const { data: settings } = useQuery({ queryKey: ["site_settings"], queryFn: fetchSiteSettings });
  const { data: related = [] } = useQuery({
    queryKey: ["products", "related", product.id, product.category_id],
    queryFn: () => fetchRelatedProducts(product.category_id, product.id),
  });

  const images = [...(product.product_images ?? [])].sort(
    (a, b) => Number(b.principal) - Number(a.principal) || a.ordem - b.ordem,
  );
  const [active, setActive] = useState(0);
  const main = images[active]?.url;

  const productUrl = typeof window !== "undefined" ? window.location.href : `/produto/${product.slug}`;
  const whatsapp = settings?.whatsapp ?? "";

  const handleWhats = () => {
    if (!whatsapp) {
      toast.error("WhatsApp ainda não foi configurado.");
      return;
    }
    const msg = product.preco != null
      ? mensagemComprar({
          nome: product.nome,
          codigo: product.codigo,
          preco: product.preco,
          categoria: product.categories?.nome ?? null,
        }, productUrl)
      : mensagemConsultar({
          nome: product.nome,
          codigo: product.codigo,
          categoria: product.categories?.nome ?? null,
        }, productUrl);
    window.open(buildWhatsAppUrl(whatsapp, msg), "_blank");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.nome, url: productUrl });
      } else {
        await navigator.clipboard.writeText(productUrl);
        toast.success("Link copiado!");
      }
    } catch { /* cancelled */ }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <article className="container-wide py-10 lg:py-14">
        <nav className="text-xs tracking-widest uppercase text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Início</Link> · <Link to="/colecao" className="hover:text-primary">Coleção</Link>
          {product.categories && (
            <> · <Link to="/categoria/$slug" params={{ slug: product.categories.slug }} className="hover:text-primary">{product.categories.nome}</Link></>
          )}
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-secondary/40 border border-border/60">
              <ProductImage src={main} alt={product.nome} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActive(i)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 transition ${
                      i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <ProductImage src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.categories && (
              <span className="text-xs tracking-[0.3em] uppercase text-accent">{product.categories.nome}</span>
            )}
            <h1 className="mt-2 font-display text-4xl md:text-5xl leading-tight text-balance">{product.nome}</h1>
            {product.descricao_curta && (
              <p className="mt-4 text-lg text-muted-foreground">{product.descricao_curta}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Tag className="h-4 w-4" /> Cód. {product.codigo}</span>
              {product.prazo_producao && (
                <span className="inline-flex items-center gap-1.5"><Hourglass className="h-4 w-4" /> {product.prazo_producao}</span>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
              {product.preco != null ? (
                <>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">Investimento</p>
                  <p className="mt-1 font-display text-4xl text-primary">{formatBRL(product.preco)}</p>
                </>
              ) : (
                <>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">Valor sob consulta</p>
                  <p className="mt-1 font-display text-3xl text-foreground">A combinar</p>
                </>
              )}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Button onClick={handleWhats} size="lg" className="rounded-full px-7 h-12 flex-1">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {product.preco != null ? "Comprar agora" : "Consultar valor"}
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-5 h-12 border-accent/40" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {product.descricao_completa && (
              <div className="mt-8 prose prose-sm max-w-none text-foreground/85 leading-relaxed whitespace-pre-line">
                {product.descricao_completa}
              </div>
            )}
          </div>
        </div>

        {/* Feito com Afeto */}
        <section className="mt-20 rounded-3xl bg-gradient-to-br from-accent/20 via-secondary/40 to-background border border-accent/30 p-10 md:p-14 text-center">
          <Heart className="mx-auto h-6 w-6 fill-accent text-accent" />
          <p className="mt-3 text-xs tracking-[0.4em] uppercase text-accent">Feito com Afeto</p>
          <p className="mt-4 font-display text-2xl md:text-3xl text-balance max-w-3xl mx-auto leading-snug">
            "Cada peça da Arte e Afeto carrega uma história, um propósito e o cuidado de quem acredita que o amor transforma tudo o que toca."
          </p>
        </section>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl mb-6">Você também pode gostar</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  nome={p.nome}
                  descricao_curta={p.descricao_curta}
                  preco={p.preco}
                  categoria={product.categories?.nome}
                  imagens={p.product_images}
                />
              ))}
            </div>
          </section>
        )}
      </article>
      <SiteFooter />
    </div>
  );
}
