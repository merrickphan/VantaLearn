"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import Link from "next/link";
import type { ExamFigure as ExamFigureData, ExamQuestion, FrqRubricDoc } from "@/types";
import { AP_FRQ_PLACEHOLDER_ANSWER } from "@/lib/questions/procedural/apFrqSets";
import { frqAnswerHasAnyDraft, mergeFrqPartAnswer, parseFrqPartAnswers } from "@/lib/exam/frqSectionAnswers";
import { useExamProgress } from "@/hooks/useProgress";
import { useTimer } from "@/hooks/useTimer";
import { DesmosCalculatorDock } from "@/components/study/DesmosCalculatorDock";
import { Button, Card, Badge, ProgressBar, Textarea, Spinner } from "@/components/ui";
import { calculateAPScore } from "@/lib/calculateAPScore";
import { ExamFigure } from "@/components/exam/ExamFigure";
import { ExamRasterizedBlock } from "@/components/exam/ExamRasterizedBlock";
import { ExamRasterLine, ExamRasterMath } from "@/components/exam/ExamRasterMath";
import { SimpleIconBox } from "@/components/icons/SimpleIconBox";
import { recordExamComplete } from "@/lib/cmdStats";
import { hashString } from "@/lib/questions/procedural/utils";
import { formatNiceMath } from "@/lib/typography/niceMath";
import { stripMarkdownBoldMarkers } from "@/lib/typography/plainExamText";
import { shouldExamMathStem } from "@/lib/typography/examPlainMathToLatex";
import { MathText } from "@/components/typography/MathText";

function isStimulusFigure(f: ExamQuestion["figure"]): f is Extract<ExamFigureData, { kind: "stimulus" }> {
 return f?.kind === "stimulus";
}

/**
 * Stems that say the exhibit appears *below* the stem (AP Lang-style revision).
 * In those cases the numbered stem comes first, then the italic line, then choices.
 */
function FrqRubricPanel({ doc, omitPartPrompts = false }: { doc: FrqRubricDoc; omitPartPrompts?: boolean }) {
	return (
		<div className="mt-4 rounded-xl border border-sky-500/25 bg-gradient-to-b from-sky-500/[0.08] to-transparent overflow-hidden shadow-[inset_0_1px_0_rgba(56,189,248,0.12)]">
			<div className="px-4 py-3 border-b border-sky-500/20 bg-sky-500/10 flex flex-wrap items-center justify-between gap-2">
				<span className="text-sm font-semibold text-vanta-text tracking-tight">{doc.header}</span>
				<span className="text-xs font-bold uppercase tracking-wider text-sky-200/95 tabular-nums shrink-0">
					{doc.totalPoints} points
				</span>
			</div>
			<div className="p-4 sm:p-5 space-y-6">
				{doc.parts.map((part) => (
					<div key={part.letter} className="border-t border-vanta-border/50 first:border-0 first:pt-0 pt-5 first:mt-0 mt-1">
						<div className="flex flex-wrap items-start justify-between gap-2 mb-2">
							<p className="text-sm font-bold text-vanta-text">
								<span className="tabular-nums">{part.letter}.</span>
								{omitPartPrompts ? null : (
									<>
										{" "}
										<span className="font-medium text-vanta-muted">{part.promptText}</span>
									</>
								)}
							</p>
							<span className="text-xs font-semibold text-sky-300/90 tabular-nums shrink-0">{part.maxPoints} pt</span>
						</div>
						{part.criteria.map((c, idx) => (
							<div key={`${part.letter}-c-${idx}`} className="mb-4 pl-3 sm:pl-4 border-l-2 border-sky-500/35">
								<p className="text-xs font-bold text-sky-100/95 mb-1">
									{c.pointLabel}{" "}
									<span className="font-semibold text-vanta-text/90">— {c.descriptor}</span>
								</p>
								<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-vanta-muted mb-2">
									Examples of acceptable responses may include:
								</p>
								<ul className="list-disc pl-5 space-y-1.5 text-sm text-vanta-text leading-relaxed marker:text-sky-400/80">
									{c.acceptableExamples.map((ex, j) => (
										<li key={j}>
											<ExamRasterMath text={ex} plainAlt={ex} />
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

function stemSignalsExhibitBelow(question: ExamQuestion): boolean {
	if (!isStimulusFigure(question.figure)) return false;
	const q = question.frq_stem ?? question.question;
	return /reproduced below|shown below|in the (?:passage|excerpt|paragraph|text|following)(?:\s+\w+)?\s+below|\(below\)|below\s*,\s*which|following\s+sentence/i.test(
		q,
	);
}

/** AP booklet-style “Respond to A, B, C, … and G.” */
function frqRespondToDirectoryLine(letters: string[]): string {
	const ls = letters.filter(Boolean);
	if (ls.length === 0) return "";
	if (ls.length === 1) return `Respond to ${ls[0]}.`;
	if (ls.length === 2) return `Respond to ${ls[0]} and ${ls[1]}.`;
	return `Respond to ${ls.slice(0, -1).join(", ")}, and ${ls[ls.length - 1]}.`;
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
	const rubricQ = Boolean(question.frq_rubric);
	const steppedFrq =
		rubricQ && Boolean(question.frq_stem) && (question.frq_rubric?.parts?.length ?? 0) > 0;

	const isCorrect =
		submitted && !rubricQ && answer === question.correct_answer && question.correct_answer !== AP_FRQ_PLACEHOLDER_ANSWER;
	const isWrong =
		submitted &&
		!rubricQ &&
		answer &&
		answer !== question.correct_answer &&
		question.correct_answer !== AP_FRQ_PLACEHOLDER_ANSWER;
	const [tapOptionIdx, setTapOptionIdx] = useState<number | null>(null);
	const [aiFeedback, setAiFeedback] = useState("");
	const [loadingFeedback, setLoadingFeedback] = useState(false);
	const [feedbackRequested, setFeedbackRequested] = useState(false);

	const parts = question.frq_rubric?.parts ?? [];
	const partAnswers = parseFrqPartAnswers(answer);

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
	/** During “Review answers,” show only the rubric for multi-part FRQs—no prompt replay. */
	const hideFrqPromptReplay = submitted && steppedFrq;
	const stemText = rubricQ ? stripMarkdownBoldMarkers(question.question) : question.question;
	const stemExamMath = shouldExamMathStem(question.subject, stemText);
	const figureSyncKey =
		dataFig != null ? `fig-${question.id}-${hashString(JSON.stringify(dataFig)).toString(36)}` : "";

	return (
		<Card
			className={`p-6 mb-4 transition-all duration-300 exam-card-enter ${
				rubricQ && submitted
					? "border-sky-500/30 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.18)]"
					: isCorrect
						? "border-vanta-success/70 shadow-[inset_0_0_0_1px_rgba(74,222,128,0.25)]"
						: isWrong
							? "border-vanta-error/70 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.25)]"
							: ""
			}`}
		>
			{!hideFrqPromptReplay && dataFig ? (
				<ExamRasterizedBlock
					syncKey={figureSyncKey}
					className="figure-reveal mb-3 w-full min-w-0"
					alt="Figure or diagram for this question"
				>
					<ExamFigure figure={dataFig} />
				</ExamRasterizedBlock>
			) : null}
			{!hideFrqPromptReplay && exhibitAboveStem ? (
				<div className="mb-3 text-[15px] leading-relaxed text-vanta-text italic whitespace-pre-wrap">
					<ExamRasterLine
						syncKey={`stim-above-${question.id}-${stripMarkdownBoldMarkers(stim.body)}`}
						plainAlt={stripMarkdownBoldMarkers(stim.body)}
						className="w-full min-w-0"
					>
						<MathText text={stripMarkdownBoldMarkers(stim.body)} />
					</ExamRasterLine>
				</div>
			) : null}
			{!steppedFrq ? (
				<div className="text-vanta-text font-medium mb-3 leading-relaxed text-[15px]">
					<ExamRasterLine
						syncKey={`stem-${question.id}-${stemText}-${stemExamMath}`}
						plainAlt={`${questionNumber}. ${stemText}`}
						className="w-full min-w-0"
					>
						<span className="tabular-nums">{questionNumber}. </span>
						<MathText text={stemText} examMath={stemExamMath} />
					</ExamRasterLine>
				</div>
			) : null}
			{!hideFrqPromptReplay && exhibitBelow ? (
				<div className="mb-4 text-[15px] leading-relaxed text-vanta-text italic whitespace-pre-wrap">
					<ExamRasterLine
						syncKey={`stim-below-${question.id}-${stripMarkdownBoldMarkers(stim.body)}`}
						plainAlt={stripMarkdownBoldMarkers(stim.body)}
						className="w-full min-w-0"
					>
						<MathText text={stripMarkdownBoldMarkers(stim.body)} />
					</ExamRasterLine>
				</div>
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
 <span className="exam-mcq-option-math leading-relaxed text-vanta-text flex-1 min-w-0 overflow-x-auto">
								<ExamRasterMath text={opt} examMath plainAlt={formatNiceMath(opt)} decorative />
							</span>
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
			) : steppedFrq && !submitted ? (
				<div className="space-y-6 mt-1 text-[15px] leading-relaxed text-vanta-text font-sans">
					<div className="space-y-3">
						<div className="whitespace-pre-wrap">
							<ExamRasterLine
								syncKey={`frq-stem-${question.id}-${question.frq_stem ?? ""}`}
								plainAlt={`${questionNumber}. ${question.frq_stem ?? ""}`}
								className="w-full min-w-0"
							>
								<span className="tabular-nums font-semibold text-vanta-text">{questionNumber}. </span>
								<MathText text={question.frq_stem ?? ""} />
							</ExamRasterLine>
						</div>
						<ExamRasterLine
							syncKey={`frq-dir-${question.id}-${parts.map((p) => p.letter).join("")}`}
							plainAlt={frqRespondToDirectoryLine(parts.map((p) => p.letter))}
							className="font-medium text-vanta-text w-full min-w-0"
						>
							<span>{frqRespondToDirectoryLine(parts.map((p) => p.letter))}</span>
						</ExamRasterLine>
					</div>
					<div className="space-y-6">
						{parts.map((p, idx) => {
							const raw =
								partAnswers[p.letter] ?? (idx === 0 && partAnswers._ ? partAnswers._ : "") ?? "";
							return (
								<div key={p.letter} className="space-y-2">
									<div className="flex gap-3 items-start">
										<span className="shrink-0 w-8 tabular-nums font-semibold text-vanta-text pt-0.5">
											{p.letter}.
										</span>
										<div className="flex-1 min-w-0">
											<div className="leading-relaxed">
												<ExamRasterMath
													text={p.promptText}
													examMath={shouldExamMathStem(question.subject, p.promptText)}
													plainAlt={p.promptText}
												/>
											</div>
										</div>
									</div>
									<Textarea
										aria-label={`Written response for part ${p.letter}`}
										placeholder={`Write your response for part ${p.letter}…`}
										value={raw}
										onChange={(e) => onAnswer(mergeFrqPartAnswer(answer, p.letter, e.target.value))}
										rows={4}
										className="w-full pl-11 font-sans text-[15px] leading-relaxed"
									/>
								</div>
							);
						})}
					</div>
				</div>
			) : !submitted ? (
				<Textarea
					placeholder="Write your response here..."
					value={answer}
					onChange={(e) => onAnswer(e.target.value)}
					rows={5}
				/>
			) : null}

		{submitted && question.frq_rubric ? (
			<FrqRubricPanel doc={question.frq_rubric} omitPartPrompts={hideFrqPromptReplay} />
		) : null}
		{submitted && question.explanation && !question.frq_rubric ? (
			<div className="mt-4 p-4 bg-vanta-bg rounded-lg border border-vanta-border">
				<p className="text-xs text-vanta-muted font-semibold uppercase tracking-wider mb-1">Explanation</p>
				<div className="text-vanta-text text-sm leading-relaxed">
					<ExamRasterMath
						text={question.explanation}
						examMath={shouldExamMathStem(question.subject, question.explanation)}
						plainAlt={question.explanation}
					/>
				</div>
			</div>
		) : null}
		{submitted && question.explanation && question.frq_rubric ? (
			<div className="mt-4 p-4 rounded-lg border border-vanta-border/80 bg-vanta-surface-elevated/60">
				<p className="text-xs text-vanta-muted font-semibold uppercase tracking-wider mb-1">Coach note</p>
				<div className="text-vanta-text text-sm leading-relaxed">
					<ExamRasterMath
						text={question.explanation}
						examMath={shouldExamMathStem(question.subject, question.explanation)}
						plainAlt={question.explanation}
					/>
				</div>
			</div>
		) : null}

		{submitted && !question.frq_rubric ? (
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
		) : null}
	</Card>
	);
}

export function ExamGame({
 questions,
 title,
 topSlot,
 onRetry,
 timeLimitSeconds = 0,
 showDesmosCalculator = false,
}: {
 questions: ExamQuestion[];
 title: string;
 topSlot?: ReactNode;
 /** When set, "Try again" / new session uses this instead of full page reload */
 onRetry?: () => void;
 /** Counts down while the exam is in progress; at 0 the exam submits automatically. */
 timeLimitSeconds?: number;
 /** Shows a Desmos graphing calculator dock (e.g. AP Calc calculator section). */
 showDesmosCalculator?: boolean;
}) {
 const { answers, submitted, answerQuestion, submit, stats } = useExamProgress(questions.length, questions);
 const statsRecorded = useRef(false);
 const submitRef = useRef(submit);
 submitRef.current = submit;

 const onTimerExpire = useCallback(() => {
 submitRef.current();
 }, []);

 const timerEnabled = timeLimitSeconds > 0;
 const { seconds: timerRemaining, stop: stopTimer } = useTimer({
 initialSeconds: timerEnabled ? timeLimitSeconds : 0,
 onExpire: timerEnabled ? onTimerExpire : undefined,
 autoStart: timerEnabled,
 });

 useEffect(() => {
 if (!submitted || statsRecorded.current) return;
 statsRecorded.current = true;
 const rubricOnly = questions.length > 0 && questions.every((q) => q.frq_rubric);
 const drafted = questions.filter((q) => {
 const a = answers[q.id];
 if (q.frq_rubric && q.frq_stem) return frqAnswerHasAnyDraft(a);
 return (a ?? "").trim().length > 0;
 }).length;
 const mcCorrect = questions.filter(
  (q) => !q.frq_rubric && answers[q.id] === q.correct_answer && q.correct_answer !== AP_FRQ_PLACEHOLDER_ANSWER,
 ).length;
 const correctCount = rubricOnly ? drafted : mcCorrect;
 const subject = questions[0]?.subject ?? "Mixed";
 recordExamComplete(subject, correctCount, questions.length);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [submitted, questions]);

 useEffect(() => {
 if (submitted) stopTimer();
 }, [submitted, stopTimer]);

 const handleRetry = () => {
 if (onRetry) onRetry();
 else window.location.reload();
 };

	if (submitted) {
		const rubricOnly = questions.length > 0 && questions.every((q) => q.frq_rubric);
		const drafted = questions.filter((q) => {
			const a = answers[q.id];
			if (q.frq_rubric && q.frq_stem) return frqAnswerHasAnyDraft(a);
			return (a ?? "").trim().length > 0;
		}).length;
		const mcCorrect = questions.filter(
			(q) => !q.frq_rubric && answers[q.id] === q.correct_answer && q.correct_answer !== AP_FRQ_PLACEHOLDER_ANSWER,
		).length;
		const correctCount = rubricOnly ? drafted : mcCorrect;
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
					{rubricOnly ? (
						<>
							<p className="text-sm text-vanta-muted mb-4 leading-relaxed max-w-lg mx-auto">
								This session is free-response practice. Use each scoring guide to self-check; there is no automatic
								letter grade for open-ended work.
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div>
									<p className="text-3xl font-bold text-vanta-blue">
										{drafted}/{questions.length}
									</p>
									<p className="text-xs text-vanta-muted mt-1">Responses drafted</p>
								</div>
								<div>
									<p className="text-3xl font-bold text-vanta-text">—</p>
									<p className="text-xs text-vanta-muted mt-1">Rubric self-score</p>
								</div>
							</div>
						</>
					) : (
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
					)}
					{!rubricOnly ? (
						<ProgressBar value={percentage} className="mt-4" color={percentage >= 60 ? "green" : "blue"} showLabel />
					) : null}
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

 const timerClock = `${String(Math.floor(timerRemaining / 60)).padStart(2, "0")}:${String(timerRemaining % 60).padStart(2, "0")}`;

 return (
 <div className="max-w-3xl mx-auto px-4 py-8">
 {showDesmosCalculator && !submitted ? <DesmosCalculatorDock /> : null}
 <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
 <div>
 <Link href="/study" className="text-xs text-vanta-muted hover:text-vanta-blue">
 Back: Library
 </Link>
 <h1 className="text-vanta-text font-semibold mt-0.5">{title}</h1>
 </div>
 <div className="flex items-center gap-2 flex-wrap justify-end">
 {timerEnabled && !submitted ? (
 <Badge variant="blue" className="tabular-nums font-mono text-sm">
 Time left {timerClock}
 </Badge>
 ) : null}
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
 Submit
 </Button>
 </div>
 </div>
 );
}
