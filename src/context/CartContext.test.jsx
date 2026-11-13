import { authenticateAs } from "../test/server.js";
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
  it("descarta un carrito guardado con estructura inválida sin bloquear la tienda", async () => {
    localStorage.setItem("carrito", JSON.stringify({ rol: "admin" }));
    await renderTienda(<Probe />);
    expect(api.cart.carrito).toEqual([]);
  });
  beforeEach(() => sembrar());
  it("UI15 carrito reduce elimina y vacía sin superar stock", async () => {
    sembrar([producto], [{ id: 90, cantidad: 2 }]);
    await renderTienda(<Probe />);
    act(() => api.cart.cambiarCantidad(90, -1));
    expect(api.cart.total).toBe(10000);
    act(() => api.cart.eliminar(90));
    expect(api.cart.cantidadTotal).toBe(0);
    act(() => api.cart.agregar(producto));
    act(() => api.cart.vaciar());
    expect(api.cart.carrito).toEqual([]);
  });
  it("UI16 catálogo eliminado retira el producto del carrito", async () => {
    sembrar([producto], [{ id: 90, cantidad: 1 }]);
    authenticateAs("admin@duoc.cl");
    await renderTienda(<Probe />);
    await act(async () => {
      await api.productos.eliminar(90);
    });
    expect(api.cart.carrito).toEqual([]);
  });
});
