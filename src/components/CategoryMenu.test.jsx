import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderTienda } from "../test/render.jsx";
import CategoryMenu from "./CategoryMenu.jsx";

describe("CategoryMenu", () => {
  it("CP12 muestra enlaces de categorías y resalta la categoría activa", () => {
    renderTienda(<CategoryMenu activaId={7} />);
    const enlace = screen.getByRole("link", { name: "Teclados y mouse" });
    expect(enlace).toHaveAttribute("href", "/categories/7");
    expect(enlace.closest("li")).toHaveClass("en-ruta");
    expect(
      screen.getByRole("complementary", { name: "Categorías" }),
    ).toBeInTheDocument();
  });
});
