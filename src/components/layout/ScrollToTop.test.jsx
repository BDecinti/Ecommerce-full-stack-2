import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ScrollToTop from "./ScrollToTop.jsx";

describe("ScrollToTop", () => {
  it("CP21 activa el botón al superar el umbral y desplaza hasta arriba", () => {
    render(<ScrollToTop />);
    const boton = screen.getByRole("button", { name: "Volver arriba" });
    expect(boton).toHaveAttribute("tabindex", "-1");
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
    });
    fireEvent.scroll(window);
    expect(boton).toHaveClass("visible");
    expect(boton).toHaveAttribute("tabindex", "0");
    let cuadro;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      cuadro = callback;
      return 1;
    });
    const scroll = vi.spyOn(window, "scrollTo");
    fireEvent.click(boton);
    cuadro(performance.now() + 1000);
    expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });
});
