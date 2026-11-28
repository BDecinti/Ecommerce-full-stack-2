import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EstadoBadge from "./EstadoBadge.jsx";

describe("EstadoBadge", () => {
  it("CP26 traduce el estado y conserva estados desconocidos", () => {
    const { rerender } = render(<EstadoBadge estado="cancelado" />);
    expect(screen.getByText("Cancelado")).toHaveClass("estado-cancelado");
    rerender(<EstadoBadge estado="en revisión" />);
    expect(screen.getByText("en revisión")).toBeInTheDocument();
  });
});
