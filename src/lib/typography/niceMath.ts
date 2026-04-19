const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/**
 * Replace ASCII spellings of π used in generated math (e.g. `2pi`, `1500pi`, `(4/3)pir³`)
 * with the Unicode Greek letter. Does not match English words like "spin" (no `\bpi\b` alone).
 */
export function normalizeAsciiPiToSymbol(s: string): string {
	let t = s;
	t = t.replace(/(\d+)pi\b/gi, "$1π");
	t = t.replace(/\)\s*pi(?=[a-z])/gi, ")π");
	t = t.replace(/\bpi\b/g, "π");
	return t;
}

function toSuperscriptDigits(exp: string): string {
	return [...exp]
		.map((ch) => {
			const d = ch.charCodeAt(0) - 48;
			return d >= 0 && d <= 9 ? SUP[d]! : ch;
		})
		.join("");
}

/**
 * Prettier math typography for UI: sqrt → √, caret powers → superscripts, km², standalone pi → π.
 * Safe to run multiple times on the same string.
 */
export function formatNiceMath(input: string | undefined | null): string {
	if (input == null || input === "") return input ?? "";
	let s = input;
	s = normalizeAsciiPiToSymbol(s);
	s = s.replace(/\bkm\^2\b/gi, "km²");
	s = s.replace(/\bper km\^2\b/gi, "per km²");
	s = s.replace(/\bsqrt\s*\(/gi, "√(");
	s = s.replace(/\b(sin|cos|tan|sec|csc|cot)\^(\d+)/g, (_, fn: string, exp: string) => `${fn}${toSuperscriptDigits(exp)}`);
	s = s.replace(/([a-zA-Z)])\^(\d+)/g, (_, base: string, exp: string) => `${base}${toSuperscriptDigits(exp)}`);
	return s;
}
