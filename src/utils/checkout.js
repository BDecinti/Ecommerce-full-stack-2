// Reglas de la compra de demostración, compartidas por la vista y sus pruebas.
export const TARJETA_APROBADA = "4242424242424242";
export const TARJETA_RECHAZADA = "4000000000000002";
export const costoEnvio = (tipo, subtotal) =>
  tipo === "envio" && subtotal < 100000 ? 4990 : 0;

export function validarEntrega(datos) {
  if (!datos.nombre.trim()) return "Ingresa el nombre de quien recibe.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim()))
    return "Ingresa un correo válido.";
  if (!/^(?:56)?9\d{8}$/.test(datos.telefono.replace(/\D/g, "")))
    return "Ingresa un celular chileno válido, por ejemplo +56 9 1234 5678.";
  if (
    datos.tipoEntrega === "envio" &&
    (!datos.direccion.trim() || !datos.comuna.trim() || !datos.region.trim())
  )
    return "Completa dirección, comuna y región para el envío.";
  return "";
}

export function validarTarjeta(
  { numero, titular, vencimiento, cvv },
  ahora = new Date(),
) {
  const limpio = numero.replace(/\s/g, "");
  if (![TARJETA_APROBADA, TARJETA_RECHAZADA].includes(limpio))
    return "Usa una de las dos tarjetas de demostración indicadas.";
  if (!titular.trim()) return "Ingresa el titular de prueba.";
  const partes = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(vencimiento);
  if (
    !partes ||
    new Date(2000 + Number(partes[2]), Number(partes[1]), 1) <= ahora
  )
    return "Ingresa un vencimiento futuro en formato MM/AA.";
  if (!/^\d{3}$/.test(cvv)) return "Ingresa un CVV de prueba de 3 dígitos.";
  return "";
}

export function validarStock(items, productos) {
  if (!items.length) return "Tu carrito está vacío.";
  for (const item of items) {
    const producto = productos.find((p) => p.id === item.id);
    if (
      !producto ||
      !Number.isInteger(item.cantidad) ||
      item.cantidad < 1 ||
      item.cantidad > producto.stock
    )
      return "Cambió la disponibilidad. Revisa tu carrito antes de pagar.";
  }
  return "";
}

export function datosDelPedido(items, entrega, subtotal) {
  const envio = costoEnvio(entrega.tipoEntrega, subtotal);
  return {
    fecha: new Date().toISOString(),
    items: items.map(({ id, nombre, precio, cantidad, imagen }) => ({
      id,
      nombre,
      precio,
      cantidad,
      imagen,
    })),
    subtotal,
    costoEnvio: envio,
    total: subtotal + envio,
    nombre: entrega.nombre.trim(),
    usuario: entrega.email.trim().toLowerCase(),
    telefono: entrega.telefono.trim(),
    tipoEntrega: entrega.tipoEntrega,
    direccion: entrega.tipoEntrega === "envio" ? entrega.direccion.trim() : "",
    comuna: entrega.tipoEntrega === "envio" ? entrega.comuna.trim() : "",
    region: entrega.tipoEntrega === "envio" ? entrega.region.trim() : "",
    metodoPago: "tarjeta demo",
    pagoSimulado: true,
  };
}
