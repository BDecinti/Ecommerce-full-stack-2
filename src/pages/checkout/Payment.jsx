import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { leerJSON, guardarJSON } from "../../hooks/useLocalStorage.js";
import { formatearPrecio, rutaImagen } from "../../data/productos.js";
import "../../styles/styles.css";

// Sistema de pago simulado: no pide datos reales de tarjeta.
export default function Payment() {
  useTitulo("MiTienda - Pagar");
  const { usuario } = useAuth();
  const { carrito, total, vaciar } = useCart();

  // Cada campo del formulario es un estado (antes se leían con document.getElementById al enviar)
  const [tipoEntrega, setTipoEntrega] = useState("presencial");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [error, setError] = useState("");
  // Datos de la compra ya realizada; mientras es null se muestra el formulario
  const [confirmacion, setConfirmacion] = useState(null);

  const pagar = (e) => {
    e.preventDefault();
    setError("");

    if (carrito.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    if (tipoEntrega === "envio" && (!direccion.trim() || !comuna.trim())) {
      setError("Por favor ingresa tu dirección y comuna para el envío.");
      return;
    }

    const esEnvio = tipoEntrega === "envio";
    // Guardar un registro simple del pedido (opcional, útil para el admin/historial)
    const pedido = {
      fecha: new Date().toISOString(),
      items: carrito,
      total,
      tipoEntrega,
      metodoPago,
      direccion: esEnvio ? direccion.trim() : "",
      comuna: esEnvio ? comuna.trim() : "",
      telefono: esEnvio ? telefono.trim() : "",
      usuario: usuario?.email || "invitado",
    };
    guardarJSON("pedidos", [...leerJSON("pedidos", []), pedido]);

    // Vaciar el carrito porque la compra ya se "pagó"
    vaciar();
    setConfirmacion(pedido);
  };

  // Vista de confirmación (reemplaza a mostrar/ocultar bloques con style.display)
  if (confirmacion) {
    return (
      <>
        <PageHeader />
        <section className="container pago-container">
          <div className="card pago-confirmacion">
            <h2>✅ ¡Pago realizado con éxito!</h2>
            <p>
              {confirmacion.tipoEntrega === "envio" ? (
                <>
                  Tu pedido por <strong>{formatearPrecio(confirmacion.total)}</strong> fue enviado
                  con éxito a{" "}
                  <strong>
                    {confirmacion.direccion}, {confirmacion.comuna}
                  </strong>
                  . Te contactaremos al <strong>{confirmacion.telefono || "teléfono registrado"}</strong>{" "}
                  para coordinar la entrega.
                </>
              ) : (
                <>
                  Tu pedido por <strong>{formatearPrecio(confirmacion.total)}</strong> fue
                  registrado con éxito. Puedes retirarlo de forma presencial en nuestra tienda.
                </>
              )}
            </p>
            <Link className="btn btn-primary" to="/products">
              Seguir comprando
            </Link>
            <Link className="btn btn-secondary" to="/">
              Volver al inicio
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader />
      <section className="container pago-container">
        {/* Resumen del pedido */}
        <div className="card pago-resumen">
          <h2>Resumen del pedido</h2>
          <div id="pago-lista-items">
            {carrito.length === 0 ? (
              <p className="carrito-vacio">
                Tu carrito está vacío. <Link to="/products">Ver productos</Link>
              </p>
            ) : (
              carrito.map((item) => (
                <div className="pago-item" key={item.id}>
                  <img src={rutaImagen(item.imagen)} alt={item.nombre} />
                  <span className="pago-item-nombre">
                    {item.nombre} x{item.cantidad}
                  </span>
                  <span className="pago-item-subtotal">
                    {formatearPrecio(item.precio * item.cantidad)}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="carrito-resumen">
            <span>Total a pagar:</span>
            <span className="carrito-total">{formatearPrecio(total)}</span>
          </div>
        </div>

        {/* Formulario de entrega y pago simulado (oculto si el carrito está vacío) */}
        {carrito.length > 0 && (
          <div className="card pago-formulario">
            <h2>Datos de entrega</h2>
            <form onSubmit={pagar}>
              <div className="form-group">
                <label>¿Cómo quieres recibir tu pedido?</label>
                <div className="entrega-opciones">
                  <label className="entrega-opcion">
                    <input
                      type="radio"
                      name="entrega"
                      value="presencial"
                      checked={tipoEntrega === "presencial"}
                      onChange={(e) => setTipoEntrega(e.target.value)}
                    />{" "}
                    Retiro presencial en tienda
                  </label>
                  <label className="entrega-opcion">
                    <input
                      type="radio"
                      name="entrega"
                      value="envio"
                      checked={tipoEntrega === "envio"}
                      onChange={(e) => setTipoEntrega(e.target.value)}
                    />{" "}
                    Envío a domicilio
                  </label>
                </div>
              </div>

              {/* Los campos de dirección solo existen si se eligió envío a domicilio */}
              {tipoEntrega === "envio" && (
                <div className="campos-envio">
                  <div className="form-group">
                    <label htmlFor="direccion">Dirección de envío</label>
                    <input
                      type="text"
                      id="direccion"
                      placeholder="Calle, número, depto (si aplica)"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="comuna">Comuna</label>
                    <input
                      type="text"
                      id="comuna"
                      placeholder="Ej: Ñuñoa"
                      value={comuna}
                      onChange={(e) => setComuna(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono de contacto</label>
                    <input
                      type="tel"
                      id="telefono"
                      placeholder="+56 9 1234 5678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="metodo-pago">Método de pago</label>
                <select
                  id="metodo-pago"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <option value="tarjeta">Tarjeta de crédito / débito</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="efectivo">Efectivo al retirar / recibir</option>
                </select>
                <p className="pago-nota">
                  💡 Este es un sistema de pago simulado con fines de prueba: no se solicitan datos
                  reales de tarjeta.
                </p>
              </div>

              <p className="pago-error">{error}</p>

              <button type="submit" className="btn btn-primary">
                Confirmar y pagar
              </button>
            </form>
          </div>
        )}
      </section>
    </>
  );
}

function PageHeader() {
  return (
    <section className="page-header">
      <h1>Finalizar compra</h1>
      <p>Revisa tu pedido y elige cómo quieres recibirlo.</p>
    </section>
  );
}
