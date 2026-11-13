import { describe, it, expect } from "vitest";
import { act } from "@testing-library/react";
import { renderTienda, Probe, api } from "../test/render.jsx";
import { server, authenticateAs } from "../test/server.js";

describe("AuthContext", () => {
  it("UI11 registro normaliza correo, omite roles y muestra errores del servidor", async () => {
    await renderTienda(<Probe />);
    let result;
    await act(async () => {
      result = await api.auth.registrar({
        nombre: "  Demo  ",
        email: " NUEVO@EXAMPLE.COM ",
        password: "Prueba123!",
        rol: "admin",
      });
    });
    expect(result.ok).toBe(true);
    expect(
      server().usuarios.find((u) => u.email === "nuevo@example.com"),
    ).toMatchObject({ nombre: "Demo", rol: "cliente" });
    expect(
      server().calls.find((c) => c.path === "/auth/registro").body,
    ).not.toHaveProperty("rol");
    await act(async () => {
      result = await api.auth.registrar({
        nombre: "Demo",
        email: "NUEVO@example.com",
        password: "Prueba123!",
      });
    });
    expect(result.ok).toBe(false);
    await act(async () => {
      result = await api.auth.registrar({
        nombre: " ",
        email: "x",
        password: "a",
      });
    });
    expect(result.ok).toBe(false);
    expect(localStorage.getItem("usuarios")).toBeNull();
  });
  it("restaura la sesión del servidor y descarta el rol guardado en el navegador", async () => {
    authenticateAs("cliente@duoc.cl");
    await renderTienda(<Probe />);
    expect(api.auth.usuario.rol).toBe("cliente");
    expect(localStorage.getItem("usuarioLogueado")).toBeNull();
  });
  it("no cierra la sesión visualmente si el servidor no puede revocarla", async () => {
    authenticateAs("cliente@duoc.cl");
    await renderTienda(<Probe />);
    server().offline = true;
    let result;
    await act(async () => {
      result = await api.auth.cerrarSesion();
    });
    expect(result).toBe(false);
    expect(api.auth.usuario).not.toBeNull();
    expect(api.auth.error).toContain("No se pudo cerrar");
  });
});
