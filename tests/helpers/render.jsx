import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CategoryProvider } from "../../src/context/CategoryContext.jsx";
import { ProductProvider } from "../../src/context/ProductContext.jsx";
import { PedidoProvider } from "../../src/context/PedidoContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
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
  localStorage.setItem("productosVersion", "3");
  localStorage.setItem("carrito", JSON.stringify(lineas));
}
