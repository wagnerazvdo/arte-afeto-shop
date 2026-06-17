import { supabase } from "@/integrations/supabase/client";

/**
 * Resolves an image URL. Accepts:
 * - an absolute URL (http/https) → returned as-is
 * - a Lovable asset path (/__l5e/...) → returned as-is
 * - a storage path "bucket/path/to/file.jpg" → resolved via signed URL
 */
const signedCache = new Map<string, { url: string; expires: number }>();

export async function resolveImageUrl(input: string | null | undefined): Promise<string> {
  if (!input) return "";
  if (/^https?:\/\//i.test(input) || input.startsWith("/")) return input;

  const cached = signedCache.get(input);
  if (cached && cached.expires > Date.now() + 60_000) return cached.url;

  const [bucket, ...rest] = input.split("/");
  const path = rest.join("/");
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
  if (!data?.signedUrl) return "";
  signedCache.set(input, { url: data.signedUrl, expires: Date.now() + 60 * 60 * 24 * 7 * 1000 });
  return data.signedUrl;
}
