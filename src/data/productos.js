// 1. ESTRUCTURA DE DATOS: Arreglo de objetos que simula la base de datos de productos
export const productos = [
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
export const idsDestacados = [2, 4, 5];

// Las imágenes viven en public/img. Los productos guardan la ruta relativa ("img/x.svg") y aquí se
// le antepone la base del sitio, así también funcionan los carritos que ya estaban en localStorage.
export const rutaImagen = (imagen) => import.meta.env.BASE_URL + imagen;

export const formatearPrecio = (valor) => "$" + Number(valor).toLocaleString("es-CL");
