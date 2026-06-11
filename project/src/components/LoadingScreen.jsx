export function LoadingScreen({ label = "Caricamento..." }) {
  return (
    <div className="loading-screen app-bg">
      <div className="flex gap-1.5">
        <span className="loading-dot" style={{ animationDelay: "0ms" }} />
        <span className="loading-dot" style={{ animationDelay: "150ms" }} />
        <span className="loading-dot" style={{ animationDelay: "300ms" }} />
      </div>
      <p className="text-sm font-medium tracking-wide">{label}</p>
    </div>
  );
}
