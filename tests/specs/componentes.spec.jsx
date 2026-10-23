import React from "react";
import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { renderTienda, sembrar, producto } from "../helpers/render.jsx";
import ProductCard from "../../src/components/ProductCard.jsx";
import ProductFilters from "../../src/components/ProductFilters.jsx";
import Home from "../../src/pages/Home.jsx";
import Products from "../../src/pages/products/Products.jsx";
import Login from "../../src/pages/auth/Login.jsx";
import Signup from "../../src/pages/auth/Signup.jsx";
import Contact from "../../src/pages/company/Contact.jsx";
import ProductReports from "../../src/pages/admin/ProductReports.jsx";
import { useCart } from "../../src/context/CartContext.jsx";
import { useProductos } from "../../src/context/ProductContext.jsx";
import { usePedidos } from "../../src/context/PedidoContext.jsx";
import { useAuth } from "../../src/context/AuthContext.jsx";
import { filtrosIniciales } from "../../src/utils/filtrarProductos.js";
let api;
function Probe() {
  api = {
    cart: useCart(),
    productos: useProductos(),
    pedidos: usePedidos(),
    auth: useAuth(),
  };
  return <p data-testid="contador">{api.cart.cantidadTotal}</p>;
}
describe("Componentes React", () => {
  beforeEach(() => {
    localStorage.clear();
    sembrar();
  });
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });
  it("UI01 renderiza las props y la insignia de producto", () => {
    renderTienda(<ProductCard producto={producto} promo />);
    expect(screen.getByRole("heading", { name: producto.nombre })).toBeTruthy();
    expect(screen.getByText("$10.000")).toBeTruthy();
    expect(screen.getByText("Oferta")).toBeTruthy();
  });
  it("UI02 clic añade al carrito y actualiza estado", () => {
    renderTienda(
      <>
        <ProductCard producto={producto} />
        <Probe />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Añadir al carrito/ }));
    expect(screen.getByTestId("contador").textContent).toBe("1");
    expect(JSON.parse(localStorage.getItem("carrito"))).toEqual([
      { id: 90, cantidad: 1 },
    ]);
  });
  it("UI03 no permite agregar más unidades que el stock", () => {
    renderTienda(
      <>
        <ProductCard producto={producto} />
        <Probe />
      </>,
    );
    const b = screen.getByRole("button", { name: /Añadir al carrito/ });
    for (let i = 0; i < 5; i++) fireEvent.click(b);
    expect(api.cart.cantidadTotal).toBe(3);
    expect(b.disabled).toBeTrue();
  });
  it("UI04 producto agotado deshabilita compra", () => {
    renderTienda(<ProductCard producto={{ ...producto, stock: 0 }} />);
    expect(
      screen.getByRole("button", { name: "Sin stock" }).disabled,
    ).toBeTrue();
  });
  it("UI05 filtros notifican eventos y props", () => {
    const cambio = jasmine.createSpy("cambio");
    renderTienda(
      <ProductFilters
        filtros={filtrosIniciales}
        marcas={[{ marca: "Demo", cantidad: 1 }]}
        onChange={cambio}
      />,
    );
    fireEvent.click(screen.getByLabelText("Solo con stock"));
    expect(cambio).toHaveBeenCalledWith({
      ...filtrosIniciales,
      soloDisponibles: true,
    });
    fireEvent.change(screen.getByLabelText("Buscar en esta selección"), {
      target: { value: "mouse" },
    });
    expect(cambio).toHaveBeenCalledWith({
      ...filtrosIniciales,
      busqueda: "mouse",
    });
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    expect(cambio).toHaveBeenCalledWith(filtrosIniciales);
  });
  it("UI06 inicio limita las selecciones a ocho productos", () => {
    sembrar(
      Array.from({ length: 20 }, (_, i) => ({
        ...producto,
        id: i + 1,
        destacado: i < 10,
      })),
    );
    const { container } = renderTienda(<Home />);
    expect(container.querySelectorAll(".card-producto").length).toBe(8);
    expect(screen.getByRole("heading", { name: /Tu setup/ })).toBeTruthy();
  });
  it("UI07 búsqueda del catálogo muestra estado vacío", () => {
    renderTienda(<Products />, "/products?q=inexistente");
    expect(screen.getByText("Sin coincidencias")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("0");
  });
  it("UI08 login informa credenciales inválidas", () => {
    renderTienda(<Login />);
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), {
      target: { value: "no@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "mala" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(screen.getByRole("status").textContent).toContain("incorrectos");
  });
  it("UI09 cliente demo puede iniciar sesión y cierra el modal", () => {
    const cerrar = jasmine.createSpy("cerrar");
    renderTienda(
      <>
        <Login modal onSuccess={cerrar} />
        <Probe />
      </>,
    );
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), {
      target: { value: "cliente@duoc.cl" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(cerrar).toHaveBeenCalled();
    expect(api.auth.usuario.rol).toBe("cliente");
  });
  it("UI10 registro público no ofrece rol administrador", () => {
    renderTienda(<Signup />);
    expect(screen.queryByLabelText("Tipo de Usuario")).toBeNull();
  });
  it("UI11 registrar normaliza correo y bloquea duplicados y rol admin", () => {
    renderTienda(<Probe />);
    let r;
    act(() => {
      r = api.auth.registrar({
        nombre: "  Demo  ",
        email: " NUEVO@EXAMPLE.COM ",
        password: "abcd",
        rol: "admin",
      });
    });
    expect(r.ok).toBeTrue();
    const u = JSON.parse(localStorage.getItem("usuarios")).find(
      (u) => u.email === "nuevo@example.com",
    );
    expect(u.rol).toBe("cliente");
    expect(u.nombre).toBe("Demo");
    act(() => {
      r = api.auth.registrar({
        nombre: "Demo",
        email: "NUEVO@example.com",
        password: "abcd",
      });
    });
    expect(r.ok).toBeFalse();
    act(() => {
      r = api.auth.registrar({ nombre: " ", email: "x", password: "a" });
    });
    expect(r.ok).toBeFalse();
  });
  it("UI12 contacto guarda consulta local y confirma sin enviar correo", () => {
    renderTienda(<Contact />);
    for (const [label, value] of [
      ["Nombre", "Demo"],
      ["Correo", "demo@example.com"],
      ["Mensaje", "Consulta sobre un mouse"],
    ])
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fireEvent.click(screen.getByRole("button", { name: /Guardar consulta/ }));
    expect(screen.getByRole("status").textContent).toContain("No se envió");
    expect(JSON.parse(localStorage.getItem("consultas")).length).toBe(1);
  });
  it("UI13 inventario filtra stock crítico", () => {
    sembrar([{ ...producto, stock: 1 }]);
    renderTienda(<ProductReports />);
    fireEvent.click(screen.getByLabelText("Solo stock crítico o agotado"));
    expect(screen.getByRole("status").textContent).toContain("1");
    expect(screen.getByText("Crítico")).toBeTruthy();
  });
  it("UI14 CRUD de producto y stock actualiza catálogo", () => {
    renderTienda(<Probe />);
    act(() =>
      api.productos.crear({ ...producto, codigo: "NUEVO", nombre: "Nuevo" }),
    );
    const creado = api.productos.productos.find((p) => p.codigo === "NUEVO");
    expect(creado.id).toBe(91);
    act(() => api.productos.editar(91, { nombre: "Editado" }));
    expect(api.productos.obtener(91).nombre).toBe("Editado");
    act(() => api.productos.descontarStock([{ id: 91, cantidad: 2 }]));
    expect(api.productos.obtener(91).stock).toBe(1);
    act(() => api.productos.reponerStock([{ id: 91, cantidad: 2 }]));
    expect(api.productos.obtener(91).stock).toBe(3);
    act(() => api.productos.eliminar(91));
    expect(api.productos.obtener(91)).toBeUndefined();
  });
  it("UI15 carrito reduce elimina y vacía sin superar stock", () => {
    sembrar([producto], [{ id: 90, cantidad: 2 }]);
    renderTienda(<Probe />);
    act(() => api.cart.cambiarCantidad(90, -1));
    expect(api.cart.total).toBe(10000);
    act(() => api.cart.eliminar(90));
    expect(api.cart.cantidadTotal).toBe(0);
    act(() => api.cart.agregar(producto));
    act(() => api.cart.vaciar());
    expect(api.cart.carrito).toEqual([]);
  });
  it("UI16 catálogo eliminado retira el producto del carrito", () => {
    sembrar([producto], [{ id: 90, cantidad: 1 }]);
    renderTienda(<Probe />);
    act(() => api.productos.eliminar(90));
    expect(api.cart.carrito).toEqual([]);
  });
  it("UI17 pedidos conservan identificador y cambios de estado", () => {
    renderTienda(<Probe />);
    let p;
    act(() => {
      p = api.pedidos.crear({ total: 100, items: [], usuario: "demo" });
    });
    expect(p.id).toBe(1);
    act(() => api.pedidos.cambiarEstado(1, "cancelado"));
    expect(api.pedidos.obtener(1).estado).toBe("cancelado");
  });
});
