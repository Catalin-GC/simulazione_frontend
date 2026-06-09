import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { RoleRoute } from "./components/RoleRoute";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { DettaglioRimborso } from "./pages/Rimborsi/Dettaglio";
import { FormRimborso } from "./pages/Rimborsi/Form";
import { ListaRimborsi } from "./pages/Rimborsi/Lista";
import { Statistiche } from "./pages/Statistiche";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/miei-rimborsi" element={<ListaRimborsi />} />
        <Route path="/rimborsi" element={<ListaRimborsi />} />

        <Route
          path="/rimborsi/nuova"
          element={
            <RoleRoute ruoloRichiesto="DIPENDENTE">
              <FormRimborso />
            </RoleRoute>
          }
        />
        <Route
          path="/rimborsi/:id/modifica"
          element={
            <RoleRoute ruoloRichiesto="DIPENDENTE">
              <FormRimborso />
            </RoleRoute>
          }
        />
        <Route path="/rimborsi/:id" element={<DettaglioRimborso />} />

        <Route
          path="/statistiche"
          element={
            <RoleRoute ruoloRichiesto="RESPONSABILE">
              <Statistiche />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
