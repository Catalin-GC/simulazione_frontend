const STILI = {
  IN_ATTESA: "bg-yellow-100 text-yellow-900 border-yellow-300",
  APPROVATA: "bg-green-100 text-green-900 border-green-300",
  RIFIUTATA: "bg-red-100 text-red-900 border-red-300",
  LIQUIDATA: "bg-blue-100 text-blue-900 border-blue-300",
};

export function StatoBadge({ stato, label }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border-2 ${
        STILI[stato] || "bg-slate-100 text-slate-700 border-slate-300"
      }`}
    >
      {label || stato}
    </span>
  );
}
