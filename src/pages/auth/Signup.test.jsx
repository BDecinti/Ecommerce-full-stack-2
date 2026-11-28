import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderTienda, sembrar } from "../../test/render.jsx";
import Signup from "./Signup.jsx";

describe("Signup", () => {
  beforeEach(() => sembrar());
  it("UI10 registro público no ofrece rol administrador", async () => {
    await renderTienda(<Signup />);
    expect(screen.queryByLabelText("Tipo de Usuario")).toBeNull();
  });
});
