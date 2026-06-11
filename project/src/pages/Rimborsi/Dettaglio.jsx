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

  if (loading) {
    return (
      <p className="text-slate-500 font-medium tracking-wide py-16 text-center">
        Caricamento...
      </p>
    );
  }

  if (!rimborso) return <Alert type="error" message={error || "Richiesta non trovata."} />;

  const isProprietario = rimborso.dipendente === user?.id;
  const inAttesa = rimborso.stato === "IN_ATTESA";
  const approvata = rimborso.stato === "APPROVATA";
  const puoModificare = isProprietario && inAttesa && !isResponsabile;
  const listaUrl = isResponsabile ? "/rimborsi" : "/miei-rimborsi";

  return (
    <div className="max-w-2xl">
      <Link
        to={listaUrl}
        className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 mb-6 inline-block"
      >
        ← Torna all&apos;elenco
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-200">
        <div>
          <h1 className="page-title">Richiesta #{rimborso.id}</h1>
          <p className="page-subtitle">Dettaglio completo della richiesta</p>
        </div>
        <StatoBadge stato={rimborso.stato} label={rimborso.stato_display} />
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="card-accent card-pad space-y-0 text-sm">
        {isResponsabile && (
          <Riga label="Dipendente" value={rimborso.dipendente_nome} />
        )}
        <Riga label="Data spesa" value={formatData(rimborso.data_spesa)} />
        <Riga label="Categoria" value={rimborso.categoria_descrizione} />
        <Riga label="Importo" value={formatEuro(rimborso.importo)} highlight />
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
            <Link to={`/rimborsi/${id}/modifica`} className="btn btn-primary">
              Modifica
            </Link>
            <button
              onClick={handleElimina}
              disabled={!!azione}
              className="btn btn-danger-outline"
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
              className="btn btn-success"
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
                  className="input-field"
                />
              </div>
              <button
                onClick={() => eseguiAzione(
                  () => rifiutaRimborso(token, id, motivazione),
                  "rifiuto"
                )}
                disabled={!!azione}
                className="btn btn-danger"
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
            className="btn btn-info"
          >
            {azione === "liquidazione" ? "..." : "Registra liquidazione"}
          </button>
        )}
      </div>
    </div>
  );
}

function Riga({ label, value, highlight }) {
  return (
    <div className="flex justify-between gap-4 py-3.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
        {label}
      </span>
      <span
        className={`text-right max-w-xs ${
          highlight ? "font-display text-xl font-bold text-slate-800" : "font-medium text-slate-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
