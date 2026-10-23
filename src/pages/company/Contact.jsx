import { useState } from "react";
import useTitulo from "../../hooks/useTitulo.js";
import { leerJSON, guardarJSON } from "../../hooks/useLocalStorage.js";
import "../../styles/contacto.css";
export default function Contact() {
  useTitulo("MiTienda - Contacto");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const enviar = (e) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form));
    if (!datos.nombre.trim() || !datos.comentario.trim()) {
      setError("Completa tu nombre y el mensaje.");
      return;
    }
    try {
      const anteriores = leerJSON("consultas", []);
      guardarJSON("consultas", [
        ...(Array.isArray(anteriores) ? anteriores : []),
        {
          ...datos,
          nombre: datos.nombre.trim(),
          comentario: datos.comentario.trim(),
          fecha: new Date().toISOString(),
          id: crypto.randomUUID(),
        },
      ]);
      setMensaje(
        "Tu consulta de demostración quedó guardada en este navegador. No se envió ningún correo.",
      );
      form.reset();
    } catch {
      setError(
        "No fue posible guardar la consulta. Revisa el espacio disponible en el navegador.",
      );
    }
  };
  return (
    <>
      <section className="page-header">
        <p className="eyebrow">CONVERSEMOS SOBRE TU SETUP</p>
        <h1>Estamos para orientarte</h1>
        <p>Cuéntanos qué estás buscando o qué necesitas mejorar.</p>
      </section>
      <section className="container contact-layout">
        <div>
          <h2>Antes de escribirnos</h2>
          <p className="muted">
            Este formulario es parte de una demostración académica. Guarda tu
            consulta localmente y muestra una confirmación.
          </p>
          <div className="contact-faq">
            <h3>Preguntas frecuentes</h3>
            <details>
              <summary>¿Se realizan cobros reales?</summary>
              <p>
                No. La compra utiliza dos tarjetas de prueba y no procesa
                dinero.
              </p>
            </details>
            <details>
              <summary>¿Cuánto cuesta el envío simulado?</summary>
              <p>
                $4.990 para compras menores a $100.000. Desde ese monto es
                gratis. El retiro siempre es gratuito.
              </p>
            </details>
            <details>
              <summary>¿Dónde se guardan mis pedidos?</summary>
              <p>
                En el navegador donde realizaste la compra. El panel de
                administración permite revisar los pedidos de la demo.
              </p>
            </details>
          </div>
        </div>
        <form className="card" onSubmit={enviar}>
          <h2>Déjanos tu consulta</h2>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              autoComplete="name"
              required
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label htmlFor="asunto">Asunto</label>
            <select id="asunto" name="asunto">
              <option>Consulta sobre un producto</option>
              <option>Compra de demostración</option>
              <option>Sugerencia sobre la tienda</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="comentario">Mensaje</label>
            <textarea
              id="comentario"
              name="comentario"
              required
              maxLength={1000}
            />
          </div>
          <button>Guardar consulta de demostración</button>
          {mensaje && (
            <p className="alert alert-success" role="status">
              {mensaje}
            </p>
          )}
          {error && (
            <p className="alert alert-error" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>
    </>
  );
}
