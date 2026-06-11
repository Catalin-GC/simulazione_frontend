import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Credenziali non valide.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="auth-panel">
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
            Portale aziendale
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Rimborsi
            <br />
            Spese
          </h1>
        </div>
        <p className="relative z-10 text-sm text-slate-400 max-w-xs">
          Gestione centralizzata delle richieste di rimborso per dipendenti e responsabili amministrativi.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center app-bg px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <h1 className="font-display text-3xl font-bold text-slate-800">Rimborsi Spese</h1>
          </div>

          <div className="card-accent card-pad">
            <h2 className="page-title text-2xl mb-1">Accedi</h2>
            <p className="page-subtitle mb-6">Inserisci le tue credenziali</p>

            {error && (
              <div className="mb-5 border-2 border-l-4 border-red-300 border-l-red-500 bg-red-50 text-red-800 px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="input-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="password" className="input-label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? "Accesso in corso..." : "Accedi"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Non hai un account?{" "}
              <Link to="/register" className="font-bold text-slate-800 hover:underline">
                Registrati
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
