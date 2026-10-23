import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb.jsx";
import { useCategorias } from "../../context/CategoryContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { useProductos } from "../../context/ProductContext.jsx";
import { formatearPrecio, rutaImagen } from "../../data/productos.js";
import "../../styles/producto-detalle.css";

// Una sola página para todos los productos: el id viene de la URL (/products/3).
// Antes era productDetail.html?id=3 y un script que rellenaba el DOM a mano.
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { key } = useLocation();
  const { agregar, carrito } = useCart();
  const { obtener } = useProductos();
  const { ruta } = useCategorias();
  const producto = obtener(id);
  const enCarrito = carrito.find((item) => item.id === producto?.id)?.cantidad ?? 0;

  // Vuelve a la página anterior; si se entró directo al producto (sin historial), va a /products
  const volver = () => (key === "default" ? navigate("/products") : navigate(-1));

  useTitulo(producto ? `MiTienda - ${producto.nombre}` : "MiTienda - Producto");

  const migas = [
    { texto: "Home", to: "/" },
    { texto: "Categoría", to: "/categories" },
    ...ruta(producto?.categoriaId).map((c) => ({ texto: c.nombre, to: `/categories/${c.id}` })),
    { texto: producto ? producto.nombre : "Producto no encontrado" },
  ];

  return (
    <>
      <Breadcrumb items={migas} />
      <section className="page-header">
        <h1>Detalle del producto</h1>
      </section>
      <section className="container product-detail card">
        {producto ? (
          <>
            <img src={rutaImagen(producto.imagen)} alt={producto.nombre} />
            <div>
              <h2>{producto.nombre}</h2>
              {producto.marca && <p>Marca: {producto.marca}</p>}
              <p className="price">{formatearPrecio(producto.precio)}</p>
              <p>{producto.descripcion}</p>
              <p>{producto.stock > 0 ? `Stock disponible: ${producto.stock}` : "Sin stock"}</p>
              <button
                type="button"
                disabled={enCarrito >= producto.stock}
                onClick={() => agregar(producto)}
              >
                {producto.stock === 0 ? "Sin stock" : "Añadir al carrito"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={volver}>
                Volver
              </button>
            </div>
          </>
        ) : (
          <div>
            <h2>Producto no encontrado</h2>
            <button type="button" className="btn btn-secondary" onClick={volver}>
              Volver
            </button>
          </div>
        )}
      </section>
    </>
  );
}
