import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/search-bar.css";

// Barra de búsqueda del navbar: al enviarla lleva a /products?q=texto. No filtra nada por sí misma.
export default function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [texto, setTexto] = useState(params.get("q") ?? "");

  const buscar = (e) => {
    e.preventDefault();
    const q = texto.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <form className="search-bar" role="search" onSubmit={buscar}>
      <input
        type="search"
        value={texto}
        placeholder="Buscar producto"
        aria-label="Buscar producto"
        onChange={(e) => setTexto(e.target.value)}
      />
    </form>
  );
}
