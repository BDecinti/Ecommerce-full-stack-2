import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OrderProductPicker from "./OrderProductPicker.jsx";

describe("OrderProductPicker", () => {
  const productos = [
    { id: 1, nombre: "Mouse", precio: 10000, stock: 3 },
    { id: 2, nombre: "Teclado", precio: 20000, stock: 0 },
  ];
  it("CP31 muestra cantidades y deshabilita agotados", () => {
    render(
      <OrderProductPicker
        productos={productos}
        cantidades={{ 1: 2 }}
        onChange={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("spinbutton", { name: "Cantidad de Mouse" }),
    ).toHaveValue(2);
    expect(
      screen.getByRole("spinbutton", { name: "Cantidad de Teclado" }),
    ).toBeDisabled();
  });
  it("CP32 limita al stock, elimina negativos y redondea las fracciones", () => {
    const cambiar = vi.fn();
    render(
      <OrderProductPicker
        productos={productos}
        cantidades={{}}
        onChange={cambiar}
      />,
    );
    const cantidad = screen.getByRole("spinbutton", {
      name: "Cantidad de Mouse",
    });
    for (const [valor, esperado] of [
      ["99", 3],
      ["-1", 0],
      ["1.9", 1],
      ["", 0],
    ]) {
      fireEvent.change(cantidad, { target: { value: valor } });
      expect(cambiar).toHaveBeenLastCalledWith(1, esperado);
    }
  });
});
