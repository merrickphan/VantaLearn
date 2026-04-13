"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, Badge } from "@/components/ui";
import { AP_CATEGORY_ORDER, getCoursesGroupedByCategory } from "@/lib/apCategories";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { StudyToolsGrid } from "@/components/study/StudyToolsGrid";
import { FriendlyCourseIcon } from "@/components/study/FriendlyCourseIcon";
import { FriendlyTileEmoji } from "@/components/study/FriendlyTileEmoji";

function StudyLibrary() {
  const searchParams = useSearchParams();
  const subjectFilter = searchParams.get("subject")?.trim() || "";
  const coursesByCategory = getCoursesGroupedByCategory();

  const flashcardSets = SAMPLE_RESOURCES.filter((r) => r.type === "flashcard_set");
  const practiceExams = SAMPLE_RESOURCES.filter((r) => r.type === "practice_exam");

  const flashFiltered = subjectFilter
    ? flashcardSets.filter((r) => r.subject === subjectFilter)
    : flashcardSets;
  const examFiltered = subjectFilter
    ? practiceExams.filter((r) => r.subject === subjectFilter)
    : practiceExams;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <header className="mb-10 fade-up">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-400/90">Study hub</p>
        <h1 className="font-display text-3xl font-bold text-vanta-text tracking-tight mt-2">Learn friendlier</h1>
        <p className="text-vanta-muted text-sm mt-2 max-w-2xl leading-relaxed">
          Practice tests, flashcards, and AI help in one calm place — rounded corners, clear labels, and quick jumps to what you need.
        </p>
      </header>

      <StudyToolsGrid />

      <section className="mb-10 fade-up rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/[0.12] via-emerald-900/5 to-cyan-900/10 px-5 py-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">AI-generated practice</p>
            <p className="text-sm text-vanta-text mt-2 leading-relaxed max-w-xl">
              Unlimited AP-style MCQs with charts & tables — new questions each run. Offline mode kicks in if the API quota runs out.
              Optional: <code className="text-[11px] bg-black/25 px-1.5 py-0.5 rounded-md">OPENAI_API_KEY</code>
            </p>
          </div>
          <Link
            href="/study/ai-units"
            className="inline-flex shrink-0 items-center justify-center text-sm px-4 py-2.5 rounded-2xl border border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/15 transition-colors font-medium"
          >
            By unit →
          </Link>
        </div>

        <div className="space-y-6">
          {AP_CATEGORY_ORDER.map((cat) => {
            const courses = coursesByCategory[cat.id];
            if (!courses.length) return null;
            return (
              <div key={cat.id}>
                <p className="text-[11px] font-semibold text-emerald-200/95 uppercase tracking-wide">{cat.label}</p>
                <p className="text-[10px] text-vanta-muted mb-2.5">{cat.short}</p>
                <div className="flex flex-wrap gap-2">
                  {courses.map((c) => (
                    <Link
                      key={c.id}
                      href={`/study/exam?ai=1&subject=${encodeURIComponent(c.name)}`}
                      className="inline-flex items-center gap-2 text-xs pl-2 pr-3.5 py-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-50 hover:bg-emerald-500/15 transition-colors"
                    >
                      <FriendlyCourseIcon courseId={c.id} size={34} className="shrink-0 shadow-sm" />
                      <span>{c.name.replace(/^AP\s+/, "")}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mb-8 fade-up">
        <h2 className="font-display text-xl font-bold text-vanta-text">Your library</h2>
        <p className="text-vanta-muted text-sm mt-1">
          {subjectFilter ? (
            <>
              Filtered: <span className="text-sky-400">{subjectFilter}</span> ·{" "}
              <Link href="/study" className="text-sky-400 hover:underline">
                Clear filter
              </Link>
            </>
          ) : (
            "Sample decks and exams — tap a card to open"
          )}
        </p>
      </div>

      <section className="mb-10">
        <h3 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Flashcard decks</h3>
        {flashFiltered.length === 0 ? (
          <p className="text-vanta-muted text-sm py-6">No flashcards for this subject yet. Try another AP course or clear the filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
            {flashFiltered.map((set) => {
              const cards = (set.content_data as { cards: unknown[] }).cards;
              return (
                <Link key={set.id} href={`/study/flashcards?id=${set.id}`}>
                  <Card hover className="p-5 h-full border-white/10 rounded-3xl bg-vanta-surface/80">
                    <div className="flex items-start justify-between mb-3">
                      <FriendlyTileEmoji emoji="🗂️" label="Flashcards" />
                      <Badge variant="blue">{cards.length} cards</Badge>
                    </div>
                    <h3 className="text-vanta-text font-semibold mb-1">{set.title}</h3>
                    <p className="text-vanta-muted text-sm">{set.subject}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h3 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Practice exams</h3>
        {examFiltered.length === 0 ? (
          <p className="text-vanta-muted text-sm py-6">
            No exams tagged for this subject yet. Open the full library or pick a featured set from the dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
            {examFiltered.map((exam) => {
              const { questions, time_limit_minutes } = exam.content_data as {
                questions: unknown[];
                time_limit_minutes?: number;
              };
              return (
                <Link key={exam.id} href={`/study/exam?id=${exam.id}`}>
                  <Card hover className="p-5 h-full border-white/10 rounded-3xl bg-vanta-surface/80">
                    <div className="flex items-start justify-between mb-3">
                      <FriendlyTileEmoji emoji="📋" label="Practice exam" />
                      <div className="flex gap-2">
                        <Badge variant="gray">{questions.length} Qs</Badge>
                        {time_limit_minutes ? <Badge variant="blue">{time_limit_minutes}m</Badge> : null}
                      </div>
                    </div>
                    <h3 className="text-vanta-text font-semibold mb-1">{exam.title}</h3>
                    <p className="text-vanta-muted text-sm">{exam.subject}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-vanta-muted text-sm">Loading…</div>}>
      <StudyLibrary />
    </Suspense>
  );
}
