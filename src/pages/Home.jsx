import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import useTitulo from "../hooks/useTitulo.js";
import { productos, idsDestacados } from "../data/productos.js";
import "../styles/styles.css";

export default function Home() {
  useTitulo("MiTienda - Home");

  // Productos que se muestran en el apartado de ofertas
  const destacados = idsDestacados
    .map((id) => productos.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <>
      <section className="hero-home">
        <div>
          <h1>Equípate como un pro</h1>
          <p>Controles, teclados, sillas y todo lo que necesitas para subir de nivel.</p>
          <Link className="btn btn-primary" to="/products">
            Ver productos
          </Link>
        </div>
      </section>
      <section className="container promo">
        <h2>Ofertas para gamers</h2>
        <p className="promo-subtitulo">
          Una selección especial pensada para ti, por tiempo limitado.
        </p>
        <div id="grid-promo" className="grid grid-3">
          {destacados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} promo />
          ))}
        </div>
      </section>
      <section className="container featured">
        <h2>Productos destacados</h2>
        <div id="grid-productos" className="grid-productos">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </>
  );
}
