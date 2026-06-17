import { Link } from "@tanstack/react-router";
import { ProductImage } from "./ProductImage";
import { formatBRL } from "@/lib/whatsapp";

type Img = { url: string; principal: boolean; ordem: number };

export function ProductCard({
  slug,
  nome,
  descricao_curta,
  preco,
  categoria,
  imagens,
}: {
  slug: string;
  nome: string;
  descricao_curta?: string | null;
  preco?: number | null;
  categoria?: string | null;
  imagens?: Img[];
}) {
  const cover = (imagens ?? []).sort((a, b) => Number(b.principal) - Number(a.principal) || a.ordem - b.ordem)[0]?.url;
  return (
    <Link
      to="/produto/$slug"
      params={{ slug }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50 transition hover:shadow-[0_18px_40px_-22px_oklch(0.52_0.105_45_/_0.35)] hover:-translate-y-1"
    >
      <div className="aspect-[4/5] overflow-hidden bg-secondary/40">
        <ProductImage src={cover} alt={nome} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {categoria && (
          <span className="text-[0.65rem] tracking-[0.25em] uppercase text-accent">{categoria}</span>
        )}
        <h3 className="font-display text-xl leading-snug text-foreground">{nome}</h3>
        {descricao_curta && (
          <p className="text-sm text-muted-foreground line-clamp-2">{descricao_curta}</p>
        )}
        <div className="mt-auto pt-3">
          {preco != null ? (
            <span className="text-base font-medium text-primary">{formatBRL(preco)}</span>
          ) : (
            <span className="text-sm italic text-accent-foreground/70">Consultar valor</span>
          )}
        </div>
      </div>
    </Link>
  );
}
