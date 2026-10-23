import PageTransition from "../components/PageTransition.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import CartMessage from "../components/CartMessage.jsx";

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
