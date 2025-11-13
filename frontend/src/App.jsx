import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PanelCoordinador from "./pages/PanelCoordinador";
import PanelOperativo from "./pages/PanelOperativo";
import PanelGerente from "./pages/PanelGerente";
import PanelAsesor from "./pages/PanelAsesor";
import PrivateRoute from "./routes/PrivateRoute";
import FormSolicitud from "./pages/FormSolicitud";
import DetalleSolicitud from "./pages/DetalleSolicitud";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/panel-coordinador" element={<PrivateRoute><PanelCoordinador /></PrivateRoute>} />
        <Route path="/panel-operativo" element={<PrivateRoute><PanelOperativo /></PrivateRoute>} />
        <Route path="/panel-gerente" element={<PrivateRoute><PanelGerente /></PrivateRoute>} />
        <Route path="/panel-asesor" element={<PrivateRoute><PanelAsesor /></PrivateRoute>} />
        <Route path="/solicitud" element={<PrivateRoute><FormSolicitud /></PrivateRoute>} />
        <Route path="/detalle-solicitud/:id" element={<PrivateRoute><DetalleSolicitud /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
