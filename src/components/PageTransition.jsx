import { Outlet, useLocation } from "react-router-dom";
import "../styles/page-transition.css";

// Envuelve el contenido de la ruta: al cambiar de página se vuelve a montar el contenedor (key)
// y la animación CSS hace que la nueva página aparezca con un fade-in suave.
export default function PageTransition() {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="page-transition">
      <Outlet />
    </div>
  );
}
