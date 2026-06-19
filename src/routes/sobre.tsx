import logo from "@/assets/logo.asset.json";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchSiteSettings } from "@/lib/queries";
import { resolveImageUrl } from "@/lib/storage-url";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Ateliê Arte e Afeto" },
      {
        name: "description",
        content:
          "Nossa história, valores e o propósito por trás de cada peça artesanal Arte e Afeto.",
      },
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
  const [resolvedLogoUrl, setResolvedLogoUrl] = useState(logo.url);

  useEffect(() => {
    let active = true;
    const logoUrl = settings?.logo_url || logo.url;
    resolveImageUrl(logoUrl).then((url) => {
      if (active) setResolvedLogoUrl(url);
    });
    return () => {
      active = false;
    };
  }, [settings?.logo_url]);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="container-wide py-16 lg:py-24 max-w-3xl">
        <span className="text-xs tracking-[0.3em] uppercase text-accent">Nossa história</span>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Arte e Afeto</h1>
        <div className="mt-10 flex justify-center">
          <img
            src={resolvedLogoUrl}
            alt="Logo"
            className="h-44 w-44 rounded-full object-cover border border-accent/30"
          />
        </div>
        <p className="mt-10 text-lg leading-relaxed text-foreground/85 whitespace-pre-line">
          {settings?.texto_institucional && settings.texto_institucional.length > 300
            ? settings.texto_institucional
            : "O Ateliê Arte e Afeto nasceu da união entre a delicadeza do artesanal e o valor das histórias que cada peça pode carregar.\nMais do que objetos decorativos, cada criação é desenvolvida com intenção, cuidado e significado, transformando a arte em uma forma de expressar sentimentos, memórias e afeto.\nInspirada no processo da cerâmica e na beleza das transformações, acredito que cada detalhe possui um propósito."}
        </p>
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {[
            "Produção artesanal",
            "Peças exclusivas",
            "Feito com amor",
            "Inspirado pela fé",
            "Transformando matéria em memória",
            "Acolhimento em cada detalhe",
          ].map((t) => (
            <div
              key={t}
              className="rounded-2xl border border-border/60 bg-card p-5 flex items-start gap-3"
            >
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
