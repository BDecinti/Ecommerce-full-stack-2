// Datos de ejemplo del panel de administración (se usan solo si localStorage está vacío)
export const adminProductosPorDefecto = [
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

export const adminUsuariosPorDefecto = [
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
