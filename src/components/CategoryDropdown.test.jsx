import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderTienda } from "../test/render.jsx";
import CategoryDropdown from "./CategoryDropdown.jsx";

describe("CategoryDropdown", () => {
  it("CP10 abre el portal y Escape lo cierra", () => {
    renderTienda(<CategoryDropdown />);
    const boton = screen.getByRole("button", { name: "Categoría" });
    expect(boton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(boton);
    expect(boton).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("complementary", { name: "Categorías" }),
    ).toBeInTheDocument();
    fireEvent.resize(window);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(boton).toHaveAttribute("aria-expanded", "false");
  });
  it("CP11 cierra al elegir categoría y al pulsar fuera", () => {
    renderTienda(<CategoryDropdown />);
    const boton = screen.getByRole("button", { name: "Categoría" });
    fireEvent.click(boton);
    fireEvent.click(screen.getByRole("link", { name: "Teclados y mouse" }));
    expect(boton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(boton);
    fireEvent.mouseDown(document.body);
    expect(boton).toHaveAttribute("aria-expanded", "false");
  });
});
