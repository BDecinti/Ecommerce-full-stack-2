// Estados posibles de un pedido. "clase" es el sufijo de la clase CSS del distintivo (EstadoBadge).
export const estadosPedido = [
  { valor: "pagado", etiqueta: "Pagado", clase: "pagado" },
  { valor: "en preparación", etiqueta: "En preparación", clase: "preparacion" },
  { valor: "entregado", etiqueta: "Entregado", clase: "entregado" },
  { valor: "cancelado", etiqueta: "Cancelado", clase: "cancelado" },
];

export const estadoInicialPedido = "pagado";
