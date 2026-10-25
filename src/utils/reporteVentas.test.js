import { describe, it, expect } from "vitest";
import {
  inicioPeriodo,
  desplazar,
  haceUnAnio,
  ventasValidas,
  enRango,
  resumen,
  variacion,
  serieVentas,
  desgloseVentas,
  rankingProductos,
} from "./reporteVentas.js";

describe("reporteVentas", () => {
  it("UT28 calcula inicios de día semana y mes", () => {
    const f = new Date(2026, 9, 21, 14);
    expect(inicioPeriodo(f, "dia").getHours()).toBe(0);
    expect(inicioPeriodo(f, "semana").getDay()).toBe(1);
    expect(inicioPeriodo(f, "mes").getDate()).toBe(1);
  });
  it("UT29 desplaza fechas y compara año anterior", () => {
    const f = new Date(2026, 9, 1);
    expect(desplazar(f, "dia", 1).getDate()).toBe(2);
    expect(desplazar(f, "semana", 1).getDate()).toBe(8);
    expect(desplazar(f, "mes", 1).getMonth()).toBe(10);
    expect(haceUnAnio(f).getFullYear()).toBe(2025);
  });
  it("UT30 excluye cancelados y respeta rango final abierto", () => {
    const p = [
      { fecha: "2026-10-01", total: 100, estado: "pendiente" },
      { fecha: "2026-10-02", total: 200, estado: "cancelado" },
    ];
    expect(ventasValidas(p).length).toBe(1);
    expect(
      enRango(p, new Date("2026-10-01"), new Date("2026-10-02")).length,
    ).toBe(1);
    expect(resumen(p).ticket).toBe(150);
    expect(resumen([]).ticket).toBe(0);
    expect(variacion(2, 1)).toBe(100);
    expect(variacion(2, 0)).toBeNull();
  });
  it("UT31 produce serie y desglose de ventas incluso productos eliminados", () => {
    const p = [
      {
        fecha: new Date(2026, 9, 21).toISOString(),
        total: 20,
        items: [
          { id: 1, nombre: "A", cantidad: 2, precio: 10 },
          { id: 99, nombre: "Eliminado", cantidad: 1, precio: 5 },
        ],
      },
    ];
    expect(serieVentas(p, "dia", new Date(2026, 9, 21), 2).length).toBe(2);
    const d = desgloseVentas(
      p,
      [{ id: 1, categoriaId: 1, marca: "M" }],
      (id) => (id ? "Periféricos" : "Sin categoría"),
    );
    expect(d.categorias.length).toBe(2);
    expect(d.marcas.length).toBe(2);
    const r = rankingProductos(d.vendidos, [
      { id: 1, nombre: "A" },
      { id: 2, nombre: "B" },
    ]);
    expect(r.mas[0].unidades).toBe(2);
    expect(r.menos[0].unidades).toBe(0);
  });
});
