import { productosPorDefecto } from "../src/data/productos.js";
import { categoriasPorDefecto } from "../src/data/categorias.js";
import { writeFile } from "node:fs/promises";
await writeFile(new URL("../backend/src/main/resources/semillas-catalogo.json",import.meta.url),JSON.stringify({categorias:categoriasPorDefecto,productos:productosPorDefecto},null,2));
console.log("Catálogo inicial sincronizado con el backend.");
