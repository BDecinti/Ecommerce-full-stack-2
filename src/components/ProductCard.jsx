import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatearPrecio, rutaImagen } from "../data/productos.js";

// Tarjeta reutilizable de un producto (antes: crearCardProducto y cargarDestacados en productos.js).
// Con `promo` se muestra la versión del apartado de ofertas del home.
export default function ProductCard({ producto, promo = false }) {
  const { agregar } = useCart();

  return (
    <article className={promo ? "card-producto card-promo" : "card-producto"}>
      {promo && <span className="badge-oferta">Oferta</span>}
      <Link className="card-link" to={`/products/${producto.id}`}>
        <img src={rutaImagen(producto.imagen)} alt={producto.nombre} />
        <h3>{producto.nombre}</h3>
      </Link>
      <p className="descripcion-producto">{producto.descripcion}</p>
      <p>Precio: {formatearPrecio(producto.precio)}</p>
      <button onClick={() => agregar(producto)}>Añadir al Carrito</button>
    </article>
  );
}
