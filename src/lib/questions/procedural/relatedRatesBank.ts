import { hashString, mulberry32 } from "./utils";

export type RelatedRatesSpec = {
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

/** Positive rational multiple of π: simplified n/d · π */
function formatRationalPi(numer: number, denom: number): string {
	const g = gcd(Math.abs(numer), Math.abs(denom));
	const n = Math.abs(numer) / g;
	const d = Math.abs(denom) / g;
	if (n === 0) return "0";
	if (d === 1) return `${n}π`;
	return `${n}π/${d}`;
}

/** Simplified positive rational (no π) */
function formatPositiveFraction(numer: number, denom: number): string {
	const g = gcd(Math.abs(numer), Math.abs(denom));
	const n = Math.abs(numer) / g;
	const d = Math.abs(denom) / g;
	if (d === 1) return `${n}`;
	return `${n}/${d}`;
}

function wrongRng(seed: string): () => number {
	return mulberry32(hashString(seed));
}

function shuffleInPlaceLocal(rng: () => number, arr: string[]): void {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[arr[i], arr[j]] = [arr[j]!, arr[i]!];
	}
}

function pickThreeWrongs(rng: () => number, correct: string, pool: string[]): [string, string, string] {
	const filtered = pool.filter((s) => s !== correct);
	while (filtered.length < 6) {
		filtered.push(`${hashString(filtered.join("|")) % 97}`);
	}
	shuffleInPlaceLocal(rng, filtered);
	const a = filtered[0]!;
	const b = filtered.find((s) => s !== a) ?? filtered[1]!;
	const c = filtered.find((s) => s !== a && s !== b) ?? filtered[2]!;
	return [a, b, c];
}

const PI_WRONGLIKE = ["0", "1", "π", "2π", "π/2", "nonexistent"];

/* - - Stems (diverse contexts; index selects) - - */

function stemSphereDvolumeToDsfc(mpi: string, R: number, stemIdx: number): string {
	const contexts: string[] = [
		`A spherical ice sculpture melts so that it remains spherical. The volume decreases at ${mpi} cubic meters per hour. When the radius is ${R} m, at what rate (m²/h) is the total surface area decreasing? Use V = (4/3)πr³ and S = 4πr².`,
		`A spherical metal shell cools and shrinks, staying spherical. The volume decreases at ${mpi} m³/h. At the instant r = ${R} m, how fast is the total surface area decreasing (m²/h)? (V = (4/3)πr³, S = 4πr².)`,
		`Snow is packed into a sphere that sublimates symmetrically; volume drops at ${mpi} m³/h. When r = ${R} m, at what rate (m²/h) is the surface area decreasing? (Sphere: V = (4/3)πr³, S = 4πr².)`,
		`A spherical weather balloon loses gas and shrinks spherically; |dV/dt| = ${mpi} m³/h. At r = ${R} m, find the rate at which total surface area is decreasing (m²/h). (V = (4/3)πr³, S = 4πr².)`,
		`A salt crystal forms a perfect sphere dissolving in water; volume decreases at ${mpi} m³/h. When the radius is ${R} m, how fast is the outer surface area decreasing (m²/h)? (Sphere formulas as usual.)`,
		`Model a dew droplet as a shrinking sphere; dV/dt has magnitude ${mpi} m³/h. At r = ${R} m, find the surface-area decrease rate in m²/h (S = 4πr², V = (4/3)πr³).`,
		`A spherical foam packing bead shrinks isotropically; volume loss rate is ${mpi} m³/h. At r = ${R} m, compute the rate of decrease of total surface area (m²/h).`,
		`An art installation is a melting sphere of ice; |dV/dt| = ${mpi} m³/h. When r = ${R} m, what is |dS/dt| for the surface in m²/h? (Use V = (4/3)πr³, S = 4πr².)`,
	];
	return contexts[stemIdx % contexts.length]!;
}

function stemSphereDsfcToDvol(mpi: string, R: number, stemIdx: number): string {
	const contexts: string[] = [
		`A spherical tank lining is etched so total surface area shrinks at ${mpi} m²/h while the object stays spherical. When r = ${R} m, how fast is the volume decreasing (m³/h)? (V = (4/3)πr³, S = 4πr².)`,
		`A spherical balloon’s outer surface area decreases at ${mpi} m²/h as it deflates spherically. At radius ${R} m, find |dV/dt| in m³/h.`,
		`As a sphere contracts, its total surface area decreases at ${mpi} m²/h. At the instant r = ${R} m, at what rate is the volume decreasing (m³/h)?`,
		`Ice ball competition: surface area melts off so |dS/dt| = ${mpi} m²/h (total surface). When r = ${R} m, determine |dV/dt| (m³/h) for the spherical ice.`,
		`A spherical soap bubble pops slowly; surface area decreases at ${mpi} m²/h. When r = ${R} m, find the volume decrease rate (m³/h).`,
	];
	return contexts[stemIdx % contexts.length]!;
}

function stemSphereDrdtToDvol(m: number, R: number, stemIdx: number): string {
	const contexts: string[] = [
		`A spherical balloon stays spherical while its radius decreases at ${m} m/h. When r = ${R} m, how fast is the volume decreasing (m³/h)? (V = (4/3)πr³.)`,
		`A metal sphere contracts so dr/dt = −${m} m/h (radius shrinking). At r = ${R} m, find |dV/dt| in m³/h.`,
		`Air escapes from a toy sphere so the radius shrinks at ${m} m/h. At r = ${R} m, compute the rate of volume loss (m³/h).`,
		`Cooling shrinkage makes a spherical pellet’s radius decrease at ${m} m/h. When r = ${R} m, what is |dV/dt|? (V = (4/3)πr³.)`,
	];
	return contexts[stemIdx % contexts.length]!;
}

function stemCubeDvolToDsfc(K: number, s: number, stemIdx: number): string {
	const contexts: string[] = [
		`A solid cube of wax melts symmetrically so volume decreases at ${K} cm³/min while staying cubic. When the edge length is ${s} cm, how fast is the total surface area decreasing (cm²/min)? (Cube: V = s³, S = 6s².)`,
		`A cubical gel pack shrinks; |dV/dt| = ${K} cm³/min. At edge ${s} cm, find |dS/dt| for the cube (cm²/min).`,
		`Salt dissolves from a cube-shaped crystal; volume loss rate is ${K} cm³/min. When s = ${s} cm, what is the surface-area decrease rate (cm²/min)?`,
	];
	return contexts[stemIdx % contexts.length]!;
}

function stemCylinderDvolToAlat(mpi: string, R: number, h: number, stemIdx: number): string {
	const contexts: string[] = [
		`A right circular cylinder keeps constant height H = ${h} m while its radius changes; its volume decreases at ${mpi} m³/h. When r = ${R} m, how fast is the lateral (side) surface area decreasing (m²/h)? Lateral area = 2πrh.`,
		`A soda can model (fixed height ${h} cm) crumples so only r changes; |dV/dt| = ${mpi} cm³/min. At r = ${R} cm, find |d/dt(2πrh)| for the side (cm²/min).`,
		`Water leaks from a cylindrical tank of fixed height ${h} m; |dV/dt| = ${mpi} m³/h. At r = ${R} m, find the rate of decrease of lateral surface area (m²/h).`,
	];
	return contexts[stemIdx % contexts.length]!;
}

function stemRipple(R: number, v: number, stemIdx: number): string {
	const contexts: string[] = [
		`Ripples spread on a pond; the circular disturbed region has radius increasing at ${v} m/s. When r = ${R} m, how fast is the enclosed area growing (m²/s)? (A = πr².)`,
		`A circular oil slick grows so dr/dt = ${v} km/h. When r = ${R} km, find dA/dt for A = πr².`,
		`A balloon’s circular shadow on the ground expands with dr/dt = ${v} ft/s. When r = ${R} ft, find dA/dt (ft²/s).`,
	];
	return contexts[stemIdx % contexts.length]!;
}

function stemLadderFixed(L: number, x0: number, y0: number, dx: number, stemIdx: number): string {
	const contexts: string[] = [
		`A ${L}-foot ladder rests against a vertical wall; x² + y² = ${L}², where x is the base distance and y the height on the wall. The base slides away from the wall at ${dx} ft/s. When x = ${x0} ft and y = ${y0} ft, how fast is the top sliding down the wall (ft/s)? (Report the magnitude of downward motion.)`,
		`A ${L} m ladder satisfies x² + y² = ${L}². The foot moves away from the wall at ${dx} m/s. At x = ${x0} m, y = ${y0} m, find how fast the top descends (m/s).`,
		`Ladder length ${L} ft: x² + y² = ${L}². The base slides outward at ${dx} ft/s. When x = ${x0} and y = ${y0}, find the downward speed of the top.`,
	];
	return contexts[stemIdx % contexts.length]!;
}

/** Expandable rectangular plate: one side fixed length L, other side x(t); A = L x. */
function stemRectangle(L: number, x: number, dAdt: number, stemIdx: number): string {
	const contexts: string[] = [
		`A rectangular metal plate stays fixed on one side of length ${L} cm while the adjacent edge changes; area A = ${L}·x cm². The area increases at ${dAdt} cm²/min. When x = ${x} cm, how fast is the expanding edge length changing (cm/min)?`,
		`A garden bed is ${L} m wide (fixed) and x m long; A = ${L}x. If dA/dt = ${dAdt} m²/h when x = ${x} m, find dx/dt.`,
	];
	return contexts[stemIdx % contexts.length]!;
}

function buildSpecs(): RelatedRatesSpec[] {
	const out: RelatedRatesSpec[] = [];

	/* Family 1 — Sphere: |dV/dt| = mπ, find |dS/dt| at r = R.  |dS/dt| = 2|dV/dt|/R = 2mπ/R */
	for (let R = 3; R <= 13; R++) {
		for (let m = 1; m <= 5; m++) {
			const mpi = `${m}π`;
			const correct = formatRationalPi(2 * m, R);
			const stemIdx = (R + m) % 8;
			const stem = stemSphereDvolumeToDsfc(mpi, R, stemIdx);
			const pool = [
				correct,
				formatRationalPi(m, R),
				formatRationalPi(4 * m, R),
				formatRationalPi(m, 2 * R),
				formatRationalPi(3 * m, R),
				...PI_WRONGLIKE,
			].filter((s, i, a) => a.indexOf(s) === i);
			const w = pickThreeWrongs(wrongRng(`rr|S1|${R}|${m}`), correct, pool);
			out.push({
				variant: `sph-dV-dS-${R}-${m}`,
				stem,
				correct,
				w1: w[0],
				w2: w[1],
				w3: w[2],
				explanation: `Differentiate V = (4/3)πr³ to get dV/dt = 4πr² dr/dt, and S = 4πr² gives dS/dt = 8πr dr/dt. Eliminate dr/dt: |dS/dt| = 2|dV/dt|/r = ${correct}.`,
			});
		}
	}

	/* Family 2 — Sphere: |dS/dt| = mπ, find |dV/dt| at r = R.  |dV/dt| = (R/2)|dS/dt| = mRπ/2 */
	for (let R = 4; R <= 14; R++) {
		for (let m = 1; m <= 5; m++) {
			const mpi = `${m}π`;
			const correct = formatRationalPi(m * R, 2);
			const stemIdx = (R + 2 * m) % 5;
			const stem = stemSphereDsfcToDvol(mpi, R, stemIdx);
			const pool = [
				correct,
				formatRationalPi(2 * m * R, 2),
				formatRationalPi(m * R, 4),
				formatRationalPi(m, 2),
				...PI_WRONGLIKE,
			].filter((s, i, a) => a.indexOf(s) === i);
			const w = pickThreeWrongs(wrongRng(`rr|S2|${R}|${m}`), correct, pool);
			out.push({
				variant: `sph-dS-dV-${R}-${m}`,
				stem,
				correct,
				w1: w[0],
				w2: w[1],
				w3: w[2],
				explanation: `From S = 4πr² and V = (4/3)πr³, relate rates: dV/dt = (r/2) dS/dt at fixed instant, so magnitude is ${correct}.`,
			});
		}
	}

	/* Family 3 — Sphere: |dr/dt| = m, find |dV/dt| at r = R.  |dV/dt| = 4π R² m */
	for (let R = 3; R <= 11; R++) {
		for (let m = 1; m <= 7; m++) {
			const correct = formatRationalPi(4 * m * R * R, 1);
			const stemIdx = (R + m) % 4;
			const stem = stemSphereDrdtToDvol(m, R, stemIdx);
			const pool = [
				correct,
				formatRationalPi(4 * m * R, 1),
				formatRationalPi(3 * m * R * R, 1),
				formatRationalPi(2 * m * R * R, 1),
				...PI_WRONGLIKE,
			].filter((s, i, a) => a.indexOf(s) === i);
			const w = pickThreeWrongs(wrongRng(`rr|S3|${R}|${m}`), correct, pool);
			out.push({
				variant: `sph-dr-dV-${R}-${m}`,
				stem,
				correct,
				w1: w[0],
				w2: w[1],
				w3: w[2],
				explanation: `Since V = (4/3)πr³, dV/dt = 4πr² dr/dt. Substitute r = ${R} and |dr/dt| = ${m} to obtain |dV/dt| = ${correct}.`,
			});
		}
	}

	/* Family 4 — Cube: |dV/dt| = K, find |dS/dt| at edge s.  |dS/dt| = 4K/s */
	for (let s = 4; s <= 10; s++) {
		for (let K = 3; K <= 8; K++) {
			const correct = formatPositiveFraction(4 * K, s);
			const stemIdx = (s + K) % 3;
			const stem = stemCubeDvolToDsfc(K, s, stemIdx);
			const pool = [
				correct,
				formatPositiveFraction(3 * K, s),
				formatPositiveFraction(6 * K, s),
				formatPositiveFraction(2 * K, s),
				formatPositiveFraction(K, s),
				"0",
				"1",
			].filter((s0, i, a) => a.indexOf(s0) === i);
			const w = pickThreeWrongs(wrongRng(`rr|C|${s}|${K}`), correct, pool);
			out.push({
				variant: `cube-dV-dS-${s}-${K}`,
				stem,
				correct,
				w1: w[0],
				w2: w[1],
				w3: w[2],
				explanation: `For a cube, V = s³ and S = 6s². Relate dS/dt to dV/dt via ds/dt to get |dS/dt| = 4|dV/dt|/s = ${correct}.`,
			});
		}
	}

	/* Family 5 — Cylinder fixed height h: |dV/dt| = mπ, find |d(2πrh)/dt| = (1/r)|dV/dt| at r = R */
	for (let R = 3; R <= 11; R++) {
		for (let m = 2; m <= 5; m++) {
			const h = 6 + ((R + m) % 7);
			const mpi = `${m}π`;
			const correct = formatRationalPi(m, R);
			const stemIdx = (h + R + m) % 3;
			const stem = stemCylinderDvolToAlat(mpi, R, h, stemIdx);
			const pool = [
				correct,
				formatRationalPi(2 * m, R),
				formatRationalPi(m, 2 * R),
				formatRationalPi(m * h, R),
				...PI_WRONGLIKE,
			].filter((s, i, a) => a.indexOf(s) === i);
			const w = pickThreeWrongs(wrongRng(`rr|Cy|${h}|${R}|${m}`), correct, pool);
			out.push({
				variant: `cyl-dV-dAlat-${h}-${R}-${m}`,
				stem,
				correct,
				w1: w[0],
				w2: w[1],
				w3: w[2],
				explanation: `With V = πr²h (h constant), dV/dt = 2πrh dr/dt. Lateral area A = 2πrh gives dA/dt = 2πh dr/dt. Hence |dA/dt| = |dV/dt|/r = ${correct}.`,
			});
		}
	}

	/* Family 6 — Ripple: dr/dt = v, find dA/dt = 2πr v at r = R */
	for (let R = 3; R <= 10; R++) {
		for (let v = 1; v <= 4; v++) {
			const correct = formatRationalPi(2 * v * R, 1);
			const stemIdx = (R + v) % 3;
			const stem = stemRipple(R, v, stemIdx);
			const pool = [
				correct,
				formatRationalPi(v * R, 1),
				formatRationalPi(v * R * R, 1),
				formatRationalPi(4 * v * R, 1),
				formatRationalPi(v * R, 2),
				...PI_WRONGLIKE,
			].filter((s, i, a) => a.indexOf(s) === i);
			const w = pickThreeWrongs(wrongRng(`rr|Rp|${R}|${v}`), correct, pool);
			out.push({
				variant: `ripple-dA-${R}-${v}`,
				stem,
				correct,
				w1: w[0],
				w2: w[1],
				w3: w[2],
				explanation: `Since A = πr², dA/dt = 2πr dr/dt. Substituting gives ${correct}.`,
			});
		}
	}

	/* Family 7 — Rectangle fixed width L: dA/dt given, find dx/dt when A = L x (answer = (dA/dt)/L) */
	for (let L = 7; L <= 11; L++) {
		for (let dxAns = 5; dxAns <= 11; dxAns++) {
			const dAdt = L * dxAns;
			const displayX = 8 + ((L + dxAns) % 9);
			const correct = formatPositiveFraction(dxAns, 1);
			const stemIdx = (L + dxAns) % 2;
			const stem = stemRectangle(L, displayX, dAdt, stemIdx);
			const pool = [
				correct,
				formatPositiveFraction(dxAns + 1, 1),
				formatPositiveFraction(dxAns - 1, 1),
				formatPositiveFraction(2 * dxAns, 1),
				formatPositiveFraction(dAdt, 2 * L),
			].filter((s, i, a) => a.indexOf(s) === i);
			const w = pickThreeWrongs(wrongRng(`rr|Rec|${L}|${dxAns}`), correct, pool);
			out.push({
				variant: `rect-dx-${L}-${dxAns}`,
				stem,
				correct,
				w1: w[0],
				w2: w[1],
				w3: w[2],
				explanation: `A = ${L}x implies dA/dt = ${L}·dx/dt, so dx/dt = (${dAdt})/${L} = ${correct}.`,
			});
		}
	}

	/* Family 8 — Ladder x²+y²=L²; dx/dt given; dy/dt downward magnitude (x/y)·dx/dt */
	const ladders: { L: number; x0: number; y0: number }[] = [
		{ L: 13, x0: 5, y0: 12 },
		{ L: 13, x0: 12, y0: 5 },
		{ L: 10, x0: 6, y0: 8 },
		{ L: 10, x0: 8, y0: 6 },
		{ L: 15, x0: 9, y0: 12 },
		{ L: 15, x0: 12, y0: 9 },
		{ L: 17, x0: 8, y0: 15 },
		{ L: 17, x0: 15, y0: 8 },
		{ L: 25, x0: 7, y0: 24 },
		{ L: 25, x0: 24, y0: 7 },
		{ L: 5, x0: 3, y0: 4 },
		{ L: 5, x0: 4, y0: 3 },
	];
	for (let li = 0; li < 6; li++) {
		const { L, x0, y0 } = ladders[li]!;
		for (let dx = 1; dx <= 5; dx++) {
			const numer = x0 * dx;
			const correct = formatPositiveFraction(numer, y0);
			const stemIdx = (li + dx) % 3;
			const stem = stemLadderFixed(L, x0, y0, dx, stemIdx);
			const pool = [
				correct,
				formatPositiveFraction(y0 * dx, x0),
				formatPositiveFraction(dx * L, y0),
				formatPositiveFraction(numer, x0),
				formatPositiveFraction(dx, 1),
				"0",
			].filter((s, i, a) => a.indexOf(s) === i);
			const w = pickThreeWrongs(wrongRng(`rr|Ld|${L}|${x0}|${dx}`), correct, pool);
			out.push({
				variant: `ladder-${L}-${x0}-${dx}`,
				stem,
				correct,
				w1: w[0],
				w2: w[1],
				w3: w[2],
				explanation: `Implicitly differentiate x² + y² = ${L}²: 2x dx/dt + 2y dy/dt = 0, so |dy/dt| = (x/y)|dx/dt| = (${x0}/${y0})·${dx} = ${correct}.`,
			});
		}
	}

	return out;
}

let _cached: RelatedRatesSpec[] | null = null;

export function allRelatedRatesSpecs(): readonly RelatedRatesSpec[] {
	if (!_cached) {
		_cached = buildSpecs();
		if (_cached.length < 300) {
			throw new Error(`relatedRatesBank: expected ≥300 specs, got ${_cached.length}`);
		}
	}
	return _cached;
}

export function relatedRatesSpecCount(): number {
	return allRelatedRatesSpecs().length;
}
