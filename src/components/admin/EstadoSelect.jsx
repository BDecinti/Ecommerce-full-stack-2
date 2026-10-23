import { estadosPedido } from "../../data/estadosPedido.js";

// Lista desplegable de estados de pedido. Con `todos` agrega la opción "Todos" (útil para filtrar).
export default function EstadoSelect({ id, value, onChange, todos = false, disabled = false }) {
  return (
    <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
      {todos && <option value="">Todos los estados</option>}
      {estadosPedido.map((e) => (
        <option key={e.valor} value={e.valor}>
          {e.etiqueta}
        </option>
      ))}
    </select>
  );
}
