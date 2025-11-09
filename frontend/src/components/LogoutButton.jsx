export default function LogoutButton() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    window.location.href = "/";
  };
  return <button onClick={logout}>Cerrar sesión</button>;
}
