import { describe, it, expect } from "vitest";
import { act } from "@testing-library/react";
import { renderTienda, sembrar, Probe, api } from "../test/render.jsx";
import { authenticateAs, server } from "../test/server.js";
describe("PedidoContext", () => {
  it("UI17 compra usa el identificador del servidor y cancelar repone stock una sola vez", async () => {
    sembrar();
    authenticateAs("admin@duoc.cl");
    await renderTienda(<Probe />);
    let pedido;
    const compra = {
      items: [{ id: 90, cantidad: 1 }],
      entrega: {
        nombre: "Cliente",
        email: "cliente@duoc.cl",
        telefono: "+56 9 1234 5678",
        tipoEntrega: "presencial",
      },
      tarjeta: {
        numero: "4242424242424242",
        titular: "CLIENTE",
        vencimiento: "12/30",
        cvv: "123",
      },
    };
    await act(async () => {
      pedido = await api.pedidos.comprar(compra, crypto.randomUUID());
    });
    expect(pedido.id).toBe(1);
    expect(api.productos.obtener(90).stock).toBe(2);
    await act(async () => {
      await api.pedidos.cambiarEstado(1, "cancelado");
    });
    expect(api.pedidos.obtener(1).estado).toBe("cancelado");
    expect(api.productos.obtener(90).stock).toBe(3);
    await act(async () => {
      await api.pedidos.cambiarEstado(1, "cancelado");
    });
    expect(server().productos[0].stock).toBe(3);
    expect(localStorage.getItem("pedidos")).toBeNull();
  });
});
