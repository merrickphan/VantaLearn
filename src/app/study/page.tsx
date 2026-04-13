"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, Badge } from "@/components/ui";
import { SimpleIconBox } from "@/components/icons/SimpleIconBox";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";

function StudyLibrary() {
  const searchParams = useSearchParams();
  const subjectFilter = searchParams.get("subject")?.trim() || "";

  const flashcardSets = SAMPLE_RESOURCES.filter((r) => r.type === "flashcard_set");
  const practiceExams = SAMPLE_RESOURCES.filter((r) => r.type === "practice_exam");

  const flashFiltered = subjectFilter
    ? flashcardSets.filter((r) => r.subject === subjectFilter)
    : flashcardSets;
  const examFiltered = subjectFilter
    ? practiceExams.filter((r) => r.subject === subjectFilter)
    : practiceExams;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 fade-up">
        <h1 className="font-display text-2xl font-bold text-vanta-text tracking-wide">Practice library</h1>
        <p className="text-vanta-muted text-sm mt-1">
          {subjectFilter ? (
            <>
              Filtered: <span className="text-sky-400">{subjectFilter}</span> ·{" "}
              <Link href="/study" className="text-sky-400 hover:underline">
                Clear filter
              </Link>
            </>
          ) : (
            "Browse flashcard decks and CB-style exams (including graph & data sets)"
          )}
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Flashcard decks</h2>
        {flashFiltered.length === 0 ? (
          <p className="text-vanta-muted text-sm py-6">No flashcards for this subject yet. Try another AP course or clear the filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
            {flashFiltered.map((set) => {
              const cards = (set.content_data as { cards: unknown[] }).cards;
              return (
                <Link key={set.id} href={`/study/flashcards?id=${set.id}`}>
                  <Card hover className="p-5 h-full border-vanta-border/80">
                    <div className="flex items-start justify-between mb-3">
                      <span aria-hidden>
                        <SimpleIconBox name="cards" size={32} />
                      </span>
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

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Practice exams</h2>
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
                  <Card hover className="p-5 h-full border-vanta-border/80">
                    <div className="flex items-start justify-between mb-3">
                      <span aria-hidden>
                        <SimpleIconBox name="document" size={32} />
                      </span>
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

      <section>
        <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Quick tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/study/tips">
            <Card hover className="p-5 border-vanta-border/80">
              <span className="mb-3 block" aria-hidden>
                <SimpleIconBox name="spark" size={36} />
              </span>
              <h3 className="text-vanta-text font-semibold mb-1">AI study tips</h3>
              <p className="text-vanta-muted text-sm">Personalized advice by subject</p>
            </Card>
          </Link>
          <Link href="/dashboard/score-calculator">
            <Card hover className="p-5 border-vanta-border/80">
              <span className="mb-3 block" aria-hidden>
                <SimpleIconBox name="calculator" size={36} />
              </span>
              <h3 className="text-vanta-text font-semibold mb-1">Score calculator</h3>
              <p className="text-vanta-muted text-sm">Estimate AP (1–5) or SAT score</p>
            </Card>
          </Link>
        </div>
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
