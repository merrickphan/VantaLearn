"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import type { ExamQuestion } from "@/types";
import { useExamProgress } from "@/hooks/useProgress";
import { Button, Card, Badge, ProgressBar, Textarea, Spinner } from "@/components/ui";
import { calculateAPScore } from "@/lib/utils";
import { ExamFigure } from "@/components/exam/ExamFigure";
import { SimpleIconBox } from "@/components/icons/SimpleIconBox";
import { recordExamComplete } from "@/lib/cmdStats";

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
 const [tapOptionIdx, setTapOptionIdx] = useState<number | null>(null);
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
 <Card
 className={`p-6 mb-4 transition-all duration-300 exam-card-enter ${isCorrect ? "border-vanta-success/70 shadow-[inset_0_0_0_1px_rgba(74,222,128,0.25)]" : isWrong ? "border-vanta-error/70 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.25)]" : ""}`}
 >
 {question.figure ? (
 <div className="figure-reveal mb-2">
 <ExamFigure figure={question.figure} />
 </div>
 ) : null}
 <p className="text-vanta-text font-medium mb-4 leading-relaxed">{question.question}</p>

 {question.type === "multiple_choice" && question.options ? (
 <div className="space-y-2">
 {question.options.map((opt, optIdx) => {
 const isSelected = answer === opt;
 const isCorrectOpt = submitted && opt === question.correct_answer;
 const isWrongOpt = submitted && isSelected && !isCorrectOpt;
 const isDimmed = submitted && !isCorrectOpt && !isWrongOpt;
 return (
 <button
 key={`${question.id}-opt-${optIdx}`}
 type="button"
 onClick={() => {
 if (submitted) return;
 setTapOptionIdx(optIdx);
 window.setTimeout(() => setTapOptionIdx(null), 420);
 onAnswer(opt);
 }}
 disabled={submitted}
 className={`exam-mcq-idle w-full text-left px-4 py-3 rounded-lg text-sm border
 ${tapOptionIdx === optIdx ? "exam-mcq-option-tap" : ""}
 ${isCorrectOpt ? "exam-mcq-correct" : ""}
 ${isWrongOpt ? "exam-mcq-wrong" : ""}
 ${!submitted && isSelected ? "bg-sky-200 border-sky-600 border-2 text-neutral-950 shadow-sm" : ""}
 ${!submitted && !isSelected ? "bg-slate-100 border-slate-300 text-neutral-950 hover:bg-slate-200 hover:border-slate-400" : ""}
 ${isDimmed ? "opacity-45 border-slate-300 bg-slate-100 text-neutral-950" : ""}
 disabled:cursor-default`}
 >
 <span className="flex items-center justify-between gap-3 w-full">
 <span className="leading-relaxed text-neutral-950">{opt}</span>
 {submitted && isCorrectOpt ? (
 <span className="shrink-0 text-lg font-bold text-green-800" aria-hidden>
 OK
 </span>
 ) : null}
 {submitted && isWrongOpt ? (
 <span className="shrink-0 text-lg font-bold text-red-800" aria-hidden>
 X
 </span>
 ) : null}
 </span>
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

export function ExamGame({
 questions,
 title,
 topSlot,
 onRetry,
}: {
 questions: ExamQuestion[];
 title: string;
 topSlot?: ReactNode;
 /** When set, "Try again" / new session uses this instead of full page reload */
 onRetry?: () => void;
}) {
 const { answers, submitted, answerQuestion, submit, stats } = useExamProgress(questions.length);
 const statsRecorded = useRef(false);

 useEffect(() => {
 if (!submitted || statsRecorded.current) return;
 statsRecorded.current = true;
 const correctCount = questions.filter((q) => answers[q.id] === q.correct_answer).length;
 const subject = questions[0]?.subject ?? "Mixed";
 recordExamComplete(subject, correctCount, questions.length);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [submitted, questions]);

 const handleRetry = () => {
 if (onRetry) onRetry();
 else window.location.reload();
 };

 if (submitted) {
 const correctCount = questions.filter((q) => answers[q.id] === q.correct_answer).length;
 const { apScore, percentage } = calculateAPScore({ rawScore: correctCount, totalQuestions: questions.length });

 return (
 <div className="max-w-2xl mx-auto px-4 py-8">
 <div className="text-center mb-8 fade-up">
 <div className="mb-4 flex justify-center motion-float" aria-hidden>
 <SimpleIconBox name="chart" size={48} />
 </div>
 <h1 className="text-2xl font-bold text-vanta-text mb-2">Exam Complete</h1>
 <p className="text-vanta-muted">{title}</p>
 </div>

 <Card className="p-6 mb-6 text-center fade-up shadow-lg shadow-sky-500/5">
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
 <Link href="/study" className="flex-1">
 <Button variant="secondary" className="w-full">
 Back to Library
 </Button>
 </Link>
 <Button onClick={handleRetry} className="flex-1">
 {onRetry ? "New questions" : "Try Again"}
 </Button>
 </div>
 </div>
 );
 }

 return (
 <div className="max-w-2xl mx-auto px-4 py-8">
 <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
 <div>
 <Link href="/study" className="text-xs text-vanta-muted hover:text-vanta-blue">
 Back: Library
 </Link>
 <h1 className="text-vanta-text font-semibold mt-0.5">{title}</h1>
 </div>
 <div className="flex items-center gap-2">
 {topSlot}
 <Badge variant="gray">
 {stats.answeredCount}/{questions.length} answered
 </Badge>
 </div>
 </div>

 <ProgressBar value={stats.progress} className="mb-8" />

 <div className="space-y-4 stagger">
 {questions.map((q, i) => (
 <div key={q.id} className="exam-card-enter" style={{ animationDelay: `${i * 45}ms` }}>
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
 <Button size="lg" onClick={submit} disabled={stats.answeredCount === 0}>
 Submit Exam (next)
 </Button>
 </div>
 </div>
 );
}
