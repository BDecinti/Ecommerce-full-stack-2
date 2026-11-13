import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import RequireRole from "./RequireRole.jsx";
import { renderTienda } from "../test/render.jsx";
import { authenticateAs, server } from "../test/server.js";
function Protected() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <RequireRole roles={["admin"]}>
            <h1>Privado</h1>
          </RequireRole>
        }
      />
      <Route path="/login" element={<h1>Ingreso requerido</h1>} />
    </Routes>
  );
}
describe("RequireRole", () => {
  it("redirige al invitado antes de renderizar contenido privado", async () => {
    await renderTienda(<Protected />, "/admin");
    expect(
      screen.getByRole("heading", { name: "Ingreso requerido" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Privado")).toBeNull();
  });
  it("rechaza al vendedor aunque escriba una ruta de administrador", async () => {
    authenticateAs("vendedor@duoc.cl");
    await renderTienda(<Protected />, "/admin");
    expect(
      screen.getByRole("heading", { name: /No tienes permiso/ }),
    ).toBeInTheDocument();
    expect(server().calls.some((c) => c.path === "/usuarios")).toBe(false);
  });
  it("permite al administrador restaurado por el servidor", async () => {
    authenticateAs("admin@duoc.cl");
    await renderTienda(<Protected />, "/admin");
    expect(
      screen.getByRole("heading", { name: "Privado" }),
    ).toBeInTheDocument();
  });
});
