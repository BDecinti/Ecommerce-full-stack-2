import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderTienda, sembrar, producto } from "../test/render.jsx";
import { adminUsuariosPorDefecto } from "../data/adminPorDefecto.js";
import Header from "./Header.jsx";

describe("Header", () => {
  it("CP14 refleja las unidades del carrito y abre/cierra el inicio de sesión", () => {
    sembrar([producto], [{ id: 90, cantidad: 2 }]);
    renderTienda(<Header />);
    expect(screen.getByRole("link", { name: "Carrito (2)" })).toHaveAttribute(
      "href",
      "/cart",
    );
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(screen.getByRole("dialog")).toHaveAttribute("open");
    fireEvent.click(
      screen.getByRole("button", { name: "Cerrar inicio de sesión" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("CP15 administrador ve su panel y cerrar sesión actualiza el header", () => {
    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify(adminUsuariosPorDefecto[0]),
    );
    renderTienda(<Header />);
    expect(screen.getByRole("link", { name: "Panel admin" })).toHaveAttribute(
      "href",
      "/admin",
    );
    fireEvent.click(screen.getByRole("link", { name: "Cerrar sesión" }));
    expect(
      screen.getByRole("button", { name: "Iniciar sesión" }),
    ).toBeInTheDocument();
    expect(localStorage.getItem("usuarioLogueado")).toBeNull();
  });
  it("CP16 se oculta al bajar y reaparece al subir", () => {
    renderTienda(<Header />);
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 200,
    });
    fireEvent.scroll(window);
    expect(screen.getByRole("banner")).toHaveClass("header-oculto");
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 100,
    });
    fireEvent.scroll(window);
    expect(screen.getByRole("banner")).not.toHaveClass("header-oculto");
  });
});
