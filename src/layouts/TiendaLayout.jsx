import PageTransition from "../components/common/PageTransition.jsx";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import CartMessage from "../components/common/CartMessage.jsx";

// Estructura común de las páginas de la tienda: header + contenido de la ruta (Outlet) + footer
export default function TiendaLayout() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <PageTransition />
      </main>
      <Footer />
      <CartMessage />
    </>
  );
}
