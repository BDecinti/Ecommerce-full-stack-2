import { estadosPedido } from "../../data/estadosPedido.js";
import "../../styles/admin-orders.css";

// Muestra el estado de un pedido como una etiqueta de color. No sabe nada más del pedido.
export default function EstadoBadge({ estado }) {
  const datos = estadosPedido.find((e) => e.valor === estado);
  return (
    <span className={`estado-badge estado-${datos?.clase ?? "pagado"}`}>
      {datos?.etiqueta ?? estado}
    </span>
  );
}
