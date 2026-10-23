import { Link } from "react-router-dom";
import EstadoBadge from "./EstadoBadge.jsx";
import { formatearPrecio } from "../../data/productos.js";
import { formatearFecha } from "../../utils/formatearFecha.js";

// Tabla de pedidos: solo dibuja las filas que recibe (no filtra, no ordena y no lee datos).
export default function OrderTable({ pedidos }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Entrega</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>#{p.id}</td>
              <td>{formatearFecha(p.fecha)}</td>
              <td>{p.usuario}</td>
              <td>{p.tipoEntrega === "envio" ? "Envío" : "Retiro"}</td>
              <td>
                <EstadoBadge estado={p.estado} />
              </td>
              <td>{formatearPrecio(p.total)}</td>
              <td>
                <Link className="btn btn-secondary" to={`/admin/orders/${p.id}`}>
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
