import { Navigate } from "react-router-dom";
import PageTransition from "../components/PageTransition.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
// Estructura del panel de administración. Reemplaza a protegerAdmin() de auth.js: si no hay sesión
// o el usuario no es admin, se redirige al login antes de dibujar cualquier página del panel.
export default function AdminLayout() {
  const { usuario, sesionCerrada } = useAuth();

  if (!usuario || usuario.rol !== "admin") {
    // Si acaba de cerrar sesión va al home; si es un visitante sin sesión, al login
    return <Navigate to={sesionCerrada ? "/" : "/login"} replace />;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <PageTransition />
      </main>
    </div>
  );
}
