import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import "../../styles/login.css";
import { rutaTrasLogin } from "../../utils/permisos.js";

export default function Login({ onSuccess, modal = false }) {
  useTitulo(modal ? document.title : "Iniciar Sesión");
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [enviando, setEnviando] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Mensaje bajo el formulario: { texto, color } (antes se escribía con style.color / textContent)
  const [mensaje, setMensaje] = useState(null);

  const ingresar = async (e) => {
    e.preventDefault(); // Evita recargar la página

    setEnviando(true);
    let usuario;
    try {
      usuario = await iniciarSesion(email.trim().toLowerCase(), password);
    } catch (error) {
      setMensaje({ texto: error.message, color: "red" });
      setEnviando(false);
      return;
    }
    setEnviando(false);
    if (!usuario) {
      setMensaje({ texto: "Correo o contraseña incorrectos.", color: "red" });
      return;
    }

    setMensaje({
      texto: `Bienvenido ${usuario.nombre} (${usuario.rol})...`,
      color: "green",
    });

    // Redireccionar según el ROL
    onSuccess?.();
    if (!modal || location.state?.from || usuario.rol !== "cliente")
      navigate(rutaTrasLogin(location.state?.from, usuario.rol), {
        replace: true,
      });
  };

  return (
    <section className="form-card card auth-card">
      <h1>Iniciar Sesión</h1>
      <p className="muted">Ingresa a tu cuenta para continuar.</p>

      <form onSubmit={ingresar}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            required
            maxLength={100}
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            required
            minLength={1}
            maxLength={128}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={enviando}>
          {enviando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>

      <p
        role="status"
        className={
          mensaje
            ? "alert " +
              (mensaje.color === "red" ? "alert-error" : "alert-success")
            : ""
        }
      >
        {mensaje?.texto}
      </p>

      <p className="auth-link">
        ¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link>
      </p>

      <div className="credenciales-demo">
        <p>
          <strong>Usuarios de prueba:</strong>
        </p>
        <p>
          👤 Administrador: <code>admin@duoc.cl</code> / <code>Admin123!</code>
        </p>
        <p>
          🛒 Comprador: <code>cliente@duoc.cl</code> / <code>Cliente123!</code>
        </p>
        <p>
          Vendedor: <code>vendedor@duoc.cl</code> / <code>Vendedor123!</code>
        </p>
      </div>
    </section>
  );
}
