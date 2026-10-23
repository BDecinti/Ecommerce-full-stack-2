import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";
import Payment from "./Payment.jsx";
import { renderTienda, sembrar, producto } from "../../test/render.jsx";
function campo(label, value) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}
function entrega(envio = false) {
  if (envio) fireEvent.click(screen.getByLabelText(/Envío a domicilio/));
  campo("Nombre de quien recibe", "Cliente Demo");
  campo("Correo de contacto", "demo@example.com");
  campo("Celular", "+56 9 1234 5678");
  if (envio) {
    campo("Calle, número y departamento", "Calle 123");
    campo("Comuna", "Santiago");
    campo("Región", "Metropolitana");
  }
  fireEvent.click(screen.getByRole("button", { name: /Continuar al pago/ }));
}
function tarjeta(numero = "4242 4242 4242 4242") {
  campo("Número de tarjeta de prueba", numero);
  campo("Titular de prueba", "CLIENTE DEMO");
  campo("Vencimiento MM/AA", "12/30");
  campo("CVV de prueba", "123");
  fireEvent.click(screen.getByRole("button", { name: /Revisar pedido/ }));
}
describe("Compra integrada", () => {
  beforeEach(() => {
    localStorage.clear();
    sembrar([producto], [{ id: 90, cantidad: 1 }]);
  });
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });
  it("CK01 no permite pagar un carrito vacío", () => {
    sembrar();
    renderTienda(<Payment />);
    expect(
      screen.getByRole("heading", { name: "Tu carrito está vacío" }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: /Confirmar y pagar/ }),
    ).toBeNull();
  });
  it("CK02 envío solicita dirección y muestra costo", () => {
    renderTienda(<Payment />);
    fireEvent.click(screen.getByLabelText(/Envío a domicilio/));
    expect(screen.getByLabelText("Calle, número y departamento").required).toBe(
      true,
    );
    expect(screen.getByText("$14.990")).toBeTruthy();
  });
  it("CK03 contacto inválido bloquea el paso a tarjeta", () => {
    renderTienda(<Payment />);
    campo("Nombre de quien recibe", "Demo");
    campo("Correo de contacto", "demo@example.com");
    campo("Celular", "123");
    fireEvent.click(screen.getByRole("button", { name: /Continuar al pago/ }));
    expect(screen.getByRole("alert").textContent).toContain("celular");
    expect(screen.queryByLabelText("Número de tarjeta de prueba")).toBeNull();
  });
  it("CK04 aprueba envío registra total descuenta stock y vacía", () => {
    renderTienda(<Payment />);
    entrega(true);
    tarjeta();
    fireEvent.click(screen.getByRole("button", { name: /Confirmar y pagar/ }));
    expect(
      screen.getByRole("heading", { name: "¡Pago aprobado!" }),
    ).toBeTruthy();
    const p = JSON.parse(localStorage.getItem("pedidos"));
    expect(p.length).toBe(1);
    expect(p[0].direccion).toBe("Calle 123");
    expect(p[0].total).toBe(14990);
    expect(JSON.parse(localStorage.getItem("productos"))[0].stock).toBe(2);
    expect(JSON.parse(localStorage.getItem("carrito"))).toEqual([]);
    expect(JSON.stringify(p)).not.toContain("4242424242424242");
    expect(p[0].cvv).toBeUndefined();
  });
  it("CK05 rechazo conserva carrito stock y pedidos", () => {
    renderTienda(<Payment />);
    entrega();
    tarjeta("4000 0000 0000 0002");
    fireEvent.click(screen.getByRole("button", { name: /Confirmar y pagar/ }));
    expect(
      screen.getByRole("heading", { name: "Pago rechazado" }),
    ).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("carrito"))).toEqual([
      { id: 90, cantidad: 1 },
    ]);
    expect(JSON.parse(localStorage.getItem("productos"))[0].stock).toBe(3);
    expect(JSON.parse(localStorage.getItem("pedidos"))).toEqual([]);
  });
  it("CK06 reintento aprobado crea un único pedido", () => {
    renderTienda(<Payment />);
    entrega();
    tarjeta("4000 0000 0000 0002");
    fireEvent.click(screen.getByRole("button", { name: /Confirmar y pagar/ }));
    fireEvent.click(screen.getByRole("button", { name: /Cambiar tarjeta/ }));
    tarjeta();
    fireEvent.click(screen.getByRole("button", { name: /Confirmar y pagar/ }));
    expect(JSON.parse(localStorage.getItem("pedidos")).length).toBe(1);
    expect(JSON.parse(localStorage.getItem("pedidos"))[0].costoEnvio).toBe(0);
  });
  it("CK07 tarjeta no autorizada bloquea revisión", () => {
    renderTienda(<Payment />);
    entrega();
    campo("Número de tarjeta de prueba", "1111 1111 1111 1111");
    campo("Titular de prueba", "DEMO");
    campo("Vencimiento MM/AA", "12/30");
    campo("CVV de prueba", "123");
    fireEvent.click(screen.getByRole("button", { name: /Revisar pedido/ }));
    expect(screen.getByRole("alert").textContent).toContain("dos tarjetas");
  });
  it("CK08 volver entre pasos conserva los datos de entrega", () => {
    renderTienda(<Payment />);
    entrega(true);
    fireEvent.click(screen.getByRole("button", { name: "Volver a entrega" }));
    expect(screen.getByLabelText("Calle, número y departamento").value).toBe(
      "Calle 123",
    );
  });
});
