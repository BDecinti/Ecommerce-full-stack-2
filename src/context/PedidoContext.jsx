import { createContext, useContext, useEffect, useState } from "react";
import { leerJSON, guardarJSON } from "../hooks/useLocalStorage.js";
import { estadoInicialPedido } from "../data/estadosPedido.js";

// Pedidos realizados en la tienda. Los crea el pago (Payment) y los administra el panel de admin.
// Se guardan en localStorage ("pedidos"). Los pedidos antiguos no tenían id ni estado: se les asigna al cargar.
const PedidoContext = createContext(null);

const normalizar = (lista) =>
  lista.map((p, i) => ({ ...p, id: p.id ?? i + 1, estado: p.estado ?? estadoInicialPedido }));

export function PedidoProvider({ children }) {
  const [pedidos, setPedidos] = useState(() => normalizar(leerJSON("pedidos", [])));

  useEffect(() => {
    guardarJSON("pedidos", pedidos);
  }, [pedidos]);

  const obtener = (id) => pedidos.find((p) => p.id === Number(id));

  // Devuelve el pedido creado (con su id y estado inicial)
  const crear = (datos) => {
    const pedido = {
      ...datos,
      id: Math.max(0, ...pedidos.map((p) => p.id)) + 1,
      estado: estadoInicialPedido,
    };
    setPedidos((actual) => [...actual, pedido]);
    return pedido;
  };

  const cambiarEstado = (id, estado) =>
    setPedidos((actual) => actual.map((p) => (p.id === id ? { ...p, estado } : p)));

  return (
    <PedidoContext.Provider value={{ pedidos, obtener, crear, cambiarEstado }}>
      {children}
    </PedidoContext.Provider>
  );
}

export const usePedidos = () => useContext(PedidoContext);
