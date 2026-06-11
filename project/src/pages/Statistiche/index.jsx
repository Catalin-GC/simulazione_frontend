import { useEffect, useState } from "react";
import { getCategorie } from "../../api/categorie";
import { getRimborsi } from "../../api/rimborsi";
import { getStatistiche } from "../../api/statistiche";
import { Alert } from "../../components/Alert";
import { PageHeader } from "../../components/PageHeader";
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
      <PageHeader
        title="Statistiche"
        subtitle="Riepilogo aggregato per mese, categoria e dipendente"
      />

      <Alert type="error" message={error} onClose={() => setError("")} />

      <form
        onSubmit={(e) => { e.preventDefault(); carica(); }}
        className="card card-pad mb-6"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Filtra statistiche
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="input-label">Mese</label>
            <input
              type="month"
              name="mese"
              value={filtri.mese}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="input-label">Categoria</label>
            <select
              name="categoriaId"
              value={filtri.categoriaId}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Tutte</option>
              {categorie.map((c) => (
                <option key={c.id} value={c.id}>{c.descrizione}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Dipendente</label>
            <select
              name="dipendenteId"
              value={filtri.dipendenteId}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Tutti</option>
              {dipendenti.map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button type="submit" className="btn btn-primary">
            Applica filtri
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-slate-500 text-center py-16 font-medium tracking-wide">
          Caricamento...
        </p>
      ) : dati.length === 0 ? (
        <div className="card card-pad text-center text-slate-500 py-16">
          Nessun dato disponibile per i filtri selezionati.
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mese</th>
                <th>Categoria</th>
                <th className="text-right">N. richieste</th>
                <th className="text-right">Tot. richiesto</th>
                <th className="text-right">Tot. approvato</th>
                <th className="text-right">Tot. liquidato</th>
              </tr>
            </thead>
            <tbody>
              {dati.map((r, i) => (
                <tr key={i}>
                  <td className="font-medium">{r.mese}</td>
                  <td>{r.categoria}</td>
                  <td className="text-right">{r.numeroRichieste}</td>
                  <td className="text-right font-medium">{formatEuro(r.totaleRichiesto)}</td>
                  <td className="text-right font-medium">{formatEuro(r.totaleApprovato)}</td>
                  <td className="text-right font-bold text-slate-800">
                    {formatEuro(r.totaleLiquidato)}
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
