import type { ExamQuestion } from "@/types";
import { proceduralUniqKey } from "@/lib/questions/procedural/utils";

const STORAGE_PREFIX = "vanta_proc_fp_v1";

function scopedStorageKey(courseId: string, unitScope: string): string {
	return `${STORAGE_PREFIX}:${courseId}:${unitScope}`;
}

/** Pre-scoped keys (course only) — migrated on read when scoped bucket is empty. */
function legacyStorageKey(courseId: string): string {
	return `${STORAGE_PREFIX}:${courseId}`;
}

function uniqueStringsPreserveOrder(items: readonly string[], max: number): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const x of items) {
		if (!x || seen.has(x)) continue;
		seen.add(x);
		out.push(x);
		if (out.length >= max) break;
	}
	return out;
}

function readJsonArray(raw: string | null): string[] {
	if (!raw) return [];
	try {
		const arr = JSON.parse(raw) as unknown;
		if (!Array.isArray(arr)) return [];
		return arr.filter((x): x is string => typeof x === "string" && x.length > 0 && x.length < 900);
	} catch {
		return [];
	}
}

/**
 * Fingerprints the procedural API should treat as already seen for this course + unit scope.
 * `unitScope` should be an AP unit id, `"all"`, or `"default"` when no unit is selected.
 */
export function peekClientAvoidFingerprints(courseId: string, unitScope: string, limit = 900): string[] {
	if (typeof window === "undefined") return [];
	const scoped = readJsonArray(sessionStorage.getItem(scopedStorageKey(courseId, unitScope)));
	if (scoped.length > 0) {
		return uniqueStringsPreserveOrder(scoped, limit);
	}
	return uniqueStringsPreserveOrder(readJsonArray(sessionStorage.getItem(legacyStorageKey(courseId))), limit);
}

/**
 * Remember items so the next fetch (Try again / New set) can skip them.
 * Deduplicates and caps storage so repeats stay rare across sessions.
 */
export function appendClientSeenFingerprints(courseId: string, unitScope: string, questions: ExamQuestion[]): void {
	if (typeof window === "undefined" || questions.length === 0) return;
	try {
		const keys = questions.map((q) => proceduralUniqKey(q));
		const prev = readJsonArray(sessionStorage.getItem(scopedStorageKey(courseId, unitScope)));
		const merged = uniqueStringsPreserveOrder([...keys, ...prev], 1200);
		sessionStorage.setItem(scopedStorageKey(courseId, unitScope), JSON.stringify(merged));
	} catch {
		/* ignore quota / privacy mode */
	}
}

/** Normalize URL / prop unit id into a stable storage segment. */
export function practiceUnitScope(unitId: string | null | undefined): string {
	if (unitId === "all") return "all";
	if (!unitId || !unitId.trim()) return "default";
	return unitId.trim();
}
