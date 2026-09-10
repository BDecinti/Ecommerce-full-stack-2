const adminProductos = JSON.parse(
  localStorage.getItem("adminProductos") || "null",
) || [
  {
    codigo: "PROD1",
    nombre: "Producto 1",
    descripcion: "Producto de ejemplo",
    precio: 8000,
    stock: 10,
    stockCritico: 2,
    categoria: "tecnologia",
  },
  {
    codigo: "PROD2",
    nombre: "Producto 2",
    descripcion: "Producto de ejemplo",
    precio: 6000,
    stock: 15,
    stockCritico: 2,
    categoria: "tecnologia",
  },
  {
    codigo: "PROD3",
    nombre: "Producto 3",
    descripcion: "Producto de ejemplo",
    precio: 10000,
    stock: 8,
    stockCritico: 2,
    categoria: "accesorios",
  },
  {
    codigo: "PROD4",
    nombre: "Producto 4",
    descripcion: "Producto de ejemplo",
    precio: 12000,
    stock: 5,
    stockCritico: 2,
    categoria: "otros",
  },
];
const adminUsuarios = JSON.parse(
  localStorage.getItem("adminUsuarios") || "null",
) || [
  {
    run: "19011022K",
    nombre: "Admin",
    apellidos: "Sistema",
    email: "admin@duoc.cl",
    rol: "admin",
    fechaNacimiento: "",
    region: "Región Metropolitana",
    comuna: "Santiago",
    direccion: "",
  },
  {
    run: "19011023K",
    nombre: "Cliente",
    apellidos: "Prueba",
    email: "cliente@duoc.cl",
    rol: "cliente",
    fechaNacimiento: "",
    region: "Región Metropolitana",
    comuna: "Santiago",
    direccion: "",
  },
];
function save() {
  localStorage.setItem("adminProductos", JSON.stringify(adminProductos));
  localStorage.setItem("adminUsuarios", JSON.stringify(adminUsuarios));
}
function renderAdminProductos() {
  const t = document.getElementById("tablaProductos");
  if (!t) return;
  t.innerHTML = adminProductos
    .map(
      (p, i) =>
        `<tr><td>${p.codigo}</td><td>${p.nombre}</td><td>$${Number(p.precio).toLocaleString("es-CL")}</td><td>${p.stock}</td><td><a class="btn btn-secondary" href="admin_producto_mostrar.html?id=${i}">Mostrar</a> <a class="btn btn-dark" href="admin_producto_editar.html?id=${i}">Editar</a></td></tr>`,
    )
    .join("");
}
function configurarProductoForm(ed = false) {
  const f = document.getElementById("productoForm"),
    idx = Number(new URLSearchParams(location.search).get("id"));
  if (ed && adminProductos[idx]) {
    const p = adminProductos[idx];
    [
      "codigo",
      "nombre",
      "descripcion",
      "precio",
      "stock",
      "stockCritico",
      "categoria",
    ].forEach((k) => (document.getElementById(k).value = p[k] ?? ""));
  }
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const p = {
      codigo: codigo.value.trim(),
      nombre: nombre.value.trim(),
      descripcion: descripcion.value.trim(),
      precio: Number(precio.value),
      stock: Number(stock.value),
      stockCritico: Number(stockCritico.value || 0),
      categoria: categoria.value,
    };
    if (ed && adminProductos[idx]) adminProductos[idx] = p;
    else adminProductos.push(p);
    save();
    mensajeAdmin.className = "alert alert-success";
    mensajeAdmin.textContent = "Producto guardado correctamente.";
    setTimeout(() => (location.href = "admin_productos.html"), 600);
  });
}
function mostrarAdminProducto() {
  const i = Number(new URLSearchParams(location.search).get("id")),
    p = adminProductos[i],
    d = document.getElementById("detalleAdminProducto");
  if (!p) {
    d.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }
  d.innerHTML = `<div class="detail-row"><strong>Código:</strong> ${p.codigo}</div><div class="detail-row"><strong>Nombre:</strong> ${p.nombre}</div><div class="detail-row"><strong>Descripción:</strong> ${p.descripcion || "Sin descripción"}</div><div class="detail-row"><strong>Precio:</strong> $${Number(p.precio).toLocaleString("es-CL")}</div><div class="detail-row"><strong>Stock:</strong> ${p.stock}</div><div class="detail-row"><strong>Stock crítico:</strong> ${p.stockCritico}</div><div class="detail-row"><strong>Categoría:</strong> ${p.categoria}</div>`;
}
function renderAdminUsuarios() {
  const t = document.getElementById("tablaUsuarios");
  if (!t) return;
  t.innerHTML = adminUsuarios
    .map(
      (u, i) =>
        `<tr><td>${u.run}</td><td>${u.nombre}</td><td>${u.apellidos}</td><td>${u.email}</td><td>${u.rol}</td><td><a class="btn btn-secondary" href="admin_usuario_mostrar.html?id=${i}">Mostrar</a> <a class="btn btn-dark" href="admin_usuario_editar.html?id=${i}">Editar</a></td></tr>`,
    )
    .join("");
}
function configurarUsuarioForm(ed = false) {
  const f = document.getElementById("usuarioForm"),
    idx = Number(new URLSearchParams(location.search).get("id"));
  if (ed && adminUsuarios[idx]) {
    const u = adminUsuarios[idx];
    [
      "run",
      "nombre",
      "apellidos",
      "email",
      "fechaNacimiento",
      "rol",
      "region",
      "comuna",
      "direccion",
    ].forEach((k) => (document.getElementById(k).value = u[k] || ""));
  }
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = {
      run: run.value.replace(/[.\-]/g, "").toUpperCase(),
      nombre: nombre.value.trim(),
      apellidos: apellidos.value.trim(),
      email: email.value.trim(),
      fechaNacimiento: fechaNacimiento.value,
      rol: rol.value,
      region: region.value,
      comuna: comuna.value,
      direccion: direccion.value.trim(),
    };
    if (ed && adminUsuarios[idx]) adminUsuarios[idx] = u;
    else adminUsuarios.push(u);
    save();
    mensajeAdmin.className = "alert alert-success";
    mensajeAdmin.textContent = "Usuario guardado correctamente.";
    setTimeout(() => (location.href = "admin_usuarios.html"), 600);
  });
}
function mostrarAdminUsuario() {
  const i = Number(new URLSearchParams(location.search).get("id")),
    u = adminUsuarios[i],
    d = document.getElementById("detalleAdminUsuario");
  if (!u) {
    d.innerHTML = "<p>Usuario no encontrado.</p>";
    return;
  }
  d.innerHTML = Object.entries(u)
    .map(
      ([k, v]) =>
        `<div class="detail-row"><strong>${k}:</strong> ${v || "No informado"}</div>`,
    )
    .join("");
}
save();
