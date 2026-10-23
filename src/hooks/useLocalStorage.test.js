import { describe, it, expect } from "vitest";
import {
  leerJSON,
  guardarJSON,
  leerConVersion,
  guardarConVersion,
} from "./useLocalStorage.js";

describe("useLocalStorage", () => {
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
});
