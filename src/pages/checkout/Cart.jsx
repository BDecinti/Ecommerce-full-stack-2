import { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { useCart } from "../../context/CartContext.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { formatearPrecio, rutaImagen } from "../../data/productos.js";
import "../../styles/styles.css";

export default function Cart() {
  useTitulo("MiTienda - Carrito");
  const { carrito, cambiarCantidad, eliminar, vaciar, cantidadTotal, total } = useCart();

  // Producto que el usuario quiere eliminar y está pendiente de confirmación (null = diálogo cerrado)
  const [porEliminar, setPorEliminar] = useState(null);

  const confirmarEliminacion = () => {
    eliminar(porEliminar.id);
    setPorEliminar(null);
  };

  return (
    <>
      <section className="page-header">
        <h1>Carrito de compra</h1>
        <p>Productos seleccionados.</p>
      </section>
      <section className="container card">
        <div id="carrito-lista">
          {carrito.length === 0 ? (
            <p className="carrito-vacio">
              Tu carrito está vacío. <Link to="/products">Ver productos</Link>
            </p>
          ) : (
            carrito.map((item) => (
              <div className="carrito-item" key={item.id}>
                <img src={rutaImagen(item.imagen)} alt={item.nombre} />
                <div className="carrito-item-info">
                  <h3>{item.nombre}</h3>
                  <p className="descripcion-producto">{item.descripcion || ""}</p>
                  <p>Precio unitario: {formatearPrecio(item.precio)}</p>
                </div>
                <div className="carrito-item-cantidad">
                  <button onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                </div>
                <p className="carrito-item-subtotal">
                  {formatearPrecio(item.precio * item.cantidad)}
                </p>
                <button className="btn-danger" onClick={() => setPorEliminar(item)}>
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
        <div className="carrito-resumen">
          <span>Total ({cantidadTotal} productos):</span>
          <span className="carrito-total">{formatearPrecio(total)}</span>
        </div>
        <div className="actions">
          <button className="btn-danger" onClick={vaciar}>
            Vaciar carrito
          </button>
          <Link className="btn btn-secondary" to="/products">
            Seguir comprando
          </Link>
          <Link className="btn btn-primary" to="/payment">
            Ir a pagar
          </Link>
        </div>
      </section>

      <ConfirmDialog
        abierto={porEliminar !== null}
        titulo="¿Eliminar producto?"
        mensaje={`¿Estás seguro de que quieres eliminar "${porEliminar?.nombre}" del carrito?`}
        textoConfirmar="Sí, eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}
