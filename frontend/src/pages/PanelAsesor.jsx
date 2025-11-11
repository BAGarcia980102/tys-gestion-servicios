import FormSolicitud from "./FormSolicitud";
import LogoutButton from "../components/LogoutButton";

export default function PanelAsesor() {
  return (
    <div>
      <LogoutButton />
      <h1>Panel del Asesor</h1>
      <FormSolicitud />
    </div>
  );
}
