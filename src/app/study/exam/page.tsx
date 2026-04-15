"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { AP_COURSES } from "@/lib/apCatalog";
import { proceduralPracticeMcqCountForCourse } from "@/lib/apPracticeExamFormat";
import type { PracticeSessionQuery } from "@/lib/examPracticeSessionQuery";
import { parsePracticeSessionQuery } from "@/lib/examPracticeSessionQuery";
import { getUnitOrFirst, getUnitsForCourseId } from "@/lib/apUnits";
import type { CalculatorSectionPolicy } from "@/lib/questions/procedural";
import { AP_FRQ_PRACTICE_SET_COUNT } from "@/lib/questions/procedural/apFrqSets";
import { ExamContent, ExamQuestion } from "@/types";
import { Button, Spinner } from "@/components/ui";
import { ExamGame } from "@/components/study/ExamGame";

const AiExamSession = dynamic(
 () => import("@/components/study/AiExamSession").then((m) => m.AiExamSession),
 { ssr: false, loading: () => <Spinner size="lg" /> },
);

function ProceduralExamSession({
 courseId,
 unitParam,
 calculatorSection,
 practice,
}: {
 courseId: string;
 unitParam?: string;
 calculatorSection?: CalculatorSectionPolicy;
 practice: PracticeSessionQuery;
}) {
 const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
 const [error, setError] = useState<string | null>(null);

 const course = AP_COURSES.find((c) => c.id === courseId);
 const isAllUnits = unitParam === "all";
 const units = courseId ? getUnitsForCourseId(courseId) : [];
 const unitForTitle = isAllUnits ? undefined : getUnitOrFirst(courseId, unitParam || undefined);
 const resolvedUnitId = isAllUnits ? "all" : unitForTitle?.id;

 const effectiveCount = practice.count ?? proceduralPracticeMcqCountForCourse(courseId);

 useEffect(() => {
 let cancelled = false;
 setQuestions(null);
 setError(null);
 if (!courseId || !resolvedUnitId) return;
 (async () => {
 try {
 const res = await fetch("/api/questions/procedural", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 courseId,
 unitId: resolvedUnitId,
 count: effectiveCount,
 ...(calculatorSection ? { calculatorSection } : {}),
 difficulty: practice.difficulty,
 }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || "Could not generate questions.");
 if (!cancelled) setQuestions(data.questions as ExamQuestion[]);
 } catch (e) {
 if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong.");
 }
 })();
 return () => {
 cancelled = true;
 };
 }, [courseId, resolvedUnitId, calculatorSection, effectiveCount, practice.difficulty]);

 if (!course || units.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
 <p className="text-vanta-muted mb-4">Unknown course or unit.</p>
 <Link href="/study/ap-practice">
 <Button variant="secondary">AP practice</Button>
 </Link>
 </div>
 );
 }

 if (error) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-md mx-auto">
 <p className="text-vanta-error mb-4">{error}</p>
 <Link href="/study/ap-practice">
 <Button variant="secondary">Back</Button>
 </Link>
 </div>
 );
 }

 if (!questions) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
 <Spinner size="lg" />
 <p className="text-vanta-muted text-lg">Building a fresh practice set...</p>
 </div>
 );
 }

 const title = `${course.name} | AP Exam Replica`;

 return (
 <ExamGame
 questions={questions}
 title={title}
 timeLimitSeconds={practice.timeLimitSeconds}
 showDesmosCalculator={practice.showDesmos}
 />
 );
}

function ProceduralFrqExamSession({
 courseId,
 unitParam,
 practice,
 setIndex,
}: {
 courseId: string;
 unitParam?: string;
 practice: PracticeSessionQuery;
 setIndex: number;
}) {
 const router = useRouter();
 const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
 const [error, setError] = useState<string | null>(null);

 const course = AP_COURSES.find((c) => c.id === courseId);
 const isAllUnits = unitParam === "all";
 const units = courseId ? getUnitsForCourseId(courseId) : [];
 const unitForTitle = isAllUnits ? undefined : getUnitOrFirst(courseId, unitParam || undefined);
 const resolvedUnitId = isAllUnits ? "all" : unitForTitle?.id;

 useEffect(() => {
 let cancelled = false;
 setQuestions(null);
 setError(null);
 if (!courseId || !resolvedUnitId) return;
 (async () => {
 try {
 const res = await fetch("/api/questions/frq-set", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 courseId,
 unitId: resolvedUnitId,
 setIndex,
 difficulty: practice.difficulty,
 }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || "Could not generate FRQ set.");
 if (!cancelled) {
 setQuestions(data.questions as ExamQuestion[]);
 }
 } catch (e) {
 if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong.");
 }
 })();
 return () => {
 cancelled = true;
 };
 }, [courseId, resolvedUnitId, setIndex, practice.difficulty]);

 if (!course || units.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
 <p className="text-vanta-muted mb-4">Unknown course or unit.</p>
 <Link href="/study/ap-practice">
 <Button variant="secondary">AP practice</Button>
 </Link>
 </div>
 );
 }

 if (error) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-md mx-auto">
 <p className="text-vanta-error mb-4">{error}</p>
 <Link href="/study/ap-practice">
 <Button variant="secondary">Back</Button>
 </Link>
 </div>
 );
 }

 if (!questions) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
 <Spinner size="lg" />
 <p className="text-vanta-muted text-lg">Building FRQ practice set…</p>
 </div>
 );
 }

 const title = `${course.name} | AP Exam Replica`;

 return (
 <ExamGame
 questions={questions}
 title={title}
 timeLimitSeconds={practice.timeLimitSeconds}
 showDesmosCalculator={practice.showDesmos}
 onRetry={() => {
 const next = Math.floor(Math.random() * AP_FRQ_PRACTICE_SET_COUNT);
 const u = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
 u.set("procFrq", "1");
 u.set("course", courseId);
 u.set("unit", resolvedUnitId ?? "all");
 u.set("set", String(next));
 u.set("difficulty", practice.difficulty);
 u.set("timerM", String(Math.floor(practice.timeLimitSeconds / 60)));
 u.set("timerS", String(practice.timeLimitSeconds % 60));
 if (practice.showDesmos) {
 u.set("calcSection", "calculator");
 }
 router.push(`/study/exam?${u.toString()}`);
 }}
 />
 );
}

function ExamPlayer() {
 const searchParams = useSearchParams();
 const rawCalcSection = searchParams.get("calcSection")?.trim();
 const calculatorSection: CalculatorSectionPolicy | undefined =
 rawCalcSection === "no_calculator" || rawCalcSection === "calculator" ? rawCalcSection : undefined;
 const proc = searchParams.get("proc") === "1";
 const procFrq = searchParams.get("procFrq") === "1";
 const courseId = searchParams.get("course")?.trim() ?? "";
 const unitParam = searchParams.get("unit")?.trim() ?? "";
 const rawSet = parseInt(searchParams.get("set") || "", 10);
 const frqSetIndex = Number.isFinite(rawSet)
 ? Math.min(AP_FRQ_PRACTICE_SET_COUNT - 1, Math.max(0, Math.floor(rawSet)))
 : Math.floor(Math.random() * AP_FRQ_PRACTICE_SET_COUNT);

 if (procFrq && courseId) {
 const practice = parsePracticeSessionQuery(searchParams, { courseId });
 return (
 <ProceduralFrqExamSession
 courseId={courseId}
 unitParam={unitParam || undefined}
 practice={practice}
 setIndex={frqSetIndex}
 />
 );
 }

 if (proc && courseId) {
 const practice = parsePracticeSessionQuery(searchParams, { courseId });
 return (
 <ProceduralExamSession
 courseId={courseId}
 unitParam={unitParam || undefined}
 calculatorSection={calculatorSection}
 practice={practice}
 />
 );
 }

 const id = searchParams.get("id");
 const ai = searchParams.get("ai") === "1";
 const proceduralOnly = searchParams.get("procedural") === "1";
 const subject = searchParams.get("subject")?.trim() || "";
 const topic = searchParams.get("topic")?.trim() || "";
 const unitId = searchParams.get("unit")?.trim() || "";

 if (ai) {
 if (!subject) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
 <p className="text-vanta-muted mb-4">Pick a subject (and optional unit) for AI practice.</p>
 <div className="flex flex-wrap gap-3 justify-center">
 <Link href="/study">
 <Button variant="secondary">Open study library</Button>
 </Link>
 <Link href="/study/ai-units">
 <Button variant="secondary">Browse all units</Button>
 </Link>
 </div>
 </div>
 );
 }
 let subj = subject;
 let top = topic;
 try {
 subj = decodeURIComponent(subject);
 if (topic) top = decodeURIComponent(topic);
 } catch {
 /* use raw */
 }
 const practice = parsePracticeSessionQuery(searchParams, { subjectName: subj });
 return (
 <AiExamSession
 subject={subj}
 topic={top || undefined}
 unitId={unitId || undefined}
 proceduralOnly={proceduralOnly}
 calculatorSection={calculatorSection}
 practice={practice}
 />
 );
 }

 const resource = SAMPLE_RESOURCES.find((r) => r.id === id && r.type === "practice_exam");

 if (!resource) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
 <p className="text-vanta-muted mb-4">Exam not found.</p>
 <div className="flex flex-wrap gap-3 justify-center">
 <Link href="/study">
 <Button variant="secondary">Back to Library</Button>
 </Link>
 <Link href="/study/ap-practice">
 <Button variant="secondary">AP practice by unit</Button>
 </Link>
 </div>
 </div>
 );
 }

 const { questions } = resource.content_data as ExamContent;
 return <ExamGame questions={questions} title={resource.title} />;
}

export default function ExamPage() {
 return (
 <Suspense
 fallback={
 <div className="flex items-center justify-center min-h-screen">
 <div className="w-8 h-8 border-2 border-vanta-border border-t-vanta-blue rounded-full animate-spin" />
 </div>
 }
 >
 <ExamPlayer />
 </Suspense>
 );
}
