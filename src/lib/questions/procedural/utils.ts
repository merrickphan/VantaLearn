import type { ExamQuestion } from "@/types";

/** Deterministic hash for seed strings (FNV-1a style). */
export function hashString(s: string): number {
 let h = 2166136261 >>> 0;
 for (let i = 0; i < s.length; i++) {
 h ^= s.charCodeAt(i);
 h = Math.imul(h, 16777619);
 }
 return h >>> 0;
}

/**
 * Stable structure id for prose MCQs (HG/WH/USH) so optional decorative figures
 * do not change the dedup key — the same stem + keyed answer is one logical item.
 * Strips a trailing "-{slot}" suffix from generator tags (those tags embed exam slot index).
 */
export function proseMcqStructureId(tag: string, stem: string, correct: string): string {
 const baseTag = tag.replace(/-\d+$/, "");
 return `prose:${hashString(`${baseTag}|${stem}|${correct}`).toString(36)}`;
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

/** Sample `count` distinct integers in [min, max] (inclusive). Range must be wide enough. */
export function distinctRandInts(rng: () => number, count: number, min: number, max: number): number[] {
 if (max - min + 1 < count) {
 throw new Error("distinctRandInts: range too small for count");
 }
 const out: number[] = [];
 let guard = 0;
 while (out.length < count && guard < count * 100) {
 guard++;
 const v = randInt(rng, min, max);
 if (!out.includes(v)) out.push(v);
 }
 while (out.length < count) {
 const v = min + out.length;
 if (!out.includes(v)) out.push(v);
 }
 return out;
}

export function pick<T>(rng: () => number, arr: readonly T[]): T {
 if (arr.length === 0) throw new Error("pick: empty array");
 return arr[Math.floor(rng() * arr.length)];
}

/** Distinct wrong answers for MC (shuffled with correct elsewhere). */
export function pickThreeDistinct(
 rng: () => number,
 pool: readonly string[],
 exclude: string,
): [string, string, string] {
 const filtered = pool.filter((x) => x !== exclude);
 const extra = [
 "a claim most historians would treat cautiously",
 "a pattern documented only in one unreliable source",
 "an outcome that contradicts typical regional evidence",
 ];
 for (const e of extra) {
 if (filtered.length >= 3) break;
 if (!filtered.includes(e)) filtered.push(e);
 }
 const shuffled = shuffleInPlace(rng, [...filtered]);
 return [shuffled[0], shuffled[1], shuffled[2]];
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

/** High-entropy seed fragment for procedural runs (reduces repeat probability across sessions). */
export function randomSeedEntropy(): string {
 if (typeof globalThis.crypto !== "undefined" && "getRandomValues" in globalThis.crypto) {
 const a = new Uint8Array(20);
 globalThis.crypto.getRandomValues(a);
 return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
 }
 return `${Date.now()}-${Math.random().toString(36).slice(2, 14)}-${Math.random().toString(36).slice(2, 14)}`;
}

/**
 * Fingerprint for deduplication: includes stem, correct answer, and figure payload so
 * chart/table questions with the same wording but different data count as distinct.
 */
export function proceduralQuestionFingerprint(q: ExamQuestion): string {
 const fig = q.figure ? JSON.stringify(q.figure) : "";
 return `${q.question.trim()}\n${String(q.correct_answer).trim()}\n${fig}`;
}

/**
 * Stable uniqueness key for "never show same question twice" tracking.
 * Prefer `procedural_structure_id` when present because it remains stable even if
 * optional stimulus text or lead-in phrasing changes.
 */
export function proceduralUniqKey(q: ExamQuestion): string {
 const s = q.procedural_structure_id?.trim();
 if (s) return `sid:${s}`;
 return `fp:${proceduralQuestionFingerprint(q)}`;
}

export function uniqueOptions(correct: string, wrong: string[], rng: () => number): string[] {
 const set = new Set<string>([correct, ...wrong]);
 const opts = shuffleInPlace(rng, [...set]);
 return opts.slice(0, Math.min(4, opts.length));
}
