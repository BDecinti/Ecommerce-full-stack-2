import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import CategoryMenu from "./CategoryMenu.jsx";
import "../styles/category-dropdown.css";

// Botón "Categoría" del navbar (icono de tres barras) que despliega el menú de categorías.
// Se cierra al elegir una categoría, al hacer clic fuera o al presionar Escape. Solo abre y cierra:
// el contenido del menú lo pone CategoryMenu.
export default function CategoryDropdown() {
  const [abierto, setAbierto] = useState(false);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });
  const contenedor = useRef(null);
  const panel = useRef(null);
  const { pathname } = useLocation();

  // Al cambiar de página el menú se cierra
  useEffect(() => setAbierto(false), [pathname]);

  useEffect(() => {
    if (!abierto) return;
    const clicFuera = (e) => {
      const dentro = contenedor.current?.contains(e.target) || panel.current?.contains(e.target);
      if (!dentro) setAbierto(false);
    };
    const tecla = (e) => {
      if (e.key === "Escape") setAbierto(false);
    };
    // El panel está fuera del header (portal), así que se posiciona según el botón
    const posicionar = () => {
      const r = contenedor.current.getBoundingClientRect();
      const ancho = Math.min(300, window.innerWidth * 0.9);
      setPosicion({ top: r.bottom + 10, left: Math.max(8, Math.min(r.left, window.innerWidth - ancho - 8)) });
    };
    posicionar();
    window.addEventListener("resize", posicionar);
    document.addEventListener("mousedown", clicFuera);
    document.addEventListener("keydown", tecla);
    return () => {
      window.removeEventListener("resize", posicionar);
      document.removeEventListener("mousedown", clicFuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  return (
    <div className="category-dropdown" ref={contenedor}>
      <button
        type="button"
        className="category-dropdown-boton"
        aria-expanded={abierto}
        aria-haspopup="true"
        onClick={() => setAbierto(!abierto)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Categoría
      </button>
      {/* Portal al body: así la capa oscura queda sobre toda la página (navbar incluido) y el panel por encima de ella */}
      {abierto &&
        createPortal(
          <>
            <div className="category-dropdown-fondo" aria-hidden="true" />
            <div
              className="category-dropdown-panel"
              ref={panel}
              style={posicion}
              onClick={() => setAbierto(false)}
            >
              <CategoryMenu />
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
