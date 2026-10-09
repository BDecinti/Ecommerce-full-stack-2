// LÓGICA DE LA PÁGINA DEL CARRITO (cart.html)
// El carrito se guarda en localStorage para que persista entre páginas.

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Dibuja todos los productos del carrito, actualiza el total y el contador del header
function renderCarrito() {
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById("carrito-lista");
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío. <a href="${RAIZ_SITIO}pages/products/products.html">Ver productos</a></p>`;
  } else {
    carrito.forEach((item) => {
      const fila = document.createElement("div");
      fila.classList.add("carrito-item");
      fila.innerHTML = `
        <img src="${RAIZ_SITIO}${item.imagen}" alt="${item.nombre}">
        <div class="carrito-item-info">
          <h3>${item.nombre}</h3>
          <p class="descripcion-producto">${item.descripcion || ""}</p>
          <p>Precio unitario: $${item.precio.toLocaleString("es-CL")}</p>
        </div>
        <div class="carrito-item-cantidad">
          <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
        </div>
        <p class="carrito-item-subtotal">$${(item.precio * item.cantidad).toLocaleString("es-CL")}</p>
        <button class="btn-danger" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
      `;
      contenedor.appendChild(fila);
    });
  }

  actualizarTotal(carrito);
}

// Suma el total general del carrito y lo muestra en pantalla
function actualizarTotal(carrito) {
  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  document.getElementById("carrito-cantidad").textContent = totalCantidad;
  document.getElementById("carrito-total").textContent =
    "$" + totalPrecio.toLocaleString("es-CL");

  // También se actualiza el contador del header (span#cart-count)
  const contadorHeader = document.getElementById("cart-count");
  if (contadorHeader) contadorHeader.textContent = totalCantidad;
}

// Aumenta o disminuye la cantidad de un producto (elimina el item si llega a 0)
function cambiarCantidad(idProducto, delta) {
  let carrito = obtenerCarrito();
  const item = carrito.find((p) => p.id === idProducto);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carrito = carrito.filter((p) => p.id !== idProducto);
  }

  guardarCarrito(carrito);
  renderCarrito();
}

// Muestra un diálogo de confirmación con el estilo de la tienda (en lugar del confirm() del navegador).
// Devuelve una promesa: true si el usuario confirma, false si cancela, cierra con Esc o hace clic fuera.
function confirmarAccion({ titulo, mensaje, textoConfirmar = "Aceptar", textoCancelar = "Cancelar" }) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box" role="alertdialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div class="modal-icon">⚠️</div>
        <h3 class="modal-titulo" id="modal-titulo"></h3>
        <p class="modal-mensaje"></p>
        <div class="modal-acciones">
          <button type="button" class="btn-dark" data-accion="cancelar"></button>
          <button type="button" class="btn-danger" data-accion="confirmar"></button>
        </div>
      </div>
    `;
    // textContent evita interpretar como HTML el nombre del producto
    overlay.querySelector(".modal-titulo").textContent = titulo;
    overlay.querySelector(".modal-mensaje").textContent = mensaje;
    overlay.querySelector("[data-accion='cancelar']").textContent = textoCancelar;
    overlay.querySelector("[data-accion='confirmar']").textContent = textoConfirmar;

    const cerrar = (resultado) => {
      document.removeEventListener("keydown", alTeclear);
      overlay.remove();
      resolve(resultado);
    };
    const alTeclear = (e) => {
      if (e.key === "Escape") cerrar(false);
    };

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) return cerrar(false); // clic en el fondo oscuro
      const accion = e.target.dataset.accion;
      if (accion) cerrar(accion === "confirmar");
    });
    document.addEventListener("keydown", alTeclear);

    document.body.appendChild(overlay);
    overlay.querySelector("[data-accion='cancelar']").focus(); // por seguridad, el foco empieza en Cancelar
  });
}

// Elimina por completo un producto del carrito (previa confirmación)
async function eliminarDelCarrito(idProducto) {
  const item = obtenerCarrito().find((p) => p.id === idProducto);
  if (!item) return;

  const confirmado = await confirmarAccion({
    titulo: "¿Eliminar producto?",
    mensaje: `¿Estás seguro de que quieres eliminar "${item.nombre}" del carrito?`,
    textoConfirmar: "Sí, eliminar",
  });
  if (!confirmado) return;

  const carrito = obtenerCarrito().filter((p) => p.id !== idProducto);
  guardarCarrito(carrito);
  renderCarrito();
}

// Vacía todo el carrito
function vaciarCarrito() {
  guardarCarrito([]);
  renderCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();
  document
    .getElementById("vaciarCarrito")
    .addEventListener("click", vaciarCarrito);
});
