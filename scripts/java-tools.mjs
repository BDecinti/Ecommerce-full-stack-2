import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const backend = path.join(root, "backend");
export function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", ...options });
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`El proceso terminó con código ${code}.`)),
    );
  });
}
export async function javaEnvironment() {
  const portable = path.join(root, ".devtools/java");
  const dirs = await fs.readdir(portable).catch(() => []);
  const candidates = [
    process.env.JAVA_HOME,
    ...dirs.map((name) => path.join(portable, name)),
  ].filter(Boolean);
  for (const home of candidates) {
    const exe = path.join(
      home,
      "bin",
      process.platform === "win32" ? "java.exe" : "java",
    );
    const result = spawnSync(exe, ["-version"], { encoding: "utf8" });
    if (/version "(?:21|2[2-9]|[3-9]\d)\./.test(result.stderr || ""))
      return {
        ...process.env,
        JAVA_HOME: home,
        PATH: path.join(home, "bin") + path.delimiter + process.env.PATH,
      };
  }
  const installed = spawnSync(
    "java",
    ["-XshowSettings:properties", "-version"],
    { encoding: "utf8" },
  );
  const home = /java.home = (.+)/.exec(installed.stderr || "")?.[1]?.trim();
  if (home && /version "(?:21|2[2-9]|[3-9]\d)\./.test(installed.stderr))
    return { ...process.env, JAVA_HOME: home };
  if (process.platform !== "win32")
    throw new Error(
      "Instala un JDK 21 o superior y configura JAVA_HOME. Luego vuelve a ejecutar este comando.",
    );
  if (!["x64", "arm64"].includes(process.arch))
    throw new Error("Instala Java 21 manualmente para esta arquitectura.");
  console.log(
    "Preparando Java 21 portátil desde Eclipse Adoptium. La primera vez necesita Internet…",
  );
  const meta = await fetch(
    `https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=${process.arch === "x64" ? "x64" : "aarch64"}&image_type=jdk&os=windows&vendor=eclipse`,
  ).then((r) => {
    if (!r.ok) throw new Error("No se pudo consultar Java.");
    return r.json();
  });
  const pkg = meta[0]?.binary?.package;
  if (!pkg) throw new Error("No se encontró Java para este equipo.");
  const response = await fetch(pkg.link);
  if (!response.ok) throw new Error("No se pudo descargar Java.");
  const bytes = Buffer.from(await response.arrayBuffer());
  if (createHash("sha256").update(bytes).digest("hex") !== pkg.checksum)
    throw new Error("La descarga de Java no superó la verificación SHA-256.");
  await fs.mkdir(portable, { recursive: true });
  const zip = path.join(root, ".devtools/java21.zip");
  await fs.writeFile(zip, bytes);
  await run(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "Expand-Archive -LiteralPath $env:TIENDA_JAVA_ZIP -DestinationPath $env:TIENDA_JAVA_DIR -Force",
    ],
    {
      env: { ...process.env, TIENDA_JAVA_ZIP: zip, TIENDA_JAVA_DIR: portable },
    },
  );
  await fs.unlink(zip);
  return javaEnvironment();
}
export async function maven(args) {
  const env = await javaEnvironment();
  if (process.platform === "win32")
    await run(
      "cmd.exe",
      ["/d", "/s", "/c", `mvnw.cmd -B -ntp ${args.join(" ")}`],
      { cwd: backend, env },
    );
  else
    await run("sh", ["./mvnw", "-B", "-ntp", ...args], { cwd: backend, env });
}
