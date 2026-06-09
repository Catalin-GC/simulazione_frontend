import { useEffect, useState } from "react";
import { getCategorie } from "../../api/categorie";
import { getRimborsi } from "../../api/rimborsi";
import { getStatistiche } from "../../api/statistiche";
import { Alert } from "../../components/Alert";
import { useAuth } from "../../context/AuthContext";

export function Statistiche() {
  const { token } = useAuth();
  const [dati, setDati] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [dipendenti, setDipendenti] = useState([]);
  const [filtri, setFiltri] = useState({ mese: "", categoriaId: "", dipendenteId: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCategorie(token), getRimborsi(token, {})])
      .then(([cats, rimborsi]) => {
        setCategorie(cats);
        const map = new Map();
        rimborsi.forEach((r) => {
          if (!map.has(r.dipendente)) {
            map.set(r.dipendente, { id: r.dipendente, nome: r.dipendente_nome });
          }
        });
        setDipendenti(Array.from(map.values()));
      })
      .catch((e) => setError(e.message));
  }, [token]);

  const carica = async (f = filtri) => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (f.mese) params.mese = f.mese;
      if (f.categoriaId) params.categoriaId = f.categoriaId;
      if (f.dipendenteId) params.dipendenteId = f.dipendenteId;
      const result = await getStatistiche(token, params);
      setDati(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carica(); }, []);

  const handleChange = (e) => {
    setFiltri((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatEuro = (n) => `${Number(n).toFixed(2)} €`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Statistiche rimborsi</h2>

      <Alert type="error" message={error} onClose={() => setError("")} />

      <form
        onSubmit={(e) => { e.preventDefault(); carica(); }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Mese</label>
          <input
            type="month"
            name="mese"
            value={filtri.mese}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Categoria</label>
          <select
            name="categoriaId"
            value={filtri.categoriaId}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Tutte</option>
            {categorie.map((c) => (
              <option key={c.id} value={c.id}>{c.descrizione}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Dipendente</label>
          <select
            name="dipendenteId"
            value={filtri.dipendenteId}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Tutti</option>
            {dipendenti.map((d) => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-3">
          <button type="submit" className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700">
            Applica filtri
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-slate-500 text-center py-10">Caricamento...</p>
      ) : dati.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center text-slate-500">
          Nessun dato disponibile per i filtri selezionati.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Mese</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Categoria</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">N. richieste</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Tot. richiesto</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Tot. approvato</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Tot. liquidato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dati.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{r.mese}</td>
                  <td className="px-4 py-3">{r.categoria}</td>
                  <td className="px-4 py-3 text-right">{r.numeroRichieste}</td>
                  <td className="px-4 py-3 text-right">{formatEuro(r.totaleRichiesto)}</td>
                  <td className="px-4 py-3 text-right">{formatEuro(r.totaleApprovato)}</td>
                  <td className="px-4 py-3 text-right">{formatEuro(r.totaleLiquidato)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
