// LÓGICA DE LA PÁGINA DEL CARRITO (carrito.html)
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
    contenedor.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío. <a href="productos.html">Ver productos</a></p>`;
  } else {
    carrito.forEach((item) => {
      const fila = document.createElement("div");
      fila.classList.add("carrito-item");
      fila.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}">
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

// Elimina por completo un producto del carrito
function eliminarDelCarrito(idProducto) {
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
