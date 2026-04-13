"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { VantaLogo } from "@/components/branding/VantaLogo";
import { Button, Card } from "@/components/ui";
import { AP_COURSES } from "@/lib/apCatalog";
import { calculateAPScore } from "@/lib/calculateAPScore";
import {
	computeApSubjectScore,
	listApSubjectModels,
	type ApScoreSectionDef,
	type ApSubjectScoreModel,
	type ApSubjectScoreResult,
} from "@/lib/utils";

type ExamMode = "ap_subject" | "ap_quick";

function earnedForSection(maxPoints: number, raw: string | undefined): number {
	const v = parseFloat(raw ?? "");
	if (!Number.isFinite(v)) return 0;
	return Math.min(Math.max(0, v), maxPoints);
}

function stripTrailingScoreWord(label: string): string {
	return label.replace(/\s+score$/i, "").trim() || label;
}

/** Group inputs like common AP calculator layouts: two composite buckets when defined, else one list. */
function partitionSectionsForDisplay(model: ApSubjectScoreModel): { title: string; sections: ApScoreSectionDef[] }[] {
	const d = model.twoPartComposite;
	if (!d) {
		return [{ title: "Exam sections", sections: [...model.sections] }];
	}
	const mc = new Set(d.mcSectionIds);
	const fr = new Set(d.frqSectionIds);
	const mcSecs = model.sections.filter((s) => mc.has(s.id));
	const frSecs = model.sections.filter((s) => fr.has(s.id));
	const rest = model.sections.filter((s) => !mc.has(s.id) && !fr.has(s.id));
	const out: { title: string; sections: ApScoreSectionDef[] }[] = [];
	if (mcSecs.length) {
		const t = d.mcScoreLabel ? stripTrailingScoreWord(d.mcScoreLabel) : "";
		out.push({ title: t || "Section 1", sections: mcSecs });
	}
	if (frSecs.length) {
		const t = d.frqScoreLabel ? stripTrailingScoreWord(d.frqScoreLabel) : "";
		out.push({ title: t || "Section 2", sections: frSecs });
	}
	if (rest.length) out.push({ title: "Additional scored portions", sections: rest });
	return out;
}

export default function ScoreCalculatorPage() {
	const examYear = new Date().getFullYear();
	const models = useMemo(() => listApSubjectModels(), []);
	const [mode, setMode] = useState<ExamMode>("ap_subject");
	const [courseId, setCourseId] = useState(AP_COURSES[0].id);
	const [sectionValues, setSectionValues] = useState<Record<string, string>>(() => {
		const m = listApSubjectModels().find((x) => x.courseId === AP_COURSES[0].id);
		const o: Record<string, string> = {};
		m?.sections.forEach((s) => {
			o[s.id] = "";
		});
		return o;
	});

	const [rawScore, setRawScore] = useState("");
	const [totalQuestions, setTotalQuestions] = useState("");

	const [quickResult, setQuickResult] = useState<{
		percentage: number;
		apScore: number;
		color: string;
	} | null>(null);

	const activeModel = useMemo(() => models.find((m) => m.courseId === courseId), [models, courseId]);
	const sectionGroups = useMemo(
		() => (activeModel ? partitionSectionsForDisplay(activeModel) : []),
		[activeModel],
	);

	const subjectPreview = useMemo((): ApSubjectScoreResult | null => {
		if (mode !== "ap_subject" || !activeModel) return null;
		const earned: Record<string, number> = {};
		for (const s of activeModel.sections) {
			earned[s.id] = earnedForSection(s.maxPoints, sectionValues[s.id]);
		}
		const out = computeApSubjectScore(courseId, earned);
		if ("error" in out) return null;
		return out;
	}, [mode, activeModel, courseId, sectionValues]);

	const resetSectionState = (id: string) => {
		const m = models.find((x) => x.courseId === id);
		const next: Record<string, string> = {};
		m?.sections.forEach((s) => {
			next[s.id] = "";
		});
		setSectionValues(next);
	};

	const calculateQuick = () => {
		const raw = parseInt(rawScore, 10);
		const total = parseInt(totalQuestions, 10);
		if (Number.isNaN(raw) || Number.isNaN(total) || total <= 0 || raw < 0 || raw > total) return;

		const { apScore, percentage } = calculateAPScore({ rawScore: raw, totalQuestions: total });
		const colors = {
			5: "text-vanta-success",
			4: "text-vanta-blue",
			3: "text-vanta-blue",
			2: "text-vanta-muted",
			1: "text-vanta-error",
		} as const;
		setQuickResult({
			percentage,
			apScore,
			color: colors[apScore as keyof typeof colors],
		});
	};

	const apScoreDescriptions = {
		5: "Extremely well qualified",
		4: "Well qualified",
		3: "Qualified",
		2: "Possibly qualified",
		1: "No recommendation",
	} as const;

	const scoreColor = (n: number) =>
		n >= 4 ? "text-vanta-success" : n === 3 ? "text-vanta-blue" : n === 2 ? "text-vanta-muted" : "text-vanta-error";

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 md:py-12">
			<div className="mb-10 fade-up">
				<p className="text-xs font-semibold text-vanta-muted uppercase tracking-[0.2em] mb-2">AP® tools</p>
				<h1 className="font-display text-3xl md:text-4xl font-bold text-vanta-text tracking-tight">
					Score calculator <span className="text-sky-400/90 font-normal text-2xl md:text-3xl">{examYear}</span>
				</h1>
				<p className="text-vanta-muted text-lg mt-3 max-w-2xl leading-relaxed">
					Choose a course, then enter raw points per section using the sliders (same flow as leading AP estimate
					calculators). Each exam uses the section breakdown for that subject. Curves are{" "}
					<strong className="text-vanta-text">practice estimates only</strong> — not from College Board.
				</p>
			</div>

			<div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
				{/* Inputs — Test Ninjas–style: instructions + grouped sliders */}
				<Card className="p-6 md:p-8 fade-up rounded-2xl border border-vanta-border/80 shadow-lg shadow-black/20 overflow-hidden">
					<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.18em] mb-3">Mode</p>
					<div className="flex flex-wrap gap-2 mb-8">
						{(["ap_subject", "ap_quick"] as const).map((key) => (
							<button
								key={key}
								type="button"
								onClick={() => {
									setMode(key);
									setQuickResult(null);
									if (key === "ap_subject") resetSectionState(courseId);
								}}
								className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
									mode === key
										? "bg-sky-500/15 border-sky-500/50 text-sky-200 shadow-[0_0_20px_-8px_rgba(56,189,248,0.5)]"
										: "border-vanta-border text-vanta-muted hover:border-sky-500/40 hover:text-vanta-text"
								}`}
							>
								{key === "ap_subject" ? "AP by subject" : "AP quick %"}
							</button>
						))}
					</div>

					{mode === "ap_subject" && activeModel ? (
						<>
							<div className="mb-6 pb-6 border-b border-vanta-border/80">
								<h2 className="font-display text-xl md:text-2xl font-bold text-vanta-text leading-tight">
									{activeModel.courseName}
								</h2>
								<p className="text-xs text-vanta-muted mt-1 uppercase tracking-wider">
									Estimated 1–5 · updates live
								</p>
							</div>

							<div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-4 mb-6">
								<p className="text-xs font-bold text-sky-200/90 uppercase tracking-wider mb-2">Instructions</p>
								<p className="text-sm text-vanta-muted leading-relaxed">
									Enter your scores for each row using the number box or slider. Totals clamp to each
									section&apos;s maximum. The predicted score uses a heuristic curve for this subject group.
								</p>
							</div>

							<div className="mb-2">
								<label className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.15em] block mb-2">
									AP course
								</label>
								<select
									value={courseId}
									onChange={(e) => {
										setCourseId(e.target.value);
										resetSectionState(e.target.value);
									}}
									className="w-full bg-vanta-surface-elevated text-vanta-text rounded-xl px-4 py-3 text-base border border-vanta-border focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-shadow duration-200"
								>
									{AP_COURSES.map((c) => (
										<option key={c.id} value={c.id}>
											{c.name}
										</option>
									))}
								</select>
								{activeModel.note ? (
									<p className="text-xs text-vanta-muted mt-2 leading-relaxed border-l-2 border-sky-500/40 pl-3">
										{activeModel.note}
									</p>
								) : null}
							</div>

							<div key={courseId} className="space-y-8 mt-8">
								{sectionGroups.map((group, groupIdx) => (
									<div key={`${group.title}-${groupIdx}`}>
										<h3 className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.2em] mb-4 pb-2 border-b border-vanta-border/60">
											{group.title}
										</h3>
										<div className="space-y-6">
											{group.sections.map((s, secIdx) => {
												const e = earnedForSection(s.maxPoints, sectionValues[s.id]);
												const rowsBefore = sectionGroups
													.slice(0, groupIdx)
													.reduce((acc, g) => acc + g.sections.length, 0);
												const staggerIdx = rowsBefore + secIdx;
												return (
													<div
														key={s.id}
														className="ap-cal-row-in border-b border-vanta-border/40 pb-6 last:border-0 last:pb-0"
														style={{ animationDelay: `${Math.min(staggerIdx, 14) * 42}ms` }}
													>
														<div className="flex flex-wrap justify-between gap-2 items-end mb-2">
															<label
																htmlFor={`sec-${s.id}`}
																className="text-sm md:text-base font-semibold text-vanta-text leading-snug pr-2"
															>
																{s.label}
															</label>
															<span className="text-base md:text-lg tabular-nums shrink-0">
																<span className="text-sky-300 font-bold">{e}</span>
																<span className="text-vanta-muted font-medium"> / {s.maxPoints}</span>
															</span>
														</div>
														{s.hint ? (
															<p className="text-xs text-vanta-muted mb-3 leading-relaxed">{s.hint}</p>
														) : null}
														<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
															<input
																id={`sec-${s.id}`}
																type="number"
																min={0}
																max={s.maxPoints}
																step={0.5}
																value={sectionValues[s.id] ?? ""}
																onChange={(ev) =>
																	setSectionValues((prev) => ({ ...prev, [s.id]: ev.target.value }))
																}
																placeholder="0"
																className="w-full sm:w-28 shrink-0 bg-vanta-bg text-vanta-text text-center text-base font-semibold tabular-nums rounded-xl px-3 py-2.5 border border-vanta-border focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/15 focus:outline-none transition-all duration-200"
															/>
															<input
																type="range"
																min={0}
																max={s.maxPoints}
																step={0.5}
																value={e}
																onChange={(ev) =>
																	setSectionValues((prev) => ({
																		...prev,
																		[s.id]: ev.target.value,
																	}))
																}
																className="score-slider flex-1 min-w-0 h-3 cursor-pointer transition-[filter] duration-200 hover:brightness-110"
															/>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</>
					) : (
						<>
							<div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-4 mb-6">
								<p className="text-xs font-bold text-sky-200/90 uppercase tracking-wider mb-2">Instructions</p>
								<p className="text-sm text-vanta-muted leading-relaxed">
									Enter how many questions you got right and the total number of questions on your practice set.
									Tap Calculate for a generic 1–5 band from percentage (not course-specific).
								</p>
							</div>
							<div className="space-y-5 mb-8">
								<div>
									<label className="text-[11px] font-semibold text-vanta-muted uppercase tracking-wider block mb-2">
										Questions correct (raw)
									</label>
									<input
										type="number"
										min={0}
										value={rawScore}
										onChange={(e) => setRawScore(e.target.value)}
										placeholder="e.g. 38"
										className="w-full bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/70 rounded-xl px-4 py-3 text-base border border-vanta-border focus:border-sky-500/60 focus:outline-none transition-colors duration-200"
									/>
								</div>
								<div>
									<label className="text-[11px] font-semibold text-vanta-muted uppercase tracking-wider block mb-2">
										Total questions
									</label>
									<input
										type="number"
										min={1}
										value={totalQuestions}
										onChange={(e) => setTotalQuestions(e.target.value)}
										placeholder="e.g. 45"
										className="w-full bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/70 rounded-xl px-4 py-3 text-base border border-vanta-border focus:border-sky-500/60 focus:outline-none transition-colors duration-200"
									/>
								</div>
							</div>
							<p className="text-sm text-vanta-muted mb-6 leading-relaxed">
								Single practice-test percentage mapped to a generic AP 1–5 band.
							</p>
							<Button
								type="button"
								onClick={calculateQuick}
								className="w-full transition-transform duration-200 active:scale-[0.98]"
								size="lg"
							>
								Calculate
							</Button>
						</>
					)}
				</Card>

				{/* Results */}
				<div className="space-y-6">
					{mode === "ap_subject" && subjectPreview ? (
						<Card className="p-6 md:p-8 fade-up rounded-2xl border border-sky-500/25 bg-gradient-to-b from-sky-500/[0.07] to-transparent shadow-lg shadow-black/25 overflow-hidden">
							<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.22em] mb-2">
								Predicted AP® score
							</p>
							<div className="text-center mb-8 pb-8 border-b border-vanta-border/70">
								<p
									key={`${courseId}-${subjectPreview.apScore}`}
									className={`text-6xl md:text-7xl font-bold mb-2 tabular-nums ${scoreColor(subjectPreview.apScore)} ap-cal-score-reveal inline-block`}
								>
									{subjectPreview.apScore}
								</p>
								<p className="text-vanta-muted text-sm tracking-wide">Score range: 1 – 5</p>
								<p className="text-vanta-muted text-base mt-4 leading-relaxed">
									{apScoreDescriptions[subjectPreview.apScore]}
								</p>
							</div>

							{subjectPreview.scaledDisplay ? (
								<div className="mb-8 pb-8 border-b border-vanta-border/70">
									<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.22em] mb-5">
										Section scores
									</p>
									<div className="space-y-0 text-sm">
										<div className="flex justify-between gap-4 py-3 border-b border-vanta-border/50">
											<span className="text-vanta-text font-medium">{subjectPreview.scaledDisplay.mcLabel}</span>
											<span className="text-sky-200 font-bold tabular-nums">
												{subjectPreview.scaledDisplay.mcOutOf100}{" "}
												<span className="text-vanta-muted font-semibold">/ 100</span>
											</span>
										</div>
										<div className="flex justify-between gap-4 py-3 border-b border-vanta-border/50">
											<span className="text-vanta-text font-medium">{subjectPreview.scaledDisplay.frqLabel}</span>
											<span className="text-sky-200 font-bold tabular-nums">
												{subjectPreview.scaledDisplay.frqOutOf100}{" "}
												<span className="text-vanta-muted font-semibold">/ 100</span>
											</span>
										</div>
										<div className="flex justify-between gap-4 pt-4">
											<span className="text-vanta-muted font-medium">Combined composite score</span>
											<span className="text-vanta-text font-bold tabular-nums text-base">
												{subjectPreview.scaledDisplay.compositeOutOf200}{" "}
												<span className="text-vanta-muted font-semibold">/ 200</span>
											</span>
										</div>
									</div>
									<p className="text-[11px] text-vanta-muted mt-3 leading-relaxed">
										Each bucket is scaled to 100; the composite is the sum (200 max), matching common calculator
										layouts.
									</p>
								</div>
							) : (
								<div className="mb-8 pb-8 border-b border-vanta-border/70">
									<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.22em] mb-3">
										Composite (raw)
									</p>
									<p className="text-vanta-text tabular-nums text-lg font-semibold">
										{subjectPreview.totalEarned.toFixed(1)} / {subjectPreview.totalPossible} pts —{" "}
										<span className="text-sky-300">{subjectPreview.compositePercent.toFixed(1)}%</span>
									</p>
								</div>
							)}

							<div className="rounded-xl border border-vanta-border/60 bg-vanta-bg/90 p-4 mb-6">
								<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.2em] mb-4">
									Raw breakdown by item
								</p>
								<ul className="space-y-4">
									{subjectPreview.bySection.map((row) => (
										<li key={row.id} className="text-sm">
											<div className="flex justify-between gap-2 mb-1.5">
												<span className="text-vanta-text font-medium leading-snug">{row.label}</span>
												<span className="text-vanta-muted tabular-nums shrink-0 text-xs">
													{row.earned} / {row.max}
												</span>
											</div>
											<div className="h-2 bg-vanta-border rounded-full overflow-hidden">
												<div
													className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-[width] duration-500 ease-out"
													style={{ width: `${Math.min(100, row.percent)}%` }}
												/>
											</div>
										</li>
									))}
								</ul>
							</div>

							<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.2em] mb-3">
								AP score scale
							</p>
							<div className="grid grid-cols-5 gap-2">
								{([1, 2, 3, 4, 5] as const).map((score) => (
									<div
										key={score}
										className={`text-center py-3 rounded-xl text-base font-bold transition-all duration-300 ease-out ${
											score === subjectPreview.apScore
												? "bg-sky-500/25 text-sky-100 border-2 border-sky-400/60 scale-[1.02] shadow-[0_0_24px_-6px_rgba(56,189,248,0.45)]"
												: score < subjectPreview.apScore
													? "bg-sky-600/15 text-sky-200/90 border border-sky-500/25"
													: "bg-vanta-border/30 text-vanta-muted border border-transparent"
										}`}
									>
										{score}
									</div>
								))}
							</div>

							<div className="mt-8 pt-6 border-t border-vanta-border flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
								<div>
									<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-wider mb-1">
										Course model
									</p>
									<p className="text-sm text-vanta-text font-medium leading-snug">{subjectPreview.model.courseName}</p>
								</div>
								<Link href="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
									<VantaLogo size={28} variant="command" className="shrink-0 transition-transform duration-200 group-hover:scale-105" />
									<span className="font-display font-semibold text-sm tracking-wide text-vanta-text group-hover:text-sky-300 transition-colors">
										VantaLearn
									</span>
								</Link>
							</div>
							<p className="text-[11px] text-vanta-muted mt-3 leading-relaxed">
								AP® is a trademark registered by the College Board. VantaLearn is not affiliated with the College Board;
								estimates are for practice only.
							</p>
						</Card>
					) : mode === "ap_quick" && quickResult ? (
						<Card className="p-6 md:p-8 fade-up rounded-2xl border border-sky-500/25 bg-gradient-to-b from-sky-500/[0.07] to-transparent shadow-lg shadow-black/25 overflow-hidden">
							<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.22em] mb-2">
								Predicted AP® score (generic)
							</p>
							<div className="text-center mb-8">
								<p
									key={`quick-${quickResult.apScore}-${quickResult.percentage.toFixed(0)}`}
									className={`text-6xl font-bold mb-3 tabular-nums ${quickResult.color} ap-cal-score-reveal inline-block`}
								>
									{quickResult.apScore}
								</p>
								<p className="text-vanta-muted text-base leading-relaxed">
									{apScoreDescriptions[quickResult.apScore as keyof typeof apScoreDescriptions]}
								</p>
							</div>
							<div className="rounded-xl border border-vanta-border/60 bg-vanta-bg/90 p-4">
								<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.22em] mb-4">
									Section scores
								</p>
								<div className="flex justify-between text-base mb-2">
									<span className="text-vanta-text font-medium">Practice accuracy</span>
									<span className="text-sky-200 font-bold tabular-nums">
										{quickResult.percentage.toFixed(1)}
										<span className="text-vanta-muted font-semibold"> %</span>
									</span>
								</div>
								<div className="h-3 bg-vanta-border rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-[width] duration-700 ease-out"
										style={{ width: `${quickResult.percentage}%` }}
									/>
								</div>
							</div>
							<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.2em] mt-8 mb-3">
								AP score scale
							</p>
							<div className="grid grid-cols-5 gap-2">
								{([1, 2, 3, 4, 5] as const).map((score) => (
									<div
										key={score}
										className={`text-center py-3 rounded-xl text-base font-bold transition-all duration-300 ${
											score === quickResult.apScore
												? "bg-sky-500/25 text-sky-100 border-2 border-sky-400/60 scale-[1.02] shadow-[0_0_24px_-6px_rgba(56,189,248,0.45)]"
												: score < quickResult.apScore
													? "bg-sky-600/15 text-sky-200/90 border border-sky-500/25"
													: "bg-vanta-border/30 text-vanta-muted border border-transparent"
										}`}
									>
										{score}
									</div>
								))}
							</div>
						</Card>
					) : (
						<Card className="p-6 md:p-8 rounded-2xl border border-dashed border-vanta-border/80 bg-vanta-bg/40 ap-cal-empty-pulse">
							<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.2em] mb-3">
								Your result
							</p>
							<p className="text-vanta-muted text-sm leading-relaxed">
								{mode === "ap_subject"
									? "Select a course and move the sliders — your predicted AP score, section scores, and raw breakdown appear here."
									: "Enter raw correct count and total questions, then tap Calculate."}
							</p>
						</Card>
					)}
				</div>
			</div>

			<footer className="mt-14 pt-8 border-t border-vanta-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 fade-up">
				<Link href="/dashboard" className="flex items-center gap-3 group w-fit">
					<VantaLogo size={32} variant="command" className="shrink-0 transition-transform duration-200 group-hover:scale-105" />
					<span className="font-display font-semibold text-base tracking-wide text-vanta-text group-hover:text-sky-300 transition-colors">
						VantaLearn
					</span>
				</Link>
				<p className="text-sm text-vanta-muted max-w-xl leading-relaxed">
					Layouts follow the same information architecture as widely used AP estimators: per-section sliders, scaled
					buckets where applicable, composite, and score scale. Curves are heuristic study aids, not official
					projections.
				</p>
			</footer>
		</div>
	);
}
