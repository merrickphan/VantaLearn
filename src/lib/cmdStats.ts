export interface CommandCenterStats {
 attempts: number;
 correct: number;
 subjectsPracticed: string[];
 streak: number;
}

const KEY = "vanta_cmd_stats";

export function loadCmdStats(): CommandCenterStats {
 if (typeof window === "undefined") {
 return { attempts: 0, correct: 0, subjectsPracticed: [], streak: 0 };
 }
 try {
 const raw = localStorage.getItem(KEY);
 if (!raw) return { attempts: 0, correct: 0, subjectsPracticed: [], streak: 0 };
 const p = JSON.parse(raw) as CommandCenterStats;
 return {
 attempts: p.attempts ?? 0,
 correct: p.correct ?? 0,
 subjectsPracticed: Array.isArray(p.subjectsPracticed) ? p.subjectsPracticed : [],
 streak: p.streak ?? 0,
 };
 } catch {
 return { attempts: 0, correct: 0, subjectsPracticed: [], streak: 0 };
 }
}

export function recordExamComplete(subject: string, correct: number, total: number) {
 if (typeof window === "undefined") return;
 const prev = loadCmdStats();
 const subs = new Set(prev.subjectsPracticed);
 subs.add(subject);
 const next: CommandCenterStats = {
 attempts: prev.attempts + total,
 correct: prev.correct + correct,
 subjectsPracticed: [...subs],
 streak: correct >= total * 0.7 ? prev.streak + 1 : 0,
 };
 localStorage.setItem(KEY, JSON.stringify(next));
}
