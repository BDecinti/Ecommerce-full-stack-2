import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import {
  renderTienda,
  sembrar,
  producto,
  Probe,
  api,
} from "../test/render.jsx";

describe("ProductContext", () => {
  beforeEach(() => sembrar());
  it("UI14 CRUD de producto y stock actualiza catálogo", () => {
    renderTienda(<Probe />);
    act(() =>
      api.productos.crear({ ...producto, codigo: "NUEVO", nombre: "Nuevo" }),
    );
    const creado = api.productos.productos.find((p) => p.codigo === "NUEVO");
    expect(creado.id).toBe(91);
    act(() => api.productos.editar(91, { nombre: "Editado" }));
    expect(api.productos.obtener(91).nombre).toBe("Editado");
    act(() => api.productos.descontarStock([{ id: 91, cantidad: 2 }]));
    expect(api.productos.obtener(91).stock).toBe(1);
    act(() => api.productos.reponerStock([{ id: 91, cantidad: 2 }]));
    expect(api.productos.obtener(91).stock).toBe(3);
    act(() => api.productos.eliminar(91));
    expect(api.productos.obtener(91)).toBeUndefined();
  });
});
