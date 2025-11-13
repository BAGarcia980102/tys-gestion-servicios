import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function DetalleSolicitud() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sol, setSol] = useState(null);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/solicitudes/detalle/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSol(res.data);
      } catch (err) {
        console.error(err);
        alert("Error cargando detalle");
      }
    };

    fetchDetalle();
  }, [id]);

  if (!sol) return <p style={{ padding: "40px" }}>Cargando detalle...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "15px" }}>
        ⬅️ Volver
      </button>

      <h1 style={{ color: "#F7931D" }}>Detalle de Solicitud</h1>

      <p><strong>Cliente:</strong> {sol.cliente}</p>
      <p><strong>Dirección:</strong> {sol.direccion}</p>
      <p><strong>Contacto:</strong> {sol.contacto} — {sol.telefono}</p>
      <p><strong>Falla:</strong> {sol.falla}</p>

      <h3 style={{ marginTop: "25px", color: "#F7931D" }}>Informe Técnico</h3>

      <p>{sol.informe_descripcion || "Sin informe cargado."}</p>

      {sol.informe_imagenes && (
        <img
          src={sol.informe_imagenes}
          alt="Evidencia"
          width="250"
          style={{ marginTop: "15px", borderRadius: "10px" }}
        />
      )}
    </div>
  );
}
