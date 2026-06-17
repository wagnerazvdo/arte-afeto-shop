import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/produtos/novo")({
  component: () => <Navigate to="/admin/produtos/$id" params={{ id: "novo" }} replace />,
});
