import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RoleRoute({ children, ruoloRichiesto }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Caricamento...
      </div>
    );
  }

  if (user?.ruolo !== ruoloRichiesto) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
