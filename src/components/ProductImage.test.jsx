import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductImage from "./ProductImage.jsx";

describe("ProductImage", () => {
  it("CP37 presenta la ruta local y las propiedades de accesibilidad y carga", () => {
    render(
      <ProductImage src="img/mouse.svg" alt="Mouse de prueba" loading="lazy" />,
    );
    const imagen = screen.getByRole("img", { name: "Mouse de prueba" });
    expect(imagen).toHaveAttribute("src", "/img/mouse.svg");
    expect(imagen).toHaveAttribute("loading", "lazy");
    expect(imagen).toHaveAttribute("referrerpolicy", "no-referrer");
  });
  it("CP38 conserva la URL HTTPS de una imagen externa", () => {
    render(<ProductImage src="https://example.com/mouse.webp" alt="Mouse" />);
    expect(screen.getByRole("img", { name: "Mouse" })).toHaveAttribute(
      "src",
      "https://example.com/mouse.webp",
    );
  });
  it("CP39 reemplaza la imagen fallida por el respaldo local y tolera otro error", () => {
    render(
      <ProductImage src="https://example.com/no-existe.webp" alt="Mouse" />,
    );
    const imagen = screen.getByRole("img", { name: "Mouse" });
    fireEvent.error(imagen);
    expect(imagen).toHaveAttribute("src", "/img/placeholder.svg");
    fireEvent.error(imagen);
    expect(imagen).toHaveAttribute("src", "/img/placeholder.svg");
  });
  it("CP40 usa el respaldo sin src y actualiza la imagen al recibir otras props", () => {
    const { container, rerender } = render(<ProductImage />);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "/img/placeholder.svg",
    );
    rerender(<ProductImage src="img/teclado.svg" alt="Teclado" />);
    expect(screen.getByRole("img", { name: "Teclado" })).toHaveAttribute(
      "src",
      "/img/teclado.svg",
    );
  });
});
