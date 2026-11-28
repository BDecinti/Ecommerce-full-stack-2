import { createContext, useContext } from "react";
import { api } from "../services/api.js";
import { useApiList } from "../hooks/useApiList.js";
const ProductContext = createContext(null);
export function ProductProvider({ children }) {
  const list = useApiList("/productos");
  const crear = async (datos) => {
    const p = await api("/productos", { method: "POST", body: datos });
    list.setItems((prev) => [...prev, p]);
    return p;
  };
  const editar = async (id, datos) => {
    const p = await api(`/productos/${id}`, { method: "PUT", body: datos });
    list.setItems((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    return p;
  };
  const eliminar = async (id) => {
    await api(`/productos/${id}`, { method: "DELETE" });
    list.setItems((prev) => prev.filter((x) => x.id !== Number(id)));
  };
  return (
    <ProductContext.Provider
      value={{
        productos: list.items,
        obtener: (id) => list.items.find((p) => p.id === Number(id)),
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
    </ProductContext.Provider>
  );
}
export const useProductos = () => useContext(ProductContext);
