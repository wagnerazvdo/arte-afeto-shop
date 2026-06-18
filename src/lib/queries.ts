import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  nome: string;
  slug: string;
  ordem: number;
  ativa: boolean;
};

export type Product = {
  id: string;
  nome: string;
  slug: string;
  codigo: string;
  descricao_curta: string | null;
  descricao_completa: string | null;
  category_id: string | null;
  preco: number | null;
  destaque: boolean;
  prazo_producao: string | null;
  ativo: boolean;
  created_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  ordem: number;
  principal: boolean;
};

export type LinkItem = { label: string; url: string };

export type SiteSettings = {
  id: string;
  whatsapp: string | null;
  instagram: string | null;
  endereco: string | null;
  email: string | null;
  texto_institucional: string | null;
  logo_url: string | null;
  banner_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  links_titulo: string | null;
  links_subtitulo: string | null;
  links_lista: LinkItem[];
};

export async function fetchActiveCategories() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("ativa", true)
    .order("ordem", { ascending: true });
  return (data ?? []) as Category[];
}

export async function fetchAllCategories() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("ordem", { ascending: true });
  return (data ?? []) as Category[];
}

export async function fetchActiveProducts(opts?: { categorySlug?: string; search?: string; destaque?: boolean; limit?: number }) {
  let query = supabase
    .from("products")
    .select("*, categories!inner(slug, nome, ativa)")
    .eq("ativo", true)
    .order("created_at", { ascending: false });

  if (opts?.categorySlug) {
    query = query.eq("categories.slug", opts.categorySlug);
  }
  if (opts?.destaque) query = query.eq("destaque", true);
  if (opts?.search) {
    query = query.or(`nome.ilike.%${opts.search}%,descricao_curta.ilike.%${opts.search}%,codigo.ilike.%${opts.search}%`);
  }
  if (opts?.limit) query = query.limit(opts.limit);

  const { data } = await query;
  return (data ?? []) as Array<Product & { categories: { slug: string; nome: string; ativa: boolean } }>;
}

export async function fetchAllProducts() {
  const { data } = await supabase
    .from("products")
    .select("*, categories(nome, slug)")
    .order("created_at", { ascending: false });
  return (data ?? []) as Array<Product & { categories: { nome: string; slug: string } | null }>;
}

export async function fetchProductBySlug(slug: string) {
  const { data } = await supabase
    .from("products")
    .select("*, categories(nome, slug), product_images(*)")
    .eq("slug", slug)
    .eq("ativo", true)
    .maybeSingle();
  if (!data) return null;
  return data as Product & {
    categories: { nome: string; slug: string } | null;
    product_images: ProductImage[];
  };
}

export async function fetchRelatedProducts(categoryId: string | null, currentId: string) {
  if (!categoryId) return [];
  const { data } = await supabase
    .from("products")
    .select("*, product_images(url, principal, ordem)")
    .eq("ativo", true)
    .eq("category_id", categoryId)
    .neq("id", currentId)
    .limit(4);
  return (data ?? []) as Array<Product & { product_images: Pick<ProductImage, "url" | "principal" | "ordem">[] }>;
}

export async function fetchSiteSettings() {
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data as SiteSettings | null;
}

export async function fetchProductsWithCover() {
  const { data } = await supabase
    .from("products")
    .select("*, product_images(url, principal, ordem), categories(nome, slug)")
    .eq("ativo", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as Array<Product & {
    product_images: Pick<ProductImage, "url" | "principal" | "ordem">[];
    categories: { nome: string; slug: string } | null;
  }>;
}
