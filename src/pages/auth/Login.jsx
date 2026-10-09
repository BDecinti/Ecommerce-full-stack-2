import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import "../../styles/login.css";

export default function Login() {
  useTitulo("Iniciar Sesión");
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Mensaje bajo el formulario: { texto, color } (antes se escribía con style.color / textContent)
  const [mensaje, setMensaje] = useState(null);

  const ingresar = (e) => {
    e.preventDefault(); // Evita recargar la página

    const usuario = iniciarSesion(email, password);
    if (!usuario) {
      setMensaje({ texto: "Correo o contraseña incorrectos.", color: "red" });
      return;
    }

    setMensaje({ texto: `Bienvenido ${usuario.nombre} (${usuario.rol})...`, color: "green" });

    // Redireccionar según el ROL
    setTimeout(() => {
      navigate(usuario.rol === "admin" ? "/admin" : "/"); // Administrador o Cliente / Tienda
    }, 1000);
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
            required
            minLength={4}
            maxLength={10}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Ingresar</button>
      </form>

      <p style={{ color: mensaje?.color }}>{mensaje?.texto}</p>

      <p className="auth-link">
        ¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link>
      </p>

      <div className="credenciales-demo">
        <p>
          <strong>Usuarios de prueba:</strong>
        </p>
        <p>
          👤 Administrador: <code>admin@duoc.cl</code> / <code>123</code>
        </p>
        <p>
          🛒 Comprador: <code>cliente@duoc.cl</code> / <code>123</code>
        </p>
      </div>
    </section>
  );
}
