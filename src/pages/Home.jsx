import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import useTitulo from "../hooks/useTitulo.js";
import { useProductos } from "../context/ProductContext.jsx";
import ProductImage from "../components/ProductImage.jsx";
import { OFERTAS_ID } from "../data/categorias.js";
import { imagenesCategorias } from "../data/imagenesCategorias.js";
import "../styles/styles.css";
export default function Home() {
  useTitulo("MiTienda - Tu próximo nivel");
  const { productos } = useProductos();
  const destacados = [
    ...productos.filter((p) => p.destacado),
    ...productos.filter((p) => !p.destacado),
  ].slice(0, 4);
  const seleccion = productos
    .filter((p) => !destacados.some((d) => d.id === p.id) && p.stock > 0)
    .slice(0, 4);
  return (
    <>
      <section className="store-hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="live-dot" /> EQUIPA TU PRÓXIMA PARTIDA
          </p>
          <h1>
            Tu setup.
            <br />
            Tu estilo.
            <br />
            <em>Tu próximo nivel.</em>
          </h1>
          <p>
            Periféricos, consolas y tecnología para disfrutar cada partida.
            Encuentra lo que le falta a tu espacio.
          </p>
          <div className="actions">
            <Link className="btn btn-primary" to="/categories">
              Explorar categorías ↗
            </Link>
            <Link className="hero-offers" to={`/categories/${OFERTAS_ID}`}>
              Ver ofertas →
            </Link>
          </div>
          <div className="hero-footnote">
            <span>01 / GAMING ESSENTIALS</span>
            <span>PLAY. CREATE. REPEAT.</span>
          </div>
        </div>
        <Link
          className="hero-visual"
          to="/categories/7"
          aria-label="Explorar teclados y mouse"
        >
          <img
            src="/img/setup-gaming.jpg"
            alt="Setup gamer con teclado y periféricos"
            fetchPriority="high"
          />
          <div className="hero-image-label">
            <span>EL ESPACIO ES TUYO</span>
            <strong>Hazlo a tu manera.</strong>
          </div>
          <span className="hero-orbit">↗</span>
        </Link>
      </section>
      <div className="store-benefits container">
        <span>↗ Envío gratis desde $100.000</span>
        <span>⌂ Retiro sin costo</span>
        <span>◇ Compra de demostración</span>
      </div>
      <section className="container home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ENCUENTRA TU ESPECIALIDAD</p>
            <h2>Arma tu espacio</h2>
          </div>
          <Link to="/categories">Todas las categorías ↗</Link>
        </div>
        <div className="category-tiles">
          {[
            ["7", "01", "Periféricos", "Teclados y mouse", "img/teclado.svg"],
            ["4", "02", "Consolas", "Tu próxima aventura", "img/consola.svg"],
            [
              "5",
              "03",
              "Audio y streaming",
              "Que se escuche tu juego",
              "img/auriculares.svg",
            ],
            ["9", "04", "Monitores", "Cada detalle cuenta", "img/monitor.svg"],
          ].map(([id, n, nombre, texto, img]) => (
            <Link key={id} to={`/categories/${id}`} className="category-tile">
              <span>{n} /</span>
              <ProductImage
                src={imagenesCategorias[id] ?? img}
                alt={nombre}
                loading="lazy"
              />
              <h3>{nombre} ↗</h3>
              <p>{texto}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="container home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SELECCIÓN DE LA TIENDA</p>
            <h2>Favoritos para tu setup</h2>
          </div>
          <Link to={`/categories/${OFERTAS_ID}`}>Explorar ofertas ↗</Link>
        </div>
        <div className="curated-grid">
          {destacados.map((p) => (
            <ProductCard key={p.id} producto={p} promo={p.destacado} />
          ))}
        </div>
      </section>
      <section className="container home-feature">
        <div>
          <p className="eyebrow">CADA PARTIDA EMPIEZA AQUÍ</p>
          <h2>
            Pequeños cambios.
            <br />
            Grandes partidas.
          </h2>
          <p>
            Encuentra el control, la pantalla o el accesorio que acompaña tu
            forma de jugar.
          </p>
          <Link className="btn btn-primary" to="/products">
            Descubrir el catálogo ↗
          </Link>
        </div>
        <span aria-hidden="true">
          PLAY
          <br />
          <em>YOUR WAY.</em>
        </span>
      </section>
      <section className="container home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SIGUE EXPLORANDO</p>
            <h2>Más para descubrir</h2>
          </div>
          <Link to="/products">Ver todo el catálogo ↗</Link>
        </div>
        <div className="curated-grid">
          {seleccion.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      </section>
      <section className="container home-journal">
        <div>
          <p className="eyebrow">GUÍAS PARA ELEGIR MEJOR</p>
          <h2>Antes de darle a comprar</h2>
          <p>Ideas para comparar equipos y preparar tu compra.</p>
        </div>
        <Link className="btn btn-secondary" to="/blog">
          Explorar el blog ↗
        </Link>
      </section>
    </>
  );
}
