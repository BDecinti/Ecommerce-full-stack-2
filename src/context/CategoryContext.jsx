import { createContext, useContext, useEffect, useState } from "react";
import { leerConVersion, guardarConVersion } from "../hooks/useLocalStorage.js";
import { categoriasPorDefecto, VERSION_CATEGORIAS } from "../data/categorias.js";

// Categorías y subcategorías de la tienda (dos niveles). Las edita el panel de administración y las
// usan el menú de categorías, la ruta de navegación (breadcrumb) y el formulario de productos.
// Se guardan en localStorage ("categorias").
const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [categorias, setCategorias] = useState(() =>
    leerConVersion("categorias", VERSION_CATEGORIAS, categoriasPorDefecto),
  );

  useEffect(() => {
    guardarConVersion("categorias", VERSION_CATEGORIAS, categorias);
  }, [categorias]);

  const principales = categorias.filter((c) => c.padreId === null);
  const hijosDe = (id) => categorias.filter((c) => c.padreId === Number(id));
  const obtener = (id) => categorias.find((c) => c.id === Number(id));

  // Camino desde la categoría principal hasta la indicada: [Notebooks, Notebooks gamers]
  const ruta = (id) => {
    const categoria = obtener(id);
    if (!categoria) return [];
    return categoria.padreId === null ? [categoria] : [...ruta(categoria.padreId), categoria];
  };

  // La categoría y sus subcategorías: sirve para listar los productos de una categoría general
  const idsConSubcategorias = (id) => [Number(id), ...hijosDe(id).map((c) => c.id)];

  const crear = ({ nombre, padreId = null }) =>
    setCategorias((actual) => [
      ...actual,
      { id: Math.max(0, ...actual.map((c) => c.id)) + 1, nombre, padreId },
    ]);

  const editar = (id, datos) =>
    setCategorias((actual) => actual.map((c) => (c.id === id ? { ...c, ...datos, id } : c)));

  const eliminar = (id) => setCategorias((actual) => actual.filter((c) => c.id !== id));

  return (
    <CategoryContext.Provider
      value={{
        categorias,
        principales,
        hijosDe,
        obtener,
        ruta,
        idsConSubcategorias,
        crear,
        editar,
        eliminar,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategorias = () => useContext(CategoryContext);
