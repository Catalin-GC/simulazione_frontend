import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RUOLO_LABEL = {
  DIPENDENTE: "Dipendente",
  RESPONSABILE: "Responsabile amministrativo",
};

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Rimborsi Spese</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Esci
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Benvenuto, {user?.nome} {user?.cognome}
          </h2>
          <p className="text-slate-500 mb-6">Dashboard — accesso effettuato con successo</p>

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-800">{user?.email}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Ruolo</dt>
              <dd className="font-medium text-slate-800">
                {RUOLO_LABEL[user?.ruolo] || user?.ruolo}
              </dd>
            </div>
          </dl>

          <p className="mt-8 text-sm text-slate-400">
            Le funzionalità per i rimborsi 
          </p>
        </div>
      </main>
    </div>
  );
}
