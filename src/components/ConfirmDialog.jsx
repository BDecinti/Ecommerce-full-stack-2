import { useEffect, useRef } from "react";

// Diálogo de confirmación con el estilo de la tienda (antes confirmarAccion() en carrito.js, que
// creaba el HTML con document.createElement y devolvía una promesa).
// Ahora el componente se muestra o se oculta según la prop `abierto`, y avisa con callbacks.
export default function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Aceptar",
  textoCancelar = "Cancelar",
  onConfirmar,
  onCancelar,
}) {
  const botonCancelar = useRef(null);

  useEffect(() => {
    if (abierto) botonCancelar.current?.focus(); // por seguridad, el foco empieza en Cancelar
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e) => {
      if (e.key === "Escape") onCancelar();
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancelar()} // clic en el fondo oscuro
    >
      <div className="modal-box" role="alertdialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div className="modal-icon">⚠️</div>
        <h3 className="modal-titulo" id="modal-titulo">
          {titulo}
        </h3>
        <p className="modal-mensaje">{mensaje}</p>
        <div className="modal-acciones">
          <button type="button" className="btn-dark" ref={botonCancelar} onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button type="button" className="btn-danger" onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
