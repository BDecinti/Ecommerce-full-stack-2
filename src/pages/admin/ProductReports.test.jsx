import { describe, it, expect, beforeEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderTienda, sembrar, producto } from "../../test/render.jsx";
import ProductReports from "./ProductReports.jsx";

describe("ProductReports", () => {
  beforeEach(() => sembrar());
  it("UI13 inventario filtra stock crítico", () => {
    sembrar([{ ...producto, stock: 1 }]);
    renderTienda(<ProductReports />);
    fireEvent.click(screen.getByLabelText("Solo stock crítico o agotado"));
    expect(screen.getByRole("status").textContent).toContain("1");
    expect(screen.getByText("Crítico")).toBeTruthy();
  });
});
