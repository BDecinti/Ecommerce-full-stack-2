import { describe, it, expect } from "vitest";
import {
  costoEnvio,
  validarEntrega,
  validarTarjeta,
  validarStock,
  datosDelPedido,
  TARJETA_APROBADA,
  TARJETA_RECHAZADA,
} from "./checkout.js";
const entrega = {
  nombre: "Cliente Demo",
  email: "demo@example.com",
  telefono: "+56 9 1234 5678",
  tipoEntrega: "envio",
  direccion: "Calle 123",
  comuna: "Santiago",
  region: "Metropolitana",
};
const tarjeta = {
  numero: TARJETA_APROBADA,
  titular: "DEMO",
  vencimiento: "12/30",
  cvv: "123",
};

describe("checkout", () => {
  it("UT01 aplica envío y umbral de gratuidad", () => {
    expect(costoEnvio("envio", 99999)).toBe(4990);
    expect(costoEnvio("envio", 100000)).toBe(0);
    expect(costoEnvio("presencial", 100)).toBe(0);
  });
  it("UT02 acepta dirección y contacto válidos", () =>
    expect(validarEntrega(entrega)).toBe(""));
  for (const [id, campo, valor] of [
    ["UT03", "nombre", " "],
    ["UT04", "email", "no-es-correo"],
    ["UT05", "telefono", "123"],
    ["UT06", "direccion", ""],
    ["UT07", "comuna", ""],
    ["UT08", "region", ""],
  ])
    it(id + " rechaza entrega con " + campo + " inválido", () =>
      expect(validarEntrega({ ...entrega, [campo]: valor })).not.toBe(""),
    );
  it("UT09 retiro no exige dirección", () =>
    expect(
      validarEntrega({
        ...entrega,
        tipoEntrega: "presencial",
        direccion: "",
        comuna: "",
        region: "",
      }),
    ).toBe(""));
  it("UT10 acepta ambas tarjetas demo y números con espacios", () => {
    for (const numero of [
      TARJETA_APROBADA,
      TARJETA_RECHAZADA,
      "4242 4242 4242 4242",
    ])
      expect(
        validarTarjeta({ ...tarjeta, numero }, new Date(2026, 9, 21)),
      ).toBe("");
  });
  for (const [id, campo, valor] of [
    ["UT11", "numero", "1234567812345678"],
    ["UT12", "titular", " "],
    ["UT13", "vencimiento", "13/30"],
    ["UT14", "vencimiento", "01/20"],
    ["UT15", "cvv", "12a"],
  ])
    it(id + " rechaza tarjeta con " + campo + " inválido", () =>
      expect(
        validarTarjeta({ ...tarjeta, [campo]: valor }, new Date(2026, 9, 21)),
      ).not.toBe(""),
    );
  it("UT16 valida disponibilidad e integridad de las cantidades", () => {
    expect(validarStock([], [])).not.toBe("");
    for (const cantidad of [0, -1, 1.5, 4])
      expect(
        validarStock([{ id: 1, cantidad }], [{ id: 1, stock: 3 }]),
      ).not.toBe("");
    expect(
      validarStock([{ id: 2, cantidad: 1 }], [{ id: 1, stock: 3 }]),
    ).not.toBe("");
    expect(validarStock([{ id: 1, cantidad: 3 }], [{ id: 1, stock: 3 }])).toBe(
      "",
    );
  });
  it("UT17 construye pedido con envío sin persistir la tarjeta", () => {
    const p = datosDelPedido(
      [
        {
          id: 1,
          nombre: "Mouse",
          precio: 10000,
          cantidad: 1,
          imagen: "a",
          stock: 5,
        },
      ],
      { ...entrega, numero: TARJETA_APROBADA, cvv: "123" },
      10000,
    );
    expect(p.total).toBe(14990);
    expect(p.costoEnvio).toBe(4990);
    expect(p.items[0].stock).toBeUndefined();
    expect(p.numero).toBeUndefined();
    expect(p.cvv).toBeUndefined();
    expect(p.pagoSimulado).toBe(true);
  });
  it("UT18 omite dirección en pedido de retiro", () =>
    expect(
      datosDelPedido([], { ...entrega, tipoEntrega: "presencial" }, 0)
        .direccion,
    ).toBe(""));
});
