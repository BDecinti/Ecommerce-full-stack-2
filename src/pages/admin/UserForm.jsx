import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useListaLocal } from "../../hooks/useLocalStorage.js";
import { adminUsuariosPorDefecto } from "../../data/adminPorDefecto.js";
import "../../styles/admin-form.css";

const CAMPOS = [
  "run",
  "nombre",
  "apellidos",
  "email",
  "password",
  "fechaNacimiento",
  "rol",
  "region",
  "comuna",
  "direccion",
];

// Valores que muestran por defecto los <select> al crear un usuario (la primera opción de cada uno)
const VALORES_INICIALES = { rol: "admin", region: "Región Metropolitana", comuna: "Santiago" };

// Formulario de usuario para crear (/admin/users/new) y editar (/admin/users/:id/edit).
// Antes eran user-create.html y user-edit.html.
export default function UserForm() {
  const { id } = useParams();
  const editando = id !== undefined;
  const idx = Number(id);
  const navigate = useNavigate();
  const [usuarios, guardar] = useListaLocal("usuarios", adminUsuariosPorDefecto);

  useTitulo(editando ? "Administrador - Editar Usuario" : "Administrador - Nuevo Usuario");

  const [form, setForm] = useState(() => {
    const existente = editando ? usuarios[idx] : null;
    return Object.fromEntries(
      CAMPOS.map((k) => [k, existente ? existente[k] || "" : (VALORES_INICIALES[k] ?? "")]),
    );
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cambiar = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const email = form.email.trim();

    // El correo identifica al usuario en el login, así que no puede repetirse
    if (usuarios.some((u, i) => u.email === email && !(editando && i === idx))) {
      setError("Ya existe un usuario con ese correo.");
      return;
    }
    setError("");

    const usuario = {
      run: form.run.replace(/[.\-]/g, "").toUpperCase(),
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      email,
      password: form.password,
      fechaNacimiento: form.fechaNacimiento,
      rol: form.rol,
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim(),
    };

    if (editando && usuarios[idx]) {
      guardar(usuarios.map((u, i) => (i === idx ? usuario : u)));
    } else {
      guardar([...usuarios, usuario]);
    }

    setMensaje("Usuario guardado correctamente.");
    setTimeout(() => navigate("/admin/users"), 600);
  };

  return (
    <section className="form-card card">
      <h1>{editando ? "Editar usuario" : "Nuevo usuario"}</h1>
      <form onSubmit={enviar}>
        <div className="form-group">
          <label htmlFor="run">RUN</label>
          <input
            id="run"
            required
            minLength={7}
            maxLength={9}
            placeholder="19011022K"
            value={form.run}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" required maxLength={50} value={form.nombre} onChange={cambiar} />
        </div>
        <div className="form-group">
          <label htmlFor="apellidos">Apellidos</label>
          <input id="apellidos" required maxLength={100} value={form.apellidos} onChange={cambiar} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            required
            maxLength={100}
            value={form.email}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            required
            minLength={4}
            maxLength={10}
            value={form.password}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
          <input
            id="fechaNacimiento"
            type="date"
            value={form.fechaNacimiento}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="rol">Tipo de usuario</label>
          <select id="rol" value={form.rol} onChange={cambiar}>
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="region">Región</label>
          <select id="region" value={form.region} onChange={cambiar}>
            <option>Región Metropolitana</option>
            <option>Valparaíso</option>
            <option>Biobío</option>
            <option>La Araucanía</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comuna">Comuna</label>
          <select id="comuna" value={form.comuna} onChange={cambiar}>
            <option>Santiago</option>
            <option>Maipú</option>
            <option>Puente Alto</option>
            <option>Providencia</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            required
            maxLength={300}
            value={form.direccion}
            onChange={cambiar}
          />
        </div>
        <div className="actions">
          <button type="submit">{editando ? "Guardar cambios" : "Crear usuario"}</button>
          <Link className="btn btn-secondary" to="/admin/users">
            Cancelar
          </Link>
        </div>
        <p className={error ? "alert alert-error" : ""}>{error}</p>
        <p className={mensaje ? "alert alert-success" : ""}>{mensaje}</p>
      </form>
    </section>
  );
}
