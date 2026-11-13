import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
export default function RequireRole({ roles, children }) {
  const { usuario, ready } = useAuth(),
    location = useLocation();
  if (!ready)
    return (
      <section className="container session-status" role="status">
        Restaurando tu sesión…
      </section>
    );
  if (!usuario)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(usuario.rol))
    return (
      <section className="container result-card card">
        <p className="eyebrow">ACCESO RESTRINGIDO</p>
        <h1>No tienes permiso para esta sección</h1>
        <p>Tu cuenta no puede realizar esta acción.</p>
        <a className="btn btn-primary" href="/">
          Volver a la tienda
        </a>
      </section>
    );
  return children;
}
