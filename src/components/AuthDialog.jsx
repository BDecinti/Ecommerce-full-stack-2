import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
export default function AuthDialog({ abierto, cerrar }) {
  const dialogo = useRef(null);
  const { pathname } = useLocation();
  const anterior = useRef(pathname);
  useEffect(() => {
    const d = dialogo.current;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);
  useEffect(() => {
    if (pathname !== anterior.current) cerrar();
    anterior.current = pathname;
  }, [pathname, cerrar]);
  return (
    <dialog
      ref={dialogo}
      className="auth-dialog"
      aria-label="Iniciar sesión"
      onCancel={cerrar}
      onClick={(e) => {
        if (e.target === dialogo.current) cerrar();
      }}
    >
      <button
        className="dialog-close btn-dark"
        aria-label="Cerrar inicio de sesión"
        onClick={cerrar}
      >
        ×
      </button>
      {abierto && <Login onSuccess={cerrar} modal />}
    </dialog>
  );
}
