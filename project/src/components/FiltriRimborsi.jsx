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
      onSubmit={(e) => { e.preventDefault(); onFiltra(); }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
    >
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Stato</label>
        <select
          name="stato"
          value={filtri.stato}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {STATI.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Categoria</label>
        <select
          name="categoria"
          value={filtri.categoria}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Tutte le categorie</option>
          {categorie.map((c) => (
            <option key={c.id} value={c.id}>{c.descrizione}</option>
          ))}
        </select>
      </div>

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

      {showDipendente && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Dipendente</label>
          <select
            name="dipendente"
            value={filtri.dipendente}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Tutti i dipendenti</option>
            {dipendenti.map((d) => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>
        </div>
      )}

      <div className="sm:col-span-2 lg:col-span-4 flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700"
        >
          Applica filtri
        </button>
        <button
          type="button"
          onClick={() => {
            onChange({ stato: "", categoria: "", mese: "", dipendente: "" });
            onFiltra({ stato: "", categoria: "", mese: "", dipendente: "" });
          }}
          className="px-4 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
