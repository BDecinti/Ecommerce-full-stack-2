import { useCart } from "../context/CartContext.jsx";
import { useProductos } from "../context/ProductContext.jsx";
import { usePedidos } from "../context/PedidoContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext.jsx";
import { CategoryProvider } from "../context/CategoryContext.jsx";
import { ProductProvider } from "../context/ProductContext.jsx";
import { PedidoProvider } from "../context/PedidoContext.jsx";
import { CartProvider } from "../context/CartContext.jsx";
import { VERSION_CATALOGO } from "../data/productos.js";
export function renderTienda(ui, ruta = "/") {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <PedidoProvider>
              <CartProvider>{ui}</CartProvider>
            </PedidoProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
export const producto = {
  id: 90,
  codigo: "DEMO-90",
  nombre: "Mouse de prueba",
  descripcion: "Mouse óptico",
  marca: "Demo",
  precio: 10000,
  stock: 3,
  stockCritico: 1,
  categoriaId: 7,
  destacado: true,
  imagen: "img/mouse.svg",
};
export function sembrar(productos = [producto], lineas = []) {
  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("productosVersion", String(VERSION_CATALOGO));
  localStorage.setItem("carrito", JSON.stringify(lineas));
}

export let api;
export function Probe() {
  api = {
    cart: useCart(),
    productos: useProductos(),
    pedidos: usePedidos(),
    auth: useAuth(),
  };
  return <p data-testid="contador">{api.cart.cantidadTotal}</p>;
}
