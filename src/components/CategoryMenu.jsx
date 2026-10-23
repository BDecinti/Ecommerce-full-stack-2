import { Link } from "react-router-dom";
import { useCategorias } from "../context/CategoryContext.jsx";
import "../styles/category-menu.css";

// Menú lateral de categorías: lista las principales y, al pasar el mouse, muestra sus subcategorías.
// Las que tienen subcategorías llevan una flecha ">". `activaId` resalta la categoría que se está viendo.
export default function CategoryMenu({ activaId }) {
  const { principales, hijosDe, ruta } = useCategorias();
  const enRuta = activaId ? ruta(activaId).map((c) => c.id) : [];

  return (
    <aside className="category-menu" aria-label="Categorías">
      <ul>
        {principales.map((cat) => {
          const hijos = hijosDe(cat.id);
          return (
            <li key={cat.id} className={enRuta.includes(cat.id) ? "en-ruta" : ""}>
              <Link to={`/categories/${cat.id}`}>
                {cat.nombre}
                {hijos.length > 0 && <span className="category-menu-flecha">›</span>}
              </Link>
              {hijos.length > 0 && (
                <ul className="category-submenu">
                  {hijos.map((sub) => (
                    <li key={sub.id} className={sub.id === Number(activaId) ? "en-ruta" : ""}>
                      <Link to={`/categories/${sub.id}`}>{sub.nombre}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
