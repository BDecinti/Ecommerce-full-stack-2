import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderTienda, sembrar } from "../../test/render.jsx";
import Products from "./Products.jsx";

describe("Products", () => {
  beforeEach(() => sembrar());
  it("UI07 búsqueda del catálogo muestra estado vacío", async () => {
    await renderTienda(<Products />, "/products?q=inexistente");
    expect(screen.getByText("Sin coincidencias")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("0");
  });
});
