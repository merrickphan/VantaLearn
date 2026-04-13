"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { AP_COURSES } from "@/lib/apCatalog";
import { getUnitOrFirst } from "@/lib/apUnits";
import { ExamContent, ExamQuestion } from "@/types";
import { Button, Spinner } from "@/components/ui";
import { ExamGame } from "@/components/study/ExamGame";
import { AiExamSession } from "@/components/study/AiExamSession";

function ProceduralExamSession({ courseId, unitId }: { courseId: string; unitId?: string }) {
 const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
 const [error, setError] = useState<string | null>(null);

 const course = AP_COURSES.find((c) => c.id === courseId);
 const unit = getUnitOrFirst(courseId, unitId);

 useEffect(() => {
 let cancelled = false;
 setQuestions(null);
 setError(null);
 (async () => {
 try {
 const res = await fetch("/api/questions/procedural", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ courseId, unitId: unit?.id, count: 10 }),
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
 }, [courseId, unit?.id, unitId]);

 if (!course || !unit) {
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

 const title = `${course.name} | Unit ${unit.index}: ${unit.title}`;
 return <ExamGame questions={questions} title={title} />;
}

function ExamPlayer() {
 const searchParams = useSearchParams();
 const proc = searchParams.get("proc") === "1";
 const courseId = searchParams.get("course")?.trim() ?? "";
 const unitParam = searchParams.get("unit")?.trim() ?? "";

 if (proc && courseId) {
 return <ProceduralExamSession courseId={courseId} unitId={unitParam || undefined} />;
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
 return (
 <AiExamSession
 subject={subj}
 topic={top || undefined}
 unitId={unitId || undefined}
 proceduralOnly={proceduralOnly}
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
