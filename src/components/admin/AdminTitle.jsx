// Encabezado de una página del admin: título, descripción y, opcionalmente, un bloque de acciones a la derecha.
export default function AdminTitle({ titulo, descripcion, children }) {
  return (
    <div className="admin-title">
      <div>
        <h1>{titulo}</h1>
        {descripcion && <p>{descripcion}</p>}
      </div>
      {children}
    </div>
  );
}
