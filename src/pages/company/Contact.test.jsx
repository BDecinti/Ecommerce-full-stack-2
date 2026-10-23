import { describe, it, expect, beforeEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderTienda, sembrar } from "../../test/render.jsx";
import Contact from "./Contact.jsx";

describe("Contact", () => {
  beforeEach(() => sembrar());
  it("UI12 contacto guarda consulta local y confirma sin enviar correo", () => {
    renderTienda(<Contact />);
    for (const [label, value] of [
      ["Nombre", "Demo"],
      ["Correo", "demo@example.com"],
      ["Mensaje", "Consulta sobre un mouse"],
    ])
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fireEvent.click(screen.getByRole("button", { name: /Guardar consulta/ }));
    expect(screen.getByRole("status").textContent).toContain("No se envió");
    expect(JSON.parse(localStorage.getItem("consultas")).length).toBe(1);
  });
});
