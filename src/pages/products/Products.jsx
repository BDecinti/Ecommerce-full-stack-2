import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import ProductFilters from "../../components/ProductFilters.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { useProductos } from "../../context/ProductContext.jsx";
import {
  filtrarProductos,
  filtrosIniciales,
  marcasDe,
} from "../../utils/filtrarProductos.js";
import "../../styles/styles.css";
export default function Products() {
  useTitulo("MiTienda - Productos");
  const { productos } = useProductos();
  const [params] = useSearchParams();
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const q = (params.get("q") ?? "").trim();
  const visibles = filtrarProductos(productos, { ...filtros, busqueda: q });
  return (
    <>
      <Breadcrumb
        items={[{ texto: "Inicio", to: "/" }, { texto: "Productos" }]}
      />
      <section className="page-header">
        <p className="eyebrow">ENCUENTRA TU PRÓXIMO FAVORITO</p>
        <h1>{q ? `Resultados para "${q}"` : "Explora el catálogo"}</h1>
        <p>Filtra, compara y encuentra lo que necesita tu setup.</p>
      </section>
      <section className="container catalog-layout">
        <ProductFilters
          filtros={filtros}
          onChange={setFiltros}
          marcas={marcasDe(productos)}
        />
        <div>
          <p className="catalog-count" role="status">
            {visibles.length} productos encontrados
          </p>
          {visibles.length ? (
            <div className="catalog-grid">
              {visibles.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <h2>Sin coincidencias</h2>
              <p>Prueba con otro término o limpia los filtros.</p>
              <button onClick={() => setFiltros(filtrosIniciales)}>
                Limpiar filtros
              </button>{" "}
              <Link to="/products">Ver catálogo completo</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
