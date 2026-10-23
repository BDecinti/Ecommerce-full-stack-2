// Categorías iniciales. Hay dos niveles: categorías principales (padreId: null) y subcategorías
// (padreId = id de la principal). Solo se usan si localStorage está vacío o si cambia VERSION_CATEGORIAS
// (después manda CategoryContext). Si se cambian aquí, hay que subir VERSION_CATEGORIAS.
export const VERSION_CATEGORIAS = 4;

// Categoría especial "Ofertas": no tiene productos propios. Muestra los 9 productos de los banners del
// carrusel del Home (categorías 11, 12 y 13) más los marcados como destacados, y es a donde llevan los banners.
export const OFERTAS_ID = 14;
export const CATEGORIAS_BANNERS = [11, 12, 13];

export const categoriasPorDefecto = [
  { id: 1, nombre: "Tecnología", padreId: null },
  { id: 2, nombre: "Accesorios", padreId: null },
  { id: 3, nombre: "Muebles", padreId: null },
  { id: 4, nombre: "Consolas", padreId: 1 },
  { id: 5, nombre: "Audio y streaming", padreId: 1 },
  { id: 6, nombre: "Controles", padreId: 2 },
  { id: 7, nombre: "Teclados y mouse", padreId: 2 },
  { id: 8, nombre: "Notebooks", padreId: 1 },
  { id: 9, nombre: "Monitores", padreId: 1 },
  { id: 10, nombre: "Sillas gamer", padreId: 3 },
  // Una por cada banner del carrusel del Home: el banner lleva a su categoría con sus 3 productos
  { id: 11, nombre: "Monitores en oferta", padreId: 1 },
  { id: 12, nombre: "Componentes de PC", padreId: 1 },
  { id: 13, nombre: "Energía y respaldo", padreId: 1 },
  { id: OFERTAS_ID, nombre: "Ofertas", padreId: null },
];
