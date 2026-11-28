import { describe, it, expect, vi } from "vitest";
import {
  api,
  login,
  logout,
  refreshSession,
  observeSession,
  clearSession,
} from "./api.js";
import { server, authenticateAs } from "../test/server.js";
describe("Cliente REST y sesiones", () => {
  it("obtiene un CSRF vigente antes de cada formulario después de cambiar la sesión", async () => {
    await login("admin@duoc.cl", "Admin123!");
    server().csrf = "csrf-renovado";
    await logout();
    expect(server().sesion).toBeNull();
    expect(
      server()
        .calls.find((c) => c.path === "/auth/logout")
        .headers.get("X-XSRF-TOKEN"),
    ).toBe("csrf-renovado");
  });
  it("envía CSRF y cookies, conserva el JWT únicamente en memoria", async () => {
    const session = await login("admin@duoc.cl", "Admin123!");
    await api("/usuarios");
    const request = server().calls.find((c) => c.path === "/usuarios");
    expect(request.headers.get("Authorization")).toBe(
      `Bearer ${session.accessToken}`,
    );
    expect(
      server()
        .calls.find((c) => c.path === "/auth/login")
        .headers.get("X-XSRF-TOKEN"),
    ).toBe("csrf-prueba");
    expect(
      fetch.mock.calls.every(([, opts]) => opts.credentials === "include"),
    ).toBe(true);
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
  it("agrupa renovaciones simultáneas y reintenta peticiones con el nuevo JWT", async () => {
    authenticateAs("admin@duoc.cl");
    await Promise.all([api("/usuarios"), api("/pedidos")]);
    expect(
      server().calls.filter((c) => c.path === "/auth/refresh"),
    ).toHaveLength(1);
    expect(server().calls.filter((c) => c.path === "/usuarios")).toHaveLength(
      2,
    );
  });
  it("un 403 no renueva la sesión ni eleva permisos", async () => {
    await login("cliente@duoc.cl", "Cliente123!");
    await expect(api("/usuarios")).rejects.toMatchObject({ status: 403 });
    expect(server().calls.some((c) => c.path === "/auth/refresh")).toBe(false);
  });
  it("una sesión vencida avisa a los proveedores y devuelve un error comprensible", async () => {
    const listener = vi.fn();
    observeSession(listener);
    await expect(api("/pedidos")).rejects.toMatchObject({
      status: 401,
      code: "SESION_REQUERIDA",
    });
    expect(listener).toHaveBeenCalledWith(null);
  });
  it("logout revoca la sesión antes de quitar el usuario del frontend", async () => {
    await login("admin@duoc.cl", "Admin123!");
    const listener = vi.fn();
    observeSession(listener);
    await logout();
    expect(server().sesion).toBeNull();
    expect(listener).toHaveBeenLastCalledWith(null);
    await expect(api("/usuarios")).rejects.toMatchObject({ status: 401 });
  });
  it("no pierde errores de validación y permite recuperar una caída de red", async () => {
    await expect(
      login("nadie@example.com", "incorrecta"),
    ).rejects.toMatchObject({ code: "CREDENCIALES_INVALIDAS", status: 401 });
    server().offline = true;
    await expect(api("/productos", { anonymous: true })).rejects.toMatchObject({
      status: 0,
    });
    server().offline = false;
    expect(await api("/productos", { anonymous: true })).toHaveLength(32);
  });
  it("restaura con la cookie y borrar la memoria no guarda credenciales", async () => {
    authenticateAs("cliente@duoc.cl");
    expect((await refreshSession()).usuario.rol).toBe("cliente");
    clearSession();
    expect(localStorage.length).toBe(0);
  });
});
