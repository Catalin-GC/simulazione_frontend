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
      label: isResponsabile ? "Richieste" : "I miei rimborsi",
    },
    ...(!isResponsabile
      ? [{ to: "/rimborsi/nuova", label: "Nuova" }]
      : []),
    ...(isResponsabile ? [{ to: "/statistiche", label: "Statistiche" }] : []),
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="min-h-screen app-bg">
      <header className="sticky top-0 z-50 bg-slate-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link
              to="/dashboard"
              className="font-display text-lg font-bold tracking-widest uppercase shrink-0"
            >
              Rimborsi
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-pill rounded-sm ${
                    isActive(link.to) ? "nav-pill-active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold leading-tight">
                  {user?.nome} {user?.cognome}
                </p>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                  {RUOLO_LABEL[user?.ruolo]}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-ghost text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2"
              >
                Esci
              </button>
            </div>
          </div>

          <nav className="md:hidden flex gap-1 pb-3 overflow-x-auto">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-pill rounded-sm whitespace-nowrap ${
                  isActive(link.to) ? "nav-pill-active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
