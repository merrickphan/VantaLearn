/**
 * Upgrades plain-text / ASCII math strings to KaTeX-friendly inline math so
 * √(3), fractions, ∑, lim, etc. render as symbols (not typed "sqrt" or "sigma").
 * Mixed English + math is split so prose uses \\text{...} (spaces preserved) and
 * formulas stay in math mode — avoids "ThevalueofF'(5)is" squishing.
 * Strings that already contain `\\(` / `\\[` are returned unchanged.
 */

const HAS_DELIM = /\\\(|\\\[|\$\$/;

function escapeLatexTextMode(s: string): string {
	return s
		.replace(/\\/g, "\\textbackslash ")
		.replace(/#/g, "\\#")
		.replace(/%/g, "\\%")
		.replace(/&/g, "\\&")
		.replace(/~/g, "\\textasciitilde ");
}

/** Insert spaces so glued prose (dt.Thevalueof, )is) can be split for \\text grouping. */
function insertLiterateSeparators(s: string): string {
	let t = s.trim();
	t = t.replace(/\)([A-Za-z])/g, ") $1");
	t = t.replace(/([.?!])([A-Za-z])/g, "$1 $2");
	t = t.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
	t = t.replace(/([a-zA-Z])(')(\()/g, "$1$2 $3");
	t = t.replace(/([a-zA-Z])(\()/g, "$1 $2");
	return t.replace(/\s+/g, " ").trim();
}

function replaceAsciiSqrt(s: string): string {
	return s.replace(/sqrt\s*\(\s*([^()]+)\s*\)/gi, (_m, inner: string) => {
		return `\\sqrt{${String(inner).trim()}}`;
	});
}

function replaceUnicodeSqrt(s: string): string {
	let t = s.replace(/\u221a\s*\(\s*([^()]+)\s*\)/g, (_m, inner: string) => `\\sqrt{${String(inner).trim()}}`);
	t = t.replace(/\u221a\s*([0-9]+(?:\.[0-9]+)?)/g, (_m, n: string) => `\\sqrt{${n}}`);
	return t;
}

function replaceDyDx(s: string): string {
	return s.replace(/\bdy\s*\/\s*dx\b/gi, "\\frac{dy}{dx}");
}

function replaceSimpleNumericFractions(s: string): string {
	let prev = "";
	let t = s;
	let guard = 0;
	while (t !== prev && guard < 12) {
		prev = t;
		t = t.replace(/\b(\d+)\s*\/\s*(\d+)\b/g, "\\frac{$1}{$2}");
		guard++;
	}
	return t;
}

function replaceCarets(s: string): string {
	return s.replace(/\^(\d+)/g, "^{$1}");
}

function replaceGreekAndSymbols(s: string): string {
	let t = s;
	t = t.replace(/\u221e/g, "\\infty");
	t = t.replace(/\u03c0/g, "\\pi");
	t = t.replace(/\u03a3|\u2211/g, "\\sum");
	t = t.replace(/\u03c6/g, "\\varphi");
	t = t.replace(/\u03b8/g, "\\theta");
	return t;
}

function replaceLimKeyword(s: string): string {
	return s.replace(/\blim\b/gi, "\\lim");
}

function replaceSigmaWord(s: string): string {
	return s.replace(/\bSigma\b/g, "\\sum").replace(/\bsigma\b(?=\s*[\[_(=])/g, "\\sum");
}

/** All symbol upgrades used for both whole-string and per-token paths. */
function applyExamMathTransforms(s: string): string {
	let t = s.trim();
	t = replaceUnicodeSqrt(t);
	t = replaceAsciiSqrt(t);
	t = replaceDyDx(t);
	t = replaceGreekAndSymbols(t);
	t = replaceSigmaWord(t);
	t = replaceLimKeyword(t);
	t = replaceSimpleNumericFractions(t);
	t = replaceCarets(t);
	t = t.replace(/→/g, "\\to ");
	t = t.replace(/\binfty\b/gi, "\\infty");
	t = t.replace(/\bpi\b/g, "\\pi");
	t = t.replace(/\\lim\s*\(\s*([a-zA-Z])\s*\\to\s*\\infty\s*\)/gi, "\\lim_{$1\\to\\infty}");
	t = t.replace(/\\lim\s+([a-zA-Z])\s*\\to\s*\\infty/gi, "\\lim_{$1\\to\\infty}");
	return t;
}

function wordLooksLikeMathToken(w: string): boolean {
	if (!w) return false;
	if (/[0-9]/.test(w)) return true;
	if (/[+\-*/=<>≤≥≠≈]/.test(w)) return true;
	if (/[()[\]{}]/.test(w)) return true;
	if (/'/.test(w)) return true;
	if (/[_^\\]/.test(w)) return true;
	if (/sqrt|frac|lim|sum|prod|int|sin|cos|tan|sec|csc|cot|ln|log|exp|arcsin|arccos|arctan|pi|theta|infty|sigma|Sigma|∫|∑|π|∞|\u221e|\u03c0|→/.test(w)) return true;
	if (/^d[xy]\/?d[xy]$/i.test(w)) return true;
	if (w.length === 1 && /^[xtnrhkuvcpsm]$/i.test(w)) return true;
	return false;
}

/**
 * Build `\\(\\displaystyle ... \\)` from space-separated tokens: prose → `\\text{}`, math → transformed chunk.
 */
function latexifyByWords(spaced: string): string {
	const words = spaced.split(/\s+/).filter(Boolean);
	const pieces: string[] = [];
	let textBuf: string[] = [];

	const flushText = () => {
		if (textBuf.length === 0) return;
		pieces.push(`\\text{${escapeLatexTextMode(textBuf.join(" "))}}`);
		textBuf = [];
	};

	for (const w of words) {
		if (wordLooksLikeMathToken(w)) {
			flushText();
			pieces.push(applyExamMathTransforms(w));
		} else {
			textBuf.push(w);
		}
	}
	flushText();

	if (pieces.length === 0) {
		return `\\(\\displaystyle \\text{${escapeLatexTextMode(spaced)}}\\)`;
	}
	return `\\(\\displaystyle ${pieces.join("\\,")}\\)`;
}

/**
 * If `s` has no `\\(` / `\\[` delimiters, wrap converted body as one inline KaTeX block.
 */
export function latexifyExamPlainMath(s: string): string {
	const raw = s ?? "";
	if (!raw.trim()) return raw;
	if (HAS_DELIM.test(raw)) return raw;

	const loosened = insertLiterateSeparators(raw);
	const words = loosened.split(/\s+/).filter(Boolean);

	if (words.length >= 2) {
		return latexifyByWords(loosened);
	}

	const single = loosened;
	const t = applyExamMathTransforms(single);

	const looksLikeProseOnly =
		!/[\\$^_{}]/.test(t) && /[A-Za-z]{3,}/.test(t) && !/^\(?[0-9.,\s]+\)?$/.test(t);

	if (looksLikeProseOnly) {
		return `\\(\\displaystyle \\text{${escapeLatexTextMode(t)}}\\)`;
	}

	return `\\(\\displaystyle ${t}\\)`;
}

export function hasLatexDelimiters(s: string | null | undefined): boolean {
	if (s == null || s === "") return false;
	return HAS_DELIM.test(s);
}

/**
 * Stems: use full LaTeX pass only when the line looks math-heavy (avoids wrapping prose in bad TeX).
 */
export function shouldExamMathStem(subject: string | undefined, stem: string): boolean {
	if (!/Calculus|Precalculus/i.test(subject ?? "")) return false;
	const q = stem ?? "";
	if (HAS_DELIM.test(q)) return false;
	return /sqrt|lim|\^|∫|∑|Σ|π|∞|dy\s*\/\s*dx|frac|\\sum|\\int|\d\s*\/\s*\d|\([0-9]+,\s*[0-9]+\)/i.test(q);
}
