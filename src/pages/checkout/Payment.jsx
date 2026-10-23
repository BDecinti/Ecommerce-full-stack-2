import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useProductos } from "../../context/ProductContext.jsx";
import { usePedidos } from "../../context/PedidoContext.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { formatearPrecio } from "../../data/productos.js";
import {
  costoEnvio,
  datosDelPedido,
  validarEntrega,
  validarTarjeta,
  validarStock,
  TARJETA_RECHAZADA,
} from "../../utils/checkout.js";
import "../../styles/styles.css";

export default function Payment() {
  useTitulo("MiTienda - Finalizar compra");
  const { usuario } = useAuth();
  const { carrito, total, vaciar } = useCart();
  const { productos, descontarStock } = useProductos();
  const { crear } = usePedidos();
  const [paso, setPaso] = useState(0);
  const [entrega, setEntrega] = useState({
    nombre: usuario?.nombre || "",
    email: usuario?.email || "",
    telefono: "",
    tipoEntrega: "presencial",
    direccion: usuario?.direccion || "",
    comuna: usuario?.comuna || "",
    region: usuario?.region || "",
  });
  const [tarjeta, setTarjeta] = useState({
    numero: "",
    titular: "",
    vencimiento: "",
    cvv: "",
  });
  const [error, setError] = useState("");
  const [rechazado, setRechazado] = useState(false);
  const [pedido, setPedido] = useState(null);
  const procesando = useRef(false);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [paso, pedido, rechazado]);
  const cambiar = (e) =>
    setEntrega({ ...entrega, [e.target.name]: e.target.value });
  const cambiarTarjeta = (e) =>
    setTarjeta({ ...tarjeta, [e.target.name]: e.target.value });
  const avanzar = (e) => {
    e.preventDefault();
    const problema =
      paso === 0 ? validarEntrega(entrega) : validarTarjeta(tarjeta);
    setError(problema);
    if (!problema) setPaso(paso + 1);
  };
  const pagar = () => {
    if (procesando.current) return;
    const problema =
      validarStock(carrito, productos) ||
      validarEntrega(entrega) ||
      validarTarjeta(tarjeta);
    if (problema) {
      setError(problema);
      return;
    }
    procesando.current = true;
    if (tarjeta.numero.replace(/\s/g, "") === TARJETA_RECHAZADA) {
      setRechazado(true);
      setError("");
      procesando.current = false;
      return;
    }
    // Se guardan solo datos de entrega y artículos. La tarjeta y el CVV nunca se persisten.
    const nuevo = crear(datosDelPedido(carrito, entrega, total));
    descontarStock(carrito);
    vaciar();
    setTarjeta({ numero: "", titular: "", vencimiento: "", cvv: "" });
    setPedido(nuevo);
  };
  if (pedido)
    return (
      <section className="container result-card card" aria-live="polite">
        <span className="result-symbol">✓</span>
        <p className="eyebrow">COMPRA DE DEMOSTRACIÓN</p>
        <h1>¡Pago aprobado!</h1>
        <p>
          Pedido #{pedido.id} registrado por {formatearPrecio(pedido.total)}.
        </p>
        <p>
          {pedido.tipoEntrega === "envio"
            ? `Entrega solicitada en ${pedido.direccion}, ${pedido.comuna}, ${pedido.region}.`
            : "Elegiste retiro en tienda. Este pedido es una simulación académica."}
        </p>
        <p>
          Contacto: {pedido.usuario} · {pedido.telefono}
        </p>
        <details>
          <summary>Ver comprobante</summary>
          {pedido.items.map((i) => (
            <p key={i.id}>
              {i.nombre} × {i.cantidad} —{" "}
              {formatearPrecio(i.precio * i.cantidad)}
            </p>
          ))}
          <p>Envío: {formatearPrecio(pedido.costoEnvio)}</p>
        </details>
        <div className="actions">
          <button onClick={() => window.print()}>Imprimir comprobante</button>
          <Link className="btn btn-secondary" to="/products">
            Seguir comprando
          </Link>
        </div>
      </section>
    );
  if (rechazado)
    return (
      <section className="container result-card card" role="alert">
        <span className="result-symbol error-symbol">×</span>
        <h1>Pago rechazado</h1>
        <p>
          La tarjeta de prueba simuló un rechazo. Tu carrito sigue intacto y no
          se creó ningún pedido ni se descontó stock.
        </p>
        <div className="actions">
          <button
            onClick={() => {
              setRechazado(false);
              setPaso(1);
            }}
          >
            Cambiar tarjeta y reintentar
          </button>
          <Link className="btn btn-secondary" to="/cart">
            Volver al carrito
          </Link>
        </div>
      </section>
    );
  if (!carrito.length)
    return (
      <section className="container result-card card">
        <h1>Tu carrito está vacío</h1>
        <p>Elige tus productos para comenzar la compra.</p>
        <Link className="btn btn-primary" to="/products">
          Explorar productos
        </Link>
      </section>
    );
  return (
    <>
      <section className="page-header">
        <p className="eyebrow">EL ÚLTIMO PASO PARA TU SETUP</p>
        <h1>Finalizar compra</h1>
        <p>
          Compra de demostración. Usa únicamente los datos de tarjeta de prueba
          indicados.
        </p>
      </section>
      <div className="container checkout-layout">
        <section className="card checkout-form">
          <ol className="checkout-steps" aria-label="Progreso de compra">
            {["Entrega", "Pago", "Confirmación"].map((p, i) => (
              <li
                key={p}
                aria-current={paso === i ? "step" : undefined}
                className={paso >= i ? "active" : ""}
              >
                <span>{i + 1}</span>
                {p}
              </li>
            ))}
          </ol>
          {paso === 0 && (
            <form onSubmit={avanzar}>
              <h2>¿Cómo recibes tu pedido?</h2>
              <div className="delivery-options">
                <label>
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value="presencial"
                    checked={entrega.tipoEntrega === "presencial"}
                    onChange={cambiar}
                  />
                  Retiro en tienda <small>Sin costo · Simulación</small>
                </label>
                <label>
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value="envio"
                    checked={entrega.tipoEntrega === "envio"}
                    onChange={cambiar}
                  />
                  Envío a domicilio{" "}
                  <small>$4.990 · Gratis desde $100.000</small>
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="nombre">Nombre de quien recibe</label>
                <input
                  id="nombre"
                  name="nombre"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={entrega.nombre}
                  onChange={cambiar}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Correo de contacto</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={entrega.email}
                    onChange={cambiar}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Celular</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+56 9 1234 5678"
                    required
                    value={entrega.telefono}
                    onChange={cambiar}
                  />
                </div>
              </div>
              {entrega.tipoEntrega === "envio" && (
                <fieldset>
                  <legend>Dirección de entrega</legend>
                  <div className="form-group">
                    <label htmlFor="direccion">
                      Calle, número y departamento
                    </label>
                    <input
                      id="direccion"
                      name="direccion"
                      autoComplete="street-address"
                      required
                      maxLength={180}
                      value={entrega.direccion}
                      onChange={cambiar}
                    />
                  </div>
                  <div className="form-row">
                    {[
                      ["comuna", "Comuna"],
                      ["region", "Región"],
                    ].map(([name, label]) => (
                      <div className="form-group" key={name}>
                        <label htmlFor={name}>{label}</label>
                        <input
                          id={name}
                          name={name}
                          required
                          value={entrega[name]}
                          onChange={cambiar}
                        />
                      </div>
                    ))}
                  </div>
                </fieldset>
              )}
              <button type="submit">Continuar al pago →</button>
            </form>
          )}
          {paso === 1 && (
            <form onSubmit={avanzar} autoComplete="off">
              <h2>Tarjeta de demostración</h2>
              <p className="muted demo-help">
                Aprobada: <code>4242 4242 4242 4242</code>
                <br />
                Rechazada: <code>4000 0000 0000 0002</code>
                <br />
                Titular ficticio, vencimiento futuro y cualquier CVV de 3
                dígitos. No ingreses datos reales.
              </p>
              {[
                [
                  "numero",
                  "Número de tarjeta de prueba",
                  "4242 4242 4242 4242",
                  19,
                ],
                ["titular", "Titular de prueba", "CLIENTE DEMO", 100],
                ["vencimiento", "Vencimiento MM/AA", "12/30", 5],
                ["cvv", "CVV de prueba", "123", 3],
              ].map(([name, label, placeholder, max]) => (
                <div className="form-group" key={name}>
                  <label htmlFor={name}>{label}</label>
                  <input
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    maxLength={max}
                    inputMode={
                      name === "numero" || name === "cvv" ? "numeric" : "text"
                    }
                    required
                    value={tarjeta[name]}
                    onChange={cambiarTarjeta}
                  />
                </div>
              ))}
              <div className="actions">
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => {
                    setPaso(0);
                    setError("");
                  }}
                >
                  Volver a entrega
                </button>
                <button type="submit">Revisar pedido →</button>
              </div>
            </form>
          )}
          {paso === 2 && (
            <div>
              <h2>Todo listo para confirmar</h2>
              <p>
                {entrega.nombre} · {entrega.email}
              </p>
              <p>
                {entrega.tipoEntrega === "envio"
                  ? `${entrega.direccion}, ${entrega.comuna}, ${entrega.region}`
                  : "Retiro en tienda sin costo"}
              </p>
              <p>
                Tarjeta de prueba terminada en{" "}
                {tarjeta.numero.replace(/\s/g, "").slice(-4)}
              </p>
              <p className="muted">
                Al confirmar se registrará un pedido simulado en este navegador.
              </p>
              <div className="actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setPaso(1);
                    setError("");
                  }}
                >
                  Volver a pago
                </button>
                <button onClick={pagar}>
                  Confirmar y pagar{" "}
                  {formatearPrecio(
                    total + costoEnvio(entrega.tipoEntrega, total),
                  )}
                </button>
              </div>
            </div>
          )}
          {error && (
            <p role="alert" className="alert alert-error">
              {error}
            </p>
          )}
        </section>
        <aside className="card checkout-summary">
          <h2>Tu pedido</h2>
          {carrito.map((i) => (
            <div className="summary-line" key={i.id}>
              <span>
                {i.nombre} <small>× {i.cantidad}</small>
              </span>
              <strong>{formatearPrecio(i.precio * i.cantidad)}</strong>
            </div>
          ))}
          <div className="summary-line">
            <span>Subtotal</span>
            <span>{formatearPrecio(total)}</span>
          </div>
          <div className="summary-line">
            <span>Envío</span>
            <span>
              {costoEnvio(entrega.tipoEntrega, total)
                ? formatearPrecio(4990)
                : "Gratis"}
            </span>
          </div>
          <div className="summary-line summary-total">
            <span>Total</span>
            <strong>
              {formatearPrecio(total + costoEnvio(entrega.tipoEntrega, total))}
            </strong>
          </div>
          <Link to="/cart">Editar carrito</Link>
        </aside>
      </div>
    </>
  );
}
