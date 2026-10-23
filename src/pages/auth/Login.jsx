import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import "../../styles/login.css";

export default function Login({ onSuccess, modal = false }) {
  useTitulo(modal ? document.title : "Iniciar Sesión");
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Mensaje bajo el formulario: { texto, color } (antes se escribía con style.color / textContent)
  const [mensaje, setMensaje] = useState(null);

  const ingresar = (e) => {
    e.preventDefault(); // Evita recargar la página

    const usuario = iniciarSesion(email.trim().toLowerCase(), password);
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
    if (usuario.rol === "admin") navigate("/admin");
    else if (!modal) navigate("/");
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

        <button type="submit">Ingresar</button>
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
          👤 Administrador: <code>admin@duoc.cl</code> / <code>12345</code>
        </p>
        <p>
          🛒 Comprador: <code>cliente@duoc.cl</code> / <code>123</code>
        </p>
      </div>
    </section>
  );
}
