import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LayoutDashboard, LogOut, Trophy, Users } from "lucide-react";
import { Button } from "../ui/button";

export function AdminLayout() {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-purple-500">
        Carregando...
      </div>
    );
  }

  // se não for admin, volta pra home
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-purple-600 text-white"
      : "text-slate-400 hover:bg-slate-800 hover:text-white";

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 font-sans">
      {/* sidebar */}
      <aside className="w-full md:w-64 h-auto md:h-full border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950 shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-purple-500" />
          <span className="font-bold text-lg tracking-tight">
            Painel Administrativo
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive(
              "/admin",
            )}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>

          <Link
            to="/admin/tournaments"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive(
              "/admin/tournaments",
            )}`}
          >
            <Trophy className="w-5 h-5" />
            Torneios
          </Link>

          <Link
            to="/admin/registrations"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive(
              "/admin/registrations",
            )}`}
          >
            <Users className="w-5 h-5" />
            Inscrições
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4 px-4 text-sm text-slate-500 truncate">
            Logado como <br />{" "}
            <strong className="text-slate-300">{user.email}</strong>
          </div>

          <Button
            variant="outline"
            onClick={logout}
            className="w-full border-slate-700 bg-transparent text-slate-300 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sair do Painel
          </Button>
        </div>
      </aside>

      {/* área principal */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
