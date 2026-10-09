import { Link, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useListaLocal } from "../../hooks/useLocalStorage.js";
import { adminUsuariosPorDefecto } from "../../data/adminPorDefecto.js";
import "../../styles/admin-detail.css";

export default function UserDetail() {
  useTitulo("Administrador - Mostrar Usuario");
  const { id } = useParams();
  const [usuarios] = useListaLocal("adminUsuarios", adminUsuariosPorDefecto);
  const u = usuarios[Number(id)];

  return (
    <section className="container">
      <div className="admin-title">
        <div>
          <h1>Mostrar usuario</h1>
          <p>Detalle del usuario seleccionado.</p>
        </div>
        <Link className="btn btn-secondary" to="/admin/users">
          Volver
        </Link>
      </div>
      <article className="card">
        {u ? (
          Object.entries(u).map(([clave, valor]) => (
            <div className="detail-row" key={clave}>
              <strong>{clave}:</strong> {valor || "No informado"}
            </div>
          ))
        ) : (
          <p>Usuario no encontrado.</p>
        )}
      </article>
    </section>
  );
}
