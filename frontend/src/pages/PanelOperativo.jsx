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
      } catch (err) {
        console.error("Error al cargar solicitudes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitudes();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 style={{ color: "#F7931D" }}>Cargando solicitudes...</h2>
      </div>
    );

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", padding: "30px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#000", fontWeight: "700" }}>Solicitudes asignadas</h1>
        <LogoutButton />
      </div>

      {solicitudes.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          No tienes solicitudes asignadas por el momento.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "24px",
            marginTop: "40px",
          }}
        >
          {solicitudes.map((s) => (
            <div
              key={s.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                overflow: "hidden",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
              }}
            >
              {/* Encabezado tipo de solicitud */}
              <div
                style={{
                  backgroundColor:
                    s.tipo === "servicio"
                      ? "#F7931D"
                      : s.tipo === "entrega"
                      ? "#1E88E5"
                      : "#43A047",
                  color: "#fff",
                  padding: "10px 16px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {s.tipo}
              </div>

              {/* Cuerpo de la tarjeta */}
              <div style={{ padding: "16px 20px" }}>
                <p><strong>Cliente:</strong> {s.cliente}</p>
                <p><strong>Dirección:</strong> {s.direccion}</p>
                <p><strong>Horario:</strong> {s.horario ?? "—"}</p>
                <p><strong>Contacto:</strong> {s.contacto} ({s.telefono})</p>

                {/* Información adicional */}
                {s.referencia && (
                  <p><strong>Referencia impresora:</strong> {s.referencia}</p>
                )}
                {s.propiedad && (
                  <p><strong>Propiedad:</strong> {s.propiedad === "tys" ? "Propia TyS" : "Del cliente"}</p>
                )}
                {s.activo_fijo && (
                  <p><strong>Activo fijo:</strong> {s.activo_fijo}</p>
                )}

                {/* Diligencia o falla */}
                {s.diligencia && (
                  <div style={{ marginTop: "8px" }}>
                    <strong>Diligencia:</strong>
                    <p style={{ marginTop: "4px", background: "#f9f9f9", padding: "8px", borderRadius: "6px", fontSize: "0.9em" }}>
                      {s.diligencia}
                    </p>
                  </div>
                )}
                {s.falla && (
                  <div style={{ marginTop: "8px" }}>
                    <strong>Falla reportada:</strong>
                    <p style={{ marginTop: "4px", background: "#fff6f0", padding: "8px", borderRadius: "6px", fontSize: "0.9em" }}>
                      {s.falla}
                    </p>
                  </div>
                )}
                {s.documentacion && (
                  <div style={{ marginTop: "8px" }}>
                    <strong>Documentación:</strong>
                    <p style={{ marginTop: "4px", background: "#f9f9f9", padding: "8px", borderRadius: "6px", fontSize: "0.9em" }}>
                      {s.documentacion}
                    </p>
                  </div>
                )}

                {/* Línea divisoria */}
                <hr style={{ margin: "16px 0", border: "0.5px solid #eee" }} />

                {/* Fecha y estado */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "0.85em", color: "#555" }}>
                    Asignada el:{" "}
                    {s.fecha_creacion
                      ? new Date(s.fecha_creacion).toLocaleString("es-CO")
                      : "—"}
                  </p>

                  <div
                    style={{
                      backgroundColor: "#F7931D",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "0.85em",
                      fontWeight: "bold",
                    }}
                  >
                    {s.estado?.toUpperCase() || "PENDIENTE"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
