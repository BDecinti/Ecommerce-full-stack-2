import { rutaImagen } from "../data/productos.js";

// Imagen de producto con respaldo: si la URL externa falla (bloqueo, enlace caído, sin Internet),
// se muestra la imagen local por defecto. referrerPolicy evita que algunos servidores rechacen la carga.
const RESPALDO = "img/placeholder.svg";

export default function ProductImage({ src, alt = "", ...props }) {
  const alFallar = (e) => {
    const img = e.currentTarget;
    const respaldo = rutaImagen(RESPALDO);
    if (!img.src.endsWith(respaldo)) img.src = respaldo;
  };
  return (
    <img
      src={rutaImagen(src)}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={alFallar}
      {...props}
    />
  );
}
