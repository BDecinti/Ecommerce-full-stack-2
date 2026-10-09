import { useState } from "react";
import useTitulo from "../../hooks/useTitulo.js";
import "../../styles/contacto.css";

// El sitio es estático (no tiene servidor), así que el envío del correo se hace con
// FormSubmit (https://formsubmit.co), un servicio gratuito que reenvía el formulario a un email.

// TODO: reemplazar por el correo donde quieres recibir los mensajes.
// La primera vez que se envíe un mensaje, FormSubmit manda un correo de activación a esta
// dirección; hay que abrirlo y confirmar. Después los mensajes llegan normalmente.
const EMAIL_DESTINO = "CORREO_DESTINO@ejemplo.com";

const URL_ENVIO = `https://formsubmit.co/ajax/${EMAIL_DESTINO}`;

export default function Contact() {
  useTitulo("MiTienda - Contacto");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null); // { texto, error }

  const enviar = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !comentario.trim()) {
      setMensaje({ texto: "Completa tu nombre y el comentario.", error: true });
      return;
    }

    if (EMAIL_DESTINO.startsWith("CORREO_DESTINO")) {
      setMensaje({ texto: "Falta configurar el correo de destino en Contact.jsx.", error: true });
      return;
    }

    setEnviando(true);
    setMensaje({ texto: "Enviando...", error: false });

    try {
      const respuesta = await fetch(URL_ENVIO, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Nuevo mensaje de contacto de ${nombre.trim()} - MiTienda`,
          _template: "table",
          _replyto: email.trim(), // permite responder directamente al cliente
          Nombre: nombre.trim(),
          Correo: email.trim() || "(no indicado)",
          Comentario: comentario.trim(),
        }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok || datos.success === "false") {
        throw new Error(datos.message || "Error al enviar");
      }

      setMensaje({ texto: "¡Mensaje enviado! Te responderemos pronto.", error: false });
      setNombre("");
      setEmail("");
      setComentario("");
    } catch (error) {
      console.error(error);
      setMensaje({ texto: "No se pudo enviar el mensaje. Inténtalo nuevamente.", error: true });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <section className="page-header">
        <h1>Contacto</h1>
        <p>Envíanos tu mensaje.</p>
      </section>
      <section className="form-card card contacto-card">
        <form onSubmit={enviar}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              required
              maxLength={100}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              id="email"
              maxLength={100}
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="comentario">Comentario</label>
            <textarea
              id="comentario"
              required
              maxLength={500}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </div>
          <button type="submit" disabled={enviando}>
            Enviar mensaje
          </button>
          <p style={{ color: mensaje?.error ? "#e74c3c" : "#2ecc71" }}>{mensaje?.texto}</p>
        </form>
      </section>
    </>
  );
}
