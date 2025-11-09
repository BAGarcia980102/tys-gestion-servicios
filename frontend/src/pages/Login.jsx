import { useState } from "react";
import axios from "axios";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const res = await axios.post("http://localhost:4000/api/auth/login", { email, password });
    
    // Guarda el token ANTES de redirigir
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("rol", res.data.rol);
    
    // Espera un instante antes de redirigir
    setTimeout(() => {
      window.location.href = res.data.panel;
    });
  } catch (err) {
    setError("Credenciales incorrectas o usuario no encontrado");
  }
};

  return (
    <div className="login-container">
      <h2>Inicio de sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
