import { describe, it, expect } from "vitest";
import { resumenInventario, csvInventario } from "./inventario.js";

describe("inventario", () => {
  it("UT24 calcula valor unidades y productos críticos", () =>
    expect(
      resumenInventario([
        { precio: 10, stock: 2, stockCritico: 2 },
        { precio: 20, stock: 0 },
      ]),
    ).toEqual({ productos: 2, unidades: 2, valor: 20, criticos: 2 }));
  it("UT25 CSV escapa comillas separadores y fórmulas", () => {
    const csv = csvInventario([
      { codigo: "=SUM(1)", nombre: 'Mouse; "Pro"', stock: 1, precio: 10 },
    ]);
    expect(csv).toContain('"\'=SUM(1)"');
    expect(csv).toContain('"Mouse; ""Pro"""');
    expect(csv.charCodeAt(0)).toBe(65279);
  });
});
