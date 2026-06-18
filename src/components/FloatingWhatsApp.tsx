import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { fetchSiteSettings } from "@/lib/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const { data: settings } = useQuery({ queryKey: ["site_settings"], queryFn: fetchSiteSettings });
  if (!settings?.whatsapp) return null;
  const href = buildWhatsAppUrl(settings.whatsapp, "Olá! Vim pelo site do Ateliê Arte e Afeto e gostaria de mais informações.");
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)] hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-7 w-7 fill-white" strokeWidth={1.5} />
      <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/40 -z-10" />
    </a>
  );
}
