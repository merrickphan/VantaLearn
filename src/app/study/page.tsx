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
 <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 md:py-12">
 <div className="mb-10 fade-up">
 <h1 className="font-display text-3xl md:text-4xl font-bold text-vanta-text tracking-wide">Practice library</h1>
 <p className="text-vanta-muted text-lg mt-3">
 <Link href="/study/ap-practice" className="text-sky-400 hover:underline font-medium">
 AP practice by section & unit
 </Link>
 <span className="text-vanta-muted"> - unlimited generated MCQ by topic.</span>
 </p>
 <p className="text-vanta-muted text-lg mt-2">
 {subjectFilter ? (
 <>
 Filtered: <span className="text-sky-400">{subjectFilter}</span> | {" "}
 <Link href="/study" className="text-sky-400 hover:underline">
 Clear filter
 </Link>
 </>
 ) : (
 "Browse flashcard decks and exam-style practice sets (including graph & data sets)"
 )}
 </p>
 </div>

 <section className="mb-10">
 <h2 className="text-base font-semibold text-vanta-muted uppercase tracking-wider mb-5">Flashcard decks</h2>
 {flashFiltered.length === 0 ? (
 <p className="text-vanta-muted text-lg py-8">No flashcards for this subject yet. Try another AP course or clear the filter.</p>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 stagger">
 {flashFiltered.map((set) => {
 const cards = (set.content_data as { cards: unknown[] }).cards;
 return (
 <Link key={set.id} href={`/study/flashcards?id=${set.id}`} className="fade-up block">
 <Card hover className="p-7 h-full border-vanta-border/80">
 <div className="flex items-start justify-between mb-4">
 <span aria-hidden>
 <SimpleIconBox name="cards" size={42} />
 </span>
 <Badge variant="blue">{cards.length} cards</Badge>
 </div>
 <h3 className="text-vanta-text font-semibold text-xl mb-1">{set.title}</h3>
 <p className="text-vanta-muted text-base">{set.subject}</p>
 </Card>
 </Link>
 );
 })}
 </div>
 )}
 </section>

 <section className="mb-10">
 <h2 className="text-base font-semibold text-vanta-muted uppercase tracking-wider mb-5">Practice exams</h2>
 {examFiltered.length === 0 ? (
 <p className="text-vanta-muted text-lg py-8">
 No exams tagged for this subject yet. Open the full library or pick a featured set from the dashboard.
 </p>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 stagger">
 {examFiltered.map((exam) => {
 const { questions, time_limit_minutes } = exam.content_data as {
 questions: unknown[];
 time_limit_minutes?: number;
 };
 return (
 <Link key={exam.id} href={`/study/exam?id=${exam.id}`} className="fade-up block">
 <Card hover className="p-7 h-full border-vanta-border/80">
 <div className="flex items-start justify-between mb-4">
 <span aria-hidden>
 <SimpleIconBox name="document" size={42} />
 </span>
 <div className="flex gap-2">
 <Badge variant="gray">{questions.length} Qs</Badge>
 {time_limit_minutes ? <Badge variant="blue">{time_limit_minutes}m</Badge> : null}
 </div>
 </div>
 <h3 className="text-vanta-text font-semibold text-xl mb-1">{exam.title}</h3>
 <p className="text-vanta-muted text-base">{exam.subject}</p>
 </Card>
 </Link>
 );
 })}
 </div>
 )}
 </section>

 <section>
 <h2 className="text-base font-semibold text-vanta-muted uppercase tracking-wider mb-5">Quick tools</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 stagger">
 <Link href="/study/tips" className="fade-up block">
 <Card hover className="p-7 border-vanta-border/80">
 <span className="mb-4 block" aria-hidden>
 <SimpleIconBox name="spark" size={44} />
 </span>
 <h3 className="text-vanta-text font-semibold text-xl mb-2">AI study tips</h3>
 <p className="text-vanta-muted text-base">Personalized advice by subject</p>
 </Card>
 </Link>
 <Link href="/dashboard/score-calculator" className="fade-up block">
 <Card hover className="p-7 border-vanta-border/80">
 <span className="mb-4 block" aria-hidden>
 <SimpleIconBox name="calculator" size={44} />
 </span>
 <h3 className="text-vanta-text font-semibold text-xl mb-2">Score calculator</h3>
 <p className="text-vanta-muted text-base">Estimate AP® scores (1-5) by course or quick %</p>
 </Card>
 </Link>
 </div>
 </section>
 </div>
 );
}

export default function StudyPage() {
 return (
 <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-vanta-muted text-lg">Loading...</div>}>
 <StudyLibrary />
 </Suspense>
 );
}
