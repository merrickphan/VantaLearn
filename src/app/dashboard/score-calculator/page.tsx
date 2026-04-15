"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { VantaLogo } from "@/components/branding/VantaLogo";
import { Card } from "@/components/ui";
import { AP_COURSES } from "@/lib/apCatalog";
import { formatNiceMath } from "@/lib/typography/niceMath";
import {
	computeApSubjectScore,
	listApSubjectModels,
	type ApScoreSectionDef,
	type ApSubjectScoreModel,
	type ApSubjectScoreResult,
} from "@/lib/utils";

function earnedForSection(maxPoints: number, raw: string | undefined): number {
	const v = parseFloat(raw ?? "");
	if (!Number.isFinite(v)) return 0;
	return Math.min(Math.max(0, v), maxPoints);
}

function stripTrailingScoreWord(label: string): string {
	return label.replace(/\s+score$/i, "").trim() || label;
}

/** Group inputs like common AP® calculator layouts: two composite buckets when defined, else one list. */
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

function isFrqSection(model: ApSubjectScoreModel, sectionId: string): boolean {
	const d = model.twoPartComposite;
	if (!d) return false;
	return d.frqSectionIds.includes(sectionId);
}

/** Integer steps for small rubric maxima (e.g. HUG /7); half points otherwise. */
function rubricStep(maxPts: number): number {
	if (Number.isInteger(maxPts) && maxPts > 0 && maxPts <= 12) return 1;
	return 0.5;
}

function snapEarnedToStep(rawEarned: number, maxPts: number, step: number): number {
	const clamped = Math.min(Math.max(0, rawEarned), maxPts);
	if (step >= 1) return Math.round(clamped);
	return Math.round(clamped * 2) / 2;
}

type ApScoreBand = 1 | 2 | 3 | 4 | 5;

function clampApBand(n: number): ApScoreBand {
	const r = Math.round(n);
	if (r <= 1) return 1;
	if (r >= 5) return 5;
	return r as ApScoreBand;
}

/** Predicted score: one calm card; border + digit + meter brighten from 1 → 5. */
function ApScoreShowcase({ score, animationKey }: { score: number; animationKey: string }) {
	const s = clampApBand(score);

	const shellClass: Record<ApScoreBand, string> = {
		1: "border-white/10 shadow-sm shadow-black/40",
		2: "border-white/15 shadow-sm shadow-black/35",
		3: "border-sky-500/30 shadow-md shadow-black/30",
		4: "border-sky-400/40 shadow-md shadow-sky-500/15",
		5: "border-emerald-400/35 shadow-md shadow-emerald-500/15",
	};

	const barFilled =
		s <= 2
			? "bg-white/55"
			: s === 3
				? "bg-sky-400"
				: s === 4
					? "bg-sky-300"
					: "bg-gradient-to-r from-emerald-300 via-sky-300 to-cyan-200";

	const barEmpty = "bg-black/40 ring-1 ring-inset ring-white/[0.07]";

	const digitTierClass: Record<ApScoreBand, string> = {
		1: "ap-score-digit-tier-1",
		2: "ap-score-digit-tier-2",
		3: "ap-score-digit-tier-3",
		4: "ap-score-digit-tier-4",
		5: "ap-score-digit-tier-5",
	};

	return (
		<div
			className={`mx-auto mt-2 max-w-[248px] rounded-xl border border-white/10 bg-[color:var(--ap-showcase-bg)] p-6 shadow-[0_8px_28px_var(--ap-showcase-shadow)] ring-1 ring-inset ring-white/[0.04] md:max-w-[272px] md:p-7 ${shellClass[s]}`}
		>
			<div className="flex flex-col items-center">
				<p
					key={animationKey}
					className={`ap-cal-score-reveal text-6xl font-extrabold leading-none tracking-tight tabular-nums md:text-7xl ${digitTierClass[s]}`}
				>
					{s}
				</p>

				<div className="mt-5 flex w-full max-w-[176px] gap-1">
					{([1, 2, 3, 4, 5] as const).map((n) => (
						<div
							key={n}
							className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-out ${
								n <= s ? barFilled : barEmpty
							}`}
							style={{ transitionDelay: `${(n - 1) * 40}ms` }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default function ScoreCalculatorPage() {
	const examYear = new Date().getFullYear();
	const models = useMemo(() => listApSubjectModels(), []);
	const [courseId, setCourseId] = useState(AP_COURSES[0].id);
	const [sectionValues, setSectionValues] = useState<Record<string, string>>(() => {
		const m = listApSubjectModels().find((x) => x.courseId === AP_COURSES[0].id);
		const o: Record<string, string> = {};
		m?.sections.forEach((s) => {
			o[s.id] = "";
		});
		return o;
	});

	const activeModel = useMemo(() => models.find((m) => m.courseId === courseId), [models, courseId]);
	const sectionGroups = useMemo(
		() => (activeModel ? partitionSectionsForDisplay(activeModel) : []),
		[activeModel],
	);

	const subjectPreview = useMemo((): ApSubjectScoreResult | null => {
		if (!activeModel) return null;
		const earned: Record<string, number> = {};
		for (const s of activeModel.sections) {
			const raw = earnedForSection(s.maxPoints, sectionValues[s.id]);
			earned[s.id] = snapEarnedToStep(raw, s.maxPoints, rubricStep(s.maxPoints));
		}
		const out = computeApSubjectScore(courseId, earned);
		if ("error" in out) return null;
		return out;
	}, [activeModel, courseId, sectionValues]);

	const resetSectionState = (id: string) => {
		const m = models.find((x) => x.courseId === id);
		const next: Record<string, string> = {};
		m?.sections.forEach((s) => {
			next[s.id] = "";
		});
		setSectionValues(next);
	};

	const apScoreDescriptions = {
		5: "Extremely well qualified",
		4: "Well qualified",
		3: "Qualified",
		2: "Possibly qualified",
		1: "No recommendation",
	} as const;

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 md:py-12">
			<div className="mb-10 fade-up">
				<p className="text-xs font-semibold text-vanta-muted uppercase tracking-[0.2em] mb-2">AP® tools</p>
				<h1 className="font-display text-3xl md:text-4xl font-bold text-vanta-text tracking-tight">
					Score calculator <span className="text-sky-400/90 font-normal text-2xl md:text-3xl">{examYear}</span>
				</h1>
				<p className="text-vanta-muted text-lg mt-3 max-w-2xl leading-relaxed">
					Choose a course, then enter raw points per section using the sliders (same flow as leading AP® estimate
					calculators). Each exam uses the section breakdown for that subject. Curves are{" "}
					<strong className="text-vanta-text">practice estimates only</strong> — not from College Board.
				</p>
			</div>

			<div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
				{/* Inputs — Test Ninjas–style: instructions + grouped sliders */}
				<Card className="p-6 md:p-8 fade-up rounded-2xl border border-vanta-border/80 shadow-lg shadow-black/20 overflow-hidden">
					{activeModel ? (
						<>
							<div className="mb-6 pb-6 border-b border-vanta-border/80">
								<h2 className="font-display text-xl md:text-2xl font-bold text-vanta-text leading-tight">
									{activeModel.courseName}
								</h2>
								<p className="text-xs text-vanta-muted mt-1 uppercase tracking-wider">
									Estimated 1–5 · updates live
								</p>
							</div>

							<div className="rounded-xl border border-sky-500/30 bg-sky-500/[0.06] dark:bg-sky-500/10 p-4 mb-6">
								<p className="text-xs font-bold text-sky-950 dark:text-sky-100 uppercase tracking-wider mb-2">
									Instructions
								</p>
								<p className="text-sm text-vanta-muted leading-relaxed">
									Section I is one multiple-choice total. Section II uses each question&apos;s{" "}
									<strong className="text-vanta-text">College Board rubric max</strong> on the slider; when a
									rubric is out of fewer points than the exam weight (for example three 7-point FRQs that
									combine to 75), your entered rubric score is{" "}
									<strong className="text-vanta-text">scaled automatically</strong> in the composite. The
									predicted 1–5 still uses a practice curve for this subject group.
								</p>
							</div>

							<div className="mb-2">
								<label className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.15em] block mb-2">
									AP® course
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
										{formatNiceMath(activeModel.note)}
									</p>
								) : null}
							</div>

							<div key={courseId} className="space-y-8 mt-8">
								{sectionGroups.map((group, groupIdx) => (
									<div key={`${group.title}-${groupIdx}`}>
										<h3 className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.2em] mb-4 pb-2 border-b border-vanta-border/60">
											{formatNiceMath(group.title)}
										</h3>
										<div className="space-y-6">
											{group.sections.map((s, secIdx) => {
												const rawEarned = earnedForSection(s.maxPoints, sectionValues[s.id]);
												const step = rubricStep(s.maxPoints);
												const e = snapEarnedToStep(rawEarned, s.maxPoints, step);
												const w = s.weightInComposite;
												const rowsBefore = sectionGroups
													.slice(0, groupIdx)
													.reduce((acc, g) => acc + g.sections.length, 0);
												const staggerIdx = rowsBefore + secIdx;
												const frq = activeModel && isFrqSection(activeModel, s.id);
												const pct = s.maxPoints > 0 ? (e / s.maxPoints) * 100 : 0;

												const setClamped = (next: number) => {
													const snapped = snapEarnedToStep(next, s.maxPoints, step);
													setSectionValues((prev) => ({
														...prev,
														[s.id]: String(snapped),
													}));
												};

												return (
													<div
														key={s.id}
														className={`ap-cal-row-in ${frq ? "" : "border-b border-vanta-border/40 pb-6 last:border-0 last:pb-0"}`}
														style={{ animationDelay: `${Math.min(staggerIdx, 14) * 42}ms` }}
													>
														{frq ? (
															<div className="rounded-2xl border border-vanta-border bg-vanta-surface-elevated/95 px-4 py-4 shadow-inner">
																<div className="flex flex-wrap justify-between gap-2 items-start mb-3">
																	<label
																		htmlFor={`sec-${s.id}`}
																		className="text-sm font-semibold text-vanta-text leading-snug pr-2"
																	>
																		{formatNiceMath(s.label)}
																	</label>
																	<p className="tabular-nums shrink-0 text-base">
																		<span className="font-bold text-vanta-text">{e}</span>
																		<span className="text-vanta-muted font-medium"> / {s.maxPoints}</span>
																	</p>
																</div>
																{w != null && w !== s.maxPoints ? (
																	<p className="text-[11px] text-sky-300/80 mb-3 leading-relaxed">
																		Counts toward {(w / s.maxPoints).toFixed(2)}× exam weight in the composite
																		(rubric max {s.maxPoints}).
																	</p>
																) : s.hint ? (
																	<p className="text-[11px] text-vanta-muted mb-3 leading-relaxed">
																		{formatNiceMath(s.hint)}
																	</p>
																) : null}
																<div className="flex items-center gap-2 sm:gap-3">
																	<button
																		type="button"
																		aria-label="Decrease score"
																		className="shrink-0 h-10 w-10 rounded-full border border-vanta-border bg-vanta-surface text-vanta-text text-lg font-medium leading-none hover:bg-vanta-surface-hover hover:border-sky-400/50 transition-colors disabled:opacity-40"
																		disabled={e <= 0}
																		onClick={() => setClamped(e - step)}
																	>
																		−
																	</button>
																	<div className="relative flex-1 min-w-0 h-9 flex items-center px-1">
																		<div
																			className="pointer-events-none absolute left-2 right-2 top-1/2 -translate-y-1/2 h-2 rounded-full bg-vanta-border/80"
																			aria-hidden
																		/>
																		<div
																			className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-2 rounded-l-full bg-sky-500 transition-[width] duration-200 ease-out"
																			style={{
																				width: `calc((100% - 16px) * ${pct / 100} + 0px)`,
																				maxWidth: "calc(100% - 16px)",
																			}}
																			aria-hidden
																		/>
																		<input
																			id={`sec-${s.id}`}
																			type="range"
																			min={0}
																			max={s.maxPoints}
																			step={step}
																			value={e}
																			onChange={(ev) => setClamped(Number(ev.target.value))}
																			className="frq-cal-thumb-only relative z-10 w-full cursor-pointer"
																		/>
																	</div>
																	<button
																		type="button"
																		aria-label="Increase score"
																		className="shrink-0 h-10 w-10 rounded-full border border-vanta-border bg-vanta-surface text-vanta-text text-lg font-medium leading-none hover:bg-vanta-surface-hover hover:border-sky-400/50 transition-colors disabled:opacity-40"
																		disabled={e >= s.maxPoints}
																		onClick={() => setClamped(e + step)}
																	>
																		+
																	</button>
																</div>
															</div>
														) : (
															<>
																<div className="flex flex-wrap justify-between gap-2 items-end mb-2">
																	<label
																		htmlFor={`sec-${s.id}`}
																		className="text-sm md:text-base font-semibold text-vanta-text leading-snug pr-2"
																	>
																		{formatNiceMath(s.label)}
																	</label>
																	<span className="text-base md:text-lg tabular-nums shrink-0">
																		<span className="text-sky-300 font-bold">{e}</span>
																		<span className="text-vanta-muted font-medium"> / {s.maxPoints}</span>
																	</span>
																</div>
																{s.hint ? (
																	<p className="text-xs text-vanta-muted mb-3 leading-relaxed">
																		{formatNiceMath(s.hint)}
																	</p>
																) : null}
																<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
																	<input
																		id={`sec-${s.id}`}
																		type="number"
																		min={0}
																		max={s.maxPoints}
																		step={step}
																		value={sectionValues[s.id] ?? ""}
																		onChange={(ev) =>
																			setSectionValues((prev) => ({ ...prev, [s.id]: ev.target.value }))
																		}
																		placeholder="0"
																		className="w-full sm:w-28 shrink-0 bg-vanta-surface-elevated text-vanta-text text-center text-base font-semibold tabular-nums rounded-xl px-3 py-2.5 border border-vanta-border focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/15 focus:outline-none transition-all duration-200"
																	/>
																	<input
																		type="range"
																		min={0}
																		max={s.maxPoints}
																		step={step}
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
															</>
														)}
													</div>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</>
					) : (
						<p className="text-sm text-vanta-muted">No scoring model found for this course.</p>
					)}
				</Card>

				{/* Results */}
				<div className="space-y-6">
					{subjectPreview ? (
						<Card className="p-6 md:p-8 fade-up overflow-hidden border-vanta-border bg-vanta-surface bg-gradient-to-b from-sky-500/[0.05] to-transparent shadow-card">
							<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.22em] mb-1 text-center">
								Predicted AP® score
							</p>
							<ApScoreShowcase
								score={subjectPreview.apScore}
								animationKey={`${courseId}-${subjectPreview.apScore}-${Math.round(subjectPreview.compositePercent)}`}
							/>
							<div className="text-center mb-8 pb-8 border-b border-vanta-border/70">
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
											<span className="text-vanta-text font-medium">
												{formatNiceMath(subjectPreview.scaledDisplay.mcLabel)}
											</span>
											<span className="text-sky-200 font-bold tabular-nums">
												{subjectPreview.scaledDisplay.mcOutOf100}{" "}
												<span className="text-vanta-muted font-semibold">/ 100</span>
											</span>
										</div>
										<div className="flex justify-between gap-4 py-3 border-b border-vanta-border/50">
											<span className="text-vanta-text font-medium">
												{formatNiceMath(subjectPreview.scaledDisplay.frqLabel)}
											</span>
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

							<div className="rounded-xl border border-vanta-border/60 bg-vanta-surface-elevated p-4 mb-6">
								<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.2em] mb-4">
									Raw breakdown by item
								</p>
								<ul className="space-y-4">
									{subjectPreview.bySection.map((row) => (
										<li key={row.id} className="text-sm">
											<div className="flex justify-between gap-2 mb-1.5">
												<span className="text-vanta-text font-medium leading-snug">
													{formatNiceMath(row.label)}
												</span>
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
								AP® score scale
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
					) : (
						<Card className="p-6 md:p-8 rounded-2xl border border-dashed border-vanta-border/80 bg-vanta-surface-elevated/60 ap-cal-empty-pulse">
							<p className="text-[11px] font-semibold text-vanta-muted uppercase tracking-[0.2em] mb-3">
								Your result
							</p>
							<p className="text-vanta-muted text-sm leading-relaxed">
								Select a course and move the sliders — your predicted AP® score, section scores, and raw breakdown appear
								here.
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
					Layouts follow the same information architecture as widely used AP® estimators: per-section sliders, scaled
					buckets where applicable, composite, and score scale. Curves are heuristic study aids, not official
					projections.
				</p>
			</footer>
		</div>
	);
}
