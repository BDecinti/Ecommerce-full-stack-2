import { Link, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { usePedidos } from "../../context/PedidoContext.jsx";
import { useProductos } from "../../context/ProductContext.jsx";
import AdminTitle from "../../components/admin/AdminTitle.jsx";
import EstadoBadge from "../../components/admin/EstadoBadge.jsx";
import EstadoSelect from "../../components/admin/EstadoSelect.jsx";
import OrderInfo from "../../components/admin/OrderInfo.jsx";
import OrderItemsTable from "../../components/admin/OrderItemsTable.jsx";
import "../../styles/admin-detail.css";
import "../../styles/admin-orders.css";

export default function OrderDetail() {
  const { id } = useParams();
  const { obtener, cambiarEstado } = usePedidos();
  const { reponerStock } = useProductos();
  const pedido = obtener(id);

  useTitulo(
    pedido ? `Administrador - Pedido #${pedido.id}` : "Administrador - Pedido",
  );

  // Un pedido cancelado devuelve sus productos al stock y ya no puede cambiar de estado
  const actualizar = (estado) => {
    if (pedido.estado === "cancelado") return;
    if (estado === "cancelado") reponerStock(pedido.items);
    cambiarEstado(pedido.id, estado);
  };

  return (
    <section className="container">
      <AdminTitle
        titulo={pedido ? `Pedido #${pedido.id}` : "Pedido"}
        descripcion="Detalle de la compra."
      >
        <Link className="btn btn-secondary" to="/admin/orders">
          Volver
        </Link>
      </AdminTitle>
      {pedido ? (
        <>
          <article className="card">
            <div className="detail-row">
              <strong>Estado:</strong> <EstadoBadge estado={pedido.estado} />
            </div>
            <OrderInfo pedido={pedido} />
            <div className="orders-cambiar-estado">
              <label htmlFor="estado">Cambiar estado</label>
              <EstadoSelect
                id="estado"
                value={pedido.estado}
                onChange={actualizar}
                disabled={pedido.estado === "cancelado"}
              />
              {pedido.estado === "cancelado" && (
                <small>Un pedido cancelado no se puede modificar.</small>
              )}
            </div>
          </article>
          <article className="card">
            {pedido.costoEnvio > 0 && (
              <p>
                Costo de envío incluido: $
                {pedido.costoEnvio.toLocaleString("es-CL")}
              </p>
            )}
            <OrderItemsTable items={pedido.items} total={pedido.total} />
          </article>
        </>
      ) : (
        <article className="card">
          <p>Pedido no encontrado.</p>
        </article>
      )}
    </section>
  );
}
