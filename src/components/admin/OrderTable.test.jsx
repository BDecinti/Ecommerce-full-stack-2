import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderTienda } from "../../test/render.jsx";
import OrderTable from "./OrderTable.jsx";

describe("OrderTable", () => {
  it("CP33 presenta pedido, entrega, estado y enlace al detalle", () => {
    renderTienda(
      <OrderTable
        pedidos={[
          {
            id: 12,
            fecha: "2026-10-23T12:00:00Z",
            usuario: "demo@example.com",
            tipoEntrega: "envio",
            estado: "cancelado",
            total: 14990,
          },
        ]}
      />,
    );
    expect(screen.getByRole("cell", { name: "#12" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Envío" })).toBeInTheDocument();
    expect(screen.getByText("Cancelado")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "$14.990" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver" })).toHaveAttribute(
      "href",
      "/admin/orders/12",
    );
  });
  it("CP34 lista vacía conserva los encabezados sin pedidos ficticios", () => {
    renderTienda(<OrderTable pedidos={[]} />);
    expect(screen.getAllByRole("row")).toHaveLength(1);
    expect(screen.queryByRole("link", { name: "Ver" })).not.toBeInTheDocument();
  });
});
