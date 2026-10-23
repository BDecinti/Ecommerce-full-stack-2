import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "../styles/cart-message.css";

const DURACION_MS = 3000;

// Aviso emergente que confirma que un producto se añadió al carrito, con un enlace al carrito.
// Se cierra solo a los 3 segundos; si se añade otro producto antes, el contador se reinicia.
export default function CartMessage() {
  const { aviso, cerrarAviso } = useCart();

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(cerrarAviso, DURACION_MS);
    return () => clearTimeout(temporizador);
  }, [aviso, cerrarAviso]);

  if (!aviso) return null;

  return (
    <div className="cart-message" role="status" aria-live="polite">
      <span className="cart-message-icono">✓</span>
      <span className="cart-message-texto">
        <strong>{aviso.nombre}</strong> se añadió al carrito
      </span>
      <Link className="cart-message-enlace" to="/cart" onClick={cerrarAviso}>
        Ver carrito
      </Link>
    </div>
  );
}
