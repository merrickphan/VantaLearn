const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

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
	s = s.replace(/\bkm\^2\b/gi, "km²");
	s = s.replace(/\bper km\^2\b/gi, "per km²");
	s = s.replace(/\bsqrt\s*\(/gi, "√(");
	s = s.replace(/\bpi\b/g, "π");
	s = s.replace(/\b(sin|cos|tan|sec|csc|cot)\^(\d+)/g, (_, fn: string, exp: string) => `${fn}${toSuperscriptDigits(exp)}`);
	s = s.replace(/([a-zA-Z)])\^(\d+)/g, (_, base: string, exp: string) => `${base}${toSuperscriptDigits(exp)}`);
	return s;
}
