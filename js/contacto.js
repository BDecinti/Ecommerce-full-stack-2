// LÓGICA DE LA PÁGINA DE CONTACTO (contact.html)
// El sitio es estático (no tiene servidor), así que el envío del correo se hace con
// FormSubmit (https://formsubmit.co), un servicio gratuito que reenvía el formulario a un email.

// TODO: reemplazar por el correo donde quieres recibir los mensajes.
// La primera vez que se envíe un mensaje, FormSubmit manda un correo de activación a esta
// dirección; hay que abrirlo y confirmar. Después los mensajes llegan normalmente.
const EMAIL_DESTINO = "CORREO_DESTINO@ejemplo.com";

const URL_ENVIO = `https://formsubmit.co/ajax/${EMAIL_DESTINO}`;

function mostrarMensajeContacto(texto, esError) {
  const caja = document.getElementById("mensajeContacto");
  if (!caja) return;
  caja.textContent = texto;
  caja.style.color = esError ? "#e74c3c" : "#2ecc71";
}

async function enviarContacto(evento) {
  evento.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const comentario = document.getElementById("comentario").value.trim();
  const boton = evento.target.querySelector("button[type='submit']");

  if (!nombre || !comentario) {
    mostrarMensajeContacto("Completa tu nombre y el comentario.", true);
    return;
  }

  if (EMAIL_DESTINO.startsWith("CORREO_DESTINO")) {
    mostrarMensajeContacto("Falta configurar el correo de destino en js/contacto.js.", true);
    return;
  }

  boton.disabled = true;
  mostrarMensajeContacto("Enviando...", false);

  try {
    const respuesta = await fetch(URL_ENVIO, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `Nuevo mensaje de contacto de ${nombre} - MiTienda`,
        _template: "table",
        _replyto: email, // permite responder directamente al cliente
        Nombre: nombre,
        Correo: email || "(no indicado)",
        Comentario: comentario,
      }),
    });

    const datos = await respuesta.json();
    if (!respuesta.ok || datos.success === "false") {
      throw new Error(datos.message || "Error al enviar");
    }

    mostrarMensajeContacto("¡Mensaje enviado! Te responderemos pronto.", false);
    evento.target.reset();
  } catch (error) {
    console.error(error);
    mostrarMensajeContacto("No se pudo enviar el mensaje. Inténtalo nuevamente.", true);
  } finally {
    boton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("contactForm");
  if (formulario) formulario.addEventListener("submit", enviarContacto);
});
