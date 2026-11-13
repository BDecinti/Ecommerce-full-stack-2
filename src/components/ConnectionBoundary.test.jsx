import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderTienda } from "../test/render.jsx";
import { server } from "../test/server.js";
describe("ConnectionBoundary", () => {
  it("ofrece reintento si el catálogo no responde y recupera la tienda", async () => {
    server().offline = true;
    await renderTienda(<h1>Catálogo disponible</h1>);
    expect(
      screen.getByRole("heading", { name: "No pudimos cargar la tienda" }),
    ).toBeInTheDocument();
    server().offline = false;
    fireEvent.click(screen.getByRole("button", { name: "Volver a intentar" }));
    expect(
      await screen.findByRole("heading", { name: "Catálogo disponible" }),
    ).toBeInTheDocument();
  });
});
