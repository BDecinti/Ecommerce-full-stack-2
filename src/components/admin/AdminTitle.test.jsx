import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminTitle from "./AdminTitle.jsx";

describe("AdminTitle", () => {
  it("CP23 presenta título, descripción y acciones recibidas", () => {
    render(
      <AdminTitle titulo="Productos" descripcion="Gestiona el catálogo">
        <button>Nuevo producto</button>
      </AdminTitle>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Productos" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Gestiona el catálogo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nuevo producto" }),
    ).toBeInTheDocument();
  });
});
