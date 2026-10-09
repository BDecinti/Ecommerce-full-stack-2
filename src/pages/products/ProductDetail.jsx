import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { productos, formatearPrecio, rutaImagen } from "../../data/productos.js";
import "../../styles/producto-detalle.css";

// Una sola página para todos los productos: el id viene de la URL (/products/3).
// Antes era productDetail.html?id=3 y un script que rellenaba el DOM a mano.
export default function ProductDetail() {
  const { id } = useParams();
  const { agregar } = useCart();
  const producto = productos.find((p) => p.id === Number(id));

  useTitulo(producto ? `MiTienda - ${producto.nombre}` : "MiTienda - Producto");

  return (
    <>
      <section className="page-header">
        <h1>Detalle del producto</h1>
      </section>
      <section className="container product-detail card">
        {producto ? (
          <>
            <img src={rutaImagen(producto.imagen)} alt={producto.nombre} />
            <div>
              <h2>{producto.nombre}</h2>
              <p className="price">{formatearPrecio(producto.precio)}</p>
              <p>{producto.descripcion}</p>
              <button type="button" onClick={() => agregar(producto)}>
                Añadir al carrito
              </button>
              <Link className="btn btn-secondary" to="/products">
                Volver a productos
              </Link>
            </div>
          </>
        ) : (
          <div>
            <h2>Producto no encontrado</h2>
            <Link className="btn btn-secondary" to="/products">
              Volver a productos
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
