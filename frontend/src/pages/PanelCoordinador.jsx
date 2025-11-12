import { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

export default function PanelCoordinador() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [operativos, setOperativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSolicitudes = await axios.get("http://localhost:4000/api/solicitudes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSolicitudes(resSolicitudes.data);

        const resOperativos = await axios.get("http://localhost:4000/api/usuarios/operativos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOperativos(resOperativos.data);
      } catch (error) {
        console.error("Error al cargar datos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const asignarSolicitud = async (id, operativo_id) => {
    if (!operativo_id) return;
    try {
      const res = await axios.put(
        `http://localhost:4000/api/solicitudes/asignar/${id}`,
        { operativo_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { tiempo, fecha_asignacion, operativo } = res.data;
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, estado: "Asignada", operativo_asignado: operativo, fecha_asignacion, tiempo_asignacion: tiempo }
            : s
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error al asignar la solicitud");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Cargando solicitudes...</p>;

  // 🎨 Colores según tipo de solicitud
  const tipoColor = {
    servicio: "#F7931D",
    entrega: "#28a745",
    compra: "#007bff",
  };

  // 🎨 Colores de estado
  const estadoColor = {
    Asignada: "#28a745",
    Pendiente: "#ff8c00",
  };

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        padding: "40px 60px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#F7931D",
          textAlign: "center",
          fontWeight: "700",
          marginBottom: "10px",
        }}
      >
         {/* 🔸 BOTÓN DE CERRAR SESIÓN */}
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
      <LogoutButton />
    </div>
        Panel del Coordinador

      </h1>
      <p style={{ textAlign: "center", color: "#444", marginBottom: "40px", fontSize: "16px" }}>
        Administra las solicitudes, asigna operativos y controla el estado de cada tarea.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "25px",
        }}
      >
        {solicitudes.map((s) => {
  const tipo = s.tipo?.toLowerCase() || "otro";
  const esIncompleta = !s.cliente || !s.direccion || !s.contacto || !s.telefono;
  const colorBorde =
    s.estado_validacion === "Validada"
      ? "#28a745"
      : esIncompleta
      ? "#dc3545"
      : tipoColor[tipo] || "#F7931D";

  return (
    <div
      key={s.id}
      style={{
        backgroundColor: "#fff",
        border: `2px solid ${colorBorde}`,
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
      <div
        style={{
          backgroundColor: tipoColor[tipo],
          color: "white",
          display: "inline-block",
          padding: "5px 12px",
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: "600",
          marginBottom: "10px",
          textTransform: "uppercase",
        }}
      >
        {s.tipo}
      </div>

      <p><strong>Cliente:</strong> {s.cliente || "—"}</p>
      <p><strong>Dirección:</strong> {s.direccion || "—"}</p>
      <p><strong>Horario:</strong> {s.horario || "—"}</p>
      <p><strong>Contacto:</strong> {s.contacto || "—"}</p>
      <p><strong>Teléfono:</strong> {s.telefono || "—"}</p>
      <p><strong>Creado por:</strong> {s.asesor || "—"}</p>

      {/* Servicio técnico */}
      {tipo === "servicio" && (
        <>
          <p><strong>Referencia impresora:</strong> {s.referencia || "—"}</p>
          <p><strong>Propiedad:</strong> {s.propiedad || "—"}</p>
          {s.propiedad?.toLowerCase() === "tys" && (
            <p><strong>Activo fijo:</strong> {s.activo_fijo || "—"}</p>
          )}
          <p><strong>Falla:</strong> {s.falla || "—"}</p>
          <p><strong>Documentación:</strong> {s.documentacion || "—"}</p>
        </>
      )}

      {tipo === "entrega" && (
        <>
          <p><strong>Diligencia:</strong> {s.diligencia || "—"}</p>
          <p><strong>Documentación:</strong> {s.documentacion || "—"}</p>
        </>
      )}

      {tipo === "compra" && <p><strong>Documentación:</strong> {s.documentacion || "—"}</p>}

      <p>
        <strong>Estado:</strong>{" "}
        <span
          style={{
            backgroundColor: estadoColor[s.estado] || "#ccc",
            color: "white",
            padding: "3px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {s.estado}
        </span>
      </p>

      {s.operativo_asignado && (
        <p><strong>Operativo asignado:</strong> {s.operativo_asignado}</p>
      )}

      {s.fecha_asignacion && (
        <p>
          <strong>Fecha de asignación:</strong>{" "}
          {new Date(s.fecha_asignacion).toLocaleString("es-CO")}
        </p>
      )}

      <p style={{ fontSize: "13px", color: "#777", marginTop: "8px" }}>
        <strong>Creada:</strong>{" "}
        {new Date(s.fecha_creacion).toLocaleString("es-CO")}
      </p>

      {/* 🔴 Marcador de incompletas */}
      {esIncompleta && (
        <p style={{ color: "#dc3545", fontWeight: "bold" }}>
          ⚠️ Información incompleta — Notificar asesora.
        </p>
      )}

      {/* 🟢 Botón de validación */}
      {!esIncompleta && s.estado_validacion !== "Validada" && (
        <button
          onClick={async () => {
            try {
              await axios.put(
                `http://localhost:4000/api/solicitudes/validar/${s.id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setSolicitudes((prev) =>
                prev.map((item) =>
                  item.id === s.id
                    ? { ...item, estado_validacion: "Validada" }
                    : item
                )
              );
              alert("Solicitud validada correctamente ✅");
            } catch (err) {
              console.error(err);
              alert("Error al validar la solicitud");
            }
          }}
          style={{
            backgroundColor: "#F7931D",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: "600",
            marginTop: "10px",
          }}
        >
          Validar solicitud
        </button>
      )}      
      
      {/* Selector de operativo */}
      {s.estado !== "Asignada" &&
        // 🔸 Solo ocultar selector si es un servicio técnico de impresora propia (TYS) no validado
        !(
          s.tipo?.toLowerCase().includes("servicio técnico") &&
          s.propiedad?.toLowerCase() === "tys" &&
          s.estado_validacion !== "Validada"
        ) && (
          <div style={{ marginTop: "15px" }}>
            <select
              onChange={(e) => asignarSolicitud(s.id, e.target.value)}
              defaultValue=""
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                backgroundColor: "#fafafa",
                cursor: "pointer",
              }}
            >
              <option value="">Seleccionar operativo...</option>
              {operativos.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

      {s.tipo?.toLowerCase().includes("servicio") &&
        s.propiedad?.toLowerCase() === "tys" &&
        s.estado_validacion !== "Validada" && (
          <p style={{ color: "#dc3545", fontWeight: "600", marginTop: "8px" }}>
            ⚠️ Debe validarse antes de poder asignar a un técnico.
          </p>
        )
      }


    </div>
  );
})}

      </div>
    </div>
  );
}
