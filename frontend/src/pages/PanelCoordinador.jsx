import { useEffect } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

export default function PanelCoordinador() {
  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      try {
        await axios.get("http://localhost:4000/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    };

    verificarToken();
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      {/* 🔐 Botón para cerrar sesión */}
      <LogoutButton />

      <h1>Panel del Coordinador</h1>
      <p>Aquí se mostrarán las solicitudes registradas para validar.</p>
    </div>
  );
}
