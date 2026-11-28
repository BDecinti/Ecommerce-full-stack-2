import { describe, it, expect } from "vitest";
import { rutaTrasLogin } from "./permisos.js";
describe("Destino después de iniciar sesión", () => {
  it("devuelve al cliente a la compra pendiente", () =>
    expect(rutaTrasLogin("/checkout", "cliente")).toBe("/checkout"));
  it("envía al vendedor a pedidos si la ruta anterior requiere administrador", () => {
    expect(rutaTrasLogin("/admin/users", "vendedor")).toBe("/admin/orders");
    expect(rutaTrasLogin("/admin/orders/new", "vendedor")).toBe(
      "/admin/orders",
    );
    expect(rutaTrasLogin("/admin/products/3", "vendedor")).toBe(
      "/admin/products/3",
    );
  });
  it("respeta la ruta del administrador y evita destinos externos", () => {
    expect(rutaTrasLogin("/admin/users", "admin")).toBe("/admin/users");
    expect(rutaTrasLogin("//ajeno.example", "cliente")).toBe("/");
    expect(rutaTrasLogin("https://ajeno.example", "admin")).toBe("/admin");
  });
});
