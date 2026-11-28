import { server } from "../../test/server.js";

import { describe, it, expect, beforeEach } from "vitest";

import { fireEvent, screen } from "@testing-library/react";

import { renderTienda, sembrar } from "../../test/render.jsx";

import Contact from "./Contact.jsx";

describe("Contact", () => {
  beforeEach(() => sembrar());

  it("UI12 contacto guarda consulta mediante API y confirma recepción", async () => {
    await renderTienda(<Contact />);

    for (const [label, value] of [
      ["Nombre", "Demo"],

      ["Correo", "demo@example.com"],

      ["Mensaje", "Consulta sobre un mouse"],
    ])
      fireEvent.change(screen.getByLabelText(label), { target: { value } });

    fireEvent.click(screen.getByRole("button", { name: /Guardar consulta/ }));

    expect((await screen.findByRole("status")).textContent).toContain(
      "registrada",
    );

    expect(server().consultas.length).toBe(1);
  });
});
