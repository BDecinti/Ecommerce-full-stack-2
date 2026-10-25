import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";
import App from "./App.jsx";
import { renderTienda, sembrar, producto } from "./test/render.jsx";
import { adminUsuariosPorDefecto } from "./data/adminPorDefecto.js";
describe("Rutas y administración", () => {
  beforeEach(() => {
    localStorage.clear();
    sembrar([producto], [{ id: 90, cantidad: 1 }]);
  });
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });
  const rutas = [
    ["UI18", "/about", "Tecnología con propósito"],
    ["UI19", "/blog", "Blogs"],
    ["UI20", "/blog/1", "Cómo elegir periféricos para tu forma de jugar"],
    ["UI21", "/categories/7", "Teclados y mouse"],
    ["UI22", "/products/90", "Mouse de prueba"],
    ["UI23", "/cart", "Carrito de compra"],
    ["UI24", "/ruta-no-existe", "Página no encontrada"],
    ["UI25", "/admin", "Iniciar Sesión"],
  ];
  for (const [id, ruta, titulo] of rutas)
    it(id + " muestra " + ruta, async () => {
      renderTienda(<App />, ruta);
      expect(
        await screen.findByRole("heading", { name: titulo, exact: true }),
      ).toBeTruthy();
    });
  const adminRutas = [
    ["UI26", "/admin", "Dashboard"],
    ["UI27", "/admin/products", "Productos"],
    ["UI28", "/admin/categories", "Categorías"],
    ["UI29", "/admin/users", "Usuarios"],
    ["UI30", "/admin/orders", "Pedidos"],
    ["UI31", "/admin/reports", "Reportes"],
    ["UI32", "/admin/profile", "Perfil"],
  ];
  for (const [id, ruta, titulo] of adminRutas)
    it(id + " renderiza " + ruta + " para administrador", async () => {
      localStorage.setItem(
        "usuarioLogueado",
        JSON.stringify(adminUsuariosPorDefecto[0]),
      );
      renderTienda(<App />, ruta);
      expect(
        await screen.findByRole("heading", { name: titulo, exact: true }),
      ).toBeTruthy();
    });
  it("UI33 cliente no accede al panel", async () => {
    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify(adminUsuariosPorDefecto[1]),
    );
    renderTienda(<App />, "/admin/products");
    expect(
      await screen.findByRole("heading", {
        name: "Iniciar Sesión",
        exact: true,
      }),
    ).toBeTruthy();
  });
  it("UI34 login emergente se abre desde la tienda", () => {
    renderTienda(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "Iniciar sesión", exact: true }),
    );
    expect(screen.getByRole("dialog").open).toBe(true);
    fireEvent.click(
      screen.getByRole("button", { name: "Cerrar inicio de sesión" }),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("UI35 categoría nueva se crea y navega al listado", async () => {
    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify(adminUsuariosPorDefecto[0]),
    );
    renderTienda(<App />, "/admin/categories/new");
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Categoría demo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));
    expect(await screen.findByText("Categoría demo")).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem("categorias")).some(
        (c) => c.nombre === "Categoría demo",
      ),
    ).toBe(true);
  });
  it("UI36 producto nuevo valida código duplicado", () => {
    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify(adminUsuariosPorDefecto[0]),
    );
    renderTienda(<App />, "/admin/products/new");
    fireEvent.change(screen.getByLabelText("Código producto"), {
      target: { value: "DEMO-90" },
    });
    fireEvent.change(screen.getByLabelText("Nombre", { exact: true }), {
      target: { value: "Nuevo mouse" },
    });
    fireEvent.change(screen.getByLabelText("Precio", { exact: true }), {
      target: { value: "10000" },
    });
    fireEvent.change(screen.getByLabelText("Stock", { exact: true }), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(
      screen.getByText("Revisa el nombre y usa un código único."),
    ).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("productos")).length).toBe(1);
  });
  it("UI37 cancelar pedido devuelve stock una sola vez", async () => {
    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify(adminUsuariosPorDefecto[0]),
    );
    localStorage.setItem(
      "pedidos",
      JSON.stringify([
        {
          id: 1,
          estado: "pendiente",
          fecha: new Date().toISOString(),
          usuario: "demo",
          items: [{ ...producto, cantidad: 1 }],
          total: 10000,
          tipoEntrega: "presencial",
          metodoPago: "tarjeta demo",
        },
      ]),
    );
    renderTienda(<App />, "/admin/orders/1");
    fireEvent.change(screen.getByLabelText("Cambiar estado"), {
      target: { value: "cancelado" },
    });
    expect(JSON.parse(localStorage.getItem("productos"))[0].stock).toBe(4);
    expect(screen.getByLabelText("Cambiar estado").disabled).toBe(true);
  });
});
