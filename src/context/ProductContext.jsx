import { createContext, useContext, useEffect, useState } from "react";
import { leerConVersion, guardarConVersion } from "../hooks/useLocalStorage.js";
import { productosPorDefecto, VERSION_CATALOGO } from "../data/productos.js";

// Catálogo único de productos: lo leen la tienda y el carrito, y lo edita el panel de administración.
// Se guarda en localStorage ("productos"); la primera vez se parte de productosPorDefecto.
const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [productos, setProductos] = useState(() =>
    leerConVersion("productos", VERSION_CATALOGO, productosPorDefecto).map(
      (p) => {
        const inicial = productosPorDefecto.find((base) => base.id === p.id);
        const anteriores = {
          1: "img/control.svg",
          2: "img/teclado.svg",
          3: "img/mouse.svg",
          4: "img/auriculares.svg",
        };
        return inicial && p.imagen === anteriores[p.id]
          ? { ...p, imagen: inicial.imagen }
          : p;
      },
    ),
  );

  useEffect(() => {
    guardarConVersion("productos", VERSION_CATALOGO, productos);
  }, [productos]);

  const obtener = (id) => productos.find((p) => p.id === Number(id));

  // El id se autogenera (siguiente número libre); el código lo escribe el administrador
  const crear = (datos) =>
    setProductos((actual) => [
      ...actual,
      { ...datos, id: Math.max(0, ...actual.map((p) => p.id)) + 1 },
    ]);

  const editar = (id, datos) =>
    setProductos((actual) =>
      actual.map((p) => (p.id === id ? { ...p, ...datos, id } : p)),
    );

  const eliminar = (id) =>
    setProductos((actual) => actual.filter((p) => p.id !== id));

  // Resta del stock lo comprado: items = [{ id, cantidad }]
  const descontarStock = (items) =>
    setProductos((actual) =>
      actual.map((p) => {
        const comprado = items.find((i) => i.id === p.id);
        return comprado
          ? { ...p, stock: Math.max(0, p.stock - comprado.cantidad) }
          : p;
      }),
    );

  // Devuelve al stock lo de un pedido cancelado: items = [{ id, cantidad }]
  const reponerStock = (items) =>
    setProductos((actual) =>
      actual.map((p) => {
        const devuelto = items.find((i) => i.id === p.id);
        return devuelto ? { ...p, stock: p.stock + devuelto.cantidad } : p;
      }),
    );

  return (
    <ProductContext.Provider
      value={{
        productos,
        obtener,
        crear,
        editar,
        eliminar,
        descontarStock,
        reponerStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProductos = () => useContext(ProductContext);
