import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { usePedidos } from "../../context/PedidoContext.jsx";
import { useProductos } from "../../context/ProductContext.jsx";
import { useUsuarios } from "../../context/UsuariosContext.jsx";
import { formatearPrecio } from "../../data/productos.js";
import { costoEnvio } from "../../utils/checkout.js";
import AdminTitle from "../../components/admin/AdminTitle.jsx";
import OrderProductPicker from "../../components/admin/OrderProductPicker.jsx";
import "../../styles/admin-form.css";
import "../../styles/admin-orders.css";

export default function OrderForm() {
  useTitulo("Administrador - Nuevo pedido");
  const navigate = useNavigate();
  const { crear } = usePedidos(),
    { productos } = useProductos(),
    { usuarios } = useUsuarios();
  const [cliente, setCliente] = useState(
    usuarios.find((u) => u.rol === "cliente")?.email ??
      usuarios[0]?.email ??
      "",
  );
  const [cantidades, setCantidades] = useState({}),
    [tipoEntrega, setTipoEntrega] = useState("presencial");
  const [direccion, setDireccion] = useState(""),
    [comuna, setComuna] = useState(""),
    [region, setRegion] = useState("");
  const [telefono, setTelefono] = useState(""),
    [metodoPago, setMetodoPago] = useState("efectivo"),
    [error, setError] = useState(""),
    [enviando, setEnviando] = useState(false);
  const key = useRef(crypto.randomUUID());
  const usuario = usuarios.find((u) => u.email === cliente);
  const items = productos
    .filter((p) => cantidades[p.id] > 0)
    .map((p) => ({ id: p.id, cantidad: cantidades[p.id] }));
  const subtotal = productos.reduce(
    (sum, p) => sum + p.precio * (cantidades[p.id] || 0),
    0,
  );
  const enviar = async (e) => {
    e.preventDefault();
    if (enviando) return;
    if (!items.length) {
      setError("Agrega al menos un producto al pedido.");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      const p = await crear(
        {
          items,
          usuario: cliente,
          metodoPago,
          entrega: {
            nombre: usuario.nombre,
            email: cliente,
            telefono,
            tipoEntrega,
            direccion,
            comuna,
            region,
          },
        },
        key.current,
      );
      navigate(`/admin/orders/${p.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };
  return (
    <section className="container">
      <AdminTitle
        titulo="Nuevo pedido"
        descripcion="Registra una venta a un cliente de la tienda."
      >
        <Link className="btn btn-secondary" to="/admin/orders">
          Cancelar
        </Link>
      </AdminTitle>
      <form className="card" onSubmit={enviar}>
        <div className="form-group">
          <label htmlFor="cliente">Cliente registrado</label>
          <select
            id="cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
          >
            {usuarios.map((u) => (
              <option key={u.id} value={u.email}>
                {u.nombre} · {u.email}
              </option>
            ))}
          </select>
        </div>
        <OrderProductPicker
          productos={productos}
          cantidades={cantidades}
          onChange={(id, cantidad) =>
            setCantidades((prev) => ({ ...prev, [id]: cantidad }))
          }
        />
        <div className="form-group">
          <label htmlFor="telefono">Celular de contacto</label>
          <input
            id="telefono"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+56 9 1234 5678"
          />
        </div>
        <div className="form-group">
          <label htmlFor="entrega">Entrega</label>
          <select
            id="entrega"
            value={tipoEntrega}
            onChange={(e) => setTipoEntrega(e.target.value)}
          >
            <option value="presencial">Retiro en tienda</option>
            <option value="envio">Envío a domicilio</option>
          </select>
        </div>
        {tipoEntrega === "envio" && (
          <>
            {[
              ["direccion", "Dirección", direccion, setDireccion],
              ["comuna", "Comuna", comuna, setComuna],
              ["region", "Región", region, setRegion],
            ].map(([id, label, value, setter]) => (
              <div key={id} className="form-group">
                <label htmlFor={id}>{label}</label>
                <input
                  id={id}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                />
              </div>
            ))}
          </>
        )}
        <div className="form-group">
          <label htmlFor="metodo">Método de pago</label>
          <select
            id="metodo"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="efectivo">Efectivo</option>
            <option value="debito">Débito</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <p>
          Total estimado:{" "}
          <strong>
            {formatearPrecio(subtotal + costoEnvio(tipoEntrega, subtotal))}
          </strong>
        </p>
        {error && (
          <p className="alert alert-error" role="alert">
            {error}
          </p>
        )}
        <div className="actions">
          <button disabled={enviando || !usuario} type="submit">
            {enviando ? "Guardando…" : "Crear pedido"}
          </button>
          <Link className="btn btn-secondary" to="/admin/orders">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
