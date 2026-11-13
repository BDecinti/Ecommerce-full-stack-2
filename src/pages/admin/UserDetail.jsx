import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { useUsuarios } from "../../context/UsuariosContext.jsx";
import "../../styles/admin-detail.css";

export default function UserDetail() {
  useTitulo("Administrador - Mostrar Usuario");
  const { id } = useParams();
  const { obtener, eliminar } = useUsuarios();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [confirmar, setConfirmar] = useState(false),
    [error, setError] = useState("");
  const retirar = async () => {
    try {
      await eliminar(Number(id));
      navigate("/admin/users");
    } catch (e) {
      setConfirmar(false);
      setError(e.message);
    }
  };
  const u = obtener(id);

  return (
    <section className="container">
      {error && (
        <p role="alert" className="alert alert-error">
          {error}
        </p>
      )}
      <ConfirmDialog
        abierto={confirmar}
        titulo="¿Desactivar usuario?"
        mensaje="La cuenta no podrá ingresar y sus sesiones serán revocadas. Su historial se conservará."
        textoConfirmar="Desactivar usuario"
        onConfirmar={retirar}
        onCancelar={() => setConfirmar(false)}
      />
      <div className="admin-title">
        <div>
          <h1>Mostrar usuario</h1>
          <p>Detalle del usuario seleccionado.</p>
        </div>
        <div>
          {u && (
            <Link className="btn btn-primary" to={`/admin/users/${id}/orders`}>
              Historial de compras
            </Link>
          )}{" "}
          <Link className="btn btn-secondary" to="/admin/users">
            Volver
          </Link>
        </div>
      </div>
      <article className="card">
        {u ? (
          Object.entries(u)
            .filter(([clave]) => clave !== "password")
            .map(([clave, valor]) => (
              <div className="detail-row" key={clave}>
                <strong>{clave}:</strong>{" "}
                {typeof valor === "boolean"
                  ? valor
                    ? "Sí"
                    : "No"
                  : valor || "No informado"}
              </div>
            ))
        ) : (
          <p>Usuario no encontrado.</p>
        )}
      </article>
      {u && u.id !== usuario.id && (
        <div className="actions">
          <Link className="btn btn-secondary" to={`/admin/users/${u.id}/edit`}>
            Editar usuario
          </Link>
          <button className="btn-danger" onClick={() => setConfirmar(true)}>
            Desactivar usuario
          </button>
        </div>
      )}
    </section>
  );
}
