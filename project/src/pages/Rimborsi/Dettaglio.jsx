import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  approvaRimborso,
  deleteRimborso,
  getRimborso,
  liquidaRimborso,
  rifiutaRimborso,
} from "../../api/rimborsi";
import { Alert } from "../../components/Alert";
import { StatoBadge } from "../../components/StatoBadge";
import { useAuth } from "../../context/AuthContext";

export function DettaglioRimborso() {
  const { id } = useParams();
  const { token, user, isResponsabile } = useAuth();
  const navigate = useNavigate();

  const [rimborso, setRimborso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [motivazione, setMotivazione] = useState("");
  const [azione, setAzione] = useState("");

  const carica = () => {
    setLoading(true);
    getRimborso(token, id)
      .then(setRimborso)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carica(); }, [token, id]);

  const formatData = (d) => d ? new Date(d).toLocaleString("it-IT") : "—";
  const formatEuro = (n) => `${Number(n).toFixed(2)} €`;

  const eseguiAzione = async (fn, msg) => {
    setError("");
    setSuccess("");
    setAzione(msg);
    try {
      await fn();
      setSuccess(`Operazione completata: ${msg}.`);
      carica();
    } catch (e) {
      setError(e.message);
    } finally {
      setAzione("");
    }
  };

  const handleElimina = () => {
    if (!confirm("Sei sicuro di voler eliminare questa richiesta?")) return;
    eseguiAzione(async () => {
      await deleteRimborso(token, id);
      navigate(isResponsabile ? "/rimborsi" : "/miei-rimborsi");
    }, "eliminazione");
  };

  if (loading) return <p className="text-slate-500">Caricamento...</p>;
  if (!rimborso) return <Alert type="error" message={error || "Richiesta non trovata."} />;

  const isProprietario = rimborso.dipendente === user?.id;
  const inAttesa = rimborso.stato === "IN_ATTESA";
  const approvata = rimborso.stato === "APPROVATA";
  const puoModificare = isProprietario && inAttesa && !isResponsabile;

  const listaUrl = isResponsabile ? "/rimborsi" : "/miei-rimborsi";

  return (
    <div className="max-w-2xl">
      <Link to={listaUrl} className="text-sm text-slate-500 hover:text-slate-800 mb-4 inline-block">
        ← Torna all'elenco
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Richiesta n°{rimborso.id}</h2>
        <StatoBadge stato={rimborso.stato} label={rimborso.stato_display} />
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 text-sm">
        {isResponsabile && (
          <Riga label="Dipendente" value={rimborso.dipendente_nome} />
        )}
        <Riga label="Data spesa" value={formatData(rimborso.data_spesa)} />
        <Riga label="Categoria" value={rimborso.categoria_descrizione} />
        <Riga label="Importo" value={formatEuro(rimborso.importo)} />
        <Riga label="Descrizione" value={rimborso.descrizione} />
        <Riga label="Riferimento giustificativo" value={rimborso.riferimento_giustificativo || "—"} />
        <Riga label="Data inserimento" value={formatData(rimborso.data_inserimento)} />
        {rimborso.data_valutazione && (
          <Riga label="Data valutazione" value={formatData(rimborso.data_valutazione)} />
        )}
        {rimborso.motivazione_rifiuto && (
          <Riga label="Motivazione rifiuto" value={rimborso.motivazione_rifiuto} />
        )}
        {rimborso.data_liquidazione && (
          <Riga label="Data liquidazione" value={formatData(rimborso.data_liquidazione)} />
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {puoModificare && (
          <>
            <Link
              to={`/rimborsi/${id}/modifica`}
              className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700"
            >
              Modifica
            </Link>
            <button
              onClick={handleElimina}
              disabled={!!azione}
              className="px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              Elimina
            </button>
          </>
        )}

        {isResponsabile && inAttesa && (
          <>
            <button
              onClick={() => eseguiAzione(() => approvaRimborso(token, id), "approvazione")}
              disabled={!!azione}
              className="px-4 py-2 bg-green-700 text-white text-sm rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {azione === "approvazione" ? "..." : "Approva"}
            </button>
            <div className="flex gap-2 items-end w-full sm:w-auto">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Motivazione rifiuto (opzionale)"
                  value={motivazione}
                  onChange={(e) => setMotivazione(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={() => eseguiAzione(
                  () => rifiutaRimborso(token, id, motivazione),
                  "rifiuto"
                )}
                disabled={!!azione}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-500 disabled:opacity-50"
              >
                {azione === "rifiuto" ? "..." : "Rifiuta"}
              </button>
            </div>
          </>
        )}

        {isResponsabile && approvata && (
          <button
            onClick={() => eseguiAzione(() => liquidaRimborso(token, id), "liquidazione")}
            disabled={!!azione}
            className="px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {azione === "liquidazione" ? "..." : "Registra liquidazione"}
          </button>
        )}
      </div>
    </div>
  );
}

function Riga({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 text-right max-w-xs">{value}</span>
    </div>
  );
}
