import { formatearPrecio, rutaImagen } from "../../data/productos.js";

// Productos de un pedido con su cantidad y subtotal, más el total al final.
export default function OrderItemsTable({ items, total }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="pedido-producto">
                <img src={rutaImagen(item.imagen)} alt="" />
                {item.nombre}
              </td>
              <td>{formatearPrecio(item.precio)}</td>
              <td>{item.cantidad}</td>
              <td>{formatearPrecio(item.precio * item.cantidad)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>
              <strong>Total</strong>
            </td>
            <td>
              <strong>{formatearPrecio(total)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
