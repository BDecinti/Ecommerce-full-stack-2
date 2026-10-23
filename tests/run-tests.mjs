import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { registerHooks } from "node:module";
import { transformSync } from "esbuild";
import Jasmine from "jasmine";
// Transforma cada JSX por separado: V8 mide los archivos originales, no un bundle agregado.
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".css"))
      return {
        format: "module",
        source: "export default {};",
        shortCircuit: true,
      };
    if (url.endsWith(".jsx")) {
      const filename = fileURLToPath(url);
      const { code } = transformSync(readFileSync(filename, "utf8"), {
        loader: "jsx",
        jsx: "automatic",
        format: "esm",
        sourcemap: "inline",
        sourcefile: filename,
      });
      return { format: "module", source: code, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
const runner = new Jasmine();
runner.loadConfig({
  spec_dir: ".",
  spec_files: ["tests/specs/index.jsx"],
  helpers: ["tests/helpers/dom.cjs"],
});
runner.env.configure({ random: false });
const resultados = [];
runner.addReporter({
  specDone(r) {
    resultados.push({
      id: r.fullName.match(/(?:UT|UI|CK)\d+/)?.[0] || r.fullName,
      nombre: r.fullName,
      estado: r.status,
      errores: r.failedExpectations.map((e) => e.message),
    });
  },
  async jasmineDone(r) {
    await fs.mkdir("reports", { recursive: true });
    await fs.writeFile(
      "reports/jasmine-results.json",
      JSON.stringify(
        {
          fecha: new Date().toISOString(),
          resultado: r.overallStatus,
          total: resultados.length,
          aprobadas: resultados.filter((s) => s.estado === "passed").length,
          fallidas: resultados.filter((s) => s.estado === "failed").length,
          pruebas: resultados,
        },
        null,
        2,
      ),
    );
  },
});
await runner.execute();
