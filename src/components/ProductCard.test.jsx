import { describe, it, expect, beforeEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import {
  renderTienda,
  sembrar,
  producto,
  Probe,
  api,
} from "../test/render.jsx";
import ProductCard from "./ProductCard.jsx";

describe("ProductCard", () => {
  beforeEach(() => sembrar());
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
    expect(b.disabled).toBe(true);
  });
  it("UI04 producto agotado deshabilita compra", () => {
    renderTienda(<ProductCard producto={{ ...producto, stock: 0 }} />);
    expect(screen.getByRole("button", { name: "Sin stock" }).disabled).toBe(
      true,
    );
  });
});
