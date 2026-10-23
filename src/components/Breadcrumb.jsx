import { Link } from "react-router-dom";
import "../styles/breadcrumb.css";

// Ruta de navegación pequeña bajo el navbar: Home → Categoría → Notebooks → Notebooks gamers.
// Recibe items = [{ texto, to? }]; el último (o cualquiera sin `to`) se muestra sin enlace.
export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Ruta de navegación">
      <ol>
        {items.map((item, i) => (
          <li key={i}>
            {item.to && i < items.length - 1 ? (
              <Link to={item.to}>{item.texto}</Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined}>{item.texto}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
