
-- Leitura pública das imagens nos dois buckets
CREATE POLICY "Public read products" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('products', 'site'));

-- Admins podem enviar
CREATE POLICY "Admins insert products/site" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('products', 'site') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update products/site" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('products', 'site') AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id IN ('products', 'site') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete products/site" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('products', 'site') AND public.has_role(auth.uid(), 'admin'));
