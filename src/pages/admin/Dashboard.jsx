import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import "../../styles/admin-home.css";

export default function Dashboard() {
  useTitulo("Administrador - Home");

  return (
    <>
      <section className="admin-welcome">
        <h1>Panel de administración</h1>
        <p>Gestiona los productos y usuarios de la tienda.</p>
      </section>
      <section className="container grid grid-2 admin-cards">
        <Link className="card admin-card" to="/admin/products">
          <h2>Productos</h2>
          <p>Listar, crear, editar y mostrar productos.</p>
        </Link>
        <Link className="card admin-card" to="/admin/users">
          <h2>Usuarios</h2>
          <p>Listar, crear, editar y mostrar usuarios.</p>
        </Link>
      </section>
    </>
  );
}
