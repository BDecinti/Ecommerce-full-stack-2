import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderTienda } from "../test/render.jsx";
import Footer from "./Footer.jsx";

describe("Footer", () => {
  it("CP13 ofrece catálogo, información de la empresa y registro", () => {
    renderTienda(<Footer />);
    const tienda = within(screen.getByRole("navigation", { name: "Tienda" }));
    expect(tienda.getByRole("link", { name: "Productos" })).toHaveAttribute(
      "href",
      "/products",
    );
    expect(tienda.getByRole("link", { name: "Ofertas" })).toHaveAttribute(
      "href",
      "/categories/14",
    );
    const empresa = within(screen.getByRole("navigation", { name: "Empresa" }));
    expect(empresa.getByRole("link", { name: "Contacto" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: "Crear cuenta" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "Pagos y envíos simulados",
    );
  });
});
