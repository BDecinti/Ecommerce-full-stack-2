import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderTienda, sembrar, producto } from "../test/render.jsx";
import Home from "./Home.jsx";

describe("Home", () => {
  beforeEach(() => sembrar());
  it("UI06 inicio limita las selecciones a ocho productos", () => {
    sembrar(
      Array.from({ length: 20 }, (_, i) => ({
        ...producto,
        id: i + 1,
        destacado: i < 10,
      })),
    );
    const { container } = renderTienda(<Home />);
    expect(container.querySelectorAll(".card-producto").length).toBe(8);
    expect(screen.getByRole("heading", { name: /Tu setup/ })).toBeTruthy();
  });
});
