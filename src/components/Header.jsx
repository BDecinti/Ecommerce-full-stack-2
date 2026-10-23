import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthDialog from "./AuthDialog.jsx";
import CategoryDropdown from "./CategoryDropdown.jsx";
import SearchBar from "./SearchBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

// Header de la tienda: logo, Categoría, buscador, sesión y carrito.
export default function Header() {
  const { usuario, cerrarSesion } = useAuth();
  const { cantidadTotal } = useCart();
  const [loginAbierto, setLoginAbierto] = useState(false);
  const cerrarLogin = useCallback(() => setLoginAbierto(false), []);
  const [oculto, setOculto] = useState(false);

  // Se esconde al bajar y reaparece al subir. Siempre se ve cerca del tope de la página
  // y mientras el menú de categorías está abierto (su panel cuelga del header).
  useEffect(() => {
    let anterior = window.scrollY;
    const alScrollear = () => {
      const y = window.scrollY;
      if (y < 80 || document.querySelector(".category-dropdown-fondo"))
        setOculto(false);
      else if (Math.abs(y - anterior) > 4) setOculto(y > anterior);
      anterior = y;
    };
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  return (
    <>
      <AuthDialog abierto={loginAbierto} cerrar={cerrarLogin} />
      <header className={`header${oculto ? " header-oculto" : ""}`}>
        <div className="logo">
          <Link to="/">
            <h2>MiTienda</h2>
          </Link>
        </div>
        <CategoryDropdown />
        <SearchBar />
        <div className="user-menu">
          {usuario ? (
            <span className="user-info-box">
              <span className="user-saludo">Hola, {usuario.nombre}</span>
              {usuario.rol === "admin" && <Link to="/admin">Panel admin</Link>}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  cerrarSesion();
                }}
              >
                Cerrar sesión
              </a>
            </span>
          ) : (
            <button
              className="header-login"
              onClick={() => setLoginAbierto(true)}
            >
              Iniciar sesión
            </button>
          )}
          <Link to="/cart">Carrito ({cantidadTotal})</Link>
        </div>
      </header>
    </>
  );
}
