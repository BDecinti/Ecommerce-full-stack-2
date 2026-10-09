import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useListaLocal } from "../../hooks/useLocalStorage.js";
import { adminUsuariosPorDefecto } from "../../data/adminPorDefecto.js";

export default function Users() {
  useTitulo("Administrador - Usuarios");
  const [usuarios] = useListaLocal("adminUsuarios", adminUsuariosPorDefecto);

  return (
    <section className="container">
      <div className="admin-title">
        <div>
          <h1>Usuarios</h1>
          <p>Listado de usuarios registrados.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/users/new">
          + Nuevo usuario
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr key={i}>
                <td>{u.run}</td>
                <td>{u.nombre}</td>
                <td>{u.apellidos}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>
                  <Link className="btn btn-secondary" to={`/admin/users/${i}`}>
                    Mostrar
                  </Link>{" "}
                  <Link className="btn btn-dark" to={`/admin/users/${i}/edit`}>
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
