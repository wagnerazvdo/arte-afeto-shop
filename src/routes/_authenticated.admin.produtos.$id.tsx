import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ProdutoForm } from "@/components/admin/ProdutoForm";

export const Route = createFileRoute("/_authenticated/admin/produtos/$id")({
  component: ProdutoEditPage,
});

function ProdutoEditPage() {
  const { id } = useParams({ from: "/_authenticated/admin/produtos/$id" });
  const navigate = useNavigate();
  return <ProdutoForm id={id} onCreated={(newId) => navigate({ to: "/admin/produtos/$id", params: { id: newId } })} />;
}
