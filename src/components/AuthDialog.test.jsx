import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderTienda } from "../test/render.jsx";
import AuthDialog from "./AuthDialog.jsx";

describe("AuthDialog", () => {
  it("CP05 abre el diálogo nativo y presenta el formulario", () => {
    renderTienda(<AuthDialog abierto cerrar={vi.fn()} />);
    expect(
      screen.getByRole("dialog", { name: "Iniciar sesión" }),
    ).toHaveAttribute("open");
    expect(screen.getByLabelText("Correo Electrónico")).toBeInTheDocument();
  });
  it("CP06 cerrar, cancelar nativo y fondo notifican sin cerrar por clic interno", () => {
    const cerrar = vi.fn();
    renderTienda(<AuthDialog abierto cerrar={cerrar} />);
    fireEvent.click(screen.getByLabelText("Correo Electrónico"));
    expect(cerrar).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: "Cerrar inicio de sesión" }),
    );
    const dialogo = screen.getByRole("dialog");
    fireEvent(dialogo, new Event("cancel", { bubbles: true }));
    fireEvent.click(dialogo);
    expect(cerrar).toHaveBeenCalledTimes(3);
  });
  it("CP07 cerrado no muestra un formulario interactivo", () => {
    const { container } = renderTienda(
      <AuthDialog abierto={false} cerrar={vi.fn()} />,
    );
    expect(container.querySelector("dialog")).not.toHaveAttribute("open");
    expect(
      screen.queryByLabelText("Correo Electrónico"),
    ).not.toBeInTheDocument();
  });
});
