import { useState } from "react";
import axios from "axios";
import "./../styles/formSolicitud.css";

export default function FormSolicitud() {
  const [tipo, setTipo] = useState("servicio");
  const [formData, setFormData] = useState({
    cliente: "",
    direccion: "",
    horario: "",
    contacto: "",
    telefono: "",
    referencia: "",
    propiedad: "tys",
    activo_fijo: "",
    falla: "",
    documentacion: "",
    diligencia: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false); // <- para evitar doble envío

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      cliente: "",
      direccion: "",
      horario: "",
      contacto: "",
      telefono: "",
      referencia: "",
      propiedad: "tys",
      activo_fijo: "",
      falla: "",
      documentacion: "",
      diligencia: ""
    });
    setTipo("servicio");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:4000/api/solicitudes",
        { tipo, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje("✅ Solicitud creada correctamente");
      resetForm();
      setTimeout(() => setMensaje(""), 4000);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al crear la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solicitud-wrapper">
      <div className="solicitud-card">
        <h2>📝 Nueva solicitud</h2>
        <p className="subtitle">
          Crea una solicitud de servicio técnico, entrega o compra.
        </p>

        <form onSubmit={handleSubmit} className="solicitud-form">
          <div className="form-group">
            <label>Tipo de solicitud:</label>
            <select
              name="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="servicio">Servicio técnico</option>
              <option value="entrega">Entrega</option>
              <option value="compra">Compra</option>
            </select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Cliente *</label>
              <input
                name="cliente"
                value={formData.cliente}
                placeholder="Nombre del cliente"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Dirección *</label>
              <input
                name="direccion"
                value={formData.direccion}
                placeholder="Dirección completa"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Horario de atención</label>
              <input
                name="horario"
                value={formData.horario}
                placeholder="Ej. 8:00 a.m. - 5:00 p.m."
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Nombre de contacto</label>
              <input
                name="contacto"
                value={formData.contacto}
                placeholder="Persona de contacto"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                name="telefono"
                value={formData.telefono}
                placeholder="Número de contacto"
                onChange={handleChange}
              />
            </div>
          </div>

          {tipo === "servicio" && (
            <div className="form-section">
              <h4>Detalles del servicio técnico</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Referencia impresora</label>
                  <input
                    name="referencia"
                    value={formData.referencia}
                    placeholder="Ej. HP LaserJet Pro MFP M426"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Propiedad</label>
                  <select
                    name="propiedad"
                    value={formData.propiedad}
                    onChange={handleChange}
                  >
                    <option value="tys">Propia TyS</option>
                    <option value="cliente">Del cliente</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Activo fijo (si aplica)</label>
                  <input
                    name="activo_fijo"
                    value={formData.activo_fijo}
                    placeholder="Código de activo"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group full">
                <label>Descripción de la falla</label>
                <textarea
                  name="falla"
                  value={formData.falla}
                  placeholder="Describe brevemente el problema..."
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="form-group full">
                <label>Documentación (opcional)</label>
                <input
                  name="documentacion"
                  value={formData.documentacion}
                  placeholder="Adjuntos o notas relevantes"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {tipo === "entrega" && (
            <div className="form-section">
              <h4>Detalles de la entrega</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Diligencia a realizar</label>
                  <input
                    name="diligencia"
                    value={formData.diligencia}
                    placeholder="Ej. Entrega de tóner o insumos"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Documentación</label>
                  <input
                    name="documentacion"
                    value={formData.documentacion}
                    placeholder="Guía, factura, remisión..."
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {tipo === "compra" && (
            <div className="form-section">
              <h4>Detalles de la compra</h4>
              <div className="form-group full">
                <label>Documentación (si aplica)</label>
                <input
                  name="documentacion"
                  value={formData.documentacion}
                  placeholder="Factura, orden de compra..."
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`btn-enviar ${loading ? "disabled" : ""}`}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar solicitud"}
          </button>

          {mensaje && <div className="alerta">{mensaje}</div>}
        </form>
      </div>
    </div>
  );
}
