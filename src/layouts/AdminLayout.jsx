import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AdminHeader from "../components/AdminHeader.jsx";

// Estructura del panel de administración. Reemplaza a protegerAdmin() de auth.js: si no hay sesión
// o el usuario no es admin, se redirige al login antes de dibujar cualquier página del panel.
export default function AdminLayout() {
  const { usuario } = useAuth();

  if (!usuario || usuario.rol !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AdminHeader />
      <main className="admin-main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2026 MiTienda - Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
