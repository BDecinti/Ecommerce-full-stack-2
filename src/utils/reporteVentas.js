// Cálculos del reporte de ventas del panel de admin. Son funciones puras: reciben los pedidos y el
// catálogo y devuelven datos listos para dibujar. Los pedidos cancelados no cuentan como venta.

export const granularidades = [
  { valor: "dia", etiqueta: "Día" },
  { valor: "semana", etiqueta: "Semana" },
  { valor: "mes", etiqueta: "Mes" },
];

// Primer instante del día / semana (lunes) / mes que contiene a la fecha
export function inicioPeriodo(fecha, gran) {
  const d = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  if (gran === "semana") d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  if (gran === "mes") d.setDate(1);
  return d;
}

// Mueve una fecha n períodos (negativo = hacia atrás)
export function desplazar(fecha, gran, n) {
  const d = new Date(fecha);
  if (gran === "dia") d.setDate(d.getDate() + n);
  if (gran === "semana") d.setDate(d.getDate() + 7 * n);
  if (gran === "mes") d.setMonth(d.getMonth() + n);
  return d;
}

// Mismo rango un año antes (mismas fechas del calendario)
export function haceUnAnio(fecha) {
  const d = new Date(fecha);
  d.setFullYear(d.getFullYear() - 1);
  return d;
}

export const ventasValidas = (pedidos) => pedidos.filter((p) => p.estado !== "cancelado");

export const enRango = (pedidos, desde, hasta) =>
  pedidos.filter((p) => {
    const f = new Date(p.fecha);
    return f >= desde && f < hasta;
  });

// Monto total, cantidad de pedidos y ticket promedio
export function resumen(pedidos) {
  const monto = pedidos.reduce((acc, p) => acc + p.total, 0);
  const cantidad = pedidos.length;
  return { monto, cantidad, ticket: cantidad ? Math.round(monto / cantidad) : 0 };
}

// Variación porcentual contra una base; null si la base es 0 (no se puede comparar)
export const variacion = (actual, base) => (base ? ((actual - base) / base) * 100 : null);

// Una fila por cada período (día, semana o mes) terminando en el período de referencia
export function serieVentas(pedidos, gran, inicio, cantidad = 8) {
  const filas = [];
  for (let k = cantidad - 1; k >= 0; k--) {
    const desde = desplazar(inicio, gran, -k);
    const hasta = desplazar(desde, gran, 1);
    filas.push({ desde, hasta, ...resumen(enRango(pedidos, desde, hasta)) });
  }
  return filas;
}

// Ventas por categoría, marca y producto. Cada ítem del pedido se cruza con el catálogo por id;
// si el producto ya no existe se agrupa como "Sin categoría" / "Sin marca".
export function desgloseVentas(pedidos, productos, nombreCategoria) {
  const porProducto = new Map();
  const porCategoria = new Map();
  const porMarca = new Map();

  const sumar = (mapa, clave, nombre, unidades, monto) => {
    const fila = mapa.get(clave) ?? { clave, nombre, unidades: 0, monto: 0 };
    fila.unidades += unidades;
    fila.monto += monto;
    mapa.set(clave, fila);
  };

  for (const pedido of pedidos) {
    for (const item of pedido.items) {
      const producto = productos.find((p) => p.id === item.id);
      const monto = item.precio * item.cantidad;
      sumar(porProducto, item.id, item.nombre, item.cantidad, monto);
      sumar(porCategoria, producto?.categoriaId ?? 0, nombreCategoria(producto?.categoriaId), item.cantidad, monto);
      const marca = producto?.marca || "Sin marca";
      sumar(porMarca, marca, marca, item.cantidad, monto);
    }
  }

  const ordenar = (mapa) => [...mapa.values()].sort((a, b) => b.monto - a.monto);
  return {
    categorias: ordenar(porCategoria),
    marcas: ordenar(porMarca),
    productos: ordenar(porProducto),
    vendidos: porProducto,
  };
}

// Productos más y menos vendidos (por unidades). Los menos vendidos incluyen los que no vendieron nada.
export function rankingProductos(vendidos, productos, limite = 5) {
  const filas = productos.map((p) => ({
    clave: p.id,
    nombre: p.nombre,
    unidades: vendidos.get(p.id)?.unidades ?? 0,
    monto: vendidos.get(p.id)?.monto ?? 0,
  }));
  const mas = filas
    .filter((f) => f.unidades > 0)
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, limite);
  const menos = [...filas].sort((a, b) => a.unidades - b.unidades || a.nombre.localeCompare(b.nombre)).slice(0, limite);
  return { mas, menos };
}
