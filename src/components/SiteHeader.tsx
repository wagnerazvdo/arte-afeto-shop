import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Logo } from "./Logo";
import { fetchActiveCategories } from "@/lib/queries";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "active"],
    queryFn: fetchActiveCategories,
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-wide flex h-20 items-center justify-between gap-6">
        <Link to="/" className="shrink-0">
          <Logo className="h-12 w-12" showText />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm">
          <Link to="/" className="text-foreground/80 hover:text-primary transition">Início</Link>
          <Link to="/colecao" className="text-foreground/80 hover:text-primary transition">Coleção</Link>
          {categories.slice(0, 5).map((c) => (
            <Link
              key={c.id}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className="text-foreground/80 hover:text-primary transition"
            >
              {c.nome}
            </Link>
          ))}
          <Link to="/sobre" className="text-foreground/80 hover:text-primary transition">Sobre</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/colecao"
            className="hidden md:inline-flex items-center justify-center h-10 w-10 rounded-full text-muted-foreground hover:text-primary hover:bg-secondary transition"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Button asChild variant="default" size="sm" className="hidden md:inline-flex rounded-full px-5">
            <Link to="/colecao">Conhecer coleção</Link>
          </Button>
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-secondary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <nav className="container-wide flex flex-col py-4 gap-2">
            <Link to="/" onClick={() => setOpen(false)} className="py-2">Início</Link>
            <Link to="/colecao" onClick={() => setOpen(false)} className="py-2">Coleção</Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/categoria/$slug"
                params={{ slug: c.slug }}
                onClick={() => setOpen(false)}
                className="py-2"
              >
                {c.nome}
              </Link>
            ))}
            <Link to="/sobre" onClick={() => setOpen(false)} className="py-2">Sobre</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
