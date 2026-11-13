import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import MyOrders from "./MyOrders.jsx";
import { renderTienda, producto } from "../../test/render.jsx";
import { authenticateAs, server } from "../../test/server.js";
describe("MyOrders", () => {
  it("muestra solamente las compras devueltas para el cliente", async () => {
    authenticateAs("cliente@duoc.cl");
    server().pedidos = [
      {
        id: 10,
        usuario: "cliente@duoc.cl",
        fecha: new Date().toISOString(),
        estado: "pagado",
        items: [{ ...producto, cantidad: 1 }],
        total: 10000,
        tipoEntrega: "presencial",
      },
      { id: 20, usuario: "otro@example.com", items: [], total: 1 },
    ];
    await renderTienda(<MyOrders />);
    expect(await screen.findByText(/Pedido #10/)).toBeInTheDocument();
    expect(screen.queryByText(/Pedido #20/)).toBeNull();
    expect(screen.queryByLabelText("Cambiar estado")).toBeNull();
  });
});
