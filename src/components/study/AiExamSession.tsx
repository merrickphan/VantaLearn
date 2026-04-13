"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { ExamQuestion } from "@/types";
import { Button, Card } from "@/components/ui";
import { ExamGame } from "@/components/study/ExamGame";
import { findUnitById, getCourseIdFromSubjectName } from "@/lib/apUnits";

type Phase = "loading" | "ready" | "error";

export function AiExamSession({
  subject,
  topic,
  unitId,
  proceduralOnly = false,
}: {
  subject: string;
  topic?: string;
  /** Locks generation to one curriculum unit (e.g. bio-u3) */
  unitId?: string;
  /** Skip OpenAI; unlimited locally generated MCQs (templates + random parameters). */
  proceduralOnly?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [sessionKey, setSessionKey] = useState(0);
  const [usedProcedural, setUsedProcedural] = useState(false);

  const unitMeta = unitId ? findUnitById(unitId) : null;
  const examTitle =
    unitMeta != null
      ? `${subject} · Unit ${unitMeta.unit.index}: ${unitMeta.unit.title}${usedProcedural ? " (offline)" : ""}`
      : `${subject} · ${usedProcedural ? "Offline practice" : "AI practice"}`;

  const loadProcedural = useCallback(async () => {
    const courseId = getCourseIdFromSubjectName(subject);
    if (!courseId) {
      throw new Error("That subject is not linked to a catalog course for offline practice.");
    }
    const res = await fetch("/api/questions/procedural", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        unitId: unitId || undefined,
        count: 8,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Offline generation failed");
    const qs = data.questions as ExamQuestion[];
    if (!Array.isArray(qs) || qs.length === 0) throw new Error("No questions returned");
    return qs;
  }, [subject, unitId]);

  const load = useCallback(async () => {
    setPhase("loading");
    setError("");
    setUsedProcedural(false);
    try {
      if (proceduralOnly) {
        const qs = await loadProcedural();
        setQuestions(qs);
        setUsedProcedural(true);
        setSessionKey((k) => k + 1);
        setPhase("ready");
        return;
      }

      const varietySeed = Date.now() ^ (Math.floor(Math.random() * 0xffff) << 8);
      const res = await fetch("/api/ai/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic: topic || undefined,
          count: 8,
          includeFigures: true,
          unitId: unitId || undefined,
          varietySeed,
        }),
      });
      const data = await res.json();
      const errText = String(data?.error ?? "");
      const quotaHit =
        res.status === 429 ||
        res.status === 402 ||
        /quota|exceeded your|billing|rate limit|insufficient funds|429/i.test(errText);

      if (res.ok) {
        const qs = data.questions as ExamQuestion[];
        if (Array.isArray(qs) && qs.length > 0) {
          setQuestions(qs);
          setUsedProcedural(false);
          setSessionKey((k) => k + 1);
          setPhase("ready");
          return;
        }
      }

      if (quotaHit || !res.ok) {
        const qs = await loadProcedural();
        setQuestions(qs);
        setUsedProcedural(true);
        setSessionKey((k) => k + 1);
        setPhase("ready");
        return;
      }

      throw new Error(errText || "Request failed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setPhase("error");
    }
  }, [subject, topic, unitId, proceduralOnly, loadProcedural]);

  useEffect(() => {
    load();
  }, [load]);

  if (phase === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex flex-col items-center gap-4 animate-fade-in-up">
          <div className="w-12 h-12 border-2 border-vanta-border border-t-sky-400 rounded-full animate-spin" />
          <p className="text-vanta-text font-medium">
            {proceduralOnly || usedProcedural
              ? "Building practice set…"
              : unitMeta
                ? `Generating questions for Unit ${unitMeta.unit.index}…`
                : "Generating AP-style questions…"}
          </p>
          <p className="text-sm text-vanta-muted max-w-md">
            {proceduralOnly || usedProcedural ? (
              <>Unlimited offline questions: randomized numbers and templates — no API calls.</>
            ) : unitMeta ? (
              <>
                <span className="text-vanta-text">{unitMeta.unit.title}</span> — new stems each run via unit-specific variety hooks.
              </>
            ) : (
              <>AI is writing stems, distractors, and optional charts or tables. This usually takes 15–40 seconds.</>
            )}
          </p>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <Card className="p-6 border-vanta-error/30 text-center">
          <p className="text-vanta-error text-sm mb-4">{error}</p>
          <Button onClick={load}>Try again</Button>
          <Link href="/study" className="block mt-4 text-sm text-sky-400 hover:underline">
            ← Back to library
          </Link>
          <Link href="/study/ai-units" className="block mt-2 text-sm text-sky-400/80 hover:underline">
            Browse units
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <ExamGame
      key={sessionKey}
      questions={questions}
      title={examTitle}
      topSlot={
        <Button variant="secondary" size="sm" onClick={load}>
          New set
        </Button>
      }
      onRetry={load}
    />
  );
}
