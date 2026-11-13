"""Genera los informes Word y Markdown desde plantillas y evidencia ejecutada."""
from pathlib import Path
from datetime import datetime, timezone
import json
import re
import xml.etree.ElementTree as ET
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
EVIDENCE = DOCS / "evidencia/backend"
EVIDENCE.mkdir(parents=True, exist_ok=True)
front = json.loads((ROOT / "reports/vitest-results.json").read_text(encoding="utf-8-sig"))
coverage = json.loads((ROOT / "coverage/coverage-summary.json").read_text(encoding="utf-8-sig"))["total"]
java_cases = []
for file in (ROOT / "backend/target/surefire-reports").glob("TEST-*.xml"):
    for case in ET.parse(file).getroot().findall("testcase"):
        java_cases.append({"clase": case.get("classname"), "nombre": case.get("name"), "estado": "failed" if case.find("failure") is not None or case.find("error") is not None else "skipped" if case.find("skipped") is not None else "passed"})
jacoco = ET.parse(ROOT / "backend/target/site/jacoco/jacoco.xml").getroot()
back_coverage = {}
for counter in jacoco.findall("counter"):
    hit, missed = int(counter.get("covered")), int(counter.get("missed"))
    back_coverage[counter.get("type")] = {"covered": hit, "missed": missed, "pct": round(100 * hit / (hit + missed), 2) if hit + missed else 100}
browser = json.loads((ROOT / "reports/backend-browser.json").read_text(encoding="utf-8"))
front_cases = []
for suite in front["testResults"]:
    relative = Path(suite["name"]).relative_to(ROOT).as_posix()
    front_cases.extend({"archivo": relative, "nombre": case["fullName"], "estado": case["status"]} for case in suite["assertionResults"])
summary = {"fecha": datetime.now(timezone.utc).isoformat(), "frontend": {"pruebas": front["numTotalTests"], "aprobadas": front["numPassedTests"], "fallidas": front["numFailedTests"], "archivos": len(front["testResults"]), "cobertura": coverage}, "backend": {"pruebas": len(java_cases), "aprobadas": sum(c["estado"] == "passed" for c in java_cases), "cobertura": back_coverage}, "navegador": browser}
for filename, value in [("resumen.json", summary), ("frontend-pruebas.json", front_cases), ("backend-pruebas.json", java_cases), ("navegador.json", browser)]:
    (EVIDENCE / filename).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")
values = {"FRONT_TESTS": str(front["numTotalTests"]), "FRONT_FILES": str(len(front["testResults"])), "BACK_TESTS": str(len(java_cases)), "FRONT_RESULT": "Todas aprobadas" if front["success"] else "Hay fallos", "BACK_RESULT": "Todas aprobadas" if all(c["estado"] == "passed" for c in java_cases) else "Hay fallos", "BROWSER_TESTS": str(len(browser["pruebas"])), "BROWSER_RESULT": "Todos aprobados" if all(c["estado"] == "passed" for c in browser["pruebas"]) else "Hay fallos"}
for key, metric in [("FRONT_STATEMENTS", "statements"), ("FRONT_LINES", "lines"), ("FRONT_BRANCHES", "branches"), ("FRONT_FUNCTIONS", "functions")]:
    values[key] = f'{coverage[metric]["pct"]:.2f} %'
for key, metric in [("BACK_LINES", "LINE"), ("BACK_BRANCHES", "BRANCH"), ("BACK_INSTRUCTIONS", "INSTRUCTION")]:
    values[key] = f'{back_coverage[metric]["pct"]:.2f} %'

def shade(cell, fill):
    element = OxmlElement("w:shd"); element.set(qn("w:fill"), fill); cell._tc.get_or_add_tcPr().append(element)

def add_table(doc, lines):
    rows = [[s.strip() for s in line.strip().strip("|").split("|")] for line in lines]
    rows = [r for r in rows if not all(re.fullmatch(r":?-+:?", c) for c in r)]
    count = len(rows[0]); widths = {2: [1.8, 4.9], 3: [1.6, 2.8, 2.3], 4: [3.1, 1.2, 1.2, 1.2]}.get(count, [6.7/count]*count)
    table = doc.add_table(rows=0, cols=count); table.autofit = False; table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for col, width in zip(table.columns, widths): col.width = Inches(width)
    for i, row in enumerate(rows):
        cells = table.add_row().cells
        for cell, value, width in zip(cells, row, widths):
            cell.width = Inches(width); cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            paragraph = cell.paragraphs[0]; paragraph.paragraph_format.space_before = Pt(4); paragraph.paragraph_format.space_after = Pt(4)
            run = paragraph.add_run(value); run.font.size = Pt(9.5)
            if i == 0: shade(cell, "17212D"); run.bold = True; run.font.color.rgb = RGBColor.from_string("FFFFFF")
            elif i % 2: shade(cell, "F1F4F6")
            margins = OxmlElement("w:tcMar")
            for side in ["left", "right"]:
                tag = OxmlElement("w:"+side); tag.set(qn("w:w"), "100"); tag.set(qn("w:type"), "dxa"); margins.append(tag)
            cell._tc.get_or_add_tcPr().append(margins)
        props = table.rows[-1]._tr.get_or_add_trPr(); props.append(OxmlElement("w:cantSplit"))
        if i == 0: props.append(OxmlElement("w:tblHeader"))
    doc.add_paragraph().paragraph_format.space_after = Pt(1)

def make_document(name, text):
    doc = Document(); section = doc.sections[0]
    section.page_width = Inches(8.5); section.page_height = Inches(11)
    section.top_margin = section.bottom_margin = Inches(.72)
    section.left_margin = section.right_margin = Inches(.9)
    section.header_distance = section.footer_distance = Inches(.3)
    doc.settings.odd_and_even_pages_header_footer = False
    section.different_first_page_header_footer = False
    for element in doc.styles.element.iter(qn("w:pBdr")):
        element.getparent().remove(element)
    for style_name in ["Normal", "Title", "Subtitle", "Heading 1", "Heading 2"]:
        style = doc.styles[style_name]; style.font.name = "Calibri"
        style.font.color.rgb = RGBColor.from_string("17212D")
        style.paragraph_format.space_after = Pt(6)
    normal = doc.styles["Normal"]; normal.font.size = Pt(11); normal.paragraph_format.line_spacing = 1.08
    doc.styles["Title"].font.size = Pt(26); doc.styles["Title"].font.bold = True
    for level, size in [(1, 15), (2, 12)]:
        style = doc.styles[f"Heading {level}"]; style.font.size = Pt(size); style.font.bold = True
        style.paragraph_format.space_before = Pt(11); style.paragraph_format.keep_with_next = True
    if name == "Propuesta_pruebas_Vitest":
        normal.paragraph_format.space_after = Pt(5)
        normal.paragraph_format.line_spacing = 1.04
    if name == "ERS_v3":
        normal.paragraph_format.space_after = Pt(5)
        doc.styles["Heading 2"].paragraph_format.space_before = Pt(8)
        doc.styles["Heading 2"].paragraph_format.space_after = Pt(5)
    header = section.header.paragraphs[0]; run = header.add_run("MITIENDA  /  FULL STACK II"); run.font.size = Pt(9); run.font.bold = True; run.font.color.rgb = RGBColor.from_string("617719")
    footer = section.footer.paragraphs[0]; footer.alignment = 2
    footer.add_run("MiTienda · Noviembre de 2026   |   ").font.size = Pt(9)
    field = OxmlElement("w:fldSimple"); field.set(qn("w:instr"), "PAGE"); footer._p.append(field)
    lines = text.splitlines(); i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line: i += 1; continue
        if line.startswith("|"):
            block = []
            while i < len(lines) and lines[i].strip().startswith("|"): block.append(lines[i]); i += 1
            add_table(doc, block); continue
        if line.startswith("# "):
            title = doc.add_paragraph(line[2:], "Title")
            borders = OxmlElement("w:pBdr"); bottom = OxmlElement("w:bottom")
            for key, value in {"val":"single", "sz":"10", "space":"8", "color":"92B831"}.items(): bottom.set(qn("w:"+key),value)
            borders.append(bottom); title._p.get_or_add_pPr().append(borders)
        elif line.startswith("### "): doc.add_paragraph(line[4:], "Heading 2")
        elif line.startswith("## "): doc.add_paragraph(line[3:], "Heading 1")
        else: doc.add_paragraph(line)
        i += 1
    doc.core_properties.title = lines[0].lstrip("# ")
    doc.core_properties.subject = "MiTienda Full Stack II"
    doc.core_properties.author = "Equipo MiTienda"; doc.core_properties.last_modified_by = "Equipo MiTienda"
    doc.core_properties.keywords = "MiTienda, Spring Boot, React, JWT, Vitest"
    doc.save(DOCS / f"{name}.docx")

for name in ["ERS_v3", "Backend_y_seguridad", "Cobertura_testing", "Propuesta_pruebas_Vitest"]:
    text = (ROOT / "scripts/documentos" / f"{name}.md").read_text(encoding="utf-8")
    for key, value in values.items(): text = text.replace("{{" + key + "}}", value)
    (DOCS / f"{name}.md").write_text(text, encoding="utf-8")
    make_document(name, text)
print(json.dumps({"frontend": values["FRONT_TESTS"], "backend": values["BACK_TESTS"], "documentos": 4, "cobertura_frontend": values["FRONT_LINES"], "cobertura_backend": values["BACK_LINES"]}, ensure_ascii=False))
