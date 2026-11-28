import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EstadoSelect from "./EstadoSelect.jsx";

describe("EstadoSelect", () => {
  it("CP27 acepta props, todos y comunica el valor seleccionado", () => {
    const cambiar = vi.fn();
    const { rerender } = render(
      <EstadoSelect id="estado" value="" todos onChange={cambiar} />,
    );
    expect(
      screen.getByRole("option", { name: "Todos los estados" }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "cancelado" },
    });
    expect(cambiar).toHaveBeenCalledExactlyOnceWith("cancelado");
    rerender(<EstadoSelect value="cancelado" disabled onChange={cambiar} />);
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByRole("combobox")).toHaveValue("cancelado");
  });
});
