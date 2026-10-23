import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useProductos } from "../../context/ProductContext.jsx";
import { leerJSON } from "../../hooks/useLocalStorage.js";
import { usePedidos } from "../../context/PedidoContext.jsx";
import AdminTitle from "../../components/admin/AdminTitle.jsx";
import OrderTable from "../../components/admin/OrderTable.jsx";
import { adminUsuariosPorDefecto } from "../../data/adminPorDefecto.js";
import { formatearPrecio } from "../../data/productos.js";
import "../../styles/admin-home.css";

// Dashboard del panel: resume productos, inventario, usuarios y ventas a partir de los datos guardados.
export default function Dashboard() {
  useTitulo("Administrador - Dashboard");
  const { productos } = useProductos();
  const usuarios = leerJSON("usuarios", null) || adminUsuariosPorDefecto;
  const { pedidos } = usePedidos();

  const ingresos = pedidos
    .filter((p) => p.estado !== "cancelado")
    .reduce((acc, p) => acc + p.total, 0);
  const valorInventario = productos.reduce((acc, p) => acc + p.precio * p.stock, 0);
  const criticos = productos.filter((p) => p.stock <= p.stockCritico);
  const stockMaximo = Math.max(1, ...productos.map((p) => p.stock));
  const ultimosPedidos = [...pedidos].reverse().slice(0, 5);
  const clientes = usuarios.filter((u) => u.rol === "cliente").length;

  const indicadores = [
    { titulo: "Ingresos", valor: formatearPrecio(ingresos), detalle: `${pedidos.length} pedidos` },
    {
      titulo: "Productos",
      valor: productos.length,
      detalle: `${productos.filter((p) => p.destacado).length} destacados`,
    },
    { titulo: "Valor del inventario", valor: formatearPrecio(valorInventario), detalle: "a precio de venta" },
    { titulo: "Usuarios", valor: usuarios.length, detalle: `${clientes} clientes` },
  ];

  return (
    <>
      <AdminTitle titulo="Dashboard" descripcion="Resumen general de la tienda." />

      <section className="dash-kpis">
        {indicadores.map((k) => (
          <article className="card dash-kpi" key={k.titulo}>
            <span className="dash-kpi-titulo">{k.titulo}</span>
            <strong className="dash-kpi-valor">{k.valor}</strong>
            <span className="dash-kpi-detalle">{k.detalle}</span>
          </article>
        ))}
      </section>

      <section className="dash-grid">
        <article className="card">
          <h2>Stock por producto</h2>
          <div className="dash-barras">
            {productos.map((p) => (
              <div className="dash-barra-fila" key={p.id}>
                <span className="dash-barra-nombre" title={p.nombre}>
                  {p.nombre}
                </span>
                <div className="dash-barra-pista">
                  <div
                    className={p.stock <= p.stockCritico ? "dash-barra critico" : "dash-barra"}
                    style={{ width: `${(p.stock / stockMaximo) * 100}%` }}
                  />
                </div>
                <span className="dash-barra-valor">{p.stock}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Stock crítico</h2>
          {criticos.length === 0 ? (
            <p className="dash-vacio">Todos los productos tienen stock suficiente.</p>
          ) : (
            <ul className="dash-alertas">
              {criticos.map((p) => (
                <li key={p.id}>
                  <Link to={`/admin/products/${p.id}/edit`}>{p.nombre}</Link>
                  <span className={p.stock === 0 ? "dash-etiqueta agotado" : "dash-etiqueta"}>
                    {p.stock === 0 ? "Agotado" : `Quedan ${p.stock}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="card dash-pedidos">
        <h2>Últimos pedidos</h2>
        {ultimosPedidos.length === 0 ? (
          <p className="dash-vacio">Aún no hay pedidos registrados.</p>
        ) : (
          <OrderTable pedidos={ultimosPedidos} />
        )}
      </section>
    </>
  );
}
