import { useAuth } from "../context/AuthContext.jsx";
import { useProductos } from "../context/ProductContext.jsx";
import { useCategorias } from "../context/CategoryContext.jsx";
export default function ConnectionBoundary({ children }) {
  const auth = useAuth(),
    productos = useProductos(),
    categorias = useCategorias();
  const problem = productos.error || categorias.error;
  if ((!productos.listo || !categorias.listo) && problem)
    return (
      <section className="container result-card card" role="alert">
        <p className="eyebrow">VOLVEMOS EN UN MOMENTO</p>
        <h1>No pudimos cargar la tienda</h1>
        <p>{problem}</p>
        <button
          onClick={() => {
            productos.recargar().catch(() => {});
            categorias.recargar().catch(() => {});
          }}
        >
          Volver a intentar
        </button>
      </section>
    );
  if (!auth.ready || !productos.listo || !categorias.listo)
    return (
      <section className="container session-status" role="status">
        <span className="session-spinner" />
        Preparando tu tienda…
      </section>
    );
  return (
    <>
      {auth.error && (
        <div className="container alert alert-error" role="alert">
          {auth.error}
        </div>
      )}
      {problem && (
        <div className="container alert alert-error" role="alert">
          {problem}
        </div>
      )}
      {children}
    </>
  );
}
