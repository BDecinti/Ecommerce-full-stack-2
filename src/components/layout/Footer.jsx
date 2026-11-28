import { Link } from "react-router-dom";

// Footer completo de la tienda (antes lo armaba construirFooter() en auth.js)
export default function Footer() {
  return (
    <footer className="footer footer-full">
      <div className="footer-grid container">
        <div className="footer-brand">
          <Link className="footer-logo" to="/">
            MiTienda
          </Link>
          <p>
            Periféricos, consolas y accesorios para llevar tu setup al siguiente
            nivel.
          </p>
          <div className="footer-promo">
            <h3>Tu próxima partida empieza aquí</h3>
            <p>Guarda tu sesión y recorre la experiencia completa de compra.</p>
            <Link to="/signup" className="footer-promo-btn">
              Crear cuenta
            </Link>
          </div>
        </div>
        <nav className="footer-col" aria-label="Tienda">
          <h4>Tienda</h4>
          <Link to="/">Inicio</Link>
          <Link to="/products">Productos</Link>
          <Link to="/categories/14">Ofertas</Link>
          <Link to="/cart">Carrito</Link>
        </nav>
        <nav className="footer-col" aria-label="Empresa">
          <h4>Empresa</h4>
          <Link to="/about">Nosotros</Link>
          <Link to="/blog">Blogs</Link>
          <Link to="/contact">Contacto</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; 2026 MiTienda - Proyecto académico · Pagos y envíos simulados.
        </p>
        <a href="#" className="footer-top">
          Volver arriba ↑
        </a>
      </div>
    </footer>
  );
}
