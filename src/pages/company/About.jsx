import useTitulo from "../../hooks/useTitulo.js";
import "../../styles/nosotros.css";

export default function About() {
  useTitulo("MiTienda - Nosotros");

  return (
    <>
      <section className="page-header">
        <h1>Nosotros</h1>
        <p>Conoce quiénes somos y qué buscamos entregar.</p>
      </section>
      <section className="container grid grid-2 about">
        <article className="card">
          <h2>Sobre MiTienda</h2>
          <p>
            Somos una tienda online creada para ofrecer una experiencia simple, clara y cercana.
            Nuestro objetivo es que encontrar un producto sea rápido y agradable.
          </p>
        </article>
        <article className="card">
          <h2>Nuestro equipo</h2>
          <p>
            Este proyecto es desarrollado por un equipo de estudiantes que aplica HTML, CSS y
            JavaScript para construir una tienda funcional y responsiva.
          </p>
        </article>
      </section>
    </>
  );
}
