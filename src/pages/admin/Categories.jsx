import { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import AdminTitle from "../../components/admin/AdminTitle.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { useCategorias } from "../../context/CategoryContext.jsx";
import { useProductos } from "../../context/ProductContext.jsx";

// Listado de categorías con sus subcategorías debajo. Solo se puede eliminar una categoría
// que no tenga subcategorías ni productos.
export default function Categories() {
  useTitulo("Administrador - Categorías");
  const { principales, hijosDe, eliminar } = useCategorias();
  const { productos } = useProductos();
  const [porEliminar, setPorEliminar] = useState(null);

  const filas = principales.flatMap((cat) => [cat, ...hijosDe(cat.id)]);
  const cantidadProductos = (id) =>
    productos.filter((p) => p.categoriaId === id).length;

  const motivoBloqueo = (cat) => {
    if (hijosDe(cat.id).length > 0) return "Tiene subcategorías";
    if (cantidadProductos(cat.id) > 0) return "Tiene productos asignados";
    return "";
  };

  const confirmarEliminacion = () => {
    eliminar(porEliminar.id);
    setPorEliminar(null);
  };

  return (
    <section className="container">
      <AdminTitle
        titulo="Categorías"
        descripcion="Categorías y subcategorías de la tienda."
      >
        <Link className="btn btn-primary" to="/admin/categories/new">
          + Nueva categoría
        </Link>
      </AdminTitle>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((cat) => {
              const bloqueo = motivoBloqueo(cat);
              const esSub = cat.padreId !== null;
              return (
                <tr key={cat.id}>
                  <td className={esSub ? "categoria-sub" : ""}>{cat.nombre}</td>
                  <td>{esSub ? "Subcategoría" : "Categoría"}</td>
                  <td>{cantidadProductos(cat.id)}</td>
                  <td>
                    <div className="table-actions">
                      <Link
                        className="btn btn-dark"
                        to={`/admin/categories/${cat.id}/edit`}
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        className="btn-danger"
                        disabled={bloqueo !== ""}
                        title={bloqueo || "Eliminar categoría"}
                        onClick={() => setPorEliminar(cat)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        abierto={porEliminar !== null}
        titulo="¿Eliminar categoría?"
        mensaje={`¿Estás seguro de que quieres eliminar "${porEliminar?.nombre}"?`}
        textoConfirmar="Sí, eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setPorEliminar(null)}
      />
    </section>
  );
}
