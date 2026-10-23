import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import { renderTienda } from "../test/render.jsx";
import HeroCarousel from "./HeroCarousel.jsx";

describe("HeroCarousel", () => {
  const activo = () => screen.getAllByRole("link")[0];
  it("CP19 flechas y puntos cambian el banner y vuelven al principio", () => {
    renderTienda(<HeroCarousel />);
    expect(activo()).toHaveTextContent("");
    expect(activo().querySelector("img")).toHaveAttribute(
      "alt",
      expect.stringContaining("Monitor Gamer"),
    );
    fireEvent.click(screen.getByRole("button", { name: "Banner anterior" }));
    expect(activo().querySelector("img")).toHaveAttribute(
      "alt",
      expect.stringContaining("UPS Cito"),
    );
    fireEvent.click(screen.getByRole("button", { name: "Banner siguiente" }));
    fireEvent.click(screen.getByRole("button", { name: "Ir al banner 2" }));
    expect(activo().querySelector("img")).toHaveAttribute(
      "alt",
      expect.stringContaining("Memoria Corsair"),
    );
  });
  it("CP20 avanza automáticamente, pausa con el puntero y reanuda", () => {
    vi.useFakeTimers();
    renderTienda(<HeroCarousel />);
    act(() => vi.advanceTimersByTime(5000));
    expect(activo().querySelector("img")).toHaveAttribute(
      "alt",
      expect.stringContaining("Memoria Corsair"),
    );
    const carrusel = screen.getByRole("region", { name: "Ofertas destacadas" });
    fireEvent.mouseEnter(carrusel);
    act(() => vi.advanceTimersByTime(10000));
    expect(activo().querySelector("img")).toHaveAttribute(
      "alt",
      expect.stringContaining("Memoria Corsair"),
    );
    fireEvent.mouseLeave(carrusel);
    act(() => vi.advanceTimersByTime(5000));
    expect(activo().querySelector("img")).toHaveAttribute(
      "alt",
      expect.stringContaining("UPS Cito"),
    );
  });
});
