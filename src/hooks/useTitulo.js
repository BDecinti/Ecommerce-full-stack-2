import { useEffect } from "react";

// Cambia el <title> de la pestaña. Antes cada página HTML traía el suyo; ahora hay un solo index.html.
export default function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo;
  }, [titulo]);
}
