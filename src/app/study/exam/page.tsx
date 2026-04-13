"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { ExamContent } from "@/types";
import { Button } from "@/components/ui";
import { ExamGame } from "@/components/study/ExamGame";
import { AiExamSession } from "@/components/study/AiExamSession";

function ExamPlayer() {
  const searchParams = useSearchParams();
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
        <Link href="/study">
          <Button variant="secondary">Back to Library</Button>
        </Link>
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
