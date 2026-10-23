import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { renderTienda } from "../test/render.jsx";
import SearchBar from "./SearchBar.jsx";

function Ruta() {
  const r = useLocation();
  return <output>{r.pathname + r.search}</output>;
}
describe("SearchBar", () => {
  it("CP08 precarga q y envía la búsqueda recortada y codificada", () => {
    renderTienda(
      <>
        <SearchBar />
        <Ruta />
      </>,
      "/products?q=mouse",
    );
    expect(screen.getByRole("searchbox")).toHaveValue("mouse");
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "  teclado & mouse  " },
    });
    fireEvent.submit(screen.getByRole("search"));
    expect(screen.getByRole("status")).toHaveTextContent(
      "/products?q=teclado%20%26%20mouse",
    );
  });
  it("CP09 búsqueda vacía navega al catálogo sin q", () => {
    renderTienda(
      <>
        <SearchBar />
        <Ruta />
      </>,
    );
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "   " },
    });
    fireEvent.submit(screen.getByRole("search"));
    expect(screen.getByRole("status")).toHaveTextContent(/^\/products$/);
  });
});
