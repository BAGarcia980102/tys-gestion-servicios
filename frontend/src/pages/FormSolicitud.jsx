import { useState } from "react";
import axios from "axios";

export default function FormSolicitud() {
  const [tipo, setTipo] = useState("servicio");
  const [formData, setFormData] = useState({});
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:4000/api/solicitudes", { tipo, ...formData }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("✅ Solicitud creada correctamente");
      setFormData({});
    } catch (err) {
      setMensaje("❌ Error al crear la solicitud");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Crear nueva solicitud</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "500px" }}>
        
        <label>Tipo de solicitud:</label>
        <select name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="servicio">Servicio técnico</option>
          <option value="entrega">Entrega</option>
          <option value="compra">Compra</option>
        </select>

        <input name="cliente" placeholder="Cliente" onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" onChange={handleChange} required />
        <input name="horario" placeholder="Horario de atención" onChange={handleChange} />
        <input name="contacto" placeholder="Nombre de contacto" onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" onChange={handleChange} />

        {/* Campos adicionales según el tipo */}
        {tipo === "servicio" && (
          <>
            <input name="referencia" placeholder="Referencia impresora" onChange={handleChange} />
            <select name="propiedad" onChange={handleChange}>
              <option value="tys">Propia TyS</option>
              <option value="cliente">Del cliente</option>
            </select>
            <input name="activo_fijo" placeholder="Activo fijo (si aplica)" onChange={handleChange} />
            <textarea name="falla" placeholder="Descripción de la falla" onChange={handleChange}></textarea>
            <input name="documentacion" placeholder="Documentación (opcional)" onChange={handleChange} />
          </>
        )}

        {tipo === "entrega" && (
          <>
            <input name="diligencia" placeholder="Diligencia a realizar" onChange={handleChange} />
            <input name="documentacion" placeholder="Documentación que lleva" onChange={handleChange} />
          </>
        )}

        {tipo === "compra" && (
          <>
            <input name="documentacion" placeholder="Documentación (si aplica)" onChange={handleChange} />
          </>
        )}

        <button type="submit" style={{ background: "#F7931D", color: "#fff", border: "none", padding: "10px", borderRadius: "8px" }}>
          Guardar solicitud
        </button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
