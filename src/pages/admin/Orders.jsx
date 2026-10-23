import { useState } from "react";
import useTitulo from "../../hooks/useTitulo.js";
import { usePedidos } from "../../context/PedidoContext.jsx";
import { Link } from "react-router-dom";
import AdminTitle from "../../components/admin/AdminTitle.jsx";
import EstadoSelect from "../../components/admin/EstadoSelect.jsx";
import OrderTable from "../../components/admin/OrderTable.jsx";
import "../../styles/admin-orders.css";

// Listado de pedidos, del más nuevo al más antiguo, con filtro por estado.
export default function Orders() {
  useTitulo("Administrador - Pedidos");
  const { pedidos } = usePedidos();
  const [estado, setEstado] = useState("");

  const visibles = [...pedidos].reverse().filter((p) => !estado || p.estado === estado);

  return (
    <section className="container">
      <AdminTitle titulo="Pedidos" descripcion="Compras realizadas en la tienda.">
        <div className="orders-acciones">
          <div className="orders-filtro">
            <EstadoSelect value={estado} onChange={setEstado} todos />
          </div>
          <Link className="btn btn-primary" to="/admin/orders/new">
            + Nuevo pedido
          </Link>
        </div>
      </AdminTitle>
      <div className="card">
        {visibles.length === 0 ? (
          <p className="dash-vacio">No hay pedidos para mostrar.</p>
        ) : (
          <OrderTable pedidos={visibles} />
        )}
      </div>
    </section>
  );
}
