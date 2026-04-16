import type { ExamQuestion } from "@/types";
import { TEXT_ITEM_STIMULUS_PROBABILITY, thematicStimulusHg } from "./stimulusPools";
import { hashString, proseMcqStructureId, shuffleInPlace } from "./utils";

/** Call-site compatible with ProcCtx in generators.ts */
export interface GeoCtx {
 courseId: string;
 courseName: string;
 unitId: string;
 unitIndex: number;
 unitTitle: string;
 seedBase: string;
}

export type GeoQuestionGen = (rng: () => number, ctx: GeoCtx, i: number) => ExamQuestion;

export function geoMc(
 rng: () => number,
 ctx: GeoCtx,
 i: number,
 tag: string,
 stem: string,
 correct: string,
 w1: string,
 w2: string,
 w3: string,
 explanation: string,
 figure?: ExamQuestion["figure"],
): ExamQuestion {
 const options = shuffleInPlace(rng, [correct, w1, w2, w3]);
 const base: ExamQuestion = {
 id: `proc-${ctx.courseId}-${ctx.unitId}-${i}-${hashString(ctx.seedBase + tag).toString(36)}`,
 question: stem,
 type: "multiple_choice",
 options,
 correct_answer: correct,
 explanation,
 subject: ctx.courseName,
 };
 let fig = figure;
 if (!fig && rng() < TEXT_ITEM_STIMULUS_PROBABILITY["hum-geo"]) {
 fig = thematicStimulusHg(rng, ctx.unitIndex);
 }
 const out = fig ? { ...base, figure: fig } : base;
 return { ...out, procedural_structure_id: proseMcqStructureId(tag, stem, correct) };
}

export function geoItem(
 tag: string,
 stem: string,
 correct: string,
 w: [string, string, string],
 explanation: string,
 figure?: ExamQuestion["figure"],
): GeoQuestionGen {
 return (rng, ctx, i) => geoMc(rng, ctx, i, tag, stem, correct, w[0], w[1], w[2], explanation, figure);
}
