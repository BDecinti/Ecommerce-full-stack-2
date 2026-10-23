import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { leerJSON, guardarJSON } from "../hooks/useLocalStorage.js";
import { adminUsuariosPorDefecto } from "../data/adminPorDefecto.js";

// Sesión del usuario. Reemplaza las funciones de auth.js que leían localStorage y modificaban
// el header a mano (obtenerUsuarioActual, cerrarSesion, sincronizarHeaderTienda, protegerAdmin).
// Ahora el usuario es un estado de React: cuando cambia, todos los componentes que lo usan se redibujan.

// Cargar usuarios desde localStorage si existen; de lo contrario, usar los por defecto
// (admin@duoc.cl y cliente@duoc.cl, para poder probar sin registrarte primero).
// Es la misma lista que gestiona el panel de administración.
function obtenerUsuarios() {
  const guardados = leerJSON("usuarios", null);
  if (!guardados) {
    guardarJSON("usuarios", adminUsuariosPorDefecto);
    return adminUsuariosPorDefecto;
  }
  return guardados;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() =>
    leerJSON("usuarioLogueado", null),
  );
  // true si el usuario acaba de cerrar sesión (y no es un visitante sin sesión): lo usa AdminLayout
  // para mandarlo al home en vez del login.
  const [sesionCerrada, setSesionCerrada] = useState(false);

  // BUSQUEDA / AUTENTICACION SIMULADA:
  // En un sistema real, aquí harías un `fetch()` enviando los datos al Backend (servidor/Base de datos).
  // Devuelve el usuario si las credenciales son válidas, o null si no.
  const iniciarSesion = (email, password) => {
    const valido = obtenerUsuarios().find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password,
    );
    if (!valido) return null;
    guardarJSON("usuarioLogueado", valido);
    setUsuario(valido);
    setSesionCerrada(false);
    return valido;
  };

  // Devuelve { ok: true } o { ok: false, error }
  const registrar = ({ nombre, email, password }) => {
    nombre = nombre.trim();
    email = email.trim().toLowerCase();
    if (
      !nombre ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 4
    )
      return {
        ok: false,
        error:
          "Revisa el nombre, correo y contraseña de al menos 4 caracteres.",
      };
    const usuarios = obtenerUsuarios();
    if (usuarios.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: "El correo ya está registrado." };
    }
    guardarJSON("usuarios", [
      ...usuarios,
      { nombre, email, password, rol: "cliente" },
    ]);
    return { ok: true };
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    setSesionCerrada(true);
    setUsuario(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ usuario, sesionCerrada, iniciarSesion, registrar, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
