import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategorie } from "../../api/categorie";
import { getRimborsi } from "../../api/rimborsi";
import { Alert } from "../../components/Alert";
import { FiltriRimborsi } from "../../components/FiltriRimborsi";
import { PageHeader } from "../../components/PageHeader";
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
      <PageHeader
        title={isResponsabile ? "Tutte le richieste" : "I miei rimborsi"}
        subtitle={
          isResponsabile
            ? "Panoramica completa delle richieste di rimborso"
            : "Le tue richieste di rimborso spese"
        }
        action={
          !isResponsabile ? (
            <Link to="/rimborsi/nuova" className="btn btn-primary">
              + Nuova richiesta
            </Link>
          ) : undefined
        }
      />

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
        <p className="text-slate-500 text-center py-16 font-medium tracking-wide">
          Caricamento...
        </p>
      ) : rimborsi.length === 0 ? (
        <div className="card card-pad text-center text-slate-500 py-16">
          Nessuna richiesta trovata.
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {isResponsabile && <th>Dipendente</th>}
                <th>Data spesa</th>
                <th>Categoria</th>
                <th>Importo</th>
                <th>Stato</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rimborsi.map((r) => (
                <tr key={r.id}>
                  {isResponsabile && (
                    <td className="font-medium">{r.dipendente_nome}</td>
                  )}
                  <td>{formatData(r.data_spesa)}</td>
                  <td>{r.categoria_descrizione}</td>
                  <td className="font-bold text-slate-800">{formatEuro(r.importo)}</td>
                  <td>
                    <StatoBadge stato={r.stato} label={r.stato_display} />
                  </td>
                  <td>
                    <Link
                      to={`/rimborsi/${r.id}`}
                      className="text-xs font-bold uppercase tracking-wider text-slate-800 hover:underline"
                    >
                      Dettaglio →
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
