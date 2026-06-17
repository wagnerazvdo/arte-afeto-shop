import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchSiteSettings } from "@/lib/queries";
import { Heart } from "lucide-react";
import logo from "@/assets/logo.asset.json";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Ateliê Arte e Afeto" },
      { name: "description", content: "Nossa história, valores e o propósito por trás de cada peça artesanal Arte e Afeto." },
      { property: "og:title", content: "Sobre — Ateliê Arte e Afeto" },
      { property: "og:description", content: "Cada peça, uma história. Cada criação, um afeto." },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: SobrePage,
});

function SobrePage() {
  const { data: settings } = useQuery({ queryKey: ["site_settings"], queryFn: fetchSiteSettings });
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="container-wide py-16 lg:py-24 max-w-3xl">
        <span className="text-xs tracking-[0.3em] uppercase text-accent">Nossa história</span>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Arte e Afeto</h1>
        <div className="mt-10 flex justify-center">
          <img src={logo.url} alt="Logo" className="h-44 w-44 rounded-full object-cover border border-accent/30" />
        </div>
        <p className="mt-10 text-lg leading-relaxed text-foreground/85">
          {settings?.texto_institucional}
        </p>
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {["Produção artesanal", "Peças exclusivas", "Feito com amor", "Inspirado pela fé", "Transformando matéria em memória", "Acolhimento em cada detalhe"].map((t) => (
            <div key={t} className="rounded-2xl border border-border/60 bg-card p-5 flex items-start gap-3">
              <Heart className="h-4 w-4 mt-1 fill-accent text-accent" />
              <p className="font-display text-lg">{t}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
