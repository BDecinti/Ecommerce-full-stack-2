import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { leerJSON, guardarJSON } from "../hooks/useLocalStorage.js";
import { useProductos } from "./ProductContext.jsx";

// Carrito de compras. En localStorage ("carrito") solo se guarda { id, cantidad }; el nombre, el
// precio, la imagen y el stock se leen del catálogo (ProductContext), así siempre están actualizados.
// Si un producto se elimina del catálogo, desaparece del carrito; la cantidad nunca supera el stock.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { productos } = useProductos();
  // Los carritos antiguos guardaban el producto completo: se conserva solo id y cantidad
  const [lineas, setLineas] = useState(() =>
    leerJSON("carrito", []).map(({ id, cantidad }) => ({ id, cantidad })),
  );

  useEffect(() => {
    guardarJSON("carrito", lineas);
  }, [lineas]);

  // Líneas unidas con su producto. Se descartan productos que ya no existen o sin stock.
  const carrito = lineas
    .map((l) => {
      const producto = productos.find((p) => p.id === l.id);
      return producto ? { ...producto, cantidad: Math.min(l.cantidad, producto.stock) } : null;
    })
    .filter((item) => item && item.cantidad > 0);

  const stockDe = (id) => productos.find((p) => p.id === id)?.stock ?? 0;

  // Suma delta a la cantidad de un producto, sin pasar del stock (se elimina si llega a 0)
  const cambiarCantidad = (id, delta) =>
    setLineas((actual) => {
      const existente = actual.find((l) => l.id === id);
      const base = existente ? Math.min(existente.cantidad, stockDe(id)) : 0;
      const nueva = Math.min(base + delta, stockDe(id));
      if (nueva <= 0) return actual.filter((l) => l.id !== id);
      return existente
        ? actual.map((l) => (l.id === id ? { ...l, cantidad: nueva } : l))
        : [...actual, { id, cantidad: nueva }];
    });

  // Producto recién añadido, para el aviso emergente (null = sin aviso). `clave` distingue añadidos seguidos.
  const [aviso, setAviso] = useState(null);
  const cerrarAviso = useCallback(() => setAviso(null), []);

  const agregar = (producto) => {
    const enCarrito = carrito.find((item) => item.id === producto.id)?.cantidad ?? 0;
    if (enCarrito >= stockDe(producto.id)) return; // sin stock: no se añade ni se avisa
    cambiarCantidad(producto.id, 1);
    setAviso({ nombre: producto.nombre, clave: Date.now() });
  };

  const eliminar = (id) => setLineas((actual) => actual.filter((l) => l.id !== id));

  const vaciar = () => setLineas([]);

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregar,
        cambiarCantidad,
        eliminar,
        vaciar,
        cantidadTotal,
        total,
        aviso,
        cerrarAviso,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
