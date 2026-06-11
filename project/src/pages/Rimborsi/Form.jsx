import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCategorie } from "../../api/categorie";
import { createRimborso, getRimborso, updateRimborso } from "../../api/rimborsi";
import { Alert } from "../../components/Alert";
import { PageHeader } from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";

const CAMPI_VUOTI = {
  data_spesa: "",
  categoria: "",
  importo: "",
  descrizione: "",
  riferimento_giustificativo: "",
};

export function FormRimborso() {
  const { id } = useParams();
  const isModifica = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(CAMPI_VUOTI);
  const [categorie, setCategorie] = useState([]);
  const [loading, setLoading] = useState(isModifica);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getCategorie(token).then(setCategorie).catch((e) => setError(e.message));

    if (isModifica) {
      getRimborso(token, id)
        .then((r) => {
          if (r.stato !== "IN_ATTESA") {
            setError("Solo le richieste in attesa possono essere modificate.");
            return;
          }
          setForm({
            data_spesa: r.data_spesa,
            categoria: String(r.categoria),
            importo: r.importo,
            descrizione: r.descrizione,
            riferimento_giustificativo: r.riferimento_giustificativo || "",
          });
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [token, id, isModifica]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const body = {
      data_spesa: form.data_spesa,
      categoria: Number(form.categoria),
      importo: form.importo,
      descrizione: form.descrizione,
      riferimento_giustificativo: form.riferimento_giustificativo,
    };

    try {
      if (isModifica) {
        await updateRimborso(token, id, body);
        setSuccess("Richiesta aggiornata con successo.");
        setTimeout(() => navigate(`/rimborsi/${id}`), 1000);
      } else {
        const nuova = await createRimborso(token, body);
        navigate(`/rimborsi/${nuova.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-slate-500 font-medium tracking-wide py-16 text-center">
        Caricamento...
      </p>
    );
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title={isModifica ? "Modifica richiesta" : "Nuova richiesta"}
        subtitle={
          isModifica
            ? "Aggiorna i dati della richiesta in attesa"
            : "Compila il form per inserire una nuova spesa"
        }
      />

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} />

      <form onSubmit={handleSubmit} className="card-accent card-pad space-y-5">
        <div>
          <label className="input-label">Data spesa *</label>
          <input
            type="date"
            name="data_spesa"
            required
            value={form.data_spesa}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="input-label">Categoria *</label>
          <select
            name="categoria"
            required
            value={form.categoria}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Seleziona categoria</option>
            {categorie.map((c) => (
              <option key={c.id} value={c.id}>{c.descrizione}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="input-label">Importo (€) *</label>
          <input
            type="number"
            name="importo"
            required
            min="0.01"
            step="0.01"
            value={form.importo}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="input-label">Descrizione *</label>
          <textarea
            name="descrizione"
            required
            rows={3}
            value={form.descrizione}
            onChange={handleChange}
            className="input-field resize-y"
          />
        </div>

        <div>
          <label className="input-label">Riferimento giustificativo</label>
          <input
            type="text"
            name="riferimento_giustificativo"
            value={form.riferimento_giustificativo}
            onChange={handleChange}
            className="input-field"
            placeholder="Es. numero scontrino, fattura..."
          />
        </div>

        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Salvataggio..." : isModifica ? "Salva modifiche" : "Invia richiesta"}
          </button>
          <Link
            to={isModifica ? `/rimborsi/${id}` : "/miei-rimborsi"}
            className="btn btn-secondary"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}
