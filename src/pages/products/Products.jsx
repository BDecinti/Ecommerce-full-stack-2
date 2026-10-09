import ProductCard from "../../components/ProductCard.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { productos } from "../../data/productos.js";
import "../../styles/styles.css";

export default function Products() {
  useTitulo("MiTienda - Productos");

  return (
    <>
      <section className="page-header">
        <h1>Productos</h1>
        <p>Revisa nuestro catálogo y selecciona el producto que quieras.</p>
      </section>
      <section className="container">
        <div id="grid-productos" className="grid grid-4">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </>
  );
}
