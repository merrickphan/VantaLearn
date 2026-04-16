/** Deterministic PRNG (mulberry32). Same seed → same sequence. */
export function mulberry32(seed: number): () => number {
	let t = seed >>> 0;
	return () => {
		t += 0x6d2b79f5;
		let r = Math.imul(t ^ (t >>> 15), 1 | t);
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
	};
}

export function hashSeed(parts: (string | number)[]): number {
	const s = parts.join("\u{1f}");
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

export function pickWeighted<T extends string>(
	rng: () => number,
	weights: Record<T, number>,
	keys: readonly T[],
): T {
	let total = 0;
	for (const k of keys) total += Math.max(0, weights[k] ?? 0);
	if (total <= 0) return keys[0];
	let r = rng() * total;
	for (const k of keys) {
		const w = Math.max(0, weights[k] ?? 0);
		if (r < w) return k;
		r -= w;
	}
	return keys[keys.length - 1];
}

export function pickIndex(rng: () => number, n: number): number {
	if (n <= 0) return 0;
	return Math.floor(rng() * n);
}

export function shuffleInPlace<T>(rng: () => number, arr: T[]): void {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}
