import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Heart, Leaf, Sparkles, HandHeart } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  fetchActiveCategories,
  fetchProductsWithCover,
  fetchSiteSettings,
} from "@/lib/queries";
import logo from "@/assets/logo.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ateliê Arte e Afeto — Peças artesanais com propósito" },
      { name: "description", content: "Cerâmicas, vasos e peças decorativas feitas à mão com amor, propósito e significado." },
      { property: "og:title", content: "Ateliê Arte e Afeto" },
      { property: "og:description", content: "Peças artesanais feitas à mão com amor, propósito e significado." },
      { property: "og:image", content: logo.url },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: settings } = useQuery({ queryKey: ["site_settings"], queryFn: fetchSiteSettings });
  const { data: categories = [] } = useQuery({ queryKey: ["categories", "active"], queryFn: fetchActiveCategories });
  const { data: products = [] } = useQuery({ queryKey: ["products", "all"], queryFn: fetchProductsWithCover });

  const destaques = products.filter((p) => p.destaque).slice(0, 8);
  const recentes = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/60 via-background to-background" />
        <div className="container-wide grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-accent">
              <Heart className="h-3 w-3 fill-accent" /> Ateliê artesanal
            </span>
            <h1 className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance text-foreground">
              Arte e Afeto
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg text-pretty leading-relaxed">
              Peças feitas à mão com amor, propósito e significado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-8 h-12">
                <Link to="/colecao">Conhecer coleção <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 border-accent/40">
                <Link to="/sobre">Nossa história</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs tracking-widest uppercase text-muted-foreground">
              <span className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-accent" /> Exclusivo</span>
              <span className="flex items-center gap-2"><Leaf className="h-3.5 w-3.5 text-accent" /> Artesanal</span>
              <span className="flex items-center gap-2"><HandHeart className="h-3.5 w-3.5 text-accent" /> Feito com fé</span>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="absolute -inset-6 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative aspect-square rounded-full overflow-hidden bg-secondary/50 border border-accent/30 shadow-[0_30px_80px_-30px_oklch(0.52_0.105_45_/_0.4)]">
              <img src={logo.url} alt="Ateliê Arte e Afeto" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="container-wide py-20 grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-2">
          <span className="text-xs tracking-[0.3em] uppercase text-accent">Sobre a marca</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-foreground">
            Mais do que objetos. <span className="italic text-primary">Memórias.</span>
          </h2>
        </div>
        <div className="lg:col-span-3">
          <p className="text-lg leading-relaxed text-foreground/80">
            {settings?.texto_institucional ??
              "Mais do que objetos decorativos, cada criação é desenvolvida com intenção, cuidado e significado, transformando a arte em uma forma de expressar sentimentos, memórias e afeto."}
          </p>
          <ul className="mt-8 grid sm:grid-cols-2 gap-4">
            {[
              ["Produção artesanal", "Cada peça é única, modelada à mão."],
              ["Peças exclusivas", "Edições limitadas, pensadas com carinho."],
              ["Feito com amor", "Intenção em cada detalhe."],
              ["Inspirado pela fé", "Propósito e gratidão em cada criação."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-border/60 bg-card p-5">
                <p className="font-display text-lg text-primary">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CATEGORIAS */}
      {categories.length > 0 && (
        <section className="container-wide py-12">
          <div className="ornamental-divider mb-10">
            <span className="font-display text-xs tracking-[0.4em] uppercase">Categorias</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/categoria/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border border-border/60 bg-card p-5 text-center transition hover:bg-secondary/60 hover:border-accent/50"
              >
                <p className="font-display text-lg text-foreground group-hover:text-primary transition">{c.nome}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* DESTAQUES */}
      {destaques.length > 0 && (
        <section className="container-wide py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-accent">Selecionadas</span>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">Peças em destaque</h2>
            </div>
            <Link to="/colecao" className="hidden md:inline-flex items-center text-sm text-primary hover:opacity-80">
              Ver toda a coleção <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destaques.map((p) => (
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
        </section>
      )}

      {/* RECENTES */}
      {recentes.length > 0 && (
        <section className="container-wide py-12">
          <h2 className="font-display text-3xl mb-6">Recém chegadas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentes.map((p) => (
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
        </section>
      )}

      {/* FEITO COM AFETO */}
      <section className="container-wide py-20">
        <div className="rounded-3xl bg-gradient-to-br from-accent/25 via-secondary/50 to-background border border-accent/30 p-10 md:p-16 text-center">
          <Heart className="mx-auto h-7 w-7 fill-accent text-accent" />
          <p className="mt-5 font-display text-3xl md:text-4xl text-balance leading-snug text-foreground max-w-3xl mx-auto">
            "Cada peça da Arte e Afeto carrega uma história, um propósito e o cuidado de quem acredita que o amor transforma tudo o que toca."
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
