import { proceduralPracticeMcqCountForCourse } from "@/lib/apPracticeExamFormat";
import { getCourseIdFromSubjectName } from "@/lib/apUnits";
import type { CalculatorSectionPolicy, ProceduralDifficulty } from "@/lib/questions/procedural";

function clampInt(n: number, lo: number, hi: number): number {
 return Math.min(hi, Math.max(lo, Math.floor(n)));
}

export function parseDifficultyParam(raw: string | null): ProceduralDifficulty {
 if (raw === "easy" || raw === "hard" || raw === "random" || raw === "medium") return raw;
 return "medium";
}

export type PracticeSessionQuery = {
 count?: number;
 difficulty: ProceduralDifficulty;
 timeLimitSeconds: number;
 showDesmos: boolean;
};

/**
 * Reads shared URL query fields for timed / difficulty / Desmos procedural practice.
 */
export function parsePracticeSessionQuery(
 searchParams: URLSearchParams,
 opts: { courseId?: string; subjectName?: string },
): PracticeSessionQuery {
 const rawCount = parseInt(searchParams.get("count") || "", 10);
 const cid = opts.courseId ?? (opts.subjectName ? getCourseIdFromSubjectName(opts.subjectName) : undefined);
 const count = Number.isFinite(rawCount)
 ? clampInt(rawCount, 1, 100)
 : cid
 ? proceduralPracticeMcqCountForCourse(cid)
 : undefined;
 const difficulty = parseDifficultyParam(searchParams.get("difficulty"));
 const timerM = clampInt(parseInt(searchParams.get("timerM") || "0", 10) || 0, 0, 180);
 const timerS = clampInt(parseInt(searchParams.get("timerS") || "0", 10) || 0, 0, 59);
 const timeLimitSeconds = timerM * 60 + timerS;
 const rawCalc = searchParams.get("calcSection")?.trim();
 const calculatorSection: CalculatorSectionPolicy | undefined =
 rawCalc === "no_calculator" || rawCalc === "calculator" ? rawCalc : undefined;
 const showDesmos =
 Boolean(cid && (cid === "calc-ab" || cid === "calc-bc") && calculatorSection === "calculator");
 return { count, difficulty, timeLimitSeconds, showDesmos };
}
