const BASE = import.meta.env.VITE_API_URL || "/api";
let accessToken = null,
  csrfPromise = null,
  refreshPromise = null,
  epoch = 0;
const listeners = new Set();
export class ApiError extends Error {
  constructor(message, status = 0, code = "", errors = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}
const notify = (session) => listeners.forEach((listener) => listener(session));
export function observeSession(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function clearSession() {
  epoch++;
  accessToken = null;
  notify(null);
}
async function raw(path, options = {}) {
  try {
    return await fetch(`${BASE}${path}`, {
      credentials: "include",
      ...options,
    });
  } catch {
    throw new ApiError(
      "No pudimos conectar con la tienda. Comprueba la conexión y vuelve a intentar.",
    );
  }
}
async function parse(response) {
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      body.detail || "No fue posible completar la operación.",
      response.status,
      body.code,
      body.errors,
    );
  return body;
}
async function csrf() {
  if (!csrfPromise)
    csrfPromise = raw("/auth/csrf")
      .then(parse)
      .then((body) => body.token)
      .finally(() => {
        csrfPromise = null;
      })
      .catch((e) => {
        csrfPromise = null;
        throw e;
      });
  return csrfPromise;
}
export async function refreshSession() {
  if (refreshPromise) return refreshPromise;
  const started = epoch;
  refreshPromise = (async () => {
    const token = await csrf();
    const session = await raw("/auth/refresh", {
      method: "POST",
      headers: { "X-XSRF-TOKEN": token },
    }).then(parse);
    if (started !== epoch) throw new ApiError("La sesión cambió.", 401);
    accessToken = session.accessToken;
    notify(session);
    return session;
  })()
    .catch((e) => {
      if (started === epoch) {
        accessToken = null;
        notify(null);
      }
      throw e;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}
export async function api(
  path,
  { method = "GET", body, headers = {}, anonymous = false, retry = true } = {},
) {
  const unsafe = !["GET", "HEAD", "OPTIONS"].includes(method);
  const outgoing = { ...headers };
  if (body !== undefined) outgoing["Content-Type"] = "application/json";
  if (!anonymous && accessToken)
    outgoing.Authorization = `Bearer ${accessToken}`;
  if (unsafe) outgoing["X-XSRF-TOKEN"] = await csrf();
  const response = await raw(path, {
    method,
    headers: outgoing,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (response.status === 401 && !anonymous && retry) {
    try {
      await refreshSession();
    } catch {
      throw new ApiError(
        "Tu sesión terminó. Inicia sesión para continuar.",
        401,
        "SESION_REQUERIDA",
      );
    }
    return api(path, { method, body, headers, anonymous, retry: false });
  }
  return parse(response);
}
export async function login(email, password) {
  epoch++;
  const session = await api("/auth/login", {
    method: "POST",
    body: { email, password },
    anonymous: true,
  });
  accessToken = session.accessToken;
  notify(session);
  return session;
}
export async function logout() {
  await api("/auth/logout", { method: "POST", anonymous: true });
  clearSession();
}
export function resetApiState() {
  accessToken = null;
  csrfPromise = null;
  refreshPromise = null;
  epoch++;
  listeners.clear();
}
