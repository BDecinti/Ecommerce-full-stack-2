import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useProductos } from "./ProductContext.jsx";
import { api } from "../services/api.js";
import { useApiList } from "../hooks/useApiList.js";
const PedidoContext = createContext(null);
export function PedidoProvider({ children }) {
  const { usuario, ready } = useAuth(),
    { recargar } = useProductos();
  const list = useApiList(
    "/pedidos",
    ready && !!usuario,
    usuario?.id ?? "anonimo",
  );
  const registrar = async (path, datos, key) => {
    const pedido = await api(path, {
      method: "POST",
      body: datos,
      headers: { "Idempotency-Key": key },
    });
    list.setItems((prev) => [
      pedido,
      ...prev.filter((p) => p.id !== pedido.id),
    ]);
    await recargar().catch(() => {});
    return pedido;
  };
  const comprar = (datos, key) => registrar("/pedidos", datos, key),
    crear = (datos, key) => registrar("/admin/pedidos", datos, key);
  const cambiarEstado = async (id, estado) => {
    const pedido = await api(`/pedidos/${id}/estado`, {
      method: "PATCH",
      body: { estado },
    });
    list.setItems((prev) => prev.map((p) => (p.id === pedido.id ? pedido : p)));
    await recargar().catch(() => {});
    return pedido;
  };
  const eliminar = async (id) => {
    await api(`/pedidos/${id}`, { method: "DELETE" });
    list.setItems((prev) => prev.filter((p) => p.id !== id));
  };
  return (
    <PedidoContext.Provider
      value={{
        pedidos: usuario ? list.items : [],
        obtener: (id) => list.items.find((p) => p.id === Number(id)),
        comprar,
        crear,
        cambiarEstado,
        eliminar,
        recargar: list.reload,
        cargando: list.loading,
        error: list.error,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
}
export const usePedidos = () => useContext(PedidoContext);
