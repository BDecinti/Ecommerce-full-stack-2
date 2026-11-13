import { useCart } from "../context/CartContext.jsx";
import { useProductos } from "../context/ProductContext.jsx";
import { usePedidos } from "../context/PedidoContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { MemoryRouter } from "react-router-dom";
import { render, act } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext.jsx";
import { CategoryProvider } from "../context/CategoryContext.jsx";
import { ProductProvider } from "../context/ProductContext.jsx";
import { PedidoProvider } from "../context/PedidoContext.jsx";
import { CartProvider } from "../context/CartContext.jsx";
import { VERSION_CATALOGO } from "../data/productos.js";
import { UsuariosProvider } from "../context/UsuariosContext.jsx";
import ConnectionBoundary from "../components/ConnectionBoundary.jsx";
import { server, seedServer, authenticateAs } from "./server.js";
export async function renderTienda(ui, ruta = "/") {
  const saved = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
  if (saved) authenticateAs(saved.email);
  const savedOrders = JSON.parse(localStorage.getItem("pedidos") || "null");
  if (savedOrders) server().pedidos = savedOrders;
  let rendered;
  await act(async () => {
    rendered = render(
      <MemoryRouter initialEntries={[ruta]}>
        <AuthProvider>
          <CategoryProvider>
            <ProductProvider>
              <PedidoProvider>
                <UsuariosProvider>
                  <CartProvider>
                    <ConnectionBoundary>{ui}</ConnectionBoundary>
                  </CartProvider>
                </UsuariosProvider>
              </PedidoProvider>
            </ProductProvider>
          </CategoryProvider>
        </AuthProvider>
      </MemoryRouter>,
    );
  });
  return rendered;
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
  seedServer(productos, lineas);
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
