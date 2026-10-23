import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminIcon from "./AdminIcon.jsx";
import "../../styles/admin.css";

const ENLACES = [
  { to: "/admin", texto: "Dashboard", icono: "dashboard", end: true },
  { to: "/admin/products", texto: "Productos", icono: "productos" },
  { to: "/admin/categories", texto: "Categorías", icono: "categorias" },
  { to: "/admin/orders", texto: "Pedidos", icono: "pedidos" },
  { to: "/admin/users", texto: "Usuarios", icono: "usuarios" },
  { to: "/admin/reports", texto: "Reportes", icono: "reportes" },
  { to: "/admin/profile", texto: "Perfil", icono: "perfil" },
];

// Barra lateral del panel de administración (reemplaza al AdminHeader con navbar horizontal).
// NavLink agrega la clase "activo" a la pestaña de la ruta actual, que se resalta con un fondo suave.
export default function AdminSidebar() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div className="admin-marca">
        <strong>MiTienda</strong>
        <span>Admin</span>
      </div>

      <nav className="admin-menu">
        {ENLACES.map(({ to, texto, icono, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "activo" : "")}>
            <AdminIcon nombre={icono} />
            {texto}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-pie">
        <NavLink to="/" className="admin-volver">
          <AdminIcon nombre="volver" tamano={16} />
          Volver a la tienda
        </NavLink>
        <div className="admin-user-box">
          <span className="admin-avatar">{usuario.nombre.charAt(0).toUpperCase()}</span>
          <div>
            <div id="admin-user-name">{usuario.nombre}</div>
            <button type="button" className="admin-logout" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
