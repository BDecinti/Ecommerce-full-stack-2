import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import AdminIcon from "./AdminIcon.jsx";

describe("AdminIcon", () => {
  it("CP24 usa el tamaño recibido y oculta el icono decorativo al lector", () => {
    const { container } = render(<AdminIcon nombre="productos" tamano={24} />);
    const icono = container.querySelector("svg");
    expect(icono).toHaveAttribute("width", "24");
    expect(icono).toHaveAttribute("height", "24");
    expect(icono).toHaveAttribute("aria-hidden", "true");
    expect(icono.querySelector("path")).toBeInTheDocument();
  });
});
