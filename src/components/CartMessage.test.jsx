import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import { renderTienda, sembrar, producto } from "../test/render.jsx";
import ProductCard from "./ProductCard.jsx";
import CartMessage from "./CartMessage.jsx";

describe("CartMessage", () => {
  function mostrar() {
    sembrar();
    renderTienda(
      <>
        <ProductCard producto={producto} />
        <CartMessage />
      </>,
    );
  }
  it("CP17 confirma el añadido y desaparece después de tres segundos", () => {
    vi.useFakeTimers();
    mostrar();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Añadir al carrito/ }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Mouse de prueba se añadió al carrito",
    );
    act(() => vi.advanceTimersByTime(2999));
    expect(screen.getByRole("status")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it("CP18 otro añadido reinicia el tiempo y el enlace cierra el aviso", () => {
    vi.useFakeTimers();
    mostrar();
    const agregar = screen.getByRole("button", { name: /Añadir al carrito/ });
    fireEvent.click(agregar);
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(agregar);
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("status")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Ver carrito" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
