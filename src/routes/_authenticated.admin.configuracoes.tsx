import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { fetchSiteSettings } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data, refetch } = useQuery({ queryKey: ["site_settings"], queryFn: fetchSiteSettings });
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = async () => {
    setLoading(true);
    const { error } = await supabase.from("site_settings").update({
      whatsapp: form.whatsapp,
      instagram: form.instagram,
      endereco: form.endereco,
      email: form.email,
      texto_institucional: form.texto_institucional,
      logo_url: form.logo_url,
      banner_url: form.banner_url,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      links_titulo: form.links_titulo,
      links_subtitulo: form.links_subtitulo,
      links_lista: (form.links_lista ?? []).filter((l: any) => l?.label && l?.url),
    }).eq("id", data!.id);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Configurações salvas com sucesso!");
    refetch();
  };

  const uploadFile = async (file: File, field: "logo_url" | "banner_url") => {
    const ext = file.name.split(".").pop();
    const path = `${field}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site").upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    setForm({ ...form, [field]: `site/${path}` });
    toast.success("Arquivo enviado. Salve para aplicar.");
  };

  if (!data) return <div className="p-10">Carregando...</div>;

  return (
    <div className="p-8 lg:p-10 max-w-3xl">
      <h1 className="font-display text-4xl">Configurações</h1>
      <p className="text-muted-foreground text-sm">Dados do ateliê, contato e SEO</p>

      <div className="mt-8 grid gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="WhatsApp (formato 5583XXXXXXXX)">
            <Input value={form.whatsapp ?? ""} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </Field>
          <Field label="Instagram (@usuário)">
            <Input value={form.instagram ?? ""} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </Field>
          <Field label="E-mail">
            <Input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Endereço">
            <Input value={form.endereco ?? ""} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
          </Field>
        </div>

        <Field label="Texto institucional (Sobre)">
          <Textarea rows={5} value={form.texto_institucional ?? ""} onChange={(e) => setForm({ ...form, texto_institucional: e.target.value })} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Logo (opcional, substitui o padrão)">
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "logo_url")} />
            {form.logo_url && <p className="mt-1 text-xs text-muted-foreground truncate">{form.logo_url}</p>}
          </Field>
          <Field label="Banner principal">
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "banner_url")} />
            {form.banner_url && <p className="mt-1 text-xs text-muted-foreground truncate">{form.banner_url}</p>}
          </Field>
        </div>

        <Field label="Meta title (SEO)">
          <Input value={form.meta_title ?? ""} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
        </Field>
        <Field label="Meta description (SEO)">
          <Textarea rows={2} value={form.meta_description ?? ""} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
        </Field>

        <div className="pt-4">
          <Button onClick={save} disabled={loading} className="rounded-full px-8">{loading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}
