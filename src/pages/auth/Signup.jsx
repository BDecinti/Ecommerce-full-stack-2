import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import useTitulo from "../../hooks/useTitulo.js";
import "../../styles/signup.css";

export default function Signup() {
  useTitulo("Registro de Usuario");
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("cliente");
  const [mensaje, setMensaje] = useState(null);

  const enviar = (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    const resultado = registrar({ nombre, email, password, rol });
    if (!resultado.ok) {
      setMensaje({ texto: resultado.error, color: "red" });
      return;
    }

    setMensaje({ texto: "¡Registro exitoso! Redirigiendo al login...", color: "green" });

    // Redirigir al login en 1.5 segundos
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <section className="form-card card auth-card">
      <h1>Registro de Usuario</h1>
      <p className="muted">Crea una cuenta para comprar en la tienda.</p>

      <form onSubmit={enviar}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            required
            maxLength={100}
            placeholder="Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

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

        <div className="form-group">
          <label htmlFor="rol">Tipo de Usuario</label>
          <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button type="submit">Registrarse</button>
      </form>

      <p style={{ color: mensaje?.color }}>{mensaje?.texto}</p>

      <p className="auth-link">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </section>
  );
}
