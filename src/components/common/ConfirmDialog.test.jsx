import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDialog from "./ConfirmDialog.jsx";

describe("ConfirmDialog", () => {
  const datos = {
    abierto: true,
    titulo: "¿Eliminar?",
    mensaje: "Esta categoría se eliminará.",
  };
  it("CP02 oculto no presenta acciones", () => {
    render(<ConfirmDialog {...datos} abierto={false} />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
  it("CP03 presenta las props, enfoca cancelar y confirma al pulsar", () => {
    const confirmar = vi.fn();
    render(
      <ConfirmDialog
        {...datos}
        textoConfirmar="Sí, eliminar"
        onConfirmar={confirmar}
        onCancelar={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("alertdialog", { name: "¿Eliminar?" }),
    ).toHaveTextContent(datos.mensaje);
    expect(screen.getByRole("button", { name: "Cancelar" })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Sí, eliminar" }));
    expect(confirmar).toHaveBeenCalledTimes(1);
  });
  it("CP04 cancelar, Escape y fondo cancelan; el contenido no cancela", () => {
    const cancelar = vi.fn();
    const { container, unmount } = render(
      <ConfirmDialog {...datos} onCancelar={cancelar} />,
    );
    fireEvent.click(screen.getByText(datos.mensaje));
    expect(cancelar).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(container.querySelector(".modal-overlay"));
    expect(cancelar).toHaveBeenCalledTimes(3);
    unmount();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(cancelar).toHaveBeenCalledTimes(3);
  });
});
