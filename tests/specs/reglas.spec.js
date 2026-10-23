import {
  costoEnvio,
  validarEntrega,
  validarTarjeta,
  validarStock,
  datosDelPedido,
  TARJETA_APROBADA,
  TARJETA_RECHAZADA,
} from "../../src/utils/checkout.js";
import {
  filtrarProductos,
  filtrosIniciales,
  marcasDe,
  marcaDe,
} from "../../src/utils/filtrarProductos.js";
import {
  resumenInventario,
  csvInventario,
} from "../../src/utils/inventario.js";
import {
  leerJSON,
  guardarJSON,
  leerConVersion,
  guardarConVersion,
} from "../../src/hooks/useLocalStorage.js";
import {
  inicioPeriodo,
  desplazar,
  haceUnAnio,
  ventasValidas,
  enRango,
  resumen,
  variacion,
  serieVentas,
  desgloseVentas,
  rankingProductos,
} from "../../src/utils/reporteVentas.js";
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
describe("Reglas de compra y catálogo", () => {
  afterEach(() => localStorage.clear());
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
    expect(p.pagoSimulado).toBeTrue();
  });
  it("UT18 omite dirección en pedido de retiro", () =>
    expect(
      datosDelPedido([], { ...entrega, tipoEntrega: "presencial" }, 0)
        .direccion,
    ).toBe(""));
  const productos = [
    {
      id: 1,
      nombre: "Teclado Mecánico",
      precio: 300,
      stock: 2,
      marca: "B",
      codigo: "TEC",
    },
    { id: 2, nombre: "Mouse", precio: 100, stock: 0, marca: "A" },
    { id: 3, nombre: "Control", precio: 200, stock: 1 },
  ];
  it("UT19 busca sin tildes y por código", () => {
    expect(
      filtrarProductos(productos, {
        ...filtrosIniciales,
        busqueda: " MECANICO ",
      }).map((p) => p.id),
    ).toEqual([1]);
    expect(
      filtrarProductos(productos, { ...filtrosIniciales, busqueda: "TEC" })
        .length,
    ).toBe(1);
  });
  it("UT20 combina marca precio y disponibilidad", () =>
    expect(
      filtrarProductos(productos, {
        ...filtrosIniciales,
        marcas: ["B"],
        precioMin: "250",
        precioMax: "350",
        soloDisponibles: true,
      }).map((p) => p.id),
    ).toEqual([1]));
  it("UT21 ordena sin mutar el catálogo", () => {
    expect(
      filtrarProductos(productos, {
        ...filtrosIniciales,
        orden: "precio-asc",
      }).map((p) => p.precio),
    ).toEqual([100, 200, 300]);
    expect(
      filtrarProductos(productos, {
        ...filtrosIniciales,
        orden: "precio-desc",
      }).map((p) => p.precio),
    ).toEqual([300, 200, 100]);
    expect(
      filtrarProductos(productos, { ...filtrosIniciales, orden: "nombre" })[0]
        .nombre,
    ).toBe("Control");
    expect(productos[0].id).toBe(1);
  });
  it("UT22 devuelve vacío para límites incompatibles", () =>
    expect(
      filtrarProductos(productos, {
        ...filtrosIniciales,
        precioMin: "400",
        precioMax: "50",
      }),
    ).toEqual([]));
  it("UT23 cuenta marcas y agrupa productos sin marca", () => {
    expect(marcaDe({})).toBe("Sin marca");
    expect(marcasDe(productos).length).toBe(3);
    expect(
      marcasDe([...productos, productos[0]]).find((m) => m.marca === "B")
        .cantidad,
    ).toBe(2);
  });
  it("UT24 calcula valor unidades y productos críticos", () =>
    expect(
      resumenInventario([
        { precio: 10, stock: 2, stockCritico: 2 },
        { precio: 20, stock: 0 },
      ]),
    ).toEqual({ productos: 2, unidades: 2, valor: 20, criticos: 2 }));
  it("UT25 CSV escapa comillas separadores y fórmulas", () => {
    const csv = csvInventario([
      { codigo: "=SUM(1)", nombre: 'Mouse; "Pro"', stock: 1, precio: 10 },
    ]);
    expect(csv).toContain('"\'=SUM(1)"');
    expect(csv).toContain('"Mouse; ""Pro"""');
    expect(csv.charCodeAt(0)).toBe(65279);
  });
  it("UT26 JSON corrupto usa el valor por defecto", () => {
    localStorage.setItem("x", "{");
    expect(leerJSON("x", [])).toEqual([]);
    expect(leerJSON("missing", null)).toBeNull();
  });
  it("UT27 guarda y recupera datos versionados", () => {
    guardarJSON("a", { ok: true });
    expect(leerJSON("a", null)).toEqual({ ok: true });
    guardarConVersion("x", 2, [1]);
    expect(leerConVersion("x", 2, [])).toEqual([1]);
    expect(leerConVersion("x", 3, [])).toEqual([]);
  });
  it("UT28 calcula inicios de día semana y mes", () => {
    const f = new Date(2026, 9, 21, 14);
    expect(inicioPeriodo(f, "dia").getHours()).toBe(0);
    expect(inicioPeriodo(f, "semana").getDay()).toBe(1);
    expect(inicioPeriodo(f, "mes").getDate()).toBe(1);
  });
  it("UT29 desplaza fechas y compara año anterior", () => {
    const f = new Date(2026, 9, 1);
    expect(desplazar(f, "dia", 1).getDate()).toBe(2);
    expect(desplazar(f, "semana", 1).getDate()).toBe(8);
    expect(desplazar(f, "mes", 1).getMonth()).toBe(10);
    expect(haceUnAnio(f).getFullYear()).toBe(2025);
  });
  it("UT30 excluye cancelados y respeta rango final abierto", () => {
    const p = [
      { fecha: "2026-10-01", total: 100, estado: "pendiente" },
      { fecha: "2026-10-02", total: 200, estado: "cancelado" },
    ];
    expect(ventasValidas(p).length).toBe(1);
    expect(
      enRango(p, new Date("2026-10-01"), new Date("2026-10-02")).length,
    ).toBe(1);
    expect(resumen(p).ticket).toBe(150);
    expect(resumen([]).ticket).toBe(0);
    expect(variacion(2, 1)).toBe(100);
    expect(variacion(2, 0)).toBeNull();
  });
  it("UT31 produce serie y desglose de ventas incluso productos eliminados", () => {
    const p = [
      {
        fecha: new Date(2026, 9, 21).toISOString(),
        total: 20,
        items: [
          { id: 1, nombre: "A", cantidad: 2, precio: 10 },
          { id: 99, nombre: "Eliminado", cantidad: 1, precio: 5 },
        ],
      },
    ];
    expect(serieVentas(p, "dia", new Date(2026, 9, 21), 2).length).toBe(2);
    const d = desgloseVentas(
      p,
      [{ id: 1, categoriaId: 1, marca: "M" }],
      (id) => (id ? "Periféricos" : "Sin categoría"),
    );
    expect(d.categorias.length).toBe(2);
    expect(d.marcas.length).toBe(2);
    const r = rankingProductos(d.vendidos, [
      { id: 1, nombre: "A" },
      { id: 2, nombre: "B" },
    ]);
    expect(r.mas[0].unidades).toBe(2);
    expect(r.menos[0].unidades).toBe(0);
  });
});
