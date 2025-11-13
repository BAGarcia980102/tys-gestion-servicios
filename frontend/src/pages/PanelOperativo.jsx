import { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

export default function PanelOperativo() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4000/api/solicitudes/operativo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSolicitudes(res.data);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  // ============================================================
  // 🟩 FUNCIÓN DE CALCULO DE COLOR (HU-12)
  // ============================================================
  const calcularColor = (sol) => {
    const hoy = new Date();

    // Prioridad alta
    if (sol.importancia?.toLowerCase() === "alta") {
      return "#dc3545"; // rojo
    }

    // Próximo a vencer
    if (sol.fecha_vencimiento) {
      const vencimiento = new Date(sol.fecha_vencimiento);
      const diffHoras = (vencimiento - hoy) / (1000 * 3600);

      if (diffHoras <= 24) return "#dc3545"; // rojo
      if (diffHoras <= 48) return "#ff9800"; // naranja
    }

    // Normal
    return "#28a745"; // verde
  };

  // ============================================================

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Cargando solicitudes...</p>;

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        padding: "40px 60px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LogoutButton />
      </div>

      <h1
        style={{
          color: "#F7931D",
          textAlign: "center",
          fontWeight: "700",
          marginBottom: "10px",
        }}
      >
        Panel del Operativo
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#444",
          marginBottom: "40px",
          fontSize: "16px",
        }}
      >
        Verifica tus solicitudes asignadas para realizar los servicios o entregas programadas.
      </p>

      {solicitudes.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No tienes solicitudes asignadas.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "25px",
          }}
        >
          {solicitudes.map((s) => {
            let tipo = s.tipo?.toLowerCase() || "sin tipo";
            if (tipo.includes("servicio")) tipo = "servicio";
            if (tipo.includes("entrega")) tipo = "entrega";
            if (tipo.includes("compra")) tipo = "compra";

            return (
              <div
                key={s.id}
                style={{
                  backgroundColor: "#fff",

                  // ============================================================
                  // 🟥🟧🟩 BORDE SEGÚN IMPORTANCIA (HU-12)
                  // ============================================================
                  border: `3px solid ${calcularColor(s)}`,
                  // ============================================================

                  borderRadius: "14px",
                  padding: "20px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
                }}
              >
                <h3
                  style={{
                    color:
                      tipo === "entrega"
                        ? "#28a745"
                        : tipo === "compra"
                        ? "#007bff"
                        : "#F7931D",
                    textTransform: "uppercase",
                    fontWeight: "700",
                    marginBottom: "10px",
                    fontSize: "18px",
                  }}
                >
                  {s.tipo || "SIN TIPO"}
                </h3>

                {/* Campos comunes */}
                <p><strong>Cliente:</strong> {s.cliente}</p>
                <p><strong>Dirección:</strong> {s.direccion}</p>
                <p><strong>Horario:</strong> {s.horario}</p>
                <p><strong>Contacto:</strong> {s.contacto} ({s.telefono})</p>

                {/* Servicio Técnico */}
                {tipo === "servicio" && (
                  <>
                    <p><strong>Referencia impresora:</strong> {s.referencia}</p>
                    <p><strong>Propiedad:</strong> {s.propiedad}</p>
                    {s.propiedad?.toLowerCase() === "tys" && (
                      <p><strong>Activo fijo:</strong> {s.activo_fijo}</p>
                    )}
                    <p><strong>Falla:</strong> {s.falla}</p>
                    <p><strong>Documentación:</strong> {s.documentacion}</p>
                  </>
                )}

                {/* Entrega */}
                {tipo === "entrega" && (
                  <>
                    <p><strong>Diligencia a realizar:</strong> {s.diligencia}</p>
                    <p><strong>Documentación:</strong> {s.documentacion}</p>
                  </>
                )}

                {/* Compra */}
                {tipo === "compra" && (
                  <>
                    <p><strong>Documentación:</strong> {s.documentacion}</p>
                  </>
                )}

                {/* Estado */}
                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    style={{
                      color: s.estado === "Asignada" ? "#28a745" : "#ff8c00",
                      fontWeight: "600",
                    }}
                  >
                    {s.estado}
                  </span>
                </p>

                {/* Fecha */}
                <p style={{ fontSize: "13px", color: "#777", marginTop: "8px" }}>
                  Fecha: {new Date(s.fecha_creacion).toLocaleString("es-CO")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
