import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import "../../styles/nosotros.css";
export default function About() {
  useTitulo("MiTienda - Nosotros");
  return (
    <>
      <section className="page-header">
        <p className="eyebrow">COMPARTIMOS LAS GANAS DE JUGAR</p>
        <h1>Tecnología con propósito</h1>
        <p>
          Un proyecto de estudiantes, pensado para quienes disfrutan su setup.
        </p>
      </section>
      <section className="container about-story">
        <div>
          <p className="eyebrow">QUIÉNES SOMOS</p>
          <h2>
            De una idea de clase
            <br />a una tienda para explorar.
          </h2>
          <p>
            MiTienda nace como proyecto semestral de Full Stack II. Alessandro,
            Nicolás y Bruno conectan catálogo, experiencia de compra y
            administración en una aplicación React.
          </p>
          <p>
            Queremos que comparar productos, entender sus características y
            recorrer una compra sea sencillo. El catálogo y los pedidos se
            guardan en este navegador para demostrar el flujo completo.
          </p>
          <Link className="btn btn-primary" to="/categories">
            Conoce el catálogo ↗
          </Link>
        </div>
        <img
          src="/img/setup-gaming.jpg"
          alt="Un espacio de juego con periféricos"
          loading="lazy"
        />
      </section>
      <section className="container about-values">
        {[
          [
            "01",
            "Claridad para elegir",
            "Precios en pesos chilenos, filtros por marca y disponibilidad, y fichas con características para comparar.",
          ],
          [
            "02",
            "Una compra paso a paso",
            "Entrega, tarjeta de prueba, revisión y comprobante. Puedes probar tanto un pago aprobado como uno rechazado.",
          ],
          [
            "03",
            "Aprender construyendo",
            "Una tienda académica de tecnología, con catálogo y compra de demostración. Los pagos y envíos son simulados.",
          ],
        ].map(([n, t, p]) => (
          <article key={n}>
            <span className="eyebrow">{n} /</span>
            <h2>{t}</h2>
            <p>{p}</p>
          </article>
        ))}
      </section>
    </>
  );
}
