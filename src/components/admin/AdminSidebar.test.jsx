import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderTienda } from "../../test/render.jsx";
import { adminUsuariosPorDefecto } from "../../data/adminPorDefecto.js";
import AdminSidebar from "./AdminSidebar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function Panel() {
  const { usuario } = useAuth();
  return usuario ? <AdminSidebar /> : <p>Sesión cerrada</p>;
}

describe("AdminSidebar", () => {
  it("CP25 marca la sección activa y ofrece el retorno a la tienda", () => {
    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify(adminUsuariosPorDefecto[0]),
    );
    renderTienda(<Panel />, "/admin/products");
    expect(screen.getByRole("link", { name: "Productos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(
      screen.getByRole("link", { name: "Volver a la tienda" }),
    ).toHaveAttribute("href", "/");
    // La página protegida desmonta la barra después de cerrar sesión.
    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(localStorage.getItem("usuarioLogueado")).toBeNull();
    expect(screen.getByText("Sesión cerrada")).toBeInTheDocument();
  });
});
