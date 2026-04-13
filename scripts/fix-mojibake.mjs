import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "src");

/** UTF-8 text that was mis-decoded; map to intended characters (longest first where relevant). */
const pairs = [
  ["ΓÇö", "\u2014"], // em dash
  ["ΓÇô", "\u2013"], // en dash
  ["ΓÇÖ", "\u2019"], // right single quote
  ["ΓÇª", "\u2026"], // ellipsis
  ["ΓÇó", "\u2022"], // bullet
  ["ΓåÆ", "\u2192"], // →
  ["ΓåÉ", "\u2190"], // ←
  ["ΓÇ▓", "\u2032"], // prime
  ["ΓÇ£", "\u201c"], // "
  ["ΓÇ¥", "\u201d"], // "
  ["┬╖", "\u00b7"], // middle dot
  ["ΓêÆ", "\u2212"], // minus sign
  ["╬╝", "\u03bc"], // μ
  ["╧Ç", "\u03c0"], // π
  ["Γê¥", "\u221d"], // ∝
  ["┬▓", "\u00b2"], // ²
  ["Γü║", "\u207a"], // ⁺
  ["Γü╗", "\u207b"], // ⁻
  ["Γü╷", "\u2077"], // ⁷
  ["Γü╖", "\u2077"], // ⁷ (alternate mojibake for superscript 7)
  ["ΓéÇ", "\u2080"], // ₀
  ["╧â", "\u03c3"], // σ
  ["ΓçÆ", "\u2192"], // →
  ["╬ÿ", "\u0398"], // Θ
  ["┬╜", "\u00bd"], // ½
  ["├ù", "\u00d7"], // ×
  ["┬░", "\u00b0"], // °
];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(tsx|ts|css|md)$/.test(ent.name)) {
      let s = fs.readFileSync(p, "utf8");
      const orig = s;
      for (const [bad, good] of pairs) {
        if (s.includes(bad)) s = s.split(bad).join(good);
      }
      if (s !== orig) {
        fs.writeFileSync(p, s, "utf8");
        console.log("fixed", path.relative(path.join(__dirname, ".."), p));
      }
    }
  }
}

walk(root);
