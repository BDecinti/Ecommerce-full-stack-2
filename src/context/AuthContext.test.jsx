import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { renderTienda, sembrar, Probe, api } from "../test/render.jsx";

describe("AuthContext", () => {
  beforeEach(() => sembrar());
  it("UI11 registrar normaliza correo y bloquea duplicados y rol admin", () => {
    renderTienda(<Probe />);
    let r;
    act(() => {
      r = api.auth.registrar({
        nombre: "  Demo  ",
        email: " NUEVO@EXAMPLE.COM ",
        password: "abcd",
        rol: "admin",
      });
    });
    expect(r.ok).toBe(true);
    const u = JSON.parse(localStorage.getItem("usuarios")).find(
      (u) => u.email === "nuevo@example.com",
    );
    expect(u.rol).toBe("cliente");
    expect(u.nombre).toBe("Demo");
    act(() => {
      r = api.auth.registrar({
        nombre: "Demo",
        email: "NUEVO@example.com",
        password: "abcd",
      });
    });
    expect(r.ok).toBe(false);
    act(() => {
      r = api.auth.registrar({ nombre: " ", email: "x", password: "a" });
    });
    expect(r.ok).toBe(false);
  });
});
