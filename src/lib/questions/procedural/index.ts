import type { ExamQuestion } from "@/types";
import { getCourseIdFromSubjectName } from "@/lib/apUnits";
import * as G from "./generators";

type GenFn = (salt: number, subject: string) => ExamQuestion;

function poolForCourse(courseId: string): GenFn[] {
  switch (courseId) {
    case "calc-ab":
    case "calc-bc":
    case "precalc":
      return [G.genDerivativeAtPoint, G.genPowerRule, G.genChainSimple, G.genPercentChange];
    case "stats":
      return [G.genMeanFromTable, G.genMedianSmallSet, G.genPercentChange];
    case "physics-1":
    case "physics-2":
    case "physics-c-m":
    case "physics-c-em":
      return [G.genKinematicsTime, G.genDisplacement, G.genPercentChange];
    case "chem":
      return [G.genMolarityDilution, G.genMeanFromTable, G.genPercentChange];
    case "bio":
    case "env":
      return [G.genMeanFromTable, G.genPercentChange, G.genMedianSmallSet, G.genKinematicsTime];
    case "macro":
    case "micro":
      return [G.genElasticityMidpoint, G.genPercentChange, G.genMeanFromTable];
    case "lang":
    case "lit":
    case "ush":
    case "wh":
    case "euro":
    case "gov":
    case "comp-gov":
    case "psych":
    case "hum-geo":
    case "art-hist":
    case "seminar":
    case "research":
      return [G.genFallacy, G.genPercentChange, G.genMedianSmallSet, G.genMeanFromTable];
    case "cs-a":
    case "csp":
      return [G.genFallacy, G.genPercentChange, G.genPowerRule, G.genMeanFromTable];
    case "music":
    case "art-design":
      return [G.genPercentChange, G.genMedianSmallSet, G.genFallacy];
    case "spanish":
    case "french":
    case "german":
    case "chinese":
    case "japanese":
    case "latin":
      return [G.genFallacy, G.genPercentChange, G.genMeanFromTable];
    default:
      return [
        G.genDerivativeAtPoint,
        G.genPowerRule,
        G.genMeanFromTable,
        G.genKinematicsTime,
        G.genFallacy,
        G.genPercentChange,
      ];
  }
}

/**
 * Unlimited offline-style questions: randomized parameters + templates (no LLM).
 * Best for STEM; humanities get logic/numeric reasoning templates.
 */
export function generateProceduralQuestions(opts: {
  subject: string;
  unitId?: string;
  count: number;
}): ExamQuestion[] {
  const courseId = getCourseIdFromSubjectName(opts.subject) ?? "";
  const pool = poolForCourse(courseId);
  const n = Math.min(12, Math.max(1, Math.floor(opts.count)));
  const out: ExamQuestion[] = [];
  let salt = (Date.now() % 200000) + (opts.unitId?.length ?? 0) * 997;
  for (let i = 0; i < n; i++) {
    const gen = pool[i % pool.length];
    salt += i * 131 + courseId.length * 17;
    out.push(gen(salt, opts.subject));
  }
  return out;
}
