import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useCategorias } from "../../context/CategoryContext.jsx";
import "../../styles/admin-form.css";

// Formulario para crear (/admin/categories/new) o editar (/admin/categories/:id/edit) una categoría.
// Si se elige una categoría padre, se crea una subcategoría. Hay solo dos niveles: una categoría
// con subcategorías no puede pasar a ser subcategoría.
export default function CategoryForm() {
  const { id } = useParams();
  const editando = id !== undefined;
  const navigate = useNavigate();
  const { categorias, principales, hijosDe, obtener, crear, editar } = useCategorias();
  const existente = editando ? obtener(id) : null;

  useTitulo(editando ? "Administrador - Editar Categoría" : "Administrador - Nueva Categoría");

  const [nombre, setNombre] = useState(existente?.nombre ?? "");
  const [padreId, setPadreId] = useState(existente?.padreId ?? "");
  const [error, setError] = useState("");

  if (editando && !existente) {
    return (
      <section className="form-card card">
        <p>Categoría no encontrada.</p>
        <Link className="btn btn-secondary" to="/admin/categories">
          Volver
        </Link>
      </section>
    );
  }

  const tieneSubcategorias = editando && hijosDe(existente.id).length > 0;
  // Posibles padres: categorías principales, sin contar la que se está editando
  const posiblesPadres = principales.filter((c) => c.id !== existente?.id);

  const enviar = (e) => {
    e.preventDefault();
    const limpio = nombre.trim();
    const padre = padreId === "" ? null : Number(padreId);

    const repetida = categorias.some(
      (c) =>
        c.id !== existente?.id &&
        c.padreId === padre &&
        c.nombre.toLowerCase() === limpio.toLowerCase(),
    );
    if (repetida) {
      setError("Ya existe una categoría con ese nombre en este nivel.");
      return;
    }

    if (editando) editar(existente.id, { nombre: limpio, padreId: padre });
    else crear({ nombre: limpio, padreId: padre });
    navigate("/admin/categories");
  };

  return (
    <section className="form-card card">
      <h1>{editando ? "Editar categoría" : "Nueva categoría"}</h1>
      <form onSubmit={enviar}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            required
            maxLength={60}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="padre">Categoría padre</label>
          <select
            id="padre"
            value={padreId}
            disabled={tieneSubcategorias}
            onChange={(e) => setPadreId(e.target.value)}
          >
            <option value="">Ninguna (categoría principal)</option>
            {posiblesPadres.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {tieneSubcategorias && (
            <small>Tiene subcategorías, por eso debe seguir siendo una categoría principal.</small>
          )}
        </div>
        {error && <p className="alert alert-error">{error}</p>}
        <div className="actions">
          <button type="submit">{editando ? "Guardar cambios" : "Crear categoría"}</button>
          <Link className="btn btn-secondary" to="/admin/categories">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
