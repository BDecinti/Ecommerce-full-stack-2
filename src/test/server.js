import { vi } from "vitest";
import { productosPorDefecto } from "../data/productos.js";
import { categoriasPorDefecto } from "../data/categorias.js";
import { adminUsuariosPorDefecto } from "../data/adminPorDefecto.js";
import {
  datosDelPedido,
  validarEntrega,
  validarTarjeta,
} from "../utils/checkout.js";
let db;
const clone = (value) => JSON.parse(JSON.stringify(value));
const response = (value, status = 200) =>
  new Response(status === 204 ? null : JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
const error = (detail, status = 400, code = "") =>
  response({ detail, status, code }, status);
export function resetServer() {
  db = {
    productos: clone(productosPorDefecto),
    categorias: clone(categoriasPorDefecto),
    usuarios: adminUsuariosPorDefecto.map((u, i) => ({
      ...u,
      id: i + 1,
      password: i === 0 ? "Admin123!" : "Cliente123!",
      activo: true,
    })),
    pedidos: [],
    consultas: [],
    sesion: null,
    tokens: new Map(),
    keys: new Map(),
    calls: [],
    offline: false,
    csrf: "csrf-prueba",
  };
  db.usuarios.push({
    id: 3,
    nombre: "Vendedor",
    email: "vendedor@duoc.cl",
    password: "Vendedor123!",
    rol: "vendedor",
    activo: true,
  });
  vi.stubGlobal("fetch", vi.fn(handle));
  return db;
}
export const server = () => db;
export function seedServer(productos, lineas = []) {
  db.productos = clone(productos);
  localStorage.setItem("carrito", JSON.stringify(lineas));
}
export function authenticateAs(email) {
  db.sesion = db.usuarios.find((u) => u.email === email)?.id ?? null;
}
function safeUser(u) {
  const { password, ...safe } = u;
  return clone(safe);
}
function issue(u) {
  const accessToken = `prueba-${crypto.randomUUID()}`;
  db.tokens.set(accessToken, u.id);
  return {
    accessToken,
    tokenType: "Bearer",
    expiresIn: 600,
    usuario: safeUser(u),
  };
}
async function handle(input, options = {}) {
  if (db.offline) throw new TypeError("Sin conexión de prueba");
  const path = new URL(String(input), "http://localhost").pathname.replace(
      /^\/api/,
      "",
    ),
    method = options.method || "GET";
  const headers = new Headers(options.headers),
    body = options.body ? JSON.parse(options.body) : null;
  db.calls.push({ path, method, body: clone(body), headers });
  if (
    !["GET", "HEAD", "OPTIONS"].includes(method) &&
    headers.get("X-XSRF-TOKEN") !== db.csrf
  )
    return error("CSRF no válido", 403);
  const user = db.usuarios.find(
    (u) =>
      u.id ===
        db.tokens.get(
          (headers.get("Authorization") || "").replace("Bearer ", ""),
        ) && u.activo,
  );
  if (path === "/auth/csrf")
    return response({ token: db.csrf, headerName: "X-XSRF-TOKEN" });
  if (path === "/auth/refresh") {
    const u = db.usuarios.find((u) => u.id === db.sesion && u.activo);
    return u ? response(issue(u)) : error("Inicia sesión para continuar.", 401);
  }
  if (path === "/auth/login") {
    const u = db.usuarios.find(
      (u) =>
        u.email.toLowerCase() === body.email.trim().toLowerCase() &&
        u.password === body.password &&
        u.activo,
    );
    if (!u)
      return error(
        "Correo o contraseña incorrectos.",
        401,
        "CREDENCIALES_INVALIDAS",
      );
    db.sesion = u.id;
    return response(issue(u));
  }
  if (path === "/auth/logout") {
    db.sesion = null;
    db.tokens.clear();
    return response(null, 204);
  }
  if (path === "/auth/registro") {
    if (
      !body.nombre?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
      body.password.length < 8
    )
      return error(
        "Revisa el nombre, correo y contraseña de al menos 8 caracteres.",
      );
    if (
      db.usuarios.some(
        (u) => u.email.toLowerCase() === body.email.toLowerCase(),
      )
    )
      return error("El correo ya está registrado.", 409);
    const u = {
      ...body,
      id: Math.max(...db.usuarios.map((x) => x.id)) + 1,
      rol: "cliente",
      activo: true,
    };
    db.usuarios.push(u);
    return response(safeUser(u), 201);
  }
  if (path === "/auth/me")
    return user ? response(safeUser(user)) : error("Sesión requerida", 401);
  if (method === "GET" && path === "/productos")
    return response(clone(db.productos));
  if (method === "GET" && path === "/categorias")
    return response(clone(db.categorias));
  if (path === "/consultas" && method === "POST") {
    const c = {
      ...body,
      id: db.consultas.length + 1,
      fecha: new Date().toISOString(),
    };
    db.consultas.push(c);
    return response(c, 201);
  }
  if (!user) return error("Inicia sesión para continuar.", 401);
  const staff = ["admin", "vendedor"].includes(user.rol);
  if (path === "/usuarios" && method === "GET")
    return user.rol === "admin"
      ? response(db.usuarios.filter((u) => u.activo).map(safeUser))
      : error("Sin permiso", 403);
  if (path === "/pedidos" && method === "GET")
    return response(
      clone(
        staff ? db.pedidos : db.pedidos.filter((p) => p.usuario === user.email),
      ),
    );
  if (path === "/pedidos" && method === "POST") {
    const problema =
      validarEntrega(body.entrega) || validarTarjeta(body.tarjeta);
    if (problema) return error(problema);
    if (body.tarjeta.numero.replace(/\s/g, "") === "4000000000000002")
      return error("Pago rechazado", 402, "PAGO_RECHAZADO");
    const key = headers.get("Idempotency-Key");
    if (db.keys.has(key)) return response(clone(db.keys.get(key)), 201);
    const items = [];
    for (const i of body.items) {
      const p = db.productos.find((p) => p.id === i.id);
      if (!p || i.cantidad > p.stock)
        return error("Cambió la disponibilidad.", 409);
      items.push({ ...p, cantidad: i.cantidad });
    }
    const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const pedido = {
      ...datosDelPedido(items, body.entrega, total),
      usuario: user.email,
      email: body.entrega.email,
      id: Math.max(0, ...db.pedidos.map((p) => p.id)) + 1,
      estado: "pagado",
    };
    for (const i of items)
      db.productos.find((p) => p.id === i.id).stock -= i.cantidad;
    db.pedidos.push(pedido);
    db.keys.set(key, pedido);
    return response(clone(pedido), 201);
  }
  const state = /^\/pedidos\/(\d+)\/estado$/.exec(path);
  if (state) {
    if (!staff) return error("Sin permiso", 403);
    const p = db.pedidos.find((p) => p.id === Number(state[1]));
    if (!p) return error("Pedido no encontrado", 404);
    if (p.estado === "cancelado" && body.estado !== p.estado)
      return error("Pedido finalizado", 409);
    if (body.estado === "cancelado" && p.estado !== "cancelado")
      for (const i of p.items)
        db.productos.find((x) => x.id === i.id).stock += i.cantidad;
    p.estado = body.estado;
    return response(clone(p));
  }
  const match = /^\/(productos|categorias|usuarios)(?:\/(\d+))?$/.exec(path);
  if (match) {
    const [_, resource, idText] = match,
      id = Number(idText);
    if (resource === "productos" ? !staff : user.rol !== "admin")
      return error("Sin permiso", 403);
    if (method === "POST") {
      const data = {
        ...body,
        id: Math.max(0, ...db[resource].map((x) => x.id)) + 1,
      };
      if (resource === "usuarios") data.activo = true;
      db[resource].push(data);
      return response(
        resource === "usuarios" ? safeUser(data) : clone(data),
        201,
      );
    }
    const index = db[resource].findIndex((x) => x.id === id);
    if (index < 0) return error("No encontrado", 404);
    if (method === "PUT") {
      db[resource][index] = { ...db[resource][index], ...body, id };
      return response(
        resource === "usuarios"
          ? safeUser(db[resource][index])
          : clone(db[resource][index]),
      );
    }
    if (method === "DELETE") {
      db[resource].splice(index, 1);
      return response(null, 204);
    }
  }
  return error("Endpoint no definido en la prueba", 404);
}
