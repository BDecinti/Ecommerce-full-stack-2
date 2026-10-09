import { Link, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useListaLocal } from "../../hooks/useLocalStorage.js";
import { adminProductosPorDefecto } from "../../data/adminPorDefecto.js";
import { formatearPrecio } from "../../data/productos.js";
import "../../styles/admin-detail.css";

export default function ProductDetail() {
  useTitulo("Administrador - Mostrar Producto");
  const { id } = useParams();
  const [productos] = useListaLocal("adminProductos", adminProductosPorDefecto);
  const p = productos[Number(id)];

  return (
    <section className="container">
      <div className="admin-title">
        <div>
          <h1>Mostrar producto</h1>
          <p>Detalle del producto seleccionado.</p>
        </div>
        <Link className="btn btn-secondary" to="/admin/products">
          Volver
        </Link>
      </div>
      <article className="card">
        {p ? (
          <>
            <div className="detail-row">
              <strong>Código:</strong> {p.codigo}
            </div>
            <div className="detail-row">
              <strong>Nombre:</strong> {p.nombre}
            </div>
            <div className="detail-row">
              <strong>Descripción:</strong> {p.descripcion || "Sin descripción"}
            </div>
            <div className="detail-row">
              <strong>Precio:</strong> {formatearPrecio(p.precio)}
            </div>
            <div className="detail-row">
              <strong>Stock:</strong> {p.stock}
            </div>
            <div className="detail-row">
              <strong>Stock crítico:</strong> {p.stockCritico}
            </div>
            <div className="detail-row">
              <strong>Categoría:</strong> {p.categoria}
            </div>
          </>
        ) : (
          <p>Producto no encontrado.</p>
        )}
      </article>
    </section>
  );
}
