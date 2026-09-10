// LÓGICA DE LA PÁGINA DE PAGO (pago.html)
// Sistema de pago simulado: no pide datos reales de tarjeta.

function obtenerCarritoPago() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Muestra el resumen del pedido (items + total) usando lo que hay en el carrito
function renderResumenPago() {
  const carrito = obtenerCarritoPago();
  const contenedor = document.getElementById("pago-lista-items");
  const formularioBox = document.getElementById("pago-formulario-box");

  if (carrito.length === 0) {
    contenedor.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío. <a href="productos.html">Ver productos</a></p>`;
    formularioBox.style.display = "none";
    document.getElementById("pago-total").textContent = "$0";
    return;
  }

  contenedor.innerHTML = carrito
    .map(
      (item) => `
      <div class="pago-item">
        <img src="${item.imagen}" alt="${item.nombre}">
        <span class="pago-item-nombre">${item.nombre} x${item.cantidad}</span>
        <span class="pago-item-subtotal">$${(item.precio * item.cantidad).toLocaleString("es-CL")}</span>
      </div>
    `,
    )
    .join("");

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );
  document.getElementById("pago-total").textContent =
    "$" + total.toLocaleString("es-CL");
}

// Muestra u oculta los campos de dirección según el método de entrega elegido
function configurarSeleccionEntrega() {
  const radios = document.querySelectorAll('input[name="entrega"]');
  const camposEnvio = document.getElementById("campos-envio");

  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      camposEnvio.style.display = e.target.value === "envio" ? "block" : "none";
    });
  });
}

// Procesa el "pago" simulado al enviar el formulario
function configurarFormularioPago() {
  const form = document.getElementById("pagoForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const mensajeError = document.getElementById("pago-mensaje-error");
    mensajeError.textContent = "";

    const carrito = obtenerCarritoPago();
    if (carrito.length === 0) {
      mensajeError.textContent = "Tu carrito está vacío.";
      return;
    }

    const tipoEntrega = document.querySelector(
      'input[name="entrega"]:checked',
    ).value;
    const metodoPago = document.getElementById("metodo-pago").value;

    let direccion = "";
    let comuna = "";
    let telefono = "";

    if (tipoEntrega === "envio") {
      direccion = document.getElementById("direccion").value.trim();
      comuna = document.getElementById("comuna").value.trim();
      telefono = document.getElementById("telefono").value.trim();

      if (!direccion || !comuna) {
        mensajeError.textContent =
          "Por favor ingresa tu dirección y comuna para el envío.";
        return;
      }
    }

    const total = carrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0,
    );

    // Guardar un registro simple del pedido (opcional, útil para el admin/historial)
    const pedido = {
      fecha: new Date().toISOString(),
      items: carrito,
      total,
      tipoEntrega,
      metodoPago,
      direccion,
      comuna,
      telefono,
      usuario: (obtenerUsuarioActual() && obtenerUsuarioActual().email) || "invitado",
    };
    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    // Vaciar el carrito porque la compra ya se "pagó"
    localStorage.setItem("carrito", "[]");
    const contadorHeader = document.getElementById("cart-count");
    if (contadorHeader) contadorHeader.textContent = "0";

    // Mostrar confirmación
    document.getElementById("pago-formulario-box").style.display = "none";
    document.querySelector(".pago-resumen").style.display = "none";

    const detalle = document.getElementById("pago-confirmacion-detalle");
    if (tipoEntrega === "envio") {
      detalle.innerHTML = `Tu pedido por <strong>$${total.toLocaleString("es-CL")}</strong> fue enviado con éxito a <strong>${direccion}, ${comuna}</strong>. Te contactaremos al <strong>${telefono || "teléfono registrado"}</strong> para coordinar la entrega.`;
    } else {
      detalle.innerHTML = `Tu pedido por <strong>$${total.toLocaleString("es-CL")}</strong> fue registrado con éxito. Puedes retirarlo de forma presencial en nuestra tienda.`;
    }
    document.getElementById("pago-confirmacion-box").style.display = "block";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderResumenPago();
  configurarSeleccionEntrega();
  configurarFormularioPago();
});
