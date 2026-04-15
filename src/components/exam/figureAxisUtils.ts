/** Readable tick labels for exam-style axes (integers when possible). */
export function formatAxisNumber(n: number): string {
	if (!Number.isFinite(n)) return "";
	const r = Math.round(n);
	if (Math.abs(n - r) < 1e-6) return String(r);
	if (Math.abs(n) >= 100) return n.toFixed(0);
	if (Math.abs(n) >= 10) return n.toFixed(1);
	return n.toFixed(2);
}

function niceStep(rough: number): number {
	if (!Number.isFinite(rough) || rough <= 0) return 1;
	const exp = Math.floor(Math.log10(rough));
	const pow10 = 10 ** exp;
	const f = rough / pow10;
	let nf = 10;
	if (f <= 1) nf = 1;
	else if (f <= 2) nf = 2;
	else if (f <= 5) nf = 5;
	return nf * pow10;
}

/** Inclusive tick values from min..max, roughly `targetCount` intervals. */
export function axisTicks(minV: number, maxV: number, targetCount = 5): number[] {
	if (!Number.isFinite(minV) || !Number.isFinite(maxV)) return [0, 1];
	if (minV === maxV) {
		const pad = Math.abs(minV) < 1e-9 ? 0.5 : Math.abs(minV) * 0.1;
		return axisTicks(minV - pad, maxV + pad, targetCount);
	}
	const span = maxV - minV;
	const step = niceStep(span / Math.max(1, targetCount - 1));
	const lo = Math.floor(minV / step) * step;
	const hi = Math.ceil(maxV / step) * step;
	const ticks: number[] = [];
	const nMax = 14;
	for (let v = lo; v <= hi + step * 1e-9 && ticks.length < nMax; v += step) {
		ticks.push(Number.parseFloat(v.toPrecision(12)));
	}
	if (ticks.length === 0) return [minV, maxV];
	return ticks;
}
