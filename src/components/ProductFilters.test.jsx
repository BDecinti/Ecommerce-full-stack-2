import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderTienda, sembrar } from "../test/render.jsx";
import ProductFilters from "./ProductFilters.jsx";
import { filtrosIniciales } from "../utils/filtrarProductos.js";

describe("ProductFilters", () => {
  beforeEach(() => sembrar());
  it("UI05 filtros notifican eventos y props", () => {
    const cambio = vi.fn();
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
  it("CP35 combina marca, orden y límites de precio mediante sus eventos", () => {
    const cambiar = vi.fn();
    renderTienda(
      <ProductFilters
        filtros={filtrosIniciales}
        marcas={[{ marca: "Demo", cantidad: 1 }]}
        onChange={cambiar}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: /Demo/ }));
    expect(cambiar).toHaveBeenLastCalledWith({
      ...filtrosIniciales,
      marcas: ["Demo"],
    });
    for (const [label, valor, campo] of [
      ["Ordenar por", "precio-asc", "orden"],
      ["Precio mínimo", "100", "precioMin"],
      ["Precio máximo", "200", "precioMax"],
    ]) {
      fireEvent.change(screen.getByLabelText(label), {
        target: { value: valor },
      });
      expect(cambiar).toHaveBeenLastCalledWith({
        ...filtrosIniciales,
        [campo]: valor,
      });
    }
  });
  it("CP36 muestra límites incompatibles y permite quitar una marca seleccionada", () => {
    const cambiar = vi.fn();
    const filtros = {
      ...filtrosIniciales,
      marcas: ["Demo"],
      precioMin: "200",
      precioMax: "100",
    };
    renderTienda(
      <ProductFilters
        filtros={filtros}
        marcas={[{ marca: "Demo", cantidad: 1 }]}
        onChange={cambiar}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "mínimo supera al máximo",
    );
    fireEvent.click(screen.getByRole("checkbox", { name: /Demo/ }));
    expect(cambiar).toHaveBeenLastCalledWith({ ...filtros, marcas: [] });
  });
});
