export function resumenInventario(productos) {
  return {
    productos: productos.length,
    unidades: productos.reduce((s, p) => s + p.stock, 0),
    valor: productos.reduce((s, p) => s + p.stock * p.precio, 0),
    criticos: productos.filter((p) => p.stock <= (p.stockCritico ?? 0)).length,
  };
}

export function csvInventario(productos) {
  // Evita que nombres ingresados por el admin se interpreten como fórmulas en Excel.
  const celda = (valor) =>
    '"' +
    String(valor)
      .replace(/^[=+@-]/, "'$&")
      .replace(/"/g, '""') +
    '"';
  const filas = [
    [
      "Código",
      "Producto",
      "Marca",
      "Precio CLP",
      "Stock",
      "Stock crítico",
      "Valor CLP",
    ],
    ...productos.map((p) => [
      p.codigo,
      p.nombre,
      p.marca || "Sin marca",
      p.precio,
      p.stock,
      p.stockCritico ?? 0,
      p.precio * p.stock,
    ]),
  ];
  return "\uFEFF" + filas.map((f) => f.map(celda).join(";")).join("\r\n");
}

export function descargarInventario(productos) {
  const url = URL.createObjectURL(
    new Blob([csvInventario(productos)], { type: "text/csv;charset=utf-8;" }),
  );
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "inventario-mitienda.csv";
  enlace.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
