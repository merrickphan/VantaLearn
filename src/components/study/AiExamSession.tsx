"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { ExamQuestion } from "@/types";
import { Button, Card } from "@/components/ui";
import { ExamGame } from "@/components/study/ExamGame";

type Phase = "loading" | "ready" | "error";

export function AiExamSession({ subject, topic }: { subject: string; topic?: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  const load = useCallback(async () => {
    setPhase("loading");
    setError("");
    try {
      const res = await fetch("/api/ai/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic: topic || undefined,
          count: 8,
          includeFigures: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      const qs = data.questions as ExamQuestion[];
      if (!Array.isArray(qs) || qs.length === 0) throw new Error("No questions returned");
      setQuestions(qs);
      setSessionKey((k) => k + 1);
      setPhase("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setPhase("error");
    }
  }, [subject, topic]);

  useEffect(() => {
    load();
  }, [load]);

  if (phase === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex flex-col items-center gap-4 animate-fade-in-up">
          <div className="w-12 h-12 border-2 border-vanta-border border-t-sky-400 rounded-full animate-spin" />
          <p className="text-vanta-text font-medium">Generating AP-style questions…</p>
          <p className="text-sm text-vanta-muted max-w-md">
            AI is writing stems, distractors, and optional charts or tables. This usually takes 15–40 seconds.
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
        </Card>
      </div>
    );
  }

  return (
    <ExamGame
      key={sessionKey}
      questions={questions}
      title={`${subject} · AI practice`}
      topSlot={
        <Button variant="secondary" size="sm" onClick={load}>
          New set
        </Button>
      }
      onRetry={load}
    />
  );
}
