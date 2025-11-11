import { useState } from "react";
import axios from "axios";
import "../styles/FormSolicitud.css";

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
      await axios.post(
        "http://localhost:4000/api/solicitudes",
        { tipo, ...formData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMensaje("✅ Solicitud creada correctamente");
      setFormData({});
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al crear la solicitud");
    }
  };

  return (
    <div className="solicitud-container">
      <div className="solicitud-card">
        <h2>🧾 Crear nueva solicitud</h2>

        <form onSubmit={handleSubmit} className="solicitud-form">
          {/* 🔸 Campo de tipo de solicitud */}
          <div className="form-section">
            <h3>Tipo de solicitud</h3>
            <select
              name="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="input-select"
            >
              <option value="servicio">Servicio técnico</option>
              <option value="entrega">Entrega</option>
              <option value="compra">Compra</option>
            </select>
          </div>

          {/* 🔹 Información del cliente */}
          <div className="form-section">
            <h3>Información del cliente</h3>
            <div className="form-grid">
              <input
                name="cliente"
                placeholder="Cliente"
                onChange={handleChange}
                required
              />
              <input
                name="direccion"
                placeholder="Dirección"
                onChange={handleChange}
                required
              />
              <input
                name="horario"
                placeholder="Horario de atención"
                onChange={handleChange}
              />
              <input
                name="contacto"
                placeholder="Nombre de contacto"
                onChange={handleChange}
              />
              <input
                name="telefono"
                placeholder="Teléfono"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 🔹 Sección condicional según tipo */}
          {tipo === "servicio" && (
            <div className="form-section">
              <h3>Detalles del servicio técnico</h3>
              <div className="form-grid">
                <input
                  name="referencia"
                  placeholder="Referencia impresora"
                  onChange={handleChange}
                />
                <select name="propiedad" onChange={handleChange}>
                  <option value="tys">Propia TyS</option>
                  <option value="cliente">Del cliente</option>
                </select>
                <input
                  name="activo_fijo"
                  placeholder="Activo fijo (si aplica)"
                  onChange={handleChange}
                />
                <textarea
                  name="falla"
                  placeholder="Descripción de la falla"
                  onChange={handleChange}
                ></textarea>
                <input
                  name="documentacion"
                  placeholder="Documentación (opcional)"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {tipo === "entrega" && (
            <div className="form-section">
              <h3>Detalles de la entrega</h3>
              <div className="form-grid">
                <input
                  name="diligencia"
                  placeholder="Diligencia a realizar"
                  onChange={handleChange}
                />
                <input
                  name="documentacion"
                  placeholder="Documentación que lleva"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {tipo === "compra" && (
            <div className="form-section">
              <h3>Detalles de la compra</h3>
              <div className="form-grid">
                <input
                  name="documentacion"
                  placeholder="Documentación (si aplica)"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* 🔸 Botón guardar */}
          <button type="submit" className="btn-guardar">
            Guardar solicitud
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}
