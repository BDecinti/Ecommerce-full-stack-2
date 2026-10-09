import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/admin.css";

// Header del panel de administración (antes copiado en cada página admin_*.html)
export default function AdminHeader() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <header className="admin-header">
      <div>
        <Link to="/admin">
          <strong>MiTienda Admin</strong>
        </Link>
      </div>
      <nav>
        <Link to="/admin">Home</Link>
        <Link to="/admin/products">Productos</Link>
        <Link to="/admin/users">Usuarios</Link>
        <Link to="/">Tienda</Link>
      </nav>
      <div className="admin-user-box">
        <span id="admin-user-name">👤 {usuario.nombre}</span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            cerrarSesion();
          }}
        >
          Cerrar sesión
        </a>
      </div>
    </header>
  );
}
