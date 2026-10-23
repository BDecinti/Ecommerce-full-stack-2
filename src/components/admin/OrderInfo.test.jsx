import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import OrderInfo from "./OrderInfo.jsx";

describe("OrderInfo", () => {
  const pedido = {
    usuario: "demo@example.com",
    fecha: "2026-10-23T12:00:00Z",
    metodoPago: "Tarjeta demo",
    nombre: "Receptor Demo",
  };
  it("CP28 envío presenta dirección completa y teléfono", () => {
    render(
      <OrderInfo
        pedido={{
          ...pedido,
          tipoEntrega: "envio",
          direccion: "Calle 123",
          comuna: "Santiago",
          region: "Metropolitana",
          telefono: "+56912345678",
        }}
      />,
    );
    expect(
      screen.getByText(/Calle 123, Santiago, Metropolitana/),
    ).toBeInTheDocument();
    expect(screen.getByText(/\+56912345678/)).toBeInTheDocument();
    expect(screen.getByText(/Receptor Demo/)).toBeInTheDocument();
  });
  it("CP29 retiro omite dirección; envío sin teléfono indica su ausencia", () => {
    const { rerender } = render(
      <OrderInfo pedido={{ ...pedido, tipoEntrega: "presencial" }} />,
    );
    expect(screen.getByText(/Retiro en tienda/)).toBeInTheDocument();
    expect(screen.queryByText("Dirección:")).not.toBeInTheDocument();
    rerender(
      <OrderInfo
        pedido={{
          ...pedido,
          tipoEntrega: "envio",
          direccion: "Calle 123",
          comuna: "Santiago",
        }}
      />,
    );
    expect(screen.getByText(/No indicado/)).toBeInTheDocument();
  });
});
