import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import OrderItemsTable from "./OrderItemsTable.jsx";

describe("OrderItemsTable", () => {
  it("CP30 presenta cantidad, subtotal y total de los items recibidos", () => {
    render(
      <OrderItemsTable
        items={[
          {
            id: 1,
            nombre: "Mouse",
            imagen: "img/mouse.svg",
            precio: 10000,
            cantidad: 2,
          },
        ]}
        total={24990}
      />,
    );
    const fila = within(
      screen.getByRole("cell", { name: "Mouse" }).closest("tr"),
    );
    expect(fila.getByRole("cell", { name: "2" })).toBeInTheDocument();
    expect(fila.getByRole("cell", { name: "$20.000" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "$24.990" })).toBeInTheDocument();
  });
});
