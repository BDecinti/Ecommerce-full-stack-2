import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { renderTienda, sembrar, Probe, api } from "../test/render.jsx";

describe("PedidoContext", () => {
  beforeEach(() => sembrar());
  it("UI17 pedidos conservan identificador y cambios de estado", () => {
    renderTienda(<Probe />);
    let p;
    act(() => {
      p = api.pedidos.crear({ total: 100, items: [], usuario: "demo" });
    });
    expect(p.id).toBe(1);
    act(() => api.pedidos.cambiarEstado(1, "cancelado"));
    expect(api.pedidos.obtener(1).estado).toBe("cancelado");
  });
});
