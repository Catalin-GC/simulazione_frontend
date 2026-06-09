import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RUOLO_LABEL = {
  DIPENDENTE: "Dipendente",
  RESPONSABILE: "Responsabile amministrativo",
};

export function Layout() {
  const { user, logout, isResponsabile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    {
      to: isResponsabile ? "/rimborsi" : "/miei-rimborsi",
      label: isResponsabile ? "Tutte le richieste" : "I miei rimborsi",
    },
    ...(!isResponsabile
      ? [{ to: "/rimborsi/nuova", label: "Nuova richiesta" }]
      : []),
    ...(isResponsabile ? [{ to: "/statistiche", label: "Statistiche" }] : []),
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-56 bg-slate-800 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-700">
          <h1 className="font-bold text-lg">Rimborsi Spese</h1>
          <p className="text-slate-400 text-xs mt-1 truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(link.to)
                  ? "bg-slate-700 text-white font-medium"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
          <p>{user?.nome} {user?.cognome}</p>
          <p className="mt-1">{RUOLO_LABEL[user?.ruolo]}</p>
          <button
            onClick={handleLogout}
            className="mt-3 text-slate-300 hover:text-white text-sm"
          >
            Esci
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
