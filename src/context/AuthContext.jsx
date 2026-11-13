import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  api,
  login,
  logout,
  refreshSession,
  observeSession,
} from "../services/api.js";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [sesionCerrada, setSesionCerrada] = useState(false);
  useEffect(() => {
    for (const key of [
      "usuarioLogueado",
      "usuarios",
      "productos",
      "productosVersion",
      "categorias",
      "categoriasVersion",
      "pedidos",
    ])
      localStorage.removeItem(key);
    let active = true;
    const stop = observeSession((session) => {
      if (active) {
        setUsuario(session?.usuario ?? null);
        if (session) setSesionCerrada(false);
      }
    });
    refreshSession()
      .catch((e) => {
        if (active && e.status !== 401) setError(e.message);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
      stop();
    };
  }, []);
  const iniciarSesion = async (email, password) => {
    setError("");
    try {
      const session = await login(email.trim().toLowerCase(), password);
      setUsuario(session.usuario);
      setSesionCerrada(false);
      return session.usuario;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };
  const registrar = async ({ nombre, email, password }) => {
    try {
      await api("/auth/registro", {
        method: "POST",
        body: {
          nombre: nombre.trim(),
          email: email.trim().toLowerCase(),
          password,
        },
        anonymous: true,
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };
  const cerrarSesion = async () => {
    try {
      await logout();
      setSesionCerrada(true);
      setUsuario(null);
      setError("");
      navigate("/");
      return true;
    } catch {
      setError(
        "No se pudo cerrar la sesión. Comprueba la conexión e inténtalo nuevamente.",
      );
      return false;
    }
  };
  const actualizarPerfil = async () => {
    const datos = await api("/auth/me");
    setUsuario(datos);
    return datos;
  };
  return (
    <AuthContext.Provider
      value={{
        usuario,
        ready,
        error,
        sesionCerrada,
        iniciarSesion,
        registrar,
        cerrarSesion,
        actualizarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
