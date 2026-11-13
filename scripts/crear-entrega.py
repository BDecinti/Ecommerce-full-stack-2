"""Empaqueta las fuentes y documentos sin datos privados ni dependencias descargadas."""
from pathlib import Path
import os
import sys
import zipfile

root = Path(__file__).resolve().parents[1]
output = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else root.parent / "MiTienda_para_compartir.zip"
excluded = {".git", "node_modules", ".devtools", ".qa", "reports", "coverage", "dist", "__pycache__"}
files = []
for current, dirs, names in os.walk(root):
    relative = Path(current).relative_to(root)
    dirs[:] = [d for d in dirs if d not in excluded and not (relative == Path("backend") and d in {"target", "data"})]
    for name in names:
        path = Path(current) / name
        if name == ".env" or (name.startswith(".env.") and name != ".env.example") or path.suffix.lower() in {".zip", ".log", ".pyc"} or name.startswith("~$"):
            continue
        files.append(path)
with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=7) as archive:
    for path in sorted(files):
        archive.write(path, Path("MiTienda") / path.relative_to(root))
with zipfile.ZipFile(output) as archive:
    if archive.testzip() is not None:
        raise RuntimeError("El ZIP no superó la verificación de integridad.")
print(f"{output.name}: {len(files)} archivos, {output.stat().st_size / 1024 / 1024:.2f} MB")
