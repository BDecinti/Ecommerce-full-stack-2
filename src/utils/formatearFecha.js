// "2026-10-19T20:10:00.000Z" -> "19-10-2026 17:10" (hora local, formato chileno)
export const formatearFecha = (iso) =>
  new Date(iso).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
