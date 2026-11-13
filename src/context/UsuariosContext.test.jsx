import { describe, it, expect } from "vitest";
import { act } from "@testing-library/react";
import { renderTienda } from "../test/render.jsx";
import { useUsuarios } from "./UsuariosContext.jsx";
import { authenticateAs, server } from "../test/server.js";
let usuarios;
function ProbeUsuarios() {
  usuarios = useUsuarios();
  return null;
}
describe("UsuariosContext", () => {
  it("solo solicita el listado para una cuenta administradora", async () => {
    authenticateAs("cliente@duoc.cl");
    await renderTienda(<ProbeUsuarios />);
    expect(usuarios.usuarios).toEqual([]);
    expect(server().calls.some((c) => c.path === "/usuarios")).toBe(false);
  });
  it("crea, modifica y retira usuarios con identificadores estables del servidor", async () => {
    authenticateAs("admin@duoc.cl");
    await renderTienda(<ProbeUsuarios />);
    let user;
    await act(async () => {
      user = await usuarios.crear({
        nombre: "Nuevo",
        email: "nuevo@example.com",
        password: "Password123!",
        rol: "cliente",
      });
    });
    await act(async () => {
      await usuarios.editar(user.id, {
        nombre: "Editado",
        email: "nuevo@example.com",
        rol: "cliente",
        password: "",
      });
    });
    expect(usuarios.obtener(user.id).nombre).toBe("Editado");
    expect(usuarios.obtener(user.id)).not.toHaveProperty("password");
    await act(async () => {
      await usuarios.eliminar(user.id);
    });
    expect(usuarios.obtener(user.id)).toBeUndefined();
    expect(localStorage.getItem("usuarios")).toBeNull();
  });
});
