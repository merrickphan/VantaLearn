/** Deterministic hash for seed strings (FNV-1a style). */
export function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mulberry32 PRNG; returns values in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRng(seedBase: string, salt: string | number): () => number {
  return mulberry32(hashString(`${seedBase}|${salt}`));
}

export function randInt(rng: () => number, min: number, maxInclusive: number): number {
  return min + Math.floor(rng() * (maxInclusive - min + 1));
}

export function shuffleInPlace<T>(rng: () => number, arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function roundN(n: number, places: number): number {
  const p = 10 ** places;
  return Math.round(n * p) / p;
}

export function uniqueOptions(correct: string, wrong: string[], rng: () => number): string[] {
  const set = new Set<string>([correct, ...wrong]);
  const opts = shuffleInPlace(rng, [...set]);
  return opts.slice(0, Math.min(4, opts.length));
}
