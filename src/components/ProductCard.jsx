import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatearPrecio, rutaImagen } from "../data/productos.js";

// Tarjeta reutilizable de un producto (antes: crearCardProducto y cargarDestacados en productos.js).
// Con `promo` se muestra la versión del apartado de ofertas del home.
export default function ProductCard({ producto, promo = false }) {
  const { agregar, carrito } = useCart();
  const enCarrito =
    carrito.find((item) => item.id === producto.id)?.cantidad ?? 0;

  return (
    <article className={promo ? "card-producto card-promo" : "card-producto"}>
      {promo && <span className="badge-oferta">Oferta</span>}
      <Link className="card-link" to={`/products/${producto.id}`}>
        <img
          loading="lazy"
          src={rutaImagen(producto.imagen)}
          alt={producto.nombre}
        />
        <h3>{producto.nombre}</h3>
      </Link>
      {producto.marca && <p className="marca-producto">{producto.marca}</p>}
      <p className="descripcion-producto">{producto.descripcion}</p>
      <p className="product-price">{formatearPrecio(producto.precio)}</p>
      <button
        disabled={enCarrito >= producto.stock}
        onClick={() => agregar(producto)}
      >
        {producto.stock === 0 ? "Sin stock" : "Añadir al carrito +"}
      </button>
    </article>
  );
}
