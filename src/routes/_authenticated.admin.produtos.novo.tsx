import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProdutoForm } from "@/components/admin/ProdutoForm";

export const Route = createFileRoute("/_authenticated/admin/produtos/novo")({
  component: () => {
    const navigate = useNavigate();
    return <ProdutoForm id="novo" onCreated={(newId) => navigate({ to: "/admin/produtos/$id", params: { id: newId } })} />;
  },
});
