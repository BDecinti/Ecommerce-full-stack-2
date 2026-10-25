import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { Routes, Route, Link } from "react-router-dom";
import { renderTienda } from "../test/render.jsx";
import PageTransition from "./PageTransition.jsx";

describe("PageTransition", () => {
  it("CP22 cambia el contenido de Outlet al navegar", () => {
    renderTienda(
      <Routes>
        <Route element={<PageTransition />}>
          <Route path="/" element={<Link to="/destino">Continuar</Link>} />
          <Route path="/destino" element={<h1>Destino</h1>} />
        </Route>
      </Routes>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Continuar" }));
    expect(
      screen.getByRole("heading", { name: "Destino" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Continuar" }),
    ).not.toBeInTheDocument();
  });
});
