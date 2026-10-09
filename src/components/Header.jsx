import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

// Header de la tienda. Antes estaba copiado en cada HTML y auth.js lo ajustaba con
// sincronizarHeaderTienda(); ahora se dibuja según el estado de sesión y del carrito.
export default function Header() {
  const { usuario, cerrarSesion } = useAuth();
  const { cantidadTotal } = useCart();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h2>MiTienda</h2>
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Productos</Link>
        <Link to="/about">Nosotros</Link>
        <Link to="/blog">Blogs</Link>
        <Link to="/contact">Contacto</Link>
      </nav>
      <div className="user-menu">
        {!usuario && (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/signup">Registrarse</Link>
          </>
        )}
        <Link to="/cart">🛒 Carrito ({cantidadTotal})</Link>
        {usuario?.rol === "admin" && <Link to="/admin">⚙️ Admin</Link>}
        <span className="user-info-box">
          {usuario && (
            <>
              <span className="user-saludo">Hola, {usuario.nombre}</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  cerrarSesion();
                }}
              >
                Cerrar sesión
              </a>
            </>
          )}
        </span>
      </div>
    </header>
  );
}
