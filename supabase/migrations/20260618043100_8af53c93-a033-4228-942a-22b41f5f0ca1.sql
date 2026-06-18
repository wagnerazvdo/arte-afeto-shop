ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS links_titulo text DEFAULT 'Ateliê Arte e Afeto',
  ADD COLUMN IF NOT EXISTS links_subtitulo text DEFAULT 'Peças feitas à mão com amor, propósito e significado.',
  ADD COLUMN IF NOT EXISTS links_lista jsonb NOT NULL DEFAULT '[]'::jsonb;