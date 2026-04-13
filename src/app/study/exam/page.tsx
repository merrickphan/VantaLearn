"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { ExamContent, ExamQuestion } from "@/types";
import { useExamProgress } from "@/hooks/useProgress";
import { Button, Card, Badge, ProgressBar, Textarea, Spinner } from "@/components/ui";
import { calculateAPScore } from "@/lib/utils";
import Link from "next/link";
import { ExamFigure } from "@/components/exam/ExamFigure";
import { SimpleIconBox } from "@/components/icons/SimpleIconBox";
import { recordExamComplete } from "@/lib/cmdStats";

function ExamPlayer() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const resource = SAMPLE_RESOURCES.find((r) => r.id === id && r.type === "practice_exam");

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-vanta-muted mb-4">Exam not found.</p>
        <Link href="/study"><Button variant="secondary">Back to Library</Button></Link>
      </div>
    );
  }

  const { questions } = resource.content_data as ExamContent;
  return <ExamGame questions={questions} title={resource.title} />;
}

function QuestionCard({
  question,
  answer,
  onAnswer,
  submitted,
}: {
  question: ExamQuestion;
  answer: string;
  onAnswer: (a: string) => void;
  submitted: boolean;
}) {
  const isCorrect = submitted && answer === question.correct_answer;
  const isWrong = submitted && answer && answer !== question.correct_answer;
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackRequested, setFeedbackRequested] = useState(false);

  const getAIFeedback = async () => {
    setLoadingFeedback(true);
    setFeedbackRequested(true);
    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          userAnswer: answer,
          correctAnswer: question.correct_answer,
          subject: question.subject,
        }),
      });
      const data = await res.json();
      setAiFeedback(data.feedback || "Unable to get feedback right now.");
    } catch {
      setAiFeedback("Could not connect to AI. Please check your API key.");
    }
    setLoadingFeedback(false);
  };

  return (
    <Card className={`p-6 mb-4 transition-colors ${isCorrect ? "border-vanta-success/40" : isWrong ? "border-vanta-error/40" : ""}`}>
      {question.figure ? <ExamFigure figure={question.figure} /> : null}
      <p className="text-vanta-text font-medium mb-4 leading-relaxed">{question.question}</p>

      {question.type === "multiple_choice" && question.options ? (
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = answer === opt;
            const isCorrectOpt = submitted && opt === question.correct_answer;
            const isWrongOpt = submitted && isSelected && !isCorrectOpt;
            return (
              <button
                key={opt}
                onClick={() => !submitted && onAnswer(opt)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm border transition-all
                  ${isCorrectOpt ? "bg-vanta-success/15 border-vanta-success text-vanta-success" :
                    isWrongOpt ? "bg-vanta-error/15 border-vanta-error text-vanta-error" :
                    isSelected ? "bg-vanta-blue/15 border-vanta-blue text-vanta-blue" :
                    "border-vanta-border text-vanta-text hover:border-vanta-blue/40 hover:bg-vanta-blue/5"
                  } disabled:cursor-default`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <Textarea
          placeholder="Write your response here..."
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
          disabled={submitted}
          rows={5}
        />
      )}

      {submitted && question.explanation && (
        <div className="mt-4 p-4 bg-vanta-bg rounded-lg border border-vanta-border">
          <p className="text-xs text-vanta-muted font-semibold uppercase tracking-wider mb-1">Explanation</p>
          <p className="text-vanta-text text-sm leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {submitted && (
        <div className="mt-3">
          {!feedbackRequested ? (
            <Button variant="ghost" size="sm" onClick={getAIFeedback} className="gap-2">
              <span aria-hidden className="inline-flex">
                <SimpleIconBox name="spark" size={22} />
              </span>
              Get AI feedback
            </Button>
          ) : loadingFeedback ? (
            <div className="flex items-center gap-2 text-vanta-muted text-sm">
              <Spinner size="sm" />
              <span className="ai-pulse">Analyzing your answer...</span>
            </div>
          ) : aiFeedback ? (
            <div className="mt-3 p-4 bg-vanta-blue/5 border border-vanta-blue/20 rounded-lg">
              <p className="text-xs text-vanta-blue font-semibold mb-2 flex items-center gap-2">
                <span aria-hidden className="inline-flex">
                  <SimpleIconBox name="spark" size={20} />
                </span>
                AI feedback
              </p>
              <p className="text-vanta-text text-sm leading-relaxed whitespace-pre-line">{aiFeedback}</p>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}

function ExamGame({ questions, title }: { questions: ExamQuestion[]; title: string }) {
  const { answers, submitted, answerQuestion, submit, stats } = useExamProgress(questions.length);
  const statsRecorded = useRef(false);

  useEffect(() => {
    if (!submitted || statsRecorded.current) return;
    statsRecorded.current = true;
    const correctCount = questions.filter((q) => answers[q.id] === q.correct_answer).length;
    const subject = questions[0]?.subject ?? "Mixed";
    recordExamComplete(subject, correctCount, questions.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- answers captured when submit completes
  }, [submitted, questions]);

  if (submitted) {
    const correctCount = questions.filter((q) => answers[q.id] === q.correct_answer).length;
    const { apScore, percentage } = calculateAPScore({ rawScore: correctCount, totalQuestions: questions.length });

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8 fade-up">
          <div className="mb-4 flex justify-center" aria-hidden>
            <SimpleIconBox name="chart" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-vanta-text mb-2">Exam Complete</h1>
          <p className="text-vanta-muted">{title}</p>
        </div>

        <Card className="p-6 mb-6 text-center fade-up">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-vanta-blue">{correctCount}/{questions.length}</p>
              <p className="text-xs text-vanta-muted mt-1">Raw Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-vanta-text">{percentage.toFixed(0)}%</p>
              <p className="text-xs text-vanta-muted mt-1">Accuracy</p>
            </div>
            <div>
              <p className={`text-3xl font-bold ${apScore >= 3 ? "text-vanta-success" : "text-vanta-error"}`}>{apScore}</p>
              <p className="text-xs text-vanta-muted mt-1">Est. AP Score</p>
            </div>
          </div>
          <ProgressBar value={percentage} className="mt-4" color={percentage >= 60 ? "green" : "blue"} showLabel />
        </Card>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider">Review Answers</h2>
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              answer={answers[q.id] || ""}
              onAnswer={() => {}}
              submitted={true}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Link href="/study" className="flex-1"><Button variant="secondary" className="w-full">Back to Library</Button></Link>
          <Button onClick={() => window.location.reload()} className="flex-1">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/study" className="text-xs text-vanta-muted hover:text-vanta-blue">← Library</Link>
          <h1 className="text-vanta-text font-semibold mt-0.5">{title}</h1>
        </div>
        <Badge variant="gray">{stats.answeredCount}/{questions.length} answered</Badge>
      </div>

      <ProgressBar value={stats.progress} className="mb-8" />

      <div className="space-y-4 stagger">
        {questions.map((q, i) => (
          <div key={q.id}>
            <p className="text-xs text-vanta-muted mb-2">Question {i + 1}</p>
            <QuestionCard
              question={q}
              answer={answers[q.id] || ""}
              onAnswer={(a) => answerQuestion(q.id, a)}
              submitted={false}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          size="lg"
          onClick={submit}
          disabled={stats.answeredCount === 0}
        >
          Submit Exam →
        </Button>
      </div>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-vanta-border border-t-vanta-blue rounded-full animate-spin" /></div>}>
      <ExamPlayer />
    </Suspense>
  );
}
