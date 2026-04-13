import Link from "next/link";
import { Card } from "@/components/ui";

type Tool = {
  href: string;
  title: string;
  description: string;
  emoji: string;
  accent: string;
  badge?: string;
};

const TOOLS: Tool[] = [
  {
    href: "/study/exam?ai=1&subject=AP%20Calculus%20AB",
    title: "Practice tests",
    description: "Timed or untimed MCQs — AI or offline generators when needed.",
    emoji: "📝",
    accent: "from-sky-500/20 to-cyan-500/10",
  },
  {
    href: "/study/flashcards",
    title: "Flashcards",
    description: "Flip decks, mark what you know, and review weak cards.",
    emoji: "🗂️",
    accent: "from-violet-500/20 to-fuchsia-500/10",
  },
  {
    href: "/study/learn",
    title: "Learn mode",
    description: "Study flow with spaced repetition — remember more with less cramming.",
    emoji: "🧠",
    accent: "from-emerald-500/20 to-teal-500/10",
    badge: "Smart review",
  },
  {
    href: "/study/match",
    title: "Match",
    description: "Pair terms with definitions — quick, game-style recall.",
    emoji: "🎯",
    accent: "from-amber-500/20 to-orange-500/10",
    badge: "Soon",
  },
  {
    href: "/study/ai-units",
    title: "Guides by unit",
    description: "Pick a course and unit for focused AP-style questions.",
    emoji: "📚",
    accent: "from-rose-500/15 to-pink-500/10",
  },
  {
    href: "/study/tips",
    title: "AI study coach",
    description: "Ask for strategies, pacing, and how to break down tough topics.",
    emoji: "✨",
    accent: "from-indigo-500/20 to-blue-500/10",
  },
  {
    href: "/study/import",
    title: "Import sets",
    description: "Bring in decks from other tools — we’ll help you organize them here.",
    emoji: "📥",
    accent: "from-slate-500/20 to-slate-500/5",
    badge: "Soon",
  },
  {
    href: "/dashboard/score-calculator",
    title: "Score calculator",
    description: "Estimate AP 1–5 or SAT section scores from raw points.",
    emoji: "📊",
    accent: "from-green-500/15 to-emerald-500/10",
  },
];

export function StudyToolsGrid() {
  return (
    <section id="study-tools" className="mb-10 fade-up scroll-mt-24">
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-400/90">Study tools</p>
        <h2 className="font-display text-xl font-bold text-vanta-text mt-1">Everything in one place</h2>
        <p className="text-sm text-vanta-muted mt-1 max-w-2xl">
          Inspired by modern study apps: practice tests, cards, games, and AI help — pick a tool and dive in.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {TOOLS.map((t) => (
          <Link key={t.href} href={t.href} className="group block h-full">
            <Card
              hover
              className={`h-full p-5 border-white/10 bg-gradient-to-br ${t.accent} rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.25)]`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-3xl leading-none" aria-hidden>
                  {t.emoji}
                </span>
                {t.badge ? (
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/10 text-sky-200/90 border border-white/10">
                    {t.badge}
                  </span>
                ) : null}
              </div>
              <h3 className="text-vanta-text font-semibold text-base mb-1 group-hover:text-sky-100 transition-colors">{t.title}</h3>
              <p className="text-vanta-muted text-sm leading-relaxed">{t.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
