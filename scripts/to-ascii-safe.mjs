/**
 * Replace common Unicode punctuation/symbols with ASCII equivalents.
 * Avoids "->" and "<-" so JSX text nodes stay valid.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "src");

function asciiFold(s) {
  let t = s;
  t = t.replace(/\u2192/g, " (next)"); // ->
  t = t.replace(/\u2190/g, "Back: "); // <-
  t = t.replace(/\u2014/g, " - "); // em dash
  t = t.replace(/\u2013/g, "-"); // en dash
  t = t.replace(/\u2022/g, "*"); // bullet
  t = t.replace(/\u00b7/g, " | "); // middle dot
  t = t.replace(/\u2026/g, "..."); // ellipsis
  t = t.replace(/\u2018/g, "'");
  t = t.replace(/\u2019/g, "'");
  // Use ASCII single quotes so nested quotations stay valid inside "double-quoted" JS/TS strings.
  t = t.replace(/\u201c/g, "'");
  t = t.replace(/\u201d/g, "'");
  t = t.replace(/\u2032/g, "'");
  t = t.replace(/\u2212/g, "-");
  t = t.replace(/\u00d7/g, "x");
  t = t.replace(/\u00b0/g, " deg ");
  t = t.replace(/\u03c0/g, "pi");
  t = t.replace(/\u03bc/g, "mu");
  t = t.replace(/\u03c3/g, "sigma");
  t = t.replace(/\u0398/g, "Theta");
  t = t.replace(/\u221d/g, "~");
  t = t.replace(/\u00b2/g, "^2");
  t = t.replace(/\u00b3/g, "^3");
  t = t.replace(/\u207a/g, "^+");
  t = t.replace(/\u207b/g, "^-");
  t = t.replace(/\u2077/g, "^7");
  t = t.replace(/\u2080/g, "_0");
  t = t.replace(/\u2082/g, "_2");
  t = t.replace(/\u00bd/g, "1/2");
  t = t.replace(/\u2713/g, "OK");
  t = t.replace(/\u2717/g, "X");
  t = t.replace(/\u21bb/g, "again");
  t = t.replace(/[\u{1F300}-\u{1FAFF}]/gu, "");
  t = t.replace(/[\u2600-\u26FF]/g, "");
  t = t.replace(/  +/g, " ");
  return t;
}

function walk(dir, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(ent.name)) out.push(p);
  }
}

const files = [];
walk(root, files);
let n = 0;
for (const p of files) {
  const o = fs.readFileSync(p, "utf8");
  const x = asciiFold(o);
  if (x !== o) {
    fs.writeFileSync(p, x, "utf8");
    n++;
    console.log(path.relative(path.join(__dirname, ".."), p));
  }
}
console.log(`Updated ${n} files.`);
