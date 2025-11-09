import FormSolicitud from "./FormSolicitud";
import "./../styles/panelAsesor.css";

export default function PanelAsesor() {
  return (
    <div className="panel-container">
      {/* Cabecera */}
      <header className="panel-header">
        <div className="logo-area">
          <img src="/logo_tys.png" alt="Logo TyS" className="logo-titulo" />
          <h1>Tintas y Suministros del Valle S.A.S.</h1>
        </div>
        <button
          className="btn-logout"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Cerrar sesión
        </button>
      </header>

      {/* Cuerpo principal */}
      <main className="panel-main">
        <section className="panel-section">
          <h2>Crear nueva solicitud</h2>
          <p className="section-description">
            Registra un servicio técnico, entrega o compra. Los campos cambian según el tipo seleccionado.
          </p>
          <FormSolicitud />
        </section>
      </main>
    </div>
  );
}
