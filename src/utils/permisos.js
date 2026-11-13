export function rutaTrasLogin(from, rol) {
  const inicio =
    rol === "admin" ? "/admin" : rol === "vendedor" ? "/admin/orders" : "/";
  if (
    typeof from !== "string" ||
    !from.startsWith("/") ||
    from.startsWith("//")
  )
    return inicio;
  if (!/^\/admin(?:\/|$)/.test(from)) return from;
  if (rol === "admin") return from;
  if (
    rol === "vendedor" &&
    /^\/admin\/(?:products|orders|profile)(?:\/|$)/.test(from) &&
    from !== "/admin/orders/new"
  )
    return from;
  return inicio;
}
