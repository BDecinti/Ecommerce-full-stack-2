import { createContext, useContext } from "react";
import { api } from "../services/api.js";
import { useApiList } from "../hooks/useApiList.js";
const CategoryContext = createContext(null);
export function CategoryProvider({ children }) {
  const list = useApiList("/categorias"),
    categorias = list.items;
  const obtener = (id) => categorias.find((c) => c.id === Number(id)),
    hijosDe = (id) => categorias.filter((c) => c.padreId === Number(id));
  const ruta = (id) => {
    const result = [],
      seen = new Set();
    let c = obtener(id);
    while (c && !seen.has(c.id)) {
      result.unshift(c);
      seen.add(c.id);
      c = obtener(c.padreId);
    }
    return result;
  };
  const crear = async (datos) => {
    const c = await api("/categorias", { method: "POST", body: datos });
    list.setItems((prev) => [...prev, c]);
    return c;
  };
  const editar = async (id, datos) => {
    const c = await api(`/categorias/${id}`, { method: "PUT", body: datos });
    list.setItems((prev) => prev.map((x) => (x.id === c.id ? c : x)));
    return c;
  };
  const eliminar = async (id) => {
    await api(`/categorias/${id}`, { method: "DELETE" });
    list.setItems((prev) => prev.filter((c) => c.id !== Number(id)));
  };
  return (
    <CategoryContext.Provider
      value={{
        categorias,
        principales: categorias.filter((c) => c.padreId === null),
        hijosDe,
        obtener,
        ruta,
        idsConSubcategorias: (id) => [
          Number(id),
          ...hijosDe(id).map((c) => c.id),
        ],
        crear,
        editar,
        eliminar,
        recargar: list.reload,
        cargando: list.loading,
        listo: list.loaded,
        error: list.error,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}
export const useCategorias = () => useContext(CategoryContext);
