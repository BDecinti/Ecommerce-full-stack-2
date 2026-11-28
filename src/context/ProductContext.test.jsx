import { describe, it, expect } from "vitest";
import { act } from "@testing-library/react";
import {
  renderTienda,
  sembrar,
  producto,
  Probe,
  api,
} from "../test/render.jsx";
import { authenticateAs, server } from "../test/server.js";
describe("ProductContext", () => {
  it("UI14 CRUD espera al servidor y actualiza el catálogo compartido", async () => {
    sembrar();
    authenticateAs("admin@duoc.cl");
    await renderTienda(<Probe />);
    let created;
    await act(async () => {
      created = await api.productos.crear({
        ...producto,
        codigo: "NUEVO",
        nombre: "Nuevo",
      });
    });
    expect(api.productos.obtener(created.id).nombre).toBe("Nuevo");
    await act(async () => {
      await api.productos.editar(created.id, {
        ...created,
        nombre: "Editado",
        stock: 2,
      });
    });
    expect(api.productos.obtener(created.id)).toMatchObject({
      nombre: "Editado",
      stock: 2,
    });
    await act(async () => {
      await api.productos.eliminar(created.id);
    });
    expect(api.productos.obtener(created.id)).toBeUndefined();
    expect(localStorage.getItem("productos")).toBeNull();
  });
  it("conserva el catálogo si la API rechaza una modificación", async () => {
    sembrar();
    await renderTienda(<Probe />);
    await act(async () => {
      await expect(api.productos.eliminar(90)).rejects.toMatchObject({
        status: 401,
      });
    });
    expect(server().productos).toHaveLength(1);
    expect(api.productos.obtener(90)).toBeDefined();
  });
});
