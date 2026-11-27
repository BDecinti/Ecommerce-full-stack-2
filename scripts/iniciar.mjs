// =====================================================================
// scripts/iniciar.mjs  ->  EL "DIRECTOR DE ORQUESTA" DEL ARRANQUE
// Se ejecuta con Node.js (NO en el navegador) cuando corres "npm run dev:full".
// Su trabajo, en orden:
//   1) Si el backend (Java, puerto 8080) no esta vivo: compilarlo y encenderlo.
//   2) Esperar a que responda /api/health.
//   3) Si el frontend (Vite, puerto 5173) no esta vivo: encenderlo.
//   4) Abrir el navegador (si se pidio con --open).
// Ctrl+C en la ventana apaga los procesos que este script encendio.
// =====================================================================

// "path" ayuda a armar rutas de archivos. "spawn" sirve para lanzar otros programas.
import path from "node:path";
import { spawn } from "node:child_process";
// Funciones y rutas de java-tools.mjs: "root" = carpeta del proyecto, "backend" = carpeta backend/,
// "maven" = ejecuta Maven (compila Java), "javaEnvironment" = busca un Java 21 o superior.
import { root, backend, maven, javaEnvironment } from "./java-tools.mjs";
// Lista de los programas que ESTE script encendio (para apagarlos despues).
const owned = [];
// Direcciones a vigilar. 127.0.0.1 = "este mismo computador".
// /api/health es un endpoint del backend que solo responde {"status":"UP"}: sirve para preguntar "estas vivo?".
const apiUrl = "http://127.0.0.1:8080/api/health",
  webUrl = "http://127.0.0.1:5173";
// healthy(url): hace una peticion a la URL (maximo 1,5 segundos).
// Devuelve true si respondio bien, false si no respondio (programa apagado o con error).
// Es como tocar la puerta para ver si hay alguien.
const healthy = async (url) => {
  try {
    return (await fetch(url, { signal: AbortSignal.timeout(1500) })).ok;
  } catch {
    return false;
  }
};
// Bandera para no intentar apagar todo dos veces.
let stopping = false;
// stop(): apaga todos los programas que encendimos.
// En Windows usa "taskkill" (/T = tambien sus procesos hijos, /F = a la fuerza); en otros sistemas, SIGTERM.
// Asi no quedan servidores "zombis" ocupando los puertos 8080 y 5173.
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
// Cuando presionas Ctrl+C (SIGINT) o el proceso termina, se llama a stop().
process.on("SIGINT", () => {
  stop();
  process.exitCode = 0;
});
process.on("SIGTERM", stop);
process.on("exit", stop);
// start(): lanza un programa y lo anota en "owned".
// stdio: "inherit" hace que sus mensajes salgan en esta misma ventana.
// Si no se puede lanzar (error), muestra el mensaje y apaga todo.
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
// BLOQUE PRINCIPAL. Si algo lanza un error, el "catch" del final lo muestra y apaga todo.
try {
  // PASO 1: el backend (la "cocina"). Solo se enciende si /api/health NO responde,
  // asi puedes reutilizar un backend que ya tengas corriendo.
  if (!(await healthy(apiUrl))) {
    // Compila el codigo Java y lo empaqueta en backend/target/mitienda-api-0.0.1-SNAPSHOT.jar.
    // -DskipTests = sin correr las pruebas (para partir mas rapido).
    await maven(["clean", "package", "-DskipTests"]);
    // Busca un Java 21+ (si no hay en Windows, descarga uno portatil).
    const env = await javaEnvironment();
    // Ejecuta "java -jar ...jar" dentro de backend/. AQUI ARRANCA SPRING BOOT (clase MiTiendaApplication).
    // Ejecuta node con node_modules/vite/bin/vite.js, que es el programa de Vite.
    start(
      path.join(
        env.JAVA_HOME,
        "bin",
        process.platform === "win32" ? "java.exe" : "java",
      ),
      ["-jar", "target/mitienda-api-0.0.1-SNAPSHOT.jar"],
      { cwd: backend, env },
    );
    // Espera hasta 90 segundos, preguntando cada 0,8 s si el backend ya responde.
    // Si no responde a tiempo, lanza el error (por ejemplo, si el puerto 8080 esta ocupado).
    const deadline = Date.now() + 90000;
    while (!(await healthy(apiUrl))) {
      if (Date.now() > deadline)
        throw new Error(
          "El backend no inició. Revisa los mensajes anteriores y que el puerto 8080 esté libre.",
        );
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  // PASO 2: el frontend (el "comedor"). Se enciende Vite en el puerto 5173.
  // --host 127.0.0.1: solo accesible desde tu computador. --strictPort: si el 5173 esta ocupado, falla
  // en vez de elegir otro puerto (la tienda y el backend esperan exactamente el 5173).
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
  // Muestra en la ventana las direcciones de la tienda y de Swagger (documentacion de la API).
  console.log(
    `\nMiTienda: ${webUrl}\nSwagger: http://127.0.0.1:8080/swagger-ui.html\nMantén esta ventana abierta. Ctrl+C detiene los procesos iniciados aquí.\n`,
  );
  // PASO 3: abrir el navegador, solo si se ejecuto con --open (lo manda INICIAR_TIENDA.cmd).
  // Windows: "start"; Mac: "open"; Linux: "xdg-open". Abre http://127.0.0.1:5173.
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
// Si algo fallo: muestra el mensaje, apaga lo que se encendio y marca la salida con error.
} catch (error) {
  console.error(error.message);
  stop();
  process.exitCode = 1;
}
