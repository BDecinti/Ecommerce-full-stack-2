import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderTienda } from "../test/render.jsx";
import Breadcrumb from "./Breadcrumb.jsx";

describe("Breadcrumb", () => {
  it("CP01 enlaza los antecesores y marca la página actual", () => {
    renderTienda(
      <Breadcrumb
        items={[
          { texto: "Inicio", to: "/" },
          { texto: "Mouse", to: "/products/90" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByText("Mouse")).toHaveAttribute("aria-current", "page");
    expect(
      screen.queryByRole("link", { name: "Mouse" }),
    ).not.toBeInTheDocument();
  });
});
