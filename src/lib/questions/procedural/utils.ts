/** Seeded-ish mixing per question index (deterministic given session offset) */
export function randInt(min: number, max: number, salt: number): number {
  const x = Math.sin(salt * 12.9898 + min * 78.233 + max * 43.758) * 43758.5453;
  const t = x - Math.floor(x);
  return min + Math.floor(t * (max - min + 1));
}

export function shuffle<T>(arr: T[], salt: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i, salt + i * 31);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick<T>(arr: T[], salt: number): T {
  return arr[randInt(0, arr.length - 1, salt)];
}

export function makeQuestionId(prefix: string, salt: number): string {
  return `proc-${prefix}-${salt}-${Math.random().toString(36).slice(2, 9)}`;
}

export function round(n: number, d = 2): string {
  const f = 10 ** d;
  return String(Math.round(n * f) / f);
}

/** Ensures wrong answers are distinct from the correct string and from each other (avoids duplicate React keys / ambiguous MCQs). */
export function dedupeWrongOptions(correct: string, wrong: string[]): string[] {
  const used = new Set<string>([correct]);
  return wrong.map((w) => {
    let x = w;
    while (used.has(x)) {
      x += "\u200b";
    }
    used.add(x);
    return x;
  });
}
