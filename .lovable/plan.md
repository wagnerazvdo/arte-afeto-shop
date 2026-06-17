## Visão geral

Loja virtual artesanal "Arte e Afeto" com catálogo público elegante e painel administrativo completo. Backend via Lovable Cloud (autenticação, banco, storage). Compra direta via WhatsApp (sem checkout/pagamento online).

## Design System

Paleta inspirada na logo (vaso terracota, ramos bege, fundo cremoso):
- Background: off-white cremoso (`oklch(0.97 0.012 80)`)
- Primary: terracota / marrom-café (`oklch(0.48 0.09 45)`)
- Accent: bege/terracota suave (`oklch(0.78 0.06 60)`)
- Sage: verde sálvia sutil para detalhes
- Foreground: marrom escuro (`oklch(0.28 0.04 40)`)

Tipografia:
- Display: **Cormorant Garamond** (serifa elegante, artesanal)
- Body: **Inter** ou **Manrope** (leve, limpa)

Elementos visuais:
- Bordas suaves (radius 0.75rem)
- Muito whitespace
- Divisores com ramos/folhas sutis (inspirados na logo)
- Coração discreto como detalhe (igual logo)
- Animações suaves (fade-in, scroll reveal)

Logo: usado em header, footer, login e favicon (gerar versões da imagem enviada como asset).

## Banco de Dados (Lovable Cloud)

**Tabelas em `public`:**

1. `profiles` — id (FK auth.users), nome, criado_em
2. `user_roles` — id, user_id, role (enum: admin, user)  *(padrão de segurança)*
3. `categories` — id, nome, slug, ordem, ativa, criado_em
4. `products` — id, nome, slug, codigo, descricao_curta, descricao_completa, categoria_id, preco (nullable), destaque, prazo_producao, ativo, criado_em
5. `product_images` — id, product_id, url, ordem, principal
6. `site_settings` — id (singleton), whatsapp, instagram, endereco, email, texto_institucional, logo_url, banner_url, meta_title, meta_description

**RLS:**
- `categories`, `products`, `product_images`, `site_settings` — SELECT público (anon+authenticated), escrita só admin
- `user_roles` — leitura própria via função `has_role()` security-definer
- `profiles` — leitura própria

**Storage:** bucket público `products` (imagens), bucket público `site` (logo/banner)

## Rotas Públicas

- `/` — Home: hero com logo + frase + CTA, sobre, categorias, destaques, "Feito com Afeto"
- `/colecao` — catálogo com filtro por categoria + busca
- `/categoria/$slug` — produtos da categoria
- `/produto/$slug` — detalhe: galeria, infos, botão WhatsApp (Comprar Agora / Consultar Valor), produtos relacionados, seção "Feito com Afeto", compartilhar
- `/sobre` — institucional
- `/auth` — login admin
- `/sitemap.xml`, `/robots.txt`

## Rotas Admin (`_authenticated/admin`)

Gate por `_authenticated/route.tsx` + verificação de role admin.

- `/admin` — dashboard: contadores + últimos produtos
- `/admin/produtos` — listar/criar/editar/excluir/duplicar
- `/admin/produtos/novo` e `/admin/produtos/$id`
- `/admin/categorias` — CRUD
- `/admin/configuracoes` — WhatsApp, Instagram, contatos, logo, banner, texto institucional, SEO

## Integração WhatsApp

Função utilitária `buildWhatsAppUrl(numero, mensagem)` que abre `https://wa.me/{numero}?text={encoded}`. Mensagens padrão "Comprar Agora" / "Consultar Valor" com nome, código, categoria, preço e link do produto.

## SEO

Cada rota com `head()` próprio (title, description, og:*). Sitemap dinâmico a partir de produtos e categorias ativos. Robots.txt permissivo.

## Detalhes técnicos

- TanStack Start (já configurado) + Tailwind v4 + shadcn
- Server functions (`createServerFn`) para escritas admin com `requireSupabaseAuth` + check de `has_role`
- Leituras públicas via cliente Supabase publishable
- Upload de imagens via Storage do Cloud no admin
- Login: email/senha (admin é criado manualmente via cadastro + atribuição de role no banco)
- Slug automático a partir do nome
- Imagens hero/produtos placeholder gerados via imagegen (estética cerâmica/terrosa) — usuário substitui depois

## Entregáveis desta primeira iteração

1. Migrations (tabelas + RLS + grants + seed do `site_settings`)
2. Storage buckets
3. Design system completo (`src/styles.css`) + componentes base
4. Páginas públicas: home, coleção, categoria, produto, sobre
5. Auth (login) + gate de admin com role
6. Painel admin completo (dashboard, produtos, categorias, configurações)
7. Logo gravado como asset + favicon
8. Sitemap/robots
9. Mensagem clara para o usuário sobre como criar o primeiro admin (cadastro + atribuição de role via SQL pelo painel Cloud)

Posso prosseguir?
