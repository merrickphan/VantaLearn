/** Canonical AP courses + default exam dates (approximate May window; adjust yearly). */
export interface ApCourse {
  id: string;
  name: string;
  short: string;
  icon: string;
  /** ISO date YYYY-MM-DD */
  examDate: string;
}

/** Typical May 2026 AP administration spread (Mon–Fri two weeks). */
export const AP_COURSES: ApCourse[] = [
  { id: "calc-ab", name: "AP Calculus AB", short: "Derivatives, integrals, limits", icon: "📐", examDate: "2026-05-05" },
  { id: "calc-bc", name: "AP Calculus BC", short: "Series, parametric, polar", icon: "📊", examDate: "2026-05-05" },
  { id: "precalc", name: "AP Precalculus", short: "Functions, modeling, trig", icon: "📈", examDate: "2026-05-13" },
  { id: "stats", name: "AP Statistics", short: "Inference, distributions, design", icon: "📉", examDate: "2026-05-07" },
  { id: "cs-a", name: "AP Computer Science A", short: "Java, OOP, algorithms", icon: "💻", examDate: "2026-05-08" },
  { id: "csp", name: "AP Computer Science Principles", short: "Big ideas, impact of computing", icon: "🖥️", examDate: "2026-05-15" },
  { id: "physics-1", name: "AP Physics 1", short: "Algebra-based mechanics & waves", icon: "⚛️", examDate: "2026-05-12" },
  { id: "physics-2", name: "AP Physics 2", short: "Fluids, thermo, optics, modern", icon: "🔬", examDate: "2026-05-12" },
  { id: "physics-c-m", name: "AP Physics C: Mechanics", short: "Calculus-based mechanics", icon: "🎯", examDate: "2026-05-13" },
  { id: "physics-c-em", name: "AP Physics C: E&M", short: "Electricity & magnetism", icon: "⚡", examDate: "2026-05-13" },
  { id: "chem", name: "AP Chemistry", short: "Atomic structure, reactions, thermo", icon: "🧪", examDate: "2026-05-04" },
  { id: "bio", name: "AP Biology", short: "Cell bio, genetics, evolution", icon: "🧬", examDate: "2026-05-11" },
  { id: "env", name: "AP Environmental Science", short: "Earth systems, human impact", icon: "🌍", examDate: "2026-05-06" },
  { id: "ush", name: "AP US History", short: "Colonial era through present", icon: "🇺🇸", examDate: "2026-05-09" },
  { id: "wh", name: "AP World History: Modern", short: "1200 CE to present", icon: "🌐", examDate: "2026-05-14" },
  { id: "euro", name: "AP European History", short: "Renaissance to modern Europe", icon: "🏛️", examDate: "2026-05-06" },
  { id: "gov", name: "AP US Government & Politics", short: "Constitution, institutions, policy", icon: "⚖️", examDate: "2026-05-04" },
  { id: "comp-gov", name: "AP Comparative Government", short: "Regimes, concepts, countries", icon: "🗳️", examDate: "2026-05-08" },
  { id: "macro", name: "AP Macroeconomics", short: "National economy, policy", icon: "📣", examDate: "2026-05-07" },
  { id: "micro", name: "AP Microeconomics", short: "Markets, firms, welfare", icon: "💹", examDate: "2026-05-08" },
  { id: "psych", name: "AP Psychology", short: "Behavior, cognition, research", icon: "🧠", examDate: "2026-05-06" },
  { id: "hum-geo", name: "AP Human Geography", short: "Population, culture, urban patterns", icon: "🗺️", examDate: "2026-05-05" },
  { id: "lang", name: "AP English Language", short: "Rhetoric, argument, synthesis", icon: "✍️", examDate: "2026-05-13" },
  { id: "lit", name: "AP English Literature", short: "Poetry, prose, drama analysis", icon: "📖", examDate: "2026-05-07" },
  { id: "art-hist", name: "AP Art History", short: "Global art, context, analysis", icon: "🖼️", examDate: "2026-05-06" },
  { id: "art-design", name: "AP Art and Design", short: "Sustained investigation, portfolio", icon: "🎨", examDate: "2026-05-09" },
  { id: "music", name: "AP Music Theory", short: "Harmony, analysis, aural skills", icon: "🎵", examDate: "2026-05-13" },
  { id: "spanish", name: "AP Spanish Language", short: "Interpretive & presentational modes", icon: "🇪🇸", examDate: "2026-05-14" },
  { id: "french", name: "AP French Language", short: "Interpersonal communication", icon: "🇫🇷", examDate: "2026-05-14" },
  { id: "german", name: "AP German Language", short: "Themes, texts, culture", icon: "🇩🇪", examDate: "2026-05-14" },
  { id: "latin", name: "AP Latin", short: "Vergil & Caesar, sight reading", icon: "🏺", examDate: "2026-05-14" },
  { id: "chinese", name: "AP Chinese Language", short: "Listening, reading, writing", icon: "🇨🇳", examDate: "2026-05-14" },
  { id: "japanese", name: "AP Japanese Language", short: "Communication & culture", icon: "🇯🇵", examDate: "2026-05-14" },
  { id: "seminar", name: "AP Seminar", short: "Team project, individual research", icon: "📝", examDate: "2026-05-01" },
  { id: "research", name: "AP Research", short: "Year-long academic paper", icon: "🔍", examDate: "2026-05-01" },
];

export const AP_COURSE_NAMES = AP_COURSES.map((c) => c.name);

export function getCourseByName(name: string): ApCourse | undefined {
  return AP_COURSES.find((c) => c.name === name);
}

export function buildCommonExamDates(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const c of AP_COURSES) {
    map[c.name] = c.examDate;
  }
  map["SAT Math"] = "2026-05-03";
  map["SAT Reading & Writing"] = "2026-05-03";
  return map;
}
