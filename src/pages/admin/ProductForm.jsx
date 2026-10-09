import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useListaLocal } from "../../hooks/useLocalStorage.js";
import { adminProductosPorDefecto } from "../../data/adminPorDefecto.js";
import "../../styles/admin-form.css";

const CAMPOS = ["codigo", "nombre", "descripcion", "precio", "stock", "stockCritico", "categoria"];

// Formulario de producto. Una sola pantalla sirve para crear (/admin/products/new) y para
// editar (/admin/products/:id/edit): antes eran product-create.html y product-edit.html, casi idénticos.
export default function ProductForm() {
  const { id } = useParams();
  const editando = id !== undefined;
  const idx = Number(id);
  const navigate = useNavigate();
  const [productos, guardar] = useListaLocal("adminProductos", adminProductosPorDefecto);

  useTitulo(editando ? "Administrador - Editar Producto" : "Administrador - Nuevo Producto");

  // Valores iniciales: el producto existente al editar, o campos vacíos al crear
  const [form, setForm] = useState(() => {
    const existente = editando ? productos[idx] : null;
    return Object.fromEntries(
      CAMPOS.map((k) => [k, existente ? (existente[k] ?? "") : k === "categoria" ? "tecnologia" : ""]),
    );
  });
  const [mensaje, setMensaje] = useState("");

  // Los inputs tienen como id el nombre del campo, así un solo handler sirve para todos
  const cambiar = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const producto = {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockCritico: Number(form.stockCritico || 0),
      categoria: form.categoria,
    };

    if (editando && productos[idx]) {
      guardar(productos.map((p, i) => (i === idx ? producto : p)));
    } else {
      guardar([...productos, producto]);
    }

    setMensaje("Producto guardado correctamente.");
    setTimeout(() => navigate("/admin/products"), 600);
  };

  return (
    <section className="form-card card">
      <h1>{editando ? "Editar producto" : "Nuevo producto"}</h1>
      <form onSubmit={enviar}>
        <div className="form-group">
          <label htmlFor="codigo">Código producto</label>
          <input id="codigo" required minLength={3} value={form.codigo} onChange={cambiar} />
        </div>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" required maxLength={100} value={form.nombre} onChange={cambiar} />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea id="descripcion" maxLength={500} value={form.descripcion} onChange={cambiar} />
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio</label>
          <input
            id="precio"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.precio}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            required
            value={form.stock}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="stockCritico">Stock crítico</label>
          <input
            id="stockCritico"
            type="number"
            min="0"
            step="1"
            value={form.stockCritico}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" required value={form.categoria} onChange={cambiar}>
            <option value="tecnologia">Tecnología</option>
            <option value="accesorios">Accesorios</option>
            <option value="otros">Otros</option>
          </select>
        </div>
        <div className="actions">
          <button type="submit">{editando ? "Guardar cambios" : "Guardar producto"}</button>
          <Link className="btn btn-secondary" to="/admin/products">
            Cancelar
          </Link>
        </div>
        <p className={mensaje ? "alert alert-success" : ""}>{mensaje}</p>
      </form>
    </section>
  );
}
