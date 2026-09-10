// 1. ESTRUCTURA DE DATOS: Arreglo de objetos que simula la base de datos de productos
const productos = [
  {
    id: 1,
    nombre: "Control Inalámbrico Pro",
    precio: 15000,
    imagen: "img/control.svg",
    descripcion: "Control inalámbrico con vibración y botones programables.",
  },
  {
    id: 2,
    nombre: "Teclado Mecánico RGB",
    precio: 25000,
    imagen: "img/teclado.svg",
    descripcion: "Teclado mecánico con retroiluminación RGB personalizable.",
  },
  {
    id: 3,
    nombre: "Mouse Gamer Óptico",
    precio: 12000,
    imagen: "img/mouse.svg",
    descripcion: "Mouse óptico de alta precisión, ideal para partidas rápidas.",
  },
  {
    id: 4,
    nombre: "Auriculares Gaming 7.1",
    precio: 18000,
    imagen: "img/auriculares.svg",
    descripcion: "Sonido envolvente 7.1 con micrófono abatible incorporado.",
  },
  {
    id: 5,
    nombre: "Consola de Videojuegos NextPlay",
    precio: 350000,
    imagen: "img/consola.svg",
    descripcion: "Consola de última generación con soporte 4K y modo online.",
  },
  {
    id: 6,
    nombre: "Silla Gamer Ergonómica",
    precio: 180000,
    imagen: "img/silla.svg",
    descripcion: "Silla reclinable con soporte lumbar para largas sesiones.",
  },
  {
    id: 7,
    nombre: "Mousepad XL Gamer",
    precio: 8000,
    imagen: "img/mousepad.svg",
    descripcion: "Mousepad extendido con base antideslizante y bordes cosidos.",
  },
  {
    id: 8,
    nombre: "Micrófono Streaming USB",
    precio: 22000,
    imagen: "img/microfono.svg",
    descripcion: "Micrófono USB plug and play, perfecto para transmisiones en vivo.",
  },
];

// IDs de los productos que se muestran en el apartado de ofertas/promoción del home
const idsDestacados = [2, 4, 5];

// 2. FUNCIONALIDAD: Renderizado dinámico en el DOM (Document Object Model)
function cargarProductos() {
  // Obtener la referencia del elemento contenedor HTML por su ID
  const contenedor = document.getElementById("grid-productos");
  if (!contenedor) return; // Esta página no tiene catálogo (ej: carrito.html)
  contenedor.innerHTML = ""; // Limpiar el contenido previo

  // Iterar sobre la lista de productos (similar a un for-each en Java/C++)
  productos.forEach((producto) => {
    contenedor.appendChild(crearCardProducto(producto));
  });
}

// Crea la tarjeta HTML reutilizable de un producto
function crearCardProducto(producto) {
  const card = document.createElement("article");
  card.classList.add("card-producto");
  card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="descripcion-producto">${producto.descripcion}</p>
            <p>Precio: $${producto.precio.toLocaleString("es-CL")}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Añadir al Carrito</button>
        `;
  return card;
}

// Renderiza el pequeño apartado de "ofertas" / publicidad en el home
function cargarDestacados() {
  const contenedor = document.getElementById("grid-promo");
  if (!contenedor) return; // Solo existe en index.html
  contenedor.innerHTML = "";

  idsDestacados.forEach((id) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    const card = document.createElement("article");
    card.classList.add("card-producto", "card-promo");
    card.innerHTML = `
            <span class="badge-oferta">Oferta</span>
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="descripcion-producto">${producto.descripcion}</p>
            <p>Precio: $${producto.precio.toLocaleString("es-CL")}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Añadir al Carrito</button>
        `;
    contenedor.appendChild(card);
  });
}

// 3. LOGICA DEL CARRITO (persistente entre páginas usando localStorage)
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(idProducto) {
  // Buscar el producto en el arreglo por su ID
  const productoEncontrado = productos.find((p) => p.id === idProducto);
  if (!productoEncontrado) return;

  const carrito = obtenerCarrito();
  const itemExistente = carrito.find((item) => item.id === idProducto);

  if (itemExistente) {
    // Si ya estaba en el carrito, solo se suma uno a la cantidad
    itemExistente.cantidad += 1;
  } else {
    // Se guarda una copia del producto junto con la cantidad
    carrito.push({ ...productoEncontrado, cantidad: 1 });
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  // Actualizar el número visible en el header (presente en todas las páginas)
  const contador = document.getElementById("cart-count");
  if (!contador) return;

  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = totalItems;
}

// Ejecutar la función de carga cuando el documento esté completamente disponible
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  cargarDestacados();
  actualizarContadorCarrito();
});
