import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { useProductos } from "../../context/ProductContext.jsx";
import { useCategorias } from "../../context/CategoryContext.jsx";
import "../../styles/admin-form.css";

const CAMPOS = [
  "codigo",
  "nombre",
  "marca",
  "descripcion",
  "precio",
  "stock",
  "stockCritico",
  "categoriaId",
  "imagen",
];

// Formulario de producto. Una sola pantalla sirve para crear (/admin/products/new) y para
// editar (/admin/products/:id/edit): antes eran product-create.html y product-edit.html, casi idénticos.
export default function ProductForm() {
  const { id } = useParams();
  const editando = id !== undefined;
  const navigate = useNavigate();
  const { productos, obtener, crear, editar } = useProductos();
  const { principales, hijosDe } = useCategorias();

  useTitulo(
    editando
      ? "Administrador - Editar Producto"
      : "Administrador - Nuevo Producto",
  );

  // Valores iniciales: el producto existente al editar, o campos vacíos al crear
  const [form, setForm] = useState(() => {
    const existente = editando ? obtener(id) : null;
    return Object.fromEntries(
      CAMPOS.map((k) => [
        k,
        existente
          ? (existente[k] ?? "")
          : k === "categoriaId"
            ? (principales[0]?.id ?? "")
            : "",
      ]),
    );
  });
  const [destacado, setDestacado] = useState(() =>
    editando ? !!obtener(id)?.destacado : false,
  );
  const [mensaje, setMensaje] = useState("");

  // Los inputs tienen como id el nombre del campo, así un solo handler sirve para todos
  const cambiar = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const producto = {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      marca: form.marca.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockCritico: Number(form.stockCritico || 0),
      categoriaId: Number(form.categoriaId),
      imagen: form.imagen.trim() || "img/placeholder.svg",
      destacado,
    };

    if (
      !producto.nombre ||
      !producto.codigo ||
      productos.some(
        (p) =>
          p.codigo.toLowerCase() === producto.codigo.toLowerCase() &&
          p.id !== Number(id),
      )
    ) {
      setMensaje("Revisa el nombre y usa un código único.");
      return;
    }
    if (editando && obtener(id)) {
      editar(Number(id), producto);
    } else {
      crear(producto);
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
          <input
            id="codigo"
            required
            minLength={3}
            value={form.codigo}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            required
            maxLength={100}
            value={form.nombre}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="marca">Marca</label>
          <input
            id="marca"
            maxLength={50}
            value={form.marca}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            maxLength={500}
            value={form.descripcion}
            onChange={cambiar}
          />
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio</label>
          <input
            id="precio"
            type="number"
            min="0"
            step="1"
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
          <label htmlFor="categoriaId">Categoría</label>
          <select
            id="categoriaId"
            required
            value={form.categoriaId}
            onChange={cambiar}
          >
            {principales.map((cat) => (
              <optgroup key={cat.id} label={cat.nombre}>
                <option value={cat.id}>{cat.nombre} (general)</option>
                {hijosDe(cat.id).map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="imagen">Imagen local o URL https de producto</label>
          <input id="imagen" value={form.imagen} onChange={cambiar} />
          <p className="muted">
            Usa imágenes de productos que tengas permiso para utilizar.
          </p>
        </div>
        <div className="form-group">
          <label className="switch" htmlFor="destacado">
            <input
              id="destacado"
              type="checkbox"
              checked={destacado}
              onChange={(e) => setDestacado(e.target.checked)}
            />
            <span className="switch-pista" />
            Destacado (aparece en las ofertas del inicio)
          </label>
        </div>
        <div className="actions">
          <button type="submit">
            {editando ? "Guardar cambios" : "Guardar producto"}
          </button>
          <Link className="btn btn-secondary" to="/admin/products">
            Cancelar
          </Link>
        </div>
        <p className={mensaje ? "alert alert-success" : ""}>{mensaje}</p>
      </form>
    </section>
  );
}
