const STILI = {
  IN_ATTESA: "bg-yellow-100 text-yellow-800",
  APPROVATA: "bg-green-100 text-green-800",
  RIFIUTATA: "bg-red-100 text-red-800",
  LIQUIDATA: "bg-blue-100 text-blue-800",
};

export function StatoBadge({ stato, label }) {
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${STILI[stato] || "bg-slate-100 text-slate-700"}`}>
      {label || stato}
    </span>
  );
}
