import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderTienda, sembrar, Probe, api } from "../../test/render.jsx";
import Login from "./Login.jsx";

describe("Login", () => {
  beforeEach(() => sembrar());
  it("UI08 login informa credenciales inválidas", () => {
    renderTienda(<Login />);
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), {
      target: { value: "no@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "mala" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(screen.getByRole("status").textContent).toContain("incorrectos");
  });
  it("UI09 cliente demo puede iniciar sesión y cierra el modal", () => {
    const cerrar = vi.fn();
    renderTienda(
      <>
        <Login modal onSuccess={cerrar} />
        <Probe />
      </>,
    );
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), {
      target: { value: "cliente@duoc.cl" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(cerrar).toHaveBeenCalled();
    expect(api.auth.usuario.rol).toBe("cliente");
  });
});
