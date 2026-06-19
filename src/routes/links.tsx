import { Logo } from "@/components/Logo";
import { fetchSiteSettings } from "@/lib/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Instagram, Mail, MessageCircle, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title: "Links · Ateliê Arte e Afeto" },
      { name: "description", content: "Todos os links do Ateliê Arte e Afeto em um só lugar." },
    ],
  }),
  component: LinksPage,
});

function LinksPage() {
  const { data: settings } = useQuery({ queryKey: ["site_settings"], queryFn: fetchSiteSettings });

  const items: { label: string; href: string; icon: React.ReactNode; external?: boolean }[] = [];

  if (settings?.whatsapp) {
    items.push({
      label: "Fale conosco",
      href: buildWhatsAppUrl(settings.whatsapp, "Olá! Vim pelo Linktree do Ateliê Arte e Afeto."),
      icon: <MessageCircle className="h-5 w-5" />,
      external: true,
    });
  }
  items.push({
    label: "Ver Catálogo",
    href: "/colecao",
    icon: <ShoppingBag className="h-5 w-5" />,
  });
  if (settings?.instagram) {
    items.push({
      label: `Instagram @${settings.instagram.replace(/^@/, "")}`,
      href: `https://instagram.com/${settings.instagram.replace(/^@/, "")}`,
      icon: <Instagram className="h-5 w-5" />,
      external: true,
    });
  }
  if (settings?.email) {
    items.push({
      label: "Enviar e-mail",
      href: `mailto:${settings.email}`,
      icon: <Mail className="h-5 w-5" />,
      external: true,
    });
  }

  (settings?.links_lista ?? []).forEach((l) => {
    if (l?.label && l?.url) {
      items.push({
        label: l.label,
        href: l.url,
        icon: <ExternalLink className="h-5 w-5" />,
        external: /^https?:\/\//.test(l.url),
      });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/40 via-background to-background flex flex-col items-center px-5 py-14">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-card border border-accent/30 overflow-hidden shadow-[0_20px_60px_-20px_oklch(0.52_0.105_45_/_0.4)] flex items-center justify-center">
          <Logo className="h-24 w-24" />
        </div>
        <h1 className="mt-5 font-display font-light italic text-4xl text-foreground">
          {settings?.links_titulo ?? "Ateliê Arte e Afeto"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {settings?.links_subtitulo ?? "Peças feitas à mão com amor, propósito e significado."}
        </p>

        <ul className="mt-10 space-y-3">
          {items.map((it) =>
            it.external ? (
              <li key={it.label}>
                <a
                  href={it.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-full border border-accent/30 bg-card px-6 py-4 text-foreground hover:bg-secondary/70 hover:border-accent transition shadow-sm"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <span className="text-accent">{it.icon}</span>
                    {it.label}
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
                </a>
              </li>
            ) : (
              <li key={it.label}>
                <a
                  href={it.href}
                  className="group flex items-center justify-between gap-3 rounded-full border border-accent/30 bg-card px-6 py-4 text-foreground hover:bg-secondary/70 hover:border-accent transition shadow-sm"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <span className="text-accent">{it.icon}</span>
                    {it.label}
                  </span>
                </a>
              </li>
            ),
          )}
        </ul>

        <p className="mt-12 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ateliê Arte e Afeto
        </p>
      </div>
    </div>
  );
}
