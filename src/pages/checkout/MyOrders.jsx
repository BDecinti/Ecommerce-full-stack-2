import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { usePedidos } from "../../context/PedidoContext.jsx";
import { formatearPrecio } from "../../data/productos.js";
import OrderInfo from "../../components/admin/OrderInfo.jsx";
import OrderItemsTable from "../../components/admin/OrderItemsTable.jsx";
import EstadoBadge from "../../components/admin/EstadoBadge.jsx";
import useTitulo from "../../hooks/useTitulo.js";
export default function MyOrders() {
  useTitulo("MiTienda - Mis compras");
  const { usuario } = useAuth(),
    { pedidos, cargando, error } = usePedidos();
  const propios = pedidos.filter((p) => p.usuario === usuario.email);
  return (
    <>
      <section className="page-header">
        <p className="eyebrow">TU HISTORIAL</p>
        <h1>Mis compras</h1>
        <p>Consulta tus pedidos y sus estados de entrega.</p>
      </section>
      <section className="container home-section">
        {cargando && <p role="status">Cargando tus compras…</p>}
        {error && (
          <p role="alert" className="alert alert-error">
            {error}
          </p>
        )}
        {!cargando && !propios.length && (
          <div className="card empty-state">
            <h2>Aún no tienes compras</h2>
            <Link className="btn btn-primary" to="/products">
              Explorar catálogo
            </Link>
          </div>
        )}
        {propios.map((p) => (
          <article className="card my-order" key={p.id}>
            <div className="section-heading">
              <h2>Pedido #{p.id}</h2>
              <EstadoBadge estado={p.estado} />
              <strong>{formatearPrecio(p.total)}</strong>
            </div>
            <OrderInfo pedido={p} />
            <details>
              <summary>Ver productos</summary>
              <OrderItemsTable items={p.items} total={p.total} />
            </details>
          </article>
        ))}
      </section>
    </>
  );
}
