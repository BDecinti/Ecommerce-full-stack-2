// Configuracion de Vite, el servidor de desarrollo del frontend (puerto 5173).
import { defineConfig } from "vitest/config";
// Plugin que ensena a Vite a entender JSX (el HTML dentro de JavaScript de React).
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Activa el plugin de React.
  plugins: [react()],
  // PROXY ("el mesero"): el navegador pide http://127.0.0.1:5173/api/productos a Vite;
  // Vite ve que empieza con /api y lo reenvia a http://127.0.0.1:8080/api/productos (el backend).
  // Asi el frontend usa rutas cortas (/api/...) y no hay problemas de CORS ni de cookies.
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8080",
      "/v3/api-docs": "http://127.0.0.1:8080",
      "/swagger-ui": "http://127.0.0.1:8080",
    },
  },
  // Lo mismo para "vite preview" (previsualizar la version compilada).
  preview: { proxy: { "/api": "http://127.0.0.1:8080" } },
  // Configuracion de las pruebas del frontend (Vitest); se estudian en el Paso 13.
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
    reporters: ["default", "json"],
    outputFile: { json: "./reports/vitest-results.json" },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "lcov"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/**/*.test.{js,jsx}", "src/test/**"],
    },
  },
});
