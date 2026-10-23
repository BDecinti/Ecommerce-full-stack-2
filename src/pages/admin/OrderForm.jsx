import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { leerJSON } from "../../hooks/useLocalStorage.js";
import { usePedidos } from "../../context/PedidoContext.jsx";
import { useProductos } from "../../context/ProductContext.jsx";
import { adminUsuariosPorDefecto } from "../../data/adminPorDefecto.js";
import { formatearPrecio } from "../../data/productos.js";
import AdminTitle from "../../components/admin/AdminTitle.jsx";
import OrderProductPicker from "../../components/admin/OrderProductPicker.jsx";
import "../../styles/admin-form.css";
import "../../styles/admin-orders.css";

const OTRO_CLIENTE = "__otro__";

// Crea un pedido a mano (ventas por teléfono, en el local, etc.). Usa los mismos contextos que el pago:
// PedidoContext para registrar el pedido y ProductContext para descontar el stock.
export default function OrderForm() {
  useTitulo("Administrador - Nuevo Pedido");
  const navigate = useNavigate();
  const { crear } = usePedidos();
  const { productos, descontarStock } = useProductos();
  const usuarios = leerJSON("usuarios", null) || adminUsuariosPorDefecto;

  const [cliente, setCliente] = useState(usuarios[0]?.email ?? OTRO_CLIENTE);
  const [clienteLibre, setClienteLibre] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [tipoEntrega, setTipoEntrega] = useState("presencial");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [error, setError] = useState("");

  const items = productos
    .filter((p) => cantidades[p.id] > 0)
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      cantidad: cantidades[p.id],
      imagen: p.imagen,
    }));
  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  const enviar = (e) => {
    e.preventDefault();
    const usuario = cliente === OTRO_CLIENTE ? clienteLibre.trim() : cliente;
    const esEnvio = tipoEntrega === "envio";

    if (!usuario) return setError("Indica el cliente (nombre o correo).");
    if (items.length === 0) return setError("Agrega al menos un producto al pedido.");
    if (esEnvio && (!direccion.trim() || !comuna.trim()))
      return setError("Para un envío indica la dirección y la comuna.");

    const pedido = crear({
      fecha: new Date().toISOString(),
      items,
      total,
      tipoEntrega,
      metodoPago,
      direccion: esEnvio ? direccion.trim() : "",
      comuna: esEnvio ? comuna.trim() : "",
      telefono: esEnvio ? telefono.trim() : "",
      usuario,
    });
    descontarStock(items);
    navigate(`/admin/orders/${pedido.id}`);
  };

  return (
    <section className="container">
      <AdminTitle titulo="Nuevo pedido" descripcion="Registra una venta realizada fuera de la web.">
        <Link className="btn btn-secondary" to="/admin/orders">
          Cancelar
        </Link>
      </AdminTitle>

      <form onSubmit={enviar}>
        <article className="card orders-entrega">
          <h2 className="orders-subtitulo">Cliente</h2>
          <div className="form-group">
            <label htmlFor="cliente">Cliente</label>
            <select id="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)}>
              {usuarios.map((u) => (
                <option key={u.email} value={u.email}>
                  {u.nombre} {u.apellidos} ({u.email})
                </option>
              ))}
              <option value={OTRO_CLIENTE}>Cliente sin registrar</option>
            </select>
          </div>
          {cliente === OTRO_CLIENTE && (
            <div className="form-group">
              <label htmlFor="cliente-libre">Nombre o correo del cliente</label>
              <input
                id="cliente-libre"
                value={clienteLibre}
                onChange={(e) => setClienteLibre(e.target.value)}
              />
            </div>
          )}
        </article>

        <article className="card">
          <h2 className="orders-subtitulo">Productos</h2>
          <OrderProductPicker
            productos={productos}
            cantidades={cantidades}
            onChange={(id, n) => setCantidades({ ...cantidades, [id]: n })}
          />
          <p className="orders-total">
            Total: <strong>{formatearPrecio(total)}</strong>
          </p>
        </article>

        <article className="card orders-entrega">
          <h2 className="orders-subtitulo">Entrega y pago</h2>
          <div className="form-group">
            <label htmlFor="entrega">Entrega</label>
            <select id="entrega" value={tipoEntrega} onChange={(e) => setTipoEntrega(e.target.value)}>
              <option value="presencial">Retiro presencial en tienda</option>
              <option value="envio">Envío a domicilio</option>
            </select>
          </div>
          {tipoEntrega === "envio" && (
            <>
              <div className="form-group">
                <label htmlFor="direccion">Dirección de envío</label>
                <input id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="comuna">Comuna</label>
                <input id="comuna" value={comuna} onChange={(e) => setComuna(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono de contacto</label>
                <input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="metodo-pago">Método de pago</label>
            <select id="metodo-pago" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
              <option value="tarjeta">Tarjeta de crédito / débito</option>
              <option value="transferencia">Transferencia bancaria</option>
              <option value="efectivo">Efectivo</option>
            </select>
          </div>
        </article>

        {error && <p className="alert alert-error">{error}</p>}
        <div className="actions">
          <button type="submit">Crear pedido</button>
        </div>
      </form>
    </section>
  );
}
