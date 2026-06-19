import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, Package, Tags, Settings, LogOut, ExternalLink, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();
    return { userId: data.user.id, isAdmin: !!role };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const ctx = Route.useRouteContext();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (!ctx.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center rounded-3xl border border-border bg-card p-10">
          <h1 className="font-display text-2xl">Acesso restrito</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sua conta ainda não tem permissão de administrador.
            Peça ao responsável pelo ateliê para liberar seu acesso.
          </p>
          <p className="mt-4 text-xs text-muted-foreground break-all">{email}</p>
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="outline" onClick={logout} className="rounded-full">Sair</Button>
            <Button asChild className="rounded-full"><Link to="/">Ir ao site</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/produtos", label: "Produtos", icon: Package },
    { to: "/admin/categorias", label: "Categorias", icon: Tags },
    { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-5 border-b border-border">
          <Logo className="h-10 w-10" showText />
        </div>
        <nav className="p-3 flex-1 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = n.to === "/admin" ? pathname === "/admin" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground/80"
                }`}
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-secondary">
            <ExternalLink className="h-4 w-4" /> Ver site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-secondary text-muted-foreground">
            <LogOut className="h-4 w-4" /> Sair
          </button>
          <p className="px-3 pt-2 text-[10px] text-muted-foreground truncate">{email}</p>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
