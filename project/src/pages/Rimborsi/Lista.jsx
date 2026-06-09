import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategorie } from "../../api/categorie";
import { getRimborsi } from "../../api/rimborsi";
import { Alert } from "../../components/Alert";
import { FiltriRimborsi } from "../../components/FiltriRimborsi";
import { StatoBadge } from "../../components/StatoBadge";
import { useAuth } from "../../context/AuthContext";

function estraiDipendenti(rimborsi) {
  const map = new Map();
  rimborsi.forEach((r) => {
    if (r.dipendente && !map.has(r.dipendente)) {
      map.set(r.dipendente, { id: r.dipendente, nome: r.dipendente_nome });
    }
  });
  return Array.from(map.values());
}

export function ListaRimborsi() {
  const { token, isResponsabile } = useAuth();
  const [rimborsi, setRimborsi] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [dipendenti, setDipendenti] = useState([]);
  const [filtri, setFiltri] = useState({ stato: "", categoria: "", mese: "", dipendente: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const carica = useCallback(async (f = filtri) => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (f.stato) params.stato = f.stato;
      if (f.categoria) params.categoria = f.categoria;
      if (f.mese) params.mese = f.mese;
      if (f.dipendente && isResponsabile) params.dipendente = f.dipendente;

      const [data, cats] = await Promise.all([
        getRimborsi(token, params),
        categorie.length ? Promise.resolve(categorie) : getCategorie(token),
      ]);
      setRimborsi(data);
      if (!categorie.length) setCategorie(cats);
      if (isResponsabile) setDipendenti(estraiDipendenti(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, filtri, isResponsabile, categorie]);

  useEffect(() => { carica(); }, [token]);

  const handleFiltra = (override) => {
    const f = override || filtri;
    if (override) setFiltri(override);
    carica(f);
  };

  const formatData = (d) => d ? new Date(d).toLocaleDateString("it-IT") : "—";
  const formatEuro = (n) => `${Number(n).toFixed(2)} €`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {isResponsabile ? "Tutte le richieste di rimborso" : "I miei rimborsi"}
        </h2>
        {!isResponsabile && (
          <Link
            to="/rimborsi/nuova"
            className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700"
          >
            + Nuova richiesta
          </Link>
        )}
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />

      <FiltriRimborsi
        filtri={filtri}
        onChange={setFiltri}
        onFiltra={handleFiltra}
        categorie={categorie}
        dipendenti={dipendenti}
        showDipendente={isResponsabile}
      />

      {loading ? (
        <p className="text-slate-500 text-center py-10">Caricamento...</p>
      ) : rimborsi.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center text-slate-500">
          Nessuna richiesta trovata.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {isResponsabile && (
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Dipendente</th>
                )}
                <th className="text-left px-4 py-3 font-medium text-slate-600">Data spesa</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Categoria</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Importo</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Stato</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rimborsi.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  {isResponsabile && (
                    <td className="px-4 py-3">{r.dipendente_nome}</td>
                  )}
                  <td className="px-4 py-3">{formatData(r.data_spesa)}</td>
                  <td className="px-4 py-3">{r.categoria_descrizione}</td>
                  <td className="px-4 py-3 font-medium">{formatEuro(r.importo)}</td>
                  <td className="px-4 py-3">
                    <StatoBadge stato={r.stato} label={r.stato_display} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/rimborsi/${r.id}`}
                      className="text-slate-800 hover:underline font-medium"
                    >
                      Dettaglio
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
