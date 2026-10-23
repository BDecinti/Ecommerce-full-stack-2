import { formatearPrecio } from "../../data/productos.js";

// Lista de productos con un campo de cantidad cada uno (0 hasta su stock).
// No guarda nada: recibe `cantidades` ({ [id]: n }) y avisa cada cambio con onChange(id, n).
export default function OrderProductPicker({ productos, cantidades, onChange }) {
  const limitar = (p, valor) => Math.min(p.stock, Math.max(0, Math.floor(Number(valor)) || 0));

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{formatearPrecio(p.precio)}</td>
              <td>{p.stock}</td>
              <td className="picker-cantidad">
                <input
                  type="number"
                  min="0"
                  max={p.stock}
                  step="1"
                  disabled={p.stock === 0}
                  value={cantidades[p.id] ?? 0}
                  aria-label={`Cantidad de ${p.nombre}`}
                  onChange={(e) => onChange(p.id, limitar(p, e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
