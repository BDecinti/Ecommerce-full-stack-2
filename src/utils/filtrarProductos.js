export const normalizarBusqueda = (t) =>
  String(t)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Filtros de la página de categorías. Son funciones puras: reciben datos y devuelven datos.
export const filtrosIniciales = {
  busqueda: "",
  marcas: [], // marcas elegidas (vacío = todas)
  precioMin: "",
  precioMax: "",
  soloDisponibles: false,
  orden: "", // "", "precio-asc", "precio-desc" o "nombre"
};

export const marcaDe = (producto) => producto.marca || "Sin marca";

// Marcas presentes en una lista de productos, con cuántos productos tiene cada una
export function marcasDe(productos) {
  const cuenta = {};
  productos.forEach((p) => {
    cuenta[marcaDe(p)] = (cuenta[marcaDe(p)] || 0) + 1;
  });
  return Object.entries(cuenta)
    .map(([marca, cantidad]) => ({ marca, cantidad }))
    .sort((a, b) => a.marca.localeCompare(b.marca));
}

export function filtrarProductos(productos, filtros) {
  const min = filtros.precioMin === "" ? null : Number(filtros.precioMin);
  const max = filtros.precioMax === "" ? null : Number(filtros.precioMax);

  const resultado = productos.filter(
    (p) =>
      (!filtros.busqueda ||
        normalizarBusqueda(
          `${p.nombre} ${p.marca ?? ""} ${p.descripcion ?? ""} ${p.codigo ?? ""}`,
        ).includes(normalizarBusqueda(filtros.busqueda))) &&
      (filtros.marcas.length === 0 || filtros.marcas.includes(marcaDe(p))) &&
      (min === null || p.precio >= min) &&
      (max === null || p.precio <= max) &&
      (!filtros.soloDisponibles || p.stock > 0),
  );

  if (filtros.orden === "precio-asc")
    resultado.sort((a, b) => a.precio - b.precio);
  if (filtros.orden === "precio-desc")
    resultado.sort((a, b) => b.precio - a.precio);
  if (filtros.orden === "nombre")
    resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
  return resultado;
}
