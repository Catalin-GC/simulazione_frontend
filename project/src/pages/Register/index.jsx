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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Registrati</h1>
        <p className="text-slate-500 mb-6">Crea un nuovo account</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}<span></span>
          </div> 
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">
                Nome
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={form.nome}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
            <div>
              <label htmlFor="cognome" className="block text-sm font-medium text-slate-700 mb-1">
                Cognome
              </label>
              <input
                id="cognome"
                name="cognome"
                type="text"
                required
                value={form.cognome}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>

          <div>
            <label htmlFor="ruolo" className="block text-sm font-medium text-slate-700 mb-1">
              Ruolo
            </label>
            <select
              id="ruolo"
              name="ruolo"
              value={form.ruolo}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
            >
              <option value="DIPENDENTE">Dipendente</option>
              <option value="RESPONSABILE">Responsabile amministrativo</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>

          <div>
            <label
              htmlFor="conferma_password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Conferma password
            </label>
            <input
              id="conferma_password"
              name="conferma_password"
              type="password"
              required
              value={form.conferma_password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-800 text-white py-2 font-medium hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Registrazione..." : "Registrati"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Hai già un account?{" "}
          <Link to="/login" className="text-slate-800 font-medium hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
