import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { leerJSON, guardarJSON } from "../hooks/useLocalStorage.js";

// Sesión del usuario. Reemplaza las funciones de auth.js que leían localStorage y modificaban
// el header a mano (obtenerUsuarioActual, cerrarSesion, sincronizarHeaderTienda, protegerAdmin).
// Ahora el usuario es un estado de React: cuando cambia, todos los componentes que lo usan se redibujan.

// USUARIOS POR DEFECTO (para poder probar sin registrarte primero)
const usuariosPorDefecto = [
  { email: "admin@duoc.cl", password: "123", rol: "admin", nombre: "Admin Sistema" },
  { email: "cliente@duoc.cl", password: "123", rol: "cliente", nombre: "Cliente Prueba" },
];

// Cargar usuarios desde localStorage si existen; de lo contrario, usar los por defecto
function obtenerUsuarios() {
  const guardados = leerJSON("usuarios", null);
  if (!guardados) {
    guardarJSON("usuarios", usuariosPorDefecto);
    return usuariosPorDefecto;
  }
  return guardados;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => leerJSON("usuarioLogueado", null));

  // BUSQUEDA / AUTENTICACION SIMULADA:
  // En un sistema real, aquí harías un `fetch()` enviando los datos al Backend (servidor/Base de datos).
  // Devuelve el usuario si las credenciales son válidas, o null si no.
  const iniciarSesion = (email, password) => {
    const valido = obtenerUsuarios().find((u) => u.email === email && u.password === password);
    if (!valido) return null;
    guardarJSON("usuarioLogueado", valido);
    setUsuario(valido);
    return valido;
  };

  // Devuelve { ok: true } o { ok: false, error }
  const registrar = ({ nombre, email, password, rol }) => {
    const usuarios = obtenerUsuarios();
    if (usuarios.some((u) => u.email === email)) {
      return { ok: false, error: "El correo ya está registrado." };
    }
    guardarJSON("usuarios", [...usuarios, { nombre, email, password, rol }]);
    return { ok: true };
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    setUsuario(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, registrar, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
