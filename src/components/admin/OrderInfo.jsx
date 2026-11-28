import { formatearFecha } from "../../utils/formatearFecha.js";

// Datos del pedido en filas "etiqueta: valor" (cliente, fecha, pago y entrega). Solo presenta, no edita.
export default function OrderInfo({ pedido }) {
  const filas = [
    ["Cliente", pedido.usuario],
    ...(pedido.nombre ? [["Receptor", pedido.nombre]] : []),
    ["Fecha", formatearFecha(pedido.fecha)],
    ["Método de pago", pedido.metodoPago],
    [
      "Entrega",
      pedido.tipoEntrega === "envio" ? "Envío a domicilio" : "Retiro en tienda",
    ],
  ];
  if (pedido.tipoEntrega === "envio") {
    filas.push([
      "Dirección",
      `${pedido.direccion}, ${pedido.comuna}${pedido.region ? ", " + pedido.region : ""}`,
    ]);
    filas.push(["Teléfono", pedido.telefono || "No indicado"]);
  }

  return (
    <>
      {filas.map(([etiqueta, valor]) => (
        <div className="detail-row" key={etiqueta}>
          <strong>{etiqueta}:</strong> {valor}
        </div>
      ))}
    </>
  );
}
