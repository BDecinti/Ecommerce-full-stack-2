// 1. ESTRUCTURA DE DATOS: Arreglo de objetos que simula la base de datos de productos
const productos = [
    { id: 1, nombre: 'Producto 1', precio: 8000, imagen: 'img/placeholder.svg' },
    { id: 2, nombre: 'Producto 2', precio: 6000, imagen: 'img/placeholder.svg' },
    { id: 3, nombre: 'Producto 3', precio: 10000, imagen: 'img/placeholder.svg' },
    { id: 4, nombre: 'Producto 4', precio: 12000, imagen: 'img/placeholder.svg' }
];

// Arreglo para almacenar los elementos seleccionados por el usuario
let carrito = [];

// 2. FUNCIONALIDAD: Renderizado dinámico en el DOM (Document Object Model)
function cargarProductos() {
    // Obtener la referencia del elemento contenedor HTML por su ID
    const contenedor = document.getElementById('grid-productos');
    contenedor.innerHTML = ''; // Limpiar el contenido previo

    // Iterar sobre la lista de productos (similar a un for-each en Java/C++)
    productos.forEach(producto => {
        // Crear el elemento div de la tarjeta
        const card = document.createElement('article');
        card.classList.add('card-producto');

        // Insertar estructura HTML con interpolación de variables (`${}`)
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Añadir al Carrito</button>
        `;

        // Agregar la tarjeta dentro del contenedor principal
        contenedor.appendChild(card);
    });
}

// 3. LOGICA DEL CARRITO
function agregarAlCarrito(idProducto) {
    // Buscar el producto en el arreglo por su ID
    const productoEncontrado = productos.find(p => p.id === idProducto);
    
    if (productoEncontrado) {
        carrito.push(productoEncontrado);
        actualizarContadorCarrito();
    }
}

function actualizarContadorCarrito() {
    // Actualizar el número visible en el HTML
    const contador = document.getElementById('cart-count');
    contador.textContent = carrito.length;
}

// Ejecutar la función de carga cuando el documento esté completamente disponible
document.addEventListener('DOMContentLoaded', cargarProductos);