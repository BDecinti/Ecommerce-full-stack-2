import { useEffect, useState } from "react";

// Lee un valor JSON de localStorage (o devuelve el valor por defecto si no existe o está dañado)
export function leerJSON(clave, valorPorDefecto) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorPorDefecto;
  } catch {
    return valorPorDefecto;
  }
}

export function guardarJSON(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Lista persistente en localStorage para el panel de administración.
// Reemplaza a las variables globales adminProductos / adminUsuarios y a la función save() de admin.js.
// Devuelve [lista, guardar]: guardar(nuevaLista) actualiza el estado y escribe en localStorage.
export function useListaLocal(clave, listaPorDefecto) {
  const [lista, setLista] = useState(() => leerJSON(clave, null) || listaPorDefecto);

  // Como hacía admin.js al cargar: la primera vez se guardan los datos por defecto
  useEffect(() => {
    guardarJSON(clave, lista);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const guardar = (nuevaLista) => {
    guardarJSON(clave, nuevaLista);
    setLista(nuevaLista);
  };

  return [lista, guardar];
}
