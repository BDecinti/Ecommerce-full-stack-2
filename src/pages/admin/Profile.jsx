import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/admin-detail.css";

const DATOS = [
  ["RUN", "run"],
  ["Nombre", "nombre"],
  ["Apellidos", "apellidos"],
  ["Correo", "email"],
  ["Fecha de nacimiento", "fechaNacimiento"],
  ["Región", "region"],
  ["Comuna", "comuna"],
  ["Dirección", "direccion"],
];

// Perfil del administrador con sesión iniciada: datos de la cuenta y accesos rápidos
export default function Profile() {
  useTitulo("Administrador - Perfil");
  const { usuario, cerrarSesion } = useAuth();

  // Se busca en la lista de usuarios para mostrar los datos más recientes y saber su posición (id de edición)
  const indice = usuario.rol === "admin" ? usuario.id : -1;
  const datos = usuario;

  return (
    <section className="container">
      <div className="admin-title">
        <div>
          <h1>Perfil</h1>
          <p>Datos de tu cuenta.</p>
        </div>
        {indice >= 0 && (
          <Link className="btn btn-primary" to={`/admin/users/${indice}/edit`}>
            Editar perfil
          </Link>
        )}
      </div>

      <article className="card">
        <div className="detail-row">
          <span className="admin-avatar">
            {datos.nombre.charAt(0).toUpperCase()}
          </span>{" "}
          <strong>
            {datos.nombre} {datos.apellidos}
          </strong>{" "}
          ({datos.rol})
        </div>
        {DATOS.map(([etiqueta, clave]) => (
          <div className="detail-row" key={clave}>
            <strong>{etiqueta}:</strong> {datos[clave] || "No informado"}
          </div>
        ))}
        <div className="detail-row">
          <strong>Contraseña:</strong> ••••••
        </div>
      </article>

      <div className="admin-title" style={{ marginTop: 20 }}>
        <Link className="btn btn-secondary" to="/">
          Volver a la tienda
        </Link>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}
