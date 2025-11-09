import { useEffect, useState } from "react";

export default function PrivateRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN DETECTADO EN PRIVATE ROUTE:", token);
    setIsAuth(!!token);
  }, []);

  if (isAuth === null) {
    console.log("Esperando verificación...");
    return <div>Verificando sesión...</div>;
  }

  if (!isAuth) {
    console.log("No hay token → debería redirigir al login");
    // 🚨 Por ahora NO redirigimos, solo mostramos el mensaje:
    return <div>Acceso denegado (debug mode)</div>;
  }

  return children;
}
