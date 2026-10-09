import { createContext, useContext, useEffect, useState } from "react";
import { leerJSON, guardarJSON } from "../hooks/useLocalStorage.js";

// Carrito de compras. Reemplaza obtenerCarrito / guardarCarrito / agregarAlCarrito / cambiarCantidad /
// eliminarDelCarrito / vaciarCarrito (que estaban repetidos en productos.js, carrito.js y pago.js) y
// las actualizaciones manuales del contador del header (span#cart-count).
// Se sigue guardando en localStorage ("carrito") para que persista entre recargas.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(() => leerJSON("carrito", []));

  useEffect(() => {
    guardarJSON("carrito", carrito);
  }, [carrito]);

  const agregar = (producto) =>
    setCarrito((actual) => {
      const existente = actual.find((item) => item.id === producto.id);
      if (existente) {
        // Si ya estaba en el carrito, solo se suma uno a la cantidad
        return actual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        );
      }
      // Se guarda una copia del producto junto con la cantidad
      return [...actual, { ...producto, cantidad: 1 }];
    });

  // Aumenta o disminuye la cantidad de un producto (lo elimina si llega a 0)
  const cambiarCantidad = (id, delta) =>
    setCarrito((actual) =>
      actual
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + delta } : item))
        .filter((item) => item.cantidad > 0),
    );

  const eliminar = (id) => setCarrito((actual) => actual.filter((item) => item.id !== id));

  const vaciar = () => setCarrito([]);

  // Valores derivados: ya no hace falta guardarlos ni actualizarlos a mano
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ carrito, agregar, cambiarCantidad, eliminar, vaciar, cantidadTotal, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
