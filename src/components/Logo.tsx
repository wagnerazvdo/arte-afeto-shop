import logo from "@/assets/logo.asset.json";

export function Logo({ className = "h-12 w-12", showText = false }: { className?: string; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo.url}
        alt="Ateliê Arte e Afeto"
        className={`${className} rounded-full object-cover`}
      />
      {showText && (
        <span className="font-display text-lg leading-tight text-foreground">
          Ateliê
          <span className="block text-xs tracking-[0.3em] uppercase text-muted-foreground">Arte e Afeto</span>
        </span>
      )}
    </div>
  );
}
