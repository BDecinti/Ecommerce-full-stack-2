import { useState } from "react";
import { Link } from "react-router-dom";
import { useProductos } from "../../context/ProductContext.jsx";
import { formatearPrecio } from "../../data/productos.js";
import {
  resumenInventario,
  descargarInventario,
} from "../../utils/inventario.js";
import useTitulo from "../../hooks/useTitulo.js";
export default function ProductReports() {
  useTitulo("Administrador - Reporte de inventario");
  const { productos } = useProductos();
  const [soloCriticos, setSoloCriticos] = useState(false);
  const r = resumenInventario(productos);
  const visibles = productos.filter(
    (p) => !soloCriticos || p.stock <= (p.stockCritico ?? 0),
  );
  return (
    <section className="container">
      <div className="admin-title">
        <div>
          <h1>Reporte de inventario</h1>
          <p>Disponibilidad y valor del catálogo a precio de venta.</p>
        </div>
        <div className="actions">
          <Link className="btn btn-secondary" to="/admin/products">
            Volver a productos
          </Link>
          <button onClick={() => descargarInventario(visibles)}>
            Descargar CSV
          </button>
        </div>
      </div>
      <div className="inventory-metrics">
        {[
          ["Productos", r.productos],
          ["Unidades", r.unidades],
          ["Stock crítico", r.criticos],
          ["Valor de inventario", formatearPrecio(r.valor)],
        ].map(([t, v]) => (
          <article className="card" key={t}>
            <p>{t}</p>
            <strong>{v}</strong>
          </article>
        ))}
      </div>
      <label className="inventory-filter">
        <input
          type="checkbox"
          checked={soloCriticos}
          onChange={(e) => setSoloCriticos(e.target.checked)}
        />
        Solo stock crítico o agotado
      </label>
      <p role="status">{visibles.length} productos en el reporte</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {[
                "Código",
                "Producto",
                "Stock",
                "Stock crítico",
                "Estado",
                "Valor CLP",
              ].map((t) => (
                <th key={t}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.stock}</td>
                <td>{p.stockCritico ?? 0}</td>
                <td>
                  {p.stock === 0
                    ? "Agotado"
                    : p.stock <= (p.stockCritico ?? 0)
                      ? "Crítico"
                      : "Disponible"}
                </td>
                <td>{formatearPrecio(p.precio * p.stock)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visibles.length && (
          <p className="empty-state">No hay productos con stock crítico.</p>
        )}
      </div>
    </section>
  );
}
