import path from "node:path";
import { spawn } from "node:child_process";
import { root, backend, maven, javaEnvironment } from "./java-tools.mjs";
const owned = [];
const apiUrl = "http://127.0.0.1:8080/api/health",
  webUrl = "http://127.0.0.1:5173";
const healthy = async (url) => {
  try {
    return (await fetch(url, { signal: AbortSignal.timeout(1500) })).ok;
  } catch {
    return false;
  }
};
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  for (const child of owned) {
    if (process.platform === "win32")
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
      });
    else child.kill("SIGTERM");
  }
}
process.on("SIGINT", () => {
  stop();
  process.exitCode = 0;
});
process.on("SIGTERM", stop);
process.on("exit", stop);
function start(command, args, options) {
  const child = spawn(command, args, { stdio: "inherit", ...options });
  owned.push(child);
  child.on("error", (e) => {
    console.error(e.message);
    stop();
    process.exitCode = 1;
  });
  return child;
}
try {
  if (!(await healthy(apiUrl))) {
    await maven(["clean", "package", "-DskipTests"]);
    const env = await javaEnvironment();
    start(
      path.join(
        env.JAVA_HOME,
        "bin",
        process.platform === "win32" ? "java.exe" : "java",
      ),
      ["-jar", "target/mitienda-api-0.0.1-SNAPSHOT.jar"],
      { cwd: backend, env },
    );
    const deadline = Date.now() + 90000;
    while (!(await healthy(apiUrl))) {
      if (Date.now() > deadline)
        throw new Error(
          "El backend no inició. Revisa los mensajes anteriores y que el puerto 8080 esté libre.",
        );
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  if (!(await healthy(webUrl)))
    start(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "--host",
        "127.0.0.1",
        "--port",
        "5173",
        "--strictPort",
      ],
      { cwd: root },
    );
  console.log(
    `\nMiTienda: ${webUrl}\nSwagger: http://127.0.0.1:8080/swagger-ui.html\nMantén esta ventana abierta. Ctrl+C detiene los procesos iniciados aquí.\n`,
  );
  if (process.argv.includes("--open")) {
    if (process.platform === "win32")
      spawn("cmd.exe", ["/d", "/c", "start", "", webUrl], {
        windowsHide: true,
        stdio: "ignore",
      });
    else
      spawn(process.platform === "darwin" ? "open" : "xdg-open", [webUrl], {
        stdio: "ignore",
      });
  }
} catch (error) {
  console.error(error.message);
  stop();
  process.exitCode = 1;
}
