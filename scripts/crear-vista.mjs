import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const images = new Map();
const types = { ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png" };
for (const name of await fs.readdir(path.join(root, "public/img"))) {
  const mime = types[path.extname(name)];
  if (!mime) continue;
  const data = await fs.readFile(path.join(root, "public/img", name));
  images.set("img/" + name, "data:" + mime + ";base64," + data.toString("base64"));
}
const result = await build({
  absWorkingDir: root,
  entryPoints: ["src/main.jsx"],
  bundle: true,
  write: false,
  platform: "browser",
  format: "iife",
  jsx: "automatic",
  minify: true,
  legalComments: "inline",
  define: { "process.env.NODE_ENV": '"production"', "import.meta.env": '{"BASE_URL":""}' },
  plugins: [{
    name: "vista-portatil",
    setup(builder) {
      builder.onLoad({ filter: /\.(jsx?|css)$/ }, async args => {
        if (!args.path.startsWith(path.join(root, "src") + path.sep)) return;
        let source = await fs.readFile(args.path, "utf8");
        if (args.path.endsWith(".css")) {
          source = source.replace(/@import\s+url\([^;]+;\s*/g, "");
          return { contents: "const style=document.createElement('style');style.textContent=" + JSON.stringify(source) + ";document.head.append(style);", loader: "js" };
        }
        // La copia portátil usa rutas con # y fotografías embebidas para abrirse sin servidor.
        if (args.path === path.join(root, "src/main.jsx")) source = source.replaceAll("BrowserRouter", "HashRouter");
        source = source.replace(/(["'])\/?(img\/[^"'\s]+)\1/g, (match, quote, imagePath) => images.has(imagePath) ? JSON.stringify(images.get(imagePath)) : match);
        // El enlace de salto no debe modificar las rutas con # de esta copia.
        source = source.replace('href="#contenido"', 'href="#contenido" onClick={e => { e.preventDefault(); document.getElementById("contenido")?.scrollIntoView(); }}');
        return { contents: source, loader: args.path.endsWith(".jsx") ? "jsx" : "js" };
      });
    }
  }]
});
const code = result.outputFiles[0].text.replaceAll("</script", "<\\/script");
const html = '<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0d1014"><title>MiTienda</title></head><body><div id="root"></div><script>' + code + '</script></body></html>\n';
await fs.writeFile(path.join(root, "VER_TIENDA.html"), html);
console.log("VER_TIENDA.html listo (" + (Buffer.byteLength(html) / 1024 / 1024).toFixed(2) + " MB).");
