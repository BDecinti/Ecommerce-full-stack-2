import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext.jsx";
import { api, clearSession } from "../services/api.js";
import { useApiList } from "../hooks/useApiList.js";
const UsuariosContext = createContext(null);
export function UsuariosProvider({ children }) {
  const { usuario, ready, actualizarPerfil } = useAuth();
  const list = useApiList(
    "/usuarios",
    ready && usuario?.rol === "admin",
    usuario?.id ?? "anonimo",
  );
  const crear = async (datos) => {
    const u = await api("/usuarios", { method: "POST", body: datos });
    list.setItems((prev) => [...prev, u]);
    return u;
  };
  const editar = async (id, datos) => {
    const u = await api(`/usuarios/${id}`, { method: "PUT", body: datos });
    list.setItems((prev) => prev.map((x) => (x.id === u.id ? u : x)));
    if (usuario.id === u.id) {
      if (u.rol !== usuario.rol || u.email !== usuario.email || datos.password)
        clearSession();
      else await actualizarPerfil();
    }
    return u;
  };
  const eliminar = async (id) => {
    await api(`/usuarios/${id}`, { method: "DELETE" });
    list.setItems((prev) => prev.filter((u) => u.id !== Number(id)));
  };
  return (
    <UsuariosContext.Provider
      value={{
        usuarios: usuario?.rol === "admin" ? list.items : [],
        obtener: (id) => list.items.find((u) => u.id === Number(id)),
        crear,
        editar,
        eliminar,
        cargando: list.loading,
        error: list.error,
        recargar: list.reload,
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
}
export const useUsuarios = () => useContext(UsuariosContext);
