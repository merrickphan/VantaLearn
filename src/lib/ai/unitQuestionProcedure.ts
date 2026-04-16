import type { ApUnit } from "@/lib/apUnits/types";

/**
 * Deterministic "procedure" for variety: combines unit scope with rotating hooks + numeric seed
 * so each API call emphasizes different angles (near-infinite combinations over time).
 */
export function buildUnitVarietyDirective(unit: ApUnit, varietySeed: number): string {
 const fallback = [unit.title, "ideas in the unit summary", "skills typical for this unit"];
 const hooks = unit.questionHooks?.length ? unit.questionHooks : fallback;
 const n = hooks.length;
 const a = ((varietySeed % n) + n) % n;
 const b = ((Math.floor(varietySeed / 7) % n) + n) % n;
 const c = ((Math.floor(varietySeed / 13) % n) + n) % n;
 const scenarioKinds = [
 "quantitative / numeric setup",
 "conceptual / definitions and contrasts",
 "graphical or tabular interpretation",
 "experimental / methodological",
 "real-world context (different domain each time)",
 "edge case or common misconception",
 "policy or stakeholder tradeoff",
 "historical or document-based vignette",
 "map, model, or diagram interpretation",
 "compare two cases or two quantities",
 "limitations, uncertainty, or assumptions",
 ];
 const sk = scenarioKinds[((varietySeed >> 3) % scenarioKinds.length + scenarioKinds.length) % scenarioKinds.length];

 const skillVerbs = [
 "interpret",
 "explain",
 "identify",
 "justify",
 "compare",
 "predict",
 "evaluate",
 "support with evidence",
 ];
 const sv = skillVerbs[((varietySeed >> 5) % skillVerbs.length + skillVerbs.length) % skillVerbs.length];

 const frames = [
 "short lab or investigation write-up",
 "public agency memo or briefing excerpt",
 "teacher demonstration notes",
 "student project summary",
 "industry quality-control or operations blurb",
 "field observation log",
 "news-style summary (hypothetical outlet)",
 "conference abstract or poster snippet",
 ];
 const fr = frames[((varietySeed >> 7) % frames.length + frames.length) % frames.length];

 return [
 `Variety batch ID: ${varietySeed}.`,
 `Primary hook (must shape at least half the stems): "${hooks[a]}".`,
 `Secondary hook (weave into several items): "${hooks[b]}".`,
 `Tertiary hook (at least one question): "${hooks[c]}".`,
 `Scenario style emphasis for this batch: ${sk}.`,
 `Primary skill framing for this batch: students should ${sv} — make the stem require that cognitive action.`,
 `Narrative frame to vary tone (do not label it in the stem): ${fr}.`,
 `AP realism: stems should be concise (avoid long preamble), use neutral third person, and match the pacing of released-exam style items (no “for homework” or “in class today” meta).`,
 `Use different fictional datasets, names, years, and contexts than typical textbook examples.`,
 `Do not repeat identical stem structures across questions — vary sentence openings, subject matter, and whether the lead is data-first vs claim-first.`,
 ].join(" ");
}

export function buildUnitCurriculumBlock(courseName: string, unit: ApUnit): string {
 return [
 `COURSE: ${courseName}`,
 `UNIT ${unit.index}: ${unit.title}`,
 `UNIT SCOPE (stay strictly within this unit's content): ${unit.summary}`,
 `Every question must assess ONLY ideas a student learning this unit would be expected to master.`,
 `If a figure is used, it must directly support a skill from this unit (not later units).`,
 ].join("\n");
}
