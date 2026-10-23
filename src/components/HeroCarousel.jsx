import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OFERTAS_ID } from "../data/categorias.js";
import "../styles/hero-carousel.css";

const INTERVALO = 5000; // ms entre cambios automáticos

// Todos los banners llevan a la categoría "Ofertas"
const banners = [
  { imagen: "img/img-hero-1.webp", alt: "Monitor Gamer LG, Monitor HP y Monitor portátil Master G en oferta" },
  { imagen: "img/img-hero-2.webp", alt: "Memoria Corsair, SSD Adata y CPU AMD en oferta" },
  { imagen: "img/img-hero-3.webp", alt: "UPS Cito, Generador Forza y UPS Spektra en oferta" },
];

// Carrusel del Home: un banner a la vez, a todo el ancho de la pantalla
export default function HeroCarousel() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);

  const ir = (i) => setActual((i + banners.length) % banners.length);

  // Avanza solo; vuelve a contar desde cero cuando se cambia de banner a mano
  useEffect(() => {
    if (pausado) return;
    const timer = setTimeout(() => ir(actual + 1), INTERVALO);
    return () => clearTimeout(timer);
  }, [actual, pausado]);

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carrusel"
      aria-label="Ofertas destacadas"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div className="hero-carousel-pista" style={{ transform: `translateX(-${actual * 100}%)` }}>
        {banners.map((b, i) => (
          <Link
            key={b.imagen}
            to={`/categories/${OFERTAS_ID}`}
            className="hero-carousel-slide"
            aria-hidden={i !== actual}
            tabIndex={i === actual ? 0 : -1}
          >
            <img src={import.meta.env.BASE_URL + b.imagen} alt={b.alt} draggable="false" />
          </Link>
        ))}
      </div>

      <button type="button" className="hero-carousel-flecha anterior" onClick={() => ir(actual - 1)} aria-label="Banner anterior">
        ‹
      </button>
      <button type="button" className="hero-carousel-flecha siguiente" onClick={() => ir(actual + 1)} aria-label="Banner siguiente">
        ›
      </button>

      <div className="hero-carousel-puntos">
        {banners.map((b, i) => (
          <button
            key={b.imagen}
            type="button"
            className={i === actual ? "activo" : ""}
            onClick={() => ir(i)}
            aria-label={`Ir al banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
