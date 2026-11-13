import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { useProductos } from "../../context/ProductContext.jsx";
import { useCategorias } from "../../context/CategoryContext.jsx";
import { formatearPrecio } from "../../data/productos.js";
import "../../styles/admin-detail.css";

export default function ProductDetail() {
  useTitulo("Administrador - Mostrar Producto");
  const { id } = useParams();
  const { obtener, eliminar } = useProductos();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [confirmar, setConfirmar] = useState(false),
    [error, setError] = useState("");
  const retirar = async () => {
    try {
      await eliminar(Number(id));
      navigate("/admin/products");
    } catch (e) {
      setConfirmar(false);
      setError(e.message);
    }
  };
  const { ruta } = useCategorias();
  const p = obtener(id);

  return (
    <section className="container">
      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}
      <ConfirmDialog
        abierto={confirmar}
        titulo="¿Retirar producto?"
        mensaje="Se retirará del catálogo, conservando el historial de compras."
        textoConfirmar="Retirar producto"
        onConfirmar={retirar}
        onCancelar={() => setConfirmar(false)}
      />
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
              <strong>Marca:</strong> {p.marca || "Sin marca"}
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
              <strong>Categoría:</strong>{" "}
              {ruta(p.categoriaId)
                .map((c) => c.nombre)
                .join(" → ") || "Sin categoría"}
            </div>
            <div className="detail-row">
              <strong>Destacado:</strong> {p.destacado ? "Sí" : "No"}
            </div>
          </>
        ) : (
          <p>Producto no encontrado.</p>
        )}
      </article>
      {p && usuario.rol === "admin" && (
        <div className="actions">
          <Link
            className="btn btn-secondary"
            to={`/admin/products/${p.id}/edit`}
          >
            Editar producto
          </Link>
          <button className="btn-danger" onClick={() => setConfirmar(true)}>
            Retirar producto
          </button>
        </div>
      )}
    </section>
  );
}
