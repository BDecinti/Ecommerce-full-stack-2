import { describe, it, expect } from "vitest";
import {
  filtrarProductos,
  filtrosIniciales,
  marcasDe,
  marcaDe,
} from "./filtrarProductos.js";

describe("filtrarProductos", () => {
  const productos = [
    {
      id: 1,
      nombre: "Teclado Mecánico",
      precio: 300,
      stock: 2,
      marca: "B",
      codigo: "TEC",
    },
    { id: 2, nombre: "Mouse", precio: 100, stock: 0, marca: "A" },
    { id: 3, nombre: "Control", precio: 200, stock: 1 },
  ];
  it("UT19 busca sin tildes y por código", () => {
    expect(
      filtrarProductos(productos, {
        ...filtrosIniciales,
        busqueda: " MECANICO ",
      }).map((p) => p.id),
    ).toEqual([1]);
    expect(
      filtrarProductos(productos, { ...filtrosIniciales, busqueda: "TEC" })
        .length,
    ).toBe(1);
  });
  it("UT20 combina marca precio y disponibilidad", () =>
    expect(
      filtrarProductos(productos, {
        ...filtrosIniciales,
        marcas: ["B"],
        precioMin: "250",
        precioMax: "350",
        soloDisponibles: true,
      }).map((p) => p.id),
    ).toEqual([1]));
  it("UT21 ordena sin mutar el catálogo", () => {
    expect(
      filtrarProductos(productos, {
        ...filtrosIniciales,
        orden: "precio-asc",
      }).map((p) => p.precio),
    ).toEqual([100, 200, 300]);
    expect(
      filtrarProductos(productos, {
        ...filtrosIniciales,
        orden: "precio-desc",
      }).map((p) => p.precio),
    ).toEqual([300, 200, 100]);
    expect(
      filtrarProductos(productos, { ...filtrosIniciales, orden: "nombre" })[0]
        .nombre,
    ).toBe("Control");
    expect(productos[0].id).toBe(1);
  });
  it("UT22 devuelve vacío para límites incompatibles", () =>
    expect(
      filtrarProductos(productos, {
        ...filtrosIniciales,
        precioMin: "400",
        precioMax: "50",
      }),
    ).toEqual([]));
  it("UT23 cuenta marcas y agrupa productos sin marca", () => {
    expect(marcaDe({})).toBe("Sin marca");
    expect(marcasDe(productos).length).toBe(3);
    expect(
      marcasDe([...productos, productos[0]]).find((m) => m.marca === "B")
        .cantidad,
    ).toBe(2);
  });
});
