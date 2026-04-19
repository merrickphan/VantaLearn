import type { ExamFigure } from "@/types";
import { hashString, mulberry32 } from "./utils";

/** AP-style curriculum alignment exhibit (limits + L'Hôpital / derivative rules framing). */
export function calcCedLimitAlignmentFigure(): ExamFigure {
	return {
		kind: "table",
		title: "Curriculum alignment (AP Calculus)",
		headers: [
			"Learning objectives",
			"Essential knowledge",
			"Mathematical practices for AP Calculus",
		],
		rows: [
			[
				"LO 1.1C: Determine limits of functions.",
				"EK 1.1C3: Limits of indeterminate forms 0/0 and ∞/∞ may be evaluated using L'Hôpital's Rule (and may also be justified with algebra or other theorems).",
				"MPAC 1: Reasoning with definitions and theorems.",
			],
			[
				"LO 2.1C: Calculate derivatives.",
				"EK 2.1C2: Specific rules can be used to calculate derivatives for classes of functions, including polynomial, rational, power, exponential, logarithmic, trigonometric, and inverse trigonometric.",
				"MPAC 3: Implementing algebraic/computational processes.",
			],
		],
	};
}

export type CalcCedLimitSpec = {
	variant: string;
	stem: string;
	correct: string;
	w1: string;
	w2: string;
	w3: string;
	explanation: string;
};

function gcd(a: number, b: number): number {
	let x = Math.abs(a);
	let y = Math.abs(b);
	while (y) {
		const t = y;
		y = x % y;
		x = t;
	}
	return x || 1;
}

/** Rational multiple of 1/π: num/(den·π), simplified (den > 0). */
export function formatPiFraction(num: number, den: number): string {
	const sign = num < 0 ? "-" : "";
	const g = gcd(Math.abs(num), Math.abs(den));
	const nn = Math.abs(num) / g;
	const dd = Math.abs(den) / g;
	if (nn === 0) return "0";
	if (dd === 1) return `${sign}${nn}/π`;
	return `${sign}${nn}/(${dd}π)`;
}

function pickThreeWrongs(rng: () => number, correct: string, pool: string[]): [string, string, string] {
	const filtered = pool.filter((s) => s !== correct);
	if (filtered.length < 3) {
		const pad = ["0", "1", "nonexistent", "2", "-1"].filter((s) => s !== correct && !filtered.includes(s));
		while (filtered.length < 6) filtered.push(pad[filtered.length % pad.length]!);
	}
	shuffleInPlaceLocal(rng, filtered);
	const a = filtered[0]!;
	const b = filtered.find((s) => s !== a) ?? filtered[1]!;
	const c = filtered.find((s) => s !== a && s !== b) ?? filtered[2]!;
	return [a, b, c];
}

function shuffleInPlaceLocal(rng: () => number, arr: string[]): void {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[arr[i], arr[j]] = [arr[j]!, arr[i]!];
	}
}

function wrongRng(seed: string): () => number {
	return mulberry32(hashString(seed));
}

const PI_POOL = [
	"1/(2π)",
	"1/π",
	"2/π",
	"3/(2π)",
	"2/(3π)",
	"-1/(2π)",
	"-1/π",
	"-2/π",
	"-3/(2π)",
	"0",
	"1",
	"-1",
	"π",
	"2π",
	"nonexistent",
];

const RAT_POOL = (n: number) => [`${n + 1}`, `${n - 1}`, `${2 * n}`, `${n * n}`, "0", "1", "nonexistent"];

function buildSpecs(): CalcCedLimitSpec[] {
	const out: CalcCedLimitSpec[] = [];

	/* Family A (CB-style): lim(x→π) (cos x + sin(n x) + 1)/(x² − π²) = n(−1)ⁿ/(2π), n ≥ 2 */
	for (let n = 2; n <= 48; n++) {
		const numer = n * (n % 2 === 0 ? 1 : -1);
		const correct = formatPiFraction(numer, 2);
		const stem = `Evaluate lim(x → π) (cos x + sin(${n}x) + 1)/(x^2 - π^2).`;
		const w = pickThreeWrongs(wrongRng(`ced|A|${n}`), correct, PI_POOL);
		out.push({
			variant: `cos-sin-pi-${n}`,
			stem,
			correct,
			w1: w[0],
			w2: w[1],
			w3: w[2],
			explanation:
				"Direct substitution gives 0/0. Applying L'Hôpital's Rule (or factoring + trig limits), the limit equals n(−1)^n divided by 2π.",
		});
	}

	/* Family B: lim(x→0) sin(k x)/x = k */
	for (let k = 1; k <= 55; k++) {
		const correct = `${k}`;
		const stem = `Find lim(x → 0) (sin(${k}x))/x.`;
		const pool = [
			`${k + 1}`,
			`${k + 2}`,
			`${2 * k + 1}`,
			`${k * k + 2}`,
			`${3 * k + 2}`,
			"0",
			"nonexistent",
		].filter((s, i, a) => a.indexOf(s) === i && s !== correct);
		const w = pickThreeWrongs(wrongRng(`ced|B|${k}`), correct, pool.length >= 3 ? pool : ["0", "1", "nonexistent"]);
		out.push({
			variant: `sin-kx-${k}`,
			stem,
			correct,
			w1: w[0],
			w2: w[1],
			w3: w[2],
			explanation: `Using lim(x → 0) sin(u)/u = 1 with u = ${k}x gives the value ${k}.`,
		});
	}

	/* Family C: lim(x→a) (x^m − a^m)/(x − a) = m a^(m−1), m ∈ {3,4,5} */
	for (let m = 3; m <= 5; m++) {
		for (let a = 2; a <= 18; a++) {
			const lim = m * a ** (m - 1);
			const correct = `${lim}`;
			const stem = `Evaluate lim(x → ${a}) (x^${m} − ${a ** m})/(x − ${a}).`;
			const pool = RAT_POOL(lim).filter((s) => s !== correct);
			const w = pickThreeWrongs(wrongRng(`ced|C|${m}|${a}`), correct, pool.length >= 3 ? pool : ["0", "1", "2"]);
			out.push({
				variant: `poly-a-${m}-${a}`,
				stem,
				correct,
				w1: w[0],
				w2: w[1],
				w3: w[2],
				explanation: `Factor x^${m} − ${a ** m} as (x − ${a})(x^{${m - 1}} + … + ${a ** (m - 1)}), then substitute x = ${a} to obtain ${m}·${a}^{m - 1} = ${lim}.`,
			});
		}
	}

	/* Family D: lim(x→0) (1 − cos(k x))/x^2 = k^2/2 */
	for (let k = 1; k <= 32; k++) {
		const half = k * k;
		const correct = half % 2 === 0 ? `${half / 2}` : `${half}/2`;
		const stem = `Find lim(x → 0) (1 − cos(${k}x))/x^2.`;
		const pool = [
			correct,
			`${k}`,
			`${k * k}`,
			`${2 * k}`,
			"0",
			"1",
			"nonexistent",
			`${half + 1}/2`,
		].filter((s, i, a) => a.indexOf(s) === i && s !== correct);
		const w = pickThreeWrongs(wrongRng(`ced|D|${k}`), correct, pool.length >= 3 ? pool : ["0", "1", "1/2"]);
		out.push({
			variant: `one-cos-${k}`,
			stem,
			correct,
			w1: w[0],
			w2: w[1],
			w3: w[2],
			explanation: `Standard limit: (1 − cos u)/u^2 → 1/2 as u → 0; with u = ${k}x this yields ${k}^2/2.`,
		});
	}

	/* Family E: lim(x→0) (e^{k x} − 1)/x = k */
	for (let k = 1; k <= 38; k++) {
		const correct = `${k}`;
		const stem = `Evaluate lim(x → 0) (e^(${k}x) - 1)/x.`;
		const pool = [
			`${k + 1}`,
			`${k + 2}`,
			`${2 * k + 1}`,
			`${k * k + 1}`,
			"0",
			"nonexistent",
		].filter((s, i, a) => a.indexOf(s) === i && s !== correct);
		const w = pickThreeWrongs(wrongRng(`ced|E|${k}`), correct, pool.length >= 3 ? pool : ["0", "1", "2"]);
		out.push({
			variant: `exp-1-${k}`,
			stem,
			correct,
			w1: w[0],
			w2: w[1],
			w3: w[2],
			explanation: `This is the derivative of e^{${k}x} at 0, so the limit equals ${k}.`,
		});
	}

	/* Family F: lim(h→0) ((x+h)^2 − x^2)/h = 2x */
	for (let x = 1; x <= 36; x++) {
		const correct = `${2 * x}`;
		const stem = `If x = ${x} is fixed, find lim(h → 0) ((x + h)^2 − x^2)/h.`;
		const pool = [correct, `${x}`, `${x * x}`, `${2 * x + 1}`, `${2 * x - 1}`, "0", "nonexistent"].filter(
			(s, i, a) => a.indexOf(s) === i && s !== correct,
		);
		const w = pickThreeWrongs(wrongRng(`ced|F|${x}`), correct, pool.length >= 3 ? pool : ["0", "1", "2"]);
		out.push({
			variant: `diff-quot-${x}`,
			stem,
			correct,
			w1: w[0],
			w2: w[1],
			w3: w[2],
			explanation: `Expand (x + h)^2 − x^2 = 2xh + h^2, divide by h, then let h → 0 to get 2x = ${2 * x}.`,
		});
	}

	return out;
}

/** Lazily built so module load stays light; length is checked once. */
let _cached: CalcCedLimitSpec[] | null = null;

export function allCalcCedLimitSpecs(): readonly CalcCedLimitSpec[] {
	if (!_cached) {
		_cached = buildSpecs();
		if (_cached.length < 200) {
			throw new Error(`calcCedLimitBank: expected ≥200 specs, got ${_cached.length}`);
		}
	}
	return _cached;
}

export function calcCedLimitSpecCount(): number {
	return allCalcCedLimitSpecs().length;
}
