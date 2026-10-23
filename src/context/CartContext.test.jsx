import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import {
  renderTienda,
  sembrar,
  producto,
  Probe,
  api,
} from "../test/render.jsx";

describe("CartContext", () => {
  beforeEach(() => sembrar());
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
});
