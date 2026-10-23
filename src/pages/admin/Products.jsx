import { useState } from "react";
import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useProductos } from "../../context/ProductContext.jsx";
import { formatearPrecio } from "../../data/productos.js";

export default function Products() {
  useTitulo("Administrador - Productos");
  const { productos } = useProductos();
  const [busqueda, setBusqueda] = useState("");
  const visibles = productos.filter((p) =>
    `${p.codigo} ${p.nombre}`.toLowerCase().includes(busqueda.toLowerCase()),
  );

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
      <div className="product-toolbar">
        <input
          type="search"
          aria-label="Buscar productos del inventario"
          placeholder="Buscar por nombre o código"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Link className="btn btn-secondary" to="/admin/products/reports">
          Reporte de inventario
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
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{formatearPrecio(p.precio)}</td>
                <td>{p.stock}</td>
                <td>{p.destacado ? "Sí" : "No"}</td>
                <td>
                  <Link
                    className="btn btn-secondary"
                    to={`/admin/products/${p.id}`}
                  >
                    Mostrar
                  </Link>{" "}
                  <Link
                    className="btn btn-dark"
                    to={`/admin/products/${p.id}/edit`}
                  >
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
