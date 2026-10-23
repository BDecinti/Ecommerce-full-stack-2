import { useEffect, useRef, useState } from "react";
import "../styles/scroll-top.css";

const UMBRAL = 300; // px de scroll a partir de los cuales aparece el botón
const DURACION = 900; // ms que dura la animación de subida

// Acelera hacia el medio y frena al llegar arriba, pero con velocidad inicial
// (la parte lineal) para que empiece a moverse apenas se aprieta el botón
const suavizado = (t) => {
  const inOut = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return 0.4 * t + 0.6 * inOut;
};

// Botón circular flotante que lleva al inicio de la página con un scroll gradual
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const frame = useRef(null);

  useEffect(() => {
    const alScrollear = () => setVisible(window.scrollY > UMBRAL);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScrollear);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const subir = () => {
    cancelAnimationFrame(frame.current);
    const inicio = window.scrollY;
    const t0 = performance.now();

    const paso = (ahora) => {
      const progreso = Math.min((ahora - t0) / DURACION, 1);
      // "instant" evita que el scroll-behavior: smooth de global.css suavice cada cuadro y retrase la subida
      window.scrollTo({ top: inicio * (1 - suavizado(progreso)), behavior: "instant" });
      if (progreso < 1) frame.current = requestAnimationFrame(paso);
    };
    frame.current = requestAnimationFrame(paso);
  };

  return (
    <button
      type="button"
      className={`scroll-top${visible ? " visible" : ""}`}
      onClick={subir}
      aria-label="Volver arriba"
      title="Volver arriba"
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
