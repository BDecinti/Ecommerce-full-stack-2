import { maven, javaEnvironment } from "./java-tools.mjs";
const task = process.argv[2] || "run";
try {
  if (task === "prepare") {
    await javaEnvironment();
    console.log("Java listo. Maven se prepara automáticamente al compilar.");
  } else if (task === "test") await maven(["test"]);
  else if (task === "package") await maven(["clean", "package"]);
  else if (task === "run") await maven(["spring-boot:run"]);
  else throw new Error("Tarea desconocida.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
