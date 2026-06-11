const STATI = [
  { value: "", label: "Tutti gli stati" },
  { value: "IN_ATTESA", label: "In attesa" },
  { value: "APPROVATA", label: "Approvata" },
  { value: "RIFIUTATA", label: "Rifiutata" },
  { value: "LIQUIDATA", label: "Liquidata" },
];

export function FiltriRimborsi({
  filtri,
  onChange,
  onFiltra,
  categorie = [],
  dipendenti = [],
  showDipendente = false,
}) {
  const handleChange = (e) => {
    onChange((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onFiltra();
      }}
      className="card card-pad mb-6"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
        Filtra richieste
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="input-label">Stato</label>
          <select
            name="stato"
            value={filtri.stato}
            onChange={handleChange}
            className="input-field"
          >
            {STATI.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="input-label">Categoria</label>
          <select
            name="categoria"
            value={filtri.categoria}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Tutte le categorie</option>
            {categorie.map((c) => (
              <option key={c.id} value={c.id}>{c.descrizione}</option>
            ))}
          </select>
        </div>

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

        {showDipendente && (
          <div>
            <label className="input-label">Dipendente</label>
            <select
              name="dipendente"
              value={filtri.dipendente}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Tutti i dipendenti</option>
              {dipendenti.map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
        <button type="submit" className="btn btn-primary">
          Applica filtri
        </button>
        <button
          type="button"
          onClick={() => {
            onChange({ stato: "", categoria: "", mese: "", dipendente: "" });
            onFiltra({ stato: "", categoria: "", mese: "", dipendente: "" });
          }}
          className="btn btn-secondary"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
