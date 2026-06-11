const STILI = {
  error: "border-red-300 bg-red-50 text-red-800 border-l-red-500",
  success: "border-green-300 bg-green-50 text-green-800 border-l-green-600",
  info: "border-blue-300 bg-blue-50 text-blue-800 border-l-blue-600",
};

export function Alert({ type = "error", message, onClose }) {
  if (!message) return null;

  return (
    <div
      className={`mb-5 border-2 border-l-4 px-4 py-3 text-sm flex justify-between items-start gap-3 ${STILI[type]}`}
    >
      <span className="font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="font-bold opacity-50 hover:opacity-100 shrink-0"
          aria-label="Chiudi"
        >
          ×
        </button>
      )}
    </div>
  );
}
