import { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";

export default function PanelAsesor() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/solicitudes/asesor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSolicitudes(res.data);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    };
    fetchSolicitudes();
  }, []);

  const estadoChip = (estado) => {
    if (estado === "Validada")
      return { label: "Validada", color: "#28a745" }; // verde
    if (estado === "Asignada")
      return { label: "Asignada", color: "#d9534f" }; // rojo
    return { label: "Pendiente", color: "#f0ad4e" }; // amarillo
  };

  const handleSave = async (id) => {
  try {
    await axios.put(
      `http://localhost:4000/api/solicitudes/editar/${id}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Solicitud actualizada correctamente");

    setEditando(null);

    // Actualiza la card en pantalla sin recargar
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...formData } : s))
    );
  } catch (error) {
    console.error(error);
    alert("Error al actualizar la solicitud");
  }
};


  return (
    <div style={{ padding: "40px 60px", fontFamily: "Segoe UI, sans-serif" }}>
      
      {/* --------- HEADER SUPERIOR --------- */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
        <h1 style={{ color: "#F7931D", fontSize: "32px", margin: 0 }}>Mis Solicitudes</h1>
        <LogoutButton />
      </div>

      {/* --------- BOTÓN PARA CREAR NUEVA --------- */}
      <button
        onClick={() => {
  setEditando(s.id);
  setFormData({
    ...s,
    cliente: s.cliente || "",
    direccion: s.direccion || "",
    horario: s.horario || "",
    contacto: s.contacto || "",
    telefono: s.telefono || "",
    referencia: s.referencia || "",
    propiedad: s.propiedad || "cliente",
    activo_fijo: s.activo_fijo || "",
    falla: s.falla || "",
    documentacion: s.documentacion || "",
    diligencia: s.diligencia || "",
  });
}}

        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        + Crear nueva solicitud
      </button>

      {/* --------- GRID DE TARJETAS --------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "30px",
        }}
      >
        {solicitudes.map((s) => {
  const chip = estadoChip(s.estado_validacion);
  const isEditing = editando === s.id;

  return (
    <div
      key={s.id}
      style={{
        border: "2px solid #F7931D",
        borderRadius: "16px",
        padding: "25px",
        background: "#fff",
        boxShadow: "0 4px 15px rgba(0,0,0,0.10)",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* HEADER: Título + estado */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ color: "#F7931D", textTransform: "capitalize" }}>
          {s.tipo}
        </h3>

        <span
          style={{
            background: chip.color,
            color: "#fff",
            padding: "5px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            height: "fit-content",
          }}
        >
          {chip.label}
        </span>
      </div>

      {/* ---------- CAMPOS GENERALES ---------- */}
      {isEditing ? (
        <>
          <input style={{ width: "100%", marginBottom: "8px" }}
            value={formData.cliente}
            onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
            placeholder="Cliente"
          />
          <input style={{ width: "100%", marginBottom: "8px" }}
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            placeholder="Dirección"
          />
          <input style={{ width: "100%", marginBottom: "8px" }}
            value={formData.horario}
            onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
            placeholder="Horario"
          />
          <input style={{ width: "100%", marginBottom: "8px" }}
            value={formData.contacto}
            onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
            placeholder="Contacto"
          />
          <input style={{ width: "100%", marginBottom: "8px" }}
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="Teléfono"
          />
        </>
      ) : (
        <>
          <p><b>Cliente:</b> {s.cliente}</p>
          <p><b>Dirección:</b> {s.direccion}</p>
          <p><b>Horario:</b> {s.horario}</p>
          <p><b>Contacto:</b> {s.contacto}</p>
          <p><b>Teléfono:</b> {s.telefono}</p>
        </>
      )}

      {/* ---------- CAMPOS PARA SERVICIO ---------- */}
      {s.tipo === "servicio" && (
        isEditing ? (
          <>
            <input style={{ width: "100%", marginBottom: "8px" }}
              value={formData.referencia}
              onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
              placeholder="Referencia"
            />

            <select style={{ width: "100%", marginBottom: "8px" }}
              value={formData.propiedad}
              onChange={(e) => setFormData({ ...formData, propiedad: e.target.value })}
            >
              <option value="tys">Propia TyS</option>
              <option value="cliente">Del cliente</option>
            </select>

            {formData.propiedad === "tys" && (
              <input style={{ width: "100%", marginBottom: "8px" }}
                value={formData.activo_fijo}
                onChange={(e) => setFormData({ ...formData, activo_fijo: e.target.value })}
                placeholder="Activo Fijo"
              />
            )}

            <textarea style={{ width: "100%", marginBottom: "8px" }}
              value={formData.falla}
              onChange={(e) => setFormData({ ...formData, falla: e.target.value })}
              placeholder="Descripción de la falla"
            ></textarea>

            <input style={{ width: "100%", marginBottom: "8px" }}
              value={formData.documentacion}
              onChange={(e) => setFormData({ ...formData, documentacion: e.target.value })}
              placeholder="Documentación"
            />
          </>
        ) : (
          <>
            <p><b>Referencia:</b> {s.referencia}</p>
            <p><b>Propiedad:</b> {s.propiedad}</p>
            {s.propiedad === "tys" && <p><b>Activo Fijo:</b> {s.activo_fijo}</p>}
            <p><b>Falla:</b> {s.falla}</p>
            <p><b>Documentación:</b> {s.documentacion}</p>
          </>
        )
      )}

      {/* ---------- CAMPOS PARA ENTREGA ---------- */}
      {s.tipo === "entrega" && (
        isEditing ? (
          <>
            <input style={{ width: "100%", marginBottom: "8px" }}
              value={formData.diligencia}
              onChange={(e) => setFormData({ ...formData, diligencia: e.target.value })}
              placeholder="Diligencia"
            />

            <input style={{ width: "100%", marginBottom: "8px" }}
              value={formData.documentacion}
              onChange={(e) => setFormData({ ...formData, documentacion: e.target.value })}
              placeholder="Documentación"
            />
          </>
        ) : (
          <>
            <p><b>Diligencia:</b> {s.diligencia}</p>
            <p><b>Documentación:</b> {s.documentacion}</p>
          </>
        )
      )}

      {/* ---------- CAMPOS PARA COMPRA ---------- */}
      {s.tipo === "compra" && (
        isEditing ? (
          <>
            <input style={{ width: "100%", marginBottom: "8px" }}
              value={formData.documentacion}
              onChange={(e) => setFormData({ ...formData, documentacion: e.target.value })}
              placeholder="Documentación"
            />
          </>
        ) : (
          <>
            <p><b>Documentación:</b> {s.documentacion}</p>
          </>
        )
      )}

      {/* ---------- BOTONES ---------- */}
      {isEditing ? (
        <button
          onClick={() => handleSave(s.id)}
          style={{
            background: "#F7931D",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "12px",
          }}
        >
          Guardar cambios
        </button>
      ) : (
        s.estado !== "Asignada" &&
        s.estado !== "Finalizada" && (
          <button
            onClick={() => {
              setEditando(s.id);
              setFormData(s);
            }}
            style={{
              marginTop: "12px",
              background: "#ffffff",
              color: "#F7931D",
              border: "2px solid #F7931D",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Editar
          </button>
        )
      )}
    </div>
  );
})}


      </div>
    </div>
  );
}
