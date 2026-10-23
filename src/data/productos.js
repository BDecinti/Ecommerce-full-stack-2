// Productos iniciales: una sola fuente para la tienda y el panel de administración.
// Solo se usan si localStorage está vacío o si cambia VERSION_CATALOGO (después manda ProductContext).
// Si se agregan o cambian productos aquí, hay que subir VERSION_CATALOGO para que se vean en el navegador.
export const VERSION_CATALOGO = 3;

// categoriaId viene de data/categorias.js (6 = Controles, 7 = Teclados y mouse, etc.).
// Las imágenes viven en public/img.
export const productosPorDefecto = [
  // --- Controles (6) ---
  {
    id: 1,
    codigo: "SON-DS01",
    nombre: "Control DualSense Wireless",
    marca: "Sony",
    precio: 74990,
    imagen: "img/dualsense.webp",
    descripcion:
      "Control inalámbrico para PS5 con retroalimentación háptica y gatillos adaptativos.",
    stock: 20,
    stockCritico: 3,
    categoriaId: 6,
    destacado: false,
  },
  {
    id: 20,
    codigo: "MIC-XBC01",
    nombre: "Control Xbox Wireless",
    marca: "Microsoft",
    precio: 64990,
    imagen: "img/control.svg",
    descripcion:
      "Control inalámbrico para Xbox y PC con agarre texturizado y Bluetooth.",
    stock: 15,
    stockCritico: 3,
    categoriaId: 6,
    destacado: false,
  },
  {
    id: 21,
    codigo: "8BD-PRO2",
    nombre: "Control 8BitDo Pro 2",
    marca: "8BitDo",
    precio: 59990,
    imagen: "img/control.svg",
    descripcion:
      "Control Bluetooth compatible con Switch, PC y Android, con botones traseros programables.",
    stock: 9,
    stockCritico: 3,
    categoriaId: 6,
    destacado: false,
  },

  // --- Teclados y mouse (7) ---
  {
    id: 2,
    codigo: "RAZ-BWV4",
    nombre: "Teclado Mecánico BlackWidow V4",
    marca: "Razer",
    precio: 159990,
    imagen: "img/blackwidow-v4.webp",
    descripcion:
      "Teclado mecánico con switches Razer Green, iluminación Chroma RGB y reposamuñecas.",
    stock: 15,
    stockCritico: 3,
    categoriaId: 7,
    destacado: true,
  },
  {
    id: 22,
    codigo: "COR-K70",
    nombre: "Teclado Mecánico K70 RGB",
    marca: "Corsair",
    precio: 139990,
    imagen: "img/teclado.svg",
    descripcion:
      "Teclado mecánico con marco de aluminio, switches Cherry MX y control multimedia.",
    stock: 7,
    stockCritico: 3,
    categoriaId: 7,
    destacado: false,
  },
  {
    id: 3,
    codigo: "LOG-G502",
    nombre: "Mouse Gamer G502 HERO",
    marca: "Logitech",
    precio: 49990,
    imagen: "img/g502-hero.webp",
    descripcion:
      "Mouse óptico con sensor HERO de 25.600 DPI, 11 botones y pesas ajustables.",
    stock: 25,
    stockCritico: 5,
    categoriaId: 7,
    destacado: false,
  },
  {
    id: 23,
    codigo: "LOG-GPXS",
    nombre: "Mouse Inalámbrico G Pro X Superlight",
    marca: "Logitech",
    precio: 139990,
    imagen: "img/mouse.svg",
    descripcion:
      "Mouse inalámbrico ultraliviano de 63 g para esports, con sensor de 25.600 DPI.",
    stock: 6,
    stockCritico: 3,
    categoriaId: 7,
    destacado: false,
  },
  {
    id: 7,
    codigo: "STE-QCKXL",
    nombre: "Mousepad QcK Heavy XL",
    marca: "SteelSeries",
    precio: 24990,
    imagen: "img/mousepad.svg",
    descripcion:
      "Mousepad extendido de tela con base antideslizante y bordes cosidos.",
    stock: 30,
    stockCritico: 5,
    categoriaId: 7,
    destacado: false,
  },

  // --- Audio y streaming (5) ---
  {
    id: 4,
    codigo: "HYP-CLD2",
    nombre: "Auriculares Cloud II 7.1",
    marca: "HyperX",
    precio: 69990,
    imagen: "img/cloud-ii.webp",
    descripcion:
      "Sonido envolvente virtual 7.1 con micrófono abatible con cancelación de ruido.",
    stock: 12,
    stockCritico: 3,
    categoriaId: 5,
    destacado: true,
  },
  {
    id: 19,
    codigo: "RAZ-KRKX",
    nombre: "Auriculares Kraken X",
    marca: "Razer",
    precio: 39990,
    imagen: "img/auriculares.svg",
    descripcion:
      "Auriculares livianos con sonido envolvente 7.1 y micrófono flexible.",
    stock: 18,
    stockCritico: 3,
    categoriaId: 5,
    destacado: false,
  },
  {
    id: 8,
    codigo: "LOG-BYET",
    nombre: "Micrófono Yeti USB",
    marca: "Logitech",
    precio: 129990,
    imagen: "img/microfono.svg",
    descripcion:
      "Micrófono USB de condensador con cuatro patrones de captación, ideal para streaming.",
    stock: 10,
    stockCritico: 3,
    categoriaId: 5,
    destacado: false,
  },

  // --- Consolas (4) ---
  {
    id: 5,
    codigo: "SON-PS5S",
    nombre: "Consola PlayStation 5 Slim",
    marca: "Sony",
    precio: 549990,
    imagen: "img/consola.svg",
    descripcion:
      "Consola de última generación con SSD de 1 TB, juegos en 4K y hasta 120 fps.",
    stock: 5,
    stockCritico: 2,
    categoriaId: 4,
    destacado: true,
  },
  {
    id: 17,
    codigo: "NIN-SWOL",
    nombre: "Consola Switch OLED",
    marca: "Nintendo",
    precio: 329990,
    imagen: "img/consola.svg",
    descripcion:
      "Consola híbrida con pantalla OLED de 7 pulgadas, para jugar en casa o portátil.",
    stock: 8,
    stockCritico: 2,
    categoriaId: 4,
    destacado: false,
  },
  {
    id: 18,
    codigo: "MIC-XSS",
    nombre: "Consola Xbox Series S 512 GB",
    marca: "Microsoft",
    precio: 299990,
    imagen: "img/consola.svg",
    descripcion:
      "Consola compacta 100 % digital con SSD de 512 GB y juegos hasta 1440p.",
    stock: 2,
    stockCritico: 3,
    categoriaId: 4,
    destacado: false,
  },

  // --- Notebooks (8) ---
  {
    id: 9,
    codigo: "ASU-ROG16",
    nombre: "Notebook ROG Strix G16",
    marca: "ASUS",
    precio: 1299990,
    imagen: "img/notebook.svg",
    descripcion:
      "Notebook gamer de 16 pulgadas con Intel Core i7, RTX 4060, 16 GB RAM y SSD de 512 GB.",
    stock: 4,
    stockCritico: 2,
    categoriaId: 8,
    destacado: false,
  },
  {
    id: 10,
    codigo: "LEN-IPS3",
    nombre: "Notebook IdeaPad Slim 3",
    marca: "Lenovo",
    precio: 479990,
    imagen: "img/notebook.svg",
    descripcion:
      "Notebook liviano de 15,6 pulgadas con Ryzen 5, 8 GB RAM y SSD de 512 GB.",
    stock: 11,
    stockCritico: 3,
    categoriaId: 8,
    destacado: false,
  },
  {
    id: 11,
    codigo: "HP-PAV15",
    nombre: "Notebook Pavilion 15",
    marca: "HP",
    precio: 599990,
    imagen: "img/notebook.svg",
    descripcion:
      "Notebook de 15,6 pulgadas con Intel Core i5, 16 GB RAM y SSD de 512 GB.",
    stock: 7,
    stockCritico: 2,
    categoriaId: 8,
    destacado: false,
  },

  // --- Monitores (9) ---
  {
    id: 12,
    codigo: "SAM-ODG5",
    nombre: 'Monitor Odyssey G5 27" 144 Hz',
    marca: "Samsung",
    precio: 249990,
    imagen: "img/monitor.svg",
    descripcion:
      "Monitor curvo QHD de 27 pulgadas, 144 Hz y 1 ms, compatible con FreeSync.",
    stock: 9,
    stockCritico: 3,
    categoriaId: 9,
    destacado: false,
  },
  {
    id: 13,
    codigo: "LG-UG24",
    nombre: 'Monitor UltraGear 24" 144 Hz',
    marca: "LG",
    precio: 169990,
    imagen: "img/monitor.svg",
    descripcion:
      "Monitor IPS Full HD de 24 pulgadas, 144 Hz y 1 ms para juegos competitivos.",
    stock: 13,
    stockCritico: 3,
    categoriaId: 9,
    destacado: false,
  },
  {
    id: 14,
    codigo: "AOC-24G2",
    nombre: 'Monitor 24G2 24" 144 Hz',
    marca: "AOC",
    precio: 159990,
    imagen: "img/monitor.svg",
    descripcion:
      "Monitor IPS Full HD de 24 pulgadas con marco delgado, 144 Hz y FreeSync Premium.",
    stock: 16,
    stockCritico: 3,
    categoriaId: 9,
    destacado: false,
  },

  // --- Sillas gamer (10) ---
  {
    id: 6,
    codigo: "SEC-TEVO",
    nombre: "Silla Gamer Titan Evo",
    marca: "Secretlab",
    precio: 549990,
    imagen: "img/silla.svg",
    descripcion:
      "Silla ergonómica con soporte lumbar magnético, reclinable hasta 165° y cuero sintético.",
    stock: 6,
    stockCritico: 2,
    categoriaId: 10,
    destacado: false,
  },
  {
    id: 15,
    codigo: "COR-TC100",
    nombre: "Silla Gamer TC100 Relaxed",
    marca: "Corsair",
    precio: 189990,
    imagen: "img/silla.svg",
    descripcion:
      "Silla de tela transpirable con respaldo alto, reposabrazos 4D y base de acero.",
    stock: 10,
    stockCritico: 2,
    categoriaId: 10,
    destacado: false,
  },
  {
    id: 16,
    codigo: "RAZ-ISKUR",
    nombre: "Silla Gamer Iskur",
    marca: "Razer",
    precio: 429990,
    imagen: "img/silla.svg",
    descripcion:
      "Silla ergonómica con soporte lumbar integrado y espuma de alta densidad.",
    stock: 0,
    stockCritico: 2,
    categoriaId: 10,
    destacado: false,
  },
  // --- Monitores en oferta (11) · banner 1 del Home ---
  {
    id: 24,
    codigo: "LG-27G610",
    nombre: 'Monitor Gamer LG 27" QHD 200Hz',
    marca: "LG",
    precio: 183990,
    imagen: "img/monitor.svg",
    descripcion:
      "Monitor IPS QHD de 27 pulgadas, 200 Hz y 1 ms (GtG), modelo 27G610A-B.AWHQ.",
    stock: 10,
    stockCritico: 3,
    categoriaId: 11,
    destacado: false,
  },
  {
    id: 25,
    codigo: "HP-S5-24",
    nombre: 'Monitor HP Series 5 23.8" FHD',
    marca: "HP",
    precio: 99990,
    imagen: "img/monitor.svg",
    descripcion:
      "Monitor Full HD de 23,8 pulgadas con panel IPS y diseño de bordes delgados.",
    stock: 14,
    stockCritico: 3,
    categoriaId: 11,
    destacado: false,
  },
  {
    id: 26,
    codigo: "MAS-PORT15",
    nombre: 'Monitor portátil Master G 15,6" FHD',
    marca: "Master G",
    precio: 79990,
    imagen: "img/monitor.svg",
    descripcion:
      "Monitor portátil FHD IPS de 15,6 pulgadas y 60 Hz, ideal para llevar a todas partes.",
    stock: 12,
    stockCritico: 3,
    categoriaId: 11,
    destacado: false,
  },

  // --- Componentes de PC (12) · banner 2 del Home ---
  {
    id: 27,
    codigo: "COR-VENG8",
    nombre: "Memoria Notebook Corsair 8GB DDR4",
    marca: "Corsair",
    precio: 99990,
    imagen: "img/placeholder.svg",
    descripcion: "Memoria SoDimm DDR4 de 8 GB a 3200 MHz, línea Vengeance.",
    stock: 20,
    stockCritico: 3,
    categoriaId: 12,
    destacado: false,
  },
  {
    id: 28,
    codigo: "ADA-SU650",
    nombre: "Unidad SSD Adata SU650 240GB",
    marca: "Adata",
    precio: 52990,
    imagen: "img/placeholder.svg",
    descripcion: "Unidad de estado sólido de 240 GB, modelo Ultimate SU650.",
    stock: 25,
    stockCritico: 3,
    categoriaId: 12,
    destacado: false,
  },
  {
    id: 29,
    codigo: "AMD-R75700G",
    nombre: "CPU AMD Ryzen 7 5700G",
    marca: "AMD",
    precio: 244990,
    imagen: "img/placeholder.svg",
    descripcion:
      "Procesador Ryzen 7 5700G con gráficos Radeon integrados, socket AM4.",
    stock: 8,
    stockCritico: 3,
    categoriaId: 12,
    destacado: false,
  },

  // --- Energía y respaldo (13) · banner 3 del Home ---
  {
    id: 30,
    codigo: "CIT-UPS750",
    nombre: "UPS Cito 750VA/375W",
    marca: "Cito",
    precio: 59990,
    imagen: "img/placeholder.svg",
    descripcion:
      "UPS Power Line interactiva de 750 VA / 375 W para proteger tus equipos.",
    stock: 15,
    stockCritico: 3,
    categoriaId: 13,
    destacado: false,
  },
  {
    id: 31,
    codigo: "FOR-TITAN300",
    nombre: "Generador Portátil Forza Titan 300W",
    marca: "Forza",
    precio: 199990,
    imagen: "img/placeholder.svg",
    descripcion:
      "Generador eléctrico portátil Titan de 300 W con múltiples salidas.",
    stock: 6,
    stockCritico: 3,
    categoriaId: 13,
    destacado: false,
  },
  {
    id: 32,
    codigo: "SPE-UPS2000",
    nombre: "UPS Spektra 2000VA/1200W",
    marca: "Spektra",
    precio: 149990,
    imagen: "img/placeholder.svg",
    descripcion: "UPS interactiva de 2000 VA / 1200 W con pantalla LCD.",
    stock: 7,
    stockCritico: 3,
    categoriaId: 13,
    destacado: false,
  },
];

// Las imágenes viven en public/img. Los productos guardan la ruta relativa ("img/x.svg") y aquí se
// le antepone la base del sitio, así también funcionan los carritos que ya estaban en localStorage.
export const rutaImagen = (imagen) =>
  /^https:\/\//.test(imagen || "")
    ? imagen
    : (import.meta.env?.BASE_URL ?? "/") + (imagen || "img/placeholder.svg");

export const formatearPrecio = (valor) =>
  "$" + Number(valor).toLocaleString("es-CL");
