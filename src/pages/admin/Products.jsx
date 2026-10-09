import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useListaLocal } from "../../hooks/useLocalStorage.js";
import { adminProductosPorDefecto } from "../../data/adminPorDefecto.js";
import { formatearPrecio } from "../../data/productos.js";

export default function Products() {
  useTitulo("Administrador - Productos");
  const [productos] = useListaLocal("adminProductos", adminProductosPorDefecto);

  return (
    <section className="container">
      <div className="admin-title">
        <div>
          <h1>Productos</h1>
          <p>Listado de productos disponibles.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/products/new">
          + Nuevo producto
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* El id de la URL es la posición en la lista, igual que antes (?id=i) */}
            {productos.map((p, i) => (
              <tr key={i}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{formatearPrecio(p.precio)}</td>
                <td>{p.stock}</td>
                <td>
                  <Link className="btn btn-secondary" to={`/admin/products/${i}`}>
                    Mostrar
                  </Link>{" "}
                  <Link className="btn btn-dark" to={`/admin/products/${i}/edit`}>
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
