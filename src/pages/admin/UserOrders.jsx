import { Link, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useListaLocal } from "../../hooks/useLocalStorage.js";
import { usePedidos } from "../../context/PedidoContext.jsx";
import AdminTitle from "../../components/admin/AdminTitle.jsx";
import OrderTable from "../../components/admin/OrderTable.jsx";
import { adminUsuariosPorDefecto } from "../../data/adminPorDefecto.js";
import { formatearPrecio } from "../../data/productos.js";
import "../../styles/admin-home.css";

// Historial de compras de un usuario: sus pedidos (se asocian por correo) con un resumen arriba.
export default function UserOrders() {
  useTitulo("Administrador - Historial de compras");
  const { id } = useParams();
  const [usuarios] = useListaLocal("usuarios", adminUsuariosPorDefecto);
  const { pedidos } = usePedidos();
  const u = usuarios[Number(id)];

  if (!u) {
    return (
      <>
        <AdminTitle titulo="Historial de compras" descripcion="Usuario no encontrado.">
          <Link className="btn btn-secondary" to="/admin/users">
            Volver
          </Link>
        </AdminTitle>
      </>
    );
  }

  const suyos = pedidos.filter((p) => p.usuario === u.email).reverse();
  const validos = suyos.filter((p) => p.estado !== "cancelado");
  const gastado = validos.reduce((acc, p) => acc + p.total, 0);

  const indicadores = [
    { titulo: "Pedidos", valor: suyos.length, detalle: `${suyos.length - validos.length} cancelados` },
    { titulo: "Total gastado", valor: formatearPrecio(gastado), detalle: "sin contar cancelados" },
    {
      titulo: "Ticket promedio",
      valor: formatearPrecio(validos.length ? Math.round(gastado / validos.length) : 0),
      detalle: "por pedido",
    },
  ];

  return (
    <>
      <AdminTitle titulo="Historial de compras" descripcion={`${u.nombre} ${u.apellidos ?? ""} · ${u.email}`}>
        <Link className="btn btn-secondary" to="/admin/users">
          Volver
        </Link>
      </AdminTitle>

      <section className="dash-kpis">
        {indicadores.map((k) => (
          <article className="card dash-kpi" key={k.titulo}>
            <span className="dash-kpi-titulo">{k.titulo}</span>
            <strong className="dash-kpi-valor">{k.valor}</strong>
            <span className="dash-kpi-detalle">{k.detalle}</span>
          </article>
        ))}
      </section>

      <section className="card dash-pedidos">
        {suyos.length === 0 ? (
          <p className="dash-vacio">Este usuario aún no ha realizado compras.</p>
        ) : (
          <OrderTable pedidos={suyos} />
        )}
      </section>
    </>
  );
}
