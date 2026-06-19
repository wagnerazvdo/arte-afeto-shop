import logo from "@/assets/logo.asset.json";
import { fetchSiteSettings } from "@/lib/queries";
import { resolveImageUrl } from "@/lib/storage-url";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function Logo({
  className = "h-12 w-12",
  showText = false,
}: {
  className?: string;
  showText?: boolean;
}) {
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
    <div className="flex items-center gap-3">
      <img
        src={resolvedLogoUrl}
        alt="Ateliê Arte e Afeto"
        className={`${className} rounded-full object-cover`}
      />
      {showText && (
        <span className="font-display text-lg leading-tight text-foreground">
          Ateliê
          <span className="block text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Arte e Afeto
          </span>
        </span>
      )}
    </div>
  );
}
