import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb.jsx";
import CategoryMenu from "../../components/CategoryMenu.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import ProductFilters from "../../components/ProductFilters.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import { useCategorias } from "../../context/CategoryContext.jsx";
import { useProductos } from "../../context/ProductContext.jsx";
import { CATEGORIAS_BANNERS, OFERTAS_ID } from "../../data/categorias.js";
import { filtrarProductos, filtrosIniciales, marcasDe } from "../../utils/filtrarProductos.js";
import "../../styles/styles.css";
import "../../styles/categories.css";

// Página de categorías: menú a la izquierda y, a la derecha, los productos de la categoría elegida
// (o todos, en /categories). Una categoría general incluye los productos de sus subcategorías.
export default function Categories() {
  const { id } = useParams();
  const { obtener, ruta, idsConSubcategorias } = useCategorias();
  const { productos } = useProductos();
  const categoria = id ? obtener(id) : null;

  // Los filtros vuelven a su valor inicial al cambiar de categoría
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [idFiltros, setIdFiltros] = useState(id);
  if (idFiltros !== id) {
    setIdFiltros(id);
    setFiltros(filtrosIniciales);
  }

  useTitulo(categoria ? `MiTienda - ${categoria.nombre}` : "MiTienda - Categorías");

  if (id && !categoria) return <Navigate to="/categories" replace />;

  const ids = categoria ? idsConSubcategorias(categoria.id) : null;
  let deLaCategoria = productos;
  if (categoria?.id === OFERTAS_ID) deLaCategoria = productos.filter((p) => p.destacado || CATEGORIAS_BANNERS.includes(p.categoriaId));
  else if (ids) deLaCategoria = productos.filter((p) => ids.includes(p.categoriaId));
  const visibles = filtrarProductos(deLaCategoria, filtros);

  const migas = [
    { texto: "Home", to: "/" },
    { texto: "Categoría", to: "/categories" },
    ...ruta(id).map((c) => ({ texto: c.nombre, to: `/categories/${c.id}` })),
  ];

  return (
    <>
      <Breadcrumb items={migas} />
      <section className="container categories-layout">
        <div className="categories-lateral">
          <CategoryMenu activaId={id} />
          <ProductFilters filtros={filtros} onChange={setFiltros} marcas={marcasDe(deLaCategoria)} />
        </div>
        <div>
          <h1 className="categories-titulo">{categoria ? categoria.nombre : "Todas las categorías"}</h1>
          <p className="categories-cantidad">{visibles.length} producto(s)</p>
          {visibles.length === 0 ? (
            <p className="categories-vacio">
              {deLaCategoria.length === 0
                ? "Aún no hay productos en esta categoría."
                : "Ningún producto coincide con los filtros."}
            </p>
          ) : (
            <div className="grid grid-3">
              {visibles.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
