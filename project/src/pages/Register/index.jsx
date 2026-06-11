import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    ruolo: "DIPENDENTE",
    password: "",
    conferma_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.conferma_password) {
      setError("Le password non coincidono.");
      return;
    }

    setLoading(true);

    try {
      await register(form);
      setSuccess("Registrazione completata. Ora puoi accedere.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Errore durante la registrazione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="auth-panel">
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
            Nuovo account
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Crea il tuo
            <br />
            profilo
          </h1>
        </div>
        <p className="relative z-10 text-sm text-slate-400 max-w-xs">
          Registra un account come dipendente o responsabile amministrativo per accedere al portale.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center app-bg px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <h1 className="font-display text-3xl font-bold text-slate-800">Registrazione</h1>
          </div>

          <div className="card-accent card-pad">
            <h2 className="page-title text-2xl mb-1">Registrati</h2>
            <p className="page-subtitle mb-6">Compila tutti i campi richiesti</p>

            {error && (
              <div className="mb-5 border-2 border-l-4 border-red-300 border-l-red-500 bg-red-50 text-red-800 px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 border-2 border-l-4 border-green-300 border-l-green-600 bg-green-50 text-green-800 px-4 py-3 text-sm font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nome" className="input-label">Nome</label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={form.nome}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="cognome" className="input-label">Cognome</label>
                  <input
                    id="cognome"
                    name="cognome"
                    type="text"
                    required
                    value={form.cognome}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

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
                <label htmlFor="ruolo" className="input-label">Ruolo</label>
                <select
                  id="ruolo"
                  name="ruolo"
                  value={form.ruolo}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="DIPENDENTE">Dipendente</option>
                  <option value="RESPONSABILE">Responsabile amministrativo</option>
                </select>
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

              <div>
                <label htmlFor="conferma_password" className="input-label">
                  Conferma password
                </label>
                <input
                  id="conferma_password"
                  name="conferma_password"
                  type="password"
                  required
                  value={form.conferma_password}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? "Registrazione..." : "Registrati"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Hai già un account?{" "}
              <Link to="/login" className="font-bold text-slate-800 hover:underline">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
