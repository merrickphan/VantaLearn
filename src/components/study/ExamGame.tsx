"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import type { ExamFigure as ExamFigureData, ExamQuestion } from "@/types";
import { useExamProgress } from "@/hooks/useProgress";
import { Button, Card, Badge, ProgressBar, Textarea, Spinner } from "@/components/ui";
import { calculateAPScore } from "@/lib/calculateAPScore";
import { ExamFigure } from "@/components/exam/ExamFigure";
import { SimpleIconBox } from "@/components/icons/SimpleIconBox";
import { recordExamComplete } from "@/lib/cmdStats";
import { formatNiceMath } from "@/lib/typography/niceMath";

function isStimulusFigure(f: ExamQuestion["figure"]): f is Extract<ExamFigureData, { kind: "stimulus" }> {
 return f?.kind === "stimulus";
}

/**
 * Stems that say the exhibit appears *below* the stem (AP Lang-style revision).
 * In those cases the numbered stem comes first, then the italic line, then choices.
 */
function stemSignalsExhibitBelow(question: ExamQuestion): boolean {
 if (!isStimulusFigure(question.figure)) return false;
 const q = question.question;
 return /reproduced below|shown below|in the (?:passage|excerpt|paragraph|text|following)(?:\s+\w+)?\s+below|\(below\)|below\s*,\s*which|following\s+sentence/i.test(
 q,
 );
}

function QuestionCard({
 question,
 questionNumber,
 answer,
 onAnswer,
 submitted,
}: {
 question: ExamQuestion;
 /** 1-based index shown like College Board booklets. */
 questionNumber: number;
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

 const fig = question.figure;
 const stim = isStimulusFigure(fig) ? fig : null;
 const dataFig = fig && !isStimulusFigure(fig) ? fig : null;
 const exhibitBelow = stim && stemSignalsExhibitBelow(question);
 const exhibitAboveStem = stim && !exhibitBelow;

 return (
 <Card
 className={`p-6 mb-4 transition-all duration-300 exam-card-enter ${isCorrect ? "border-vanta-success/70 shadow-[inset_0_0_0_1px_rgba(74,222,128,0.25)]" : isWrong ? "border-vanta-error/70 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.25)]" : ""}`}
 >
 {dataFig ? (
 <div className="figure-reveal mb-3">
 <ExamFigure figure={dataFig} />
 </div>
 ) : null}
 {exhibitAboveStem ? (
 <p className="mb-3 text-[15px] leading-relaxed text-vanta-text italic whitespace-pre-wrap">
 {formatNiceMath(stim.body)}
 </p>
 ) : null}
 <p className="text-vanta-text font-medium mb-3 leading-relaxed text-[15px]">
 <span className="tabular-nums">{questionNumber}. </span>
 {formatNiceMath(question.question)}
 </p>
 {exhibitBelow ? (
 <p className="mb-4 text-[15px] leading-relaxed text-vanta-text italic whitespace-pre-wrap">
 {formatNiceMath(stim.body)}
 </p>
 ) : null}

 {question.type === "multiple_choice" && question.options ? (
 <div className="space-y-2">
 {question.options.map((opt, optIdx) => {
 const letter = String.fromCharCode(65 + optIdx);
 const isSelected = answer === opt;
 const isCorrectOpt = submitted && opt === question.correct_answer;
 const isWrongOpt = submitted && isSelected && !isCorrectOpt;
 const isDimmed = submitted && !isCorrectOpt && !isWrongOpt;
 return (
 <button
 key={`${question.id}-opt-${optIdx}`}
 type="button"
 aria-label={`Answer ${letter}: ${formatNiceMath(opt)}`}
 onClick={() => {
 if (submitted) return;
 setTapOptionIdx(optIdx);
 window.setTimeout(() => setTapOptionIdx(null), 420);
 onAnswer(opt);
 }}
 disabled={submitted}
  className={`exam-mcq-idle w-full text-left px-4 py-3 rounded-lg text-[15px] border
 ${tapOptionIdx === optIdx ? "exam-mcq-option-tap" : ""}
 ${isCorrectOpt ? "exam-mcq-correct" : ""}
 ${isWrongOpt ? "exam-mcq-wrong" : ""}
 ${!submitted && isSelected ? "bg-sky-500/25 border-sky-500 border-2 text-vanta-text shadow-sm" : ""}
 ${!submitted && !isSelected ? "bg-vanta-surface-elevated border-vanta-border text-vanta-text hover:bg-vanta-surface-hover hover:border-sky-500/35" : ""}
 ${isDimmed ? "opacity-60 border-vanta-border bg-vanta-surface-elevated text-vanta-muted" : ""}
 disabled:cursor-default`}
 >
 <span className="flex items-start justify-between gap-3 w-full">
 <span className="flex flex-1 items-start gap-3 min-w-0">
 <span className="shrink-0 w-8 tabular-nums font-medium text-vanta-text pt-0.5">{letter}.</span>
 <span className="leading-relaxed text-vanta-text flex-1 min-w-0">{formatNiceMath(opt)}</span>
 </span>
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
 <p className="text-vanta-text text-sm leading-relaxed">{formatNiceMath(question.explanation)}</p>
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
 <div className="max-w-3xl mx-auto px-4 py-8">
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
 {questions.map((q, qi) => (
 <QuestionCard
 key={q.id}
 question={q}
 questionNumber={qi + 1}
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
 <div className="max-w-3xl mx-auto px-4 py-8">
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
 <QuestionCard
 question={q}
 questionNumber={i + 1}
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
