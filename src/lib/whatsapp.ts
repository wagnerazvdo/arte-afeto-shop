/**
 * Builds a wa.me URL with an automatic message.
 * Numbers should be stored in international format: 5583XXXXXXXX
 */
export function buildWhatsAppUrl(numero: string, mensagem: string): string {
  const cleanNumber = (numero || "").replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(mensagem)}`;
}

interface ProdutoWa {
  nome: string;
  codigo: string;
  preco?: number | null;
  categoria?: string | null;
}

export function mensagemComprar(p: ProdutoWa, url: string) {
  const precoStr = p.preco != null ? formatBRL(p.preco) : "a consultar";
  return `Olá! Tenho interesse no produto:

Nome: ${p.nome}
Código: ${p.codigo}
Preço: ${precoStr}

Link do produto:
${url}

Gostaria de finalizar a compra.`;
}

export function mensagemConsultar(p: ProdutoWa, url: string) {
  return `Olá! Gostaria de consultar o valor deste produto.

Nome: ${p.nome}
Código: ${p.codigo}
Categoria: ${p.categoria ?? "-"}

Link:
${url}

Aguardo informações.`;
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
