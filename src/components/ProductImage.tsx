import { useEffect, useState } from "react";
import { resolveImageUrl } from "@/lib/storage-url";

export function ProductImage({
  src,
  alt,
  className,
}: { src: string | null | undefined; alt: string; className?: string }) {
  const [resolved, setResolved] = useState<string>("");

  useEffect(() => {
    let active = true;
    if (!src) {
      setResolved("");
      return;
    }
    resolveImageUrl(src).then((url) => {
      if (active) setResolved(url);
    });
    return () => {
      active = false;
    };
  }, [src]);

  if (!resolved) {
    return (
      <div
        className={`bg-gradient-to-br from-secondary via-muted to-accent/30 flex items-center justify-center ${className ?? ""}`}
      >
        <span className="font-display text-3xl text-accent/60">a&a</span>
      </div>
    );
  }
  return <img src={resolved} alt={alt} className={className} loading="lazy" />;
}
