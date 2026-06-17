import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Mail, MapPin, MessageCircle, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { fetchSiteSettings } from "@/lib/queries";

export function SiteFooter() {
  const { data: settings } = useQuery({ queryKey: ["site_settings"], queryFn: fetchSiteSettings });

  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="container-wide py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Logo className="h-14 w-14" showText />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Peças artesanais feitas à mão com amor, propósito e significado.
          </p>
        </div>

        <div className="text-sm">
          <h4 className="font-display text-base mb-3 text-foreground">Navegar</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Início</Link></li>
            <li><Link to="/colecao" className="hover:text-primary">Coleção</Link></li>
            <li><Link to="/sobre" className="hover:text-primary">Sobre</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <h4 className="font-display text-base mb-3 text-foreground">Contato</h4>
          <ul className="space-y-2 text-muted-foreground">
            {settings?.whatsapp && (
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-accent" /> {settings.whatsapp}
              </li>
            )}
            {settings?.instagram && (
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-accent" />
                <a href={`https://instagram.com/${settings.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="hover:text-primary">
                  @{settings.instagram.replace(/^@/, "")}
                </a>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" /> {settings.email}
              </li>
            )}
            {settings?.endereco && (
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent mt-0.5" /> <span>{settings.endereco}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-5">
        <div className="container-wide flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            Feito com <Heart className="h-3 w-3 fill-accent text-accent" /> pelo Ateliê Arte e Afeto · {new Date().getFullYear()}
          </p>
          <Link to="/auth" className="hover:text-primary">Acesso restrito</Link>
        </div>
      </div>
    </footer>
  );
}
