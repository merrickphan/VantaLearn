"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ApUnit } from "@/lib/apUnits";
import { getApFrqReplicaSpec } from "@/lib/apFrqExamReplicaFormat";
import { AP_FRQ_PRACTICE_SET_COUNT } from "@/lib/questions/procedural/apFrqSets";
import { hashString } from "@/lib/questions/procedural/utils";
import type { ProceduralDifficulty } from "@/lib/questions/procedural";
import { Button } from "@/components/ui";

function selectClassName() {
	return "rounded-full border border-vanta-border bg-vanta-surface px-3 py-2 text-sm text-vanta-text min-w-[7.5rem] focus:outline-none focus:ring-2 focus:ring-sky-500/40";
}

function readOnlyRow(label: string, value: string) {
	return (
		<div className="flex flex-wrap items-start justify-between gap-3 py-3 border-b border-vanta-border/80">
			<span className="text-sm font-medium text-vanta-text shrink-0">{label}</span>
			<span className="text-sm text-vanta-muted text-right max-w-[min(100%,20rem)] leading-snug">{value}</span>
		</div>
	);
}

export function FrqPracticeSetupModal({
	open,
	onClose,
	courseId,
	units,
}: {
	open: boolean;
	onClose: () => void;
	courseId: string;
	units: ApUnit[];
}) {
	const router = useRouter();
	const replica = useMemo(() => getApFrqReplicaSpec(courseId), [courseId]);

	const [unitChoice, setUnitChoice] = useState<string>("all");
	const [difficulty, setDifficulty] = useState<ProceduralDifficulty>("random");

	useEffect(() => {
		if (!open) return;
		setUnitChoice("all");
		setDifficulty("random");
	}, [open, courseId]);

	useEffect(() => {
		if (!open || typeof document === "undefined") return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open]);

	const unitOptions = useMemo(
		() => [{ id: "all", label: "All units" }, ...units.map((u) => ({ id: u.id, label: `Unit ${u.index}: ${u.title}` }))],
		[units],
	);

	const resolvedUnit = unitChoice === "all" ? "all" : unitChoice;

	const start = useCallback(() => {
		const totalSec = Math.max(1, replica.sectionMinutes * 60);
		const timerM = Math.floor(totalSec / 60);
		const timerS = totalSec % 60;
		const setIdx = hashString(`${courseId}|${resolvedUnit}|${difficulty}`) % AP_FRQ_PRACTICE_SET_COUNT;
		const qs = new URLSearchParams();
		qs.set("procFrq", "1");
		qs.set("course", courseId);
		qs.set("unit", resolvedUnit);
		qs.set("set", String(setIdx));
		qs.set("difficulty", difficulty);
		qs.set("timerM", String(Math.min(180, timerM)));
		qs.set("timerS", String(Math.min(59, timerS)));
		if (replica.examCalcSection) {
			qs.set("calcSection", replica.examCalcSection);
		}
		router.push(`/study/exam?${qs.toString()}`);
		onClose();
	}, [courseId, difficulty, onClose, replica.examCalcSection, replica.sectionMinutes, resolvedUnit, router]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md vl-backdrop-in"
			role="dialog"
			aria-modal="true"
			aria-labelledby="frq-setup-title"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				className="w-full max-w-lg rounded-2xl border border-vanta-border bg-vanta-surface shadow-xl shadow-black/20 overflow-hidden vl-modal-surface-in"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-vanta-border">
					<h2 id="frq-setup-title" className="text-lg font-bold text-vanta-text">
						Set up your free response question
					</h2>
					<Button
						type="button"
						onClick={start}
						className="rounded-full px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white border border-sky-700/25 shadow-md shadow-sky-600/20"
					>
						Start practice
					</Button>
				</div>

				<div className="px-5 py-1">
					{unitOptions.length > 0 ? (
						<div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-vanta-border/80">
							<span className="text-sm font-medium text-vanta-text">Unit</span>
							<select
								className={selectClassName()}
								value={unitChoice}
								onChange={(e) => setUnitChoice(e.target.value)}
								aria-label="Unit"
							>
								{unitOptions.map((o) => (
									<option key={o.id} value={o.id}>
										{o.label}
									</option>
								))}
							</select>
						</div>
					) : null}

					<div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-vanta-border/80">
						<span className="text-sm font-medium text-vanta-text">Difficulty level</span>
						<select
							className={selectClassName()}
							value={difficulty}
							onChange={(e) => setDifficulty(e.target.value as ProceduralDifficulty)}
							aria-label="Difficulty level"
						>
							<option value="random">Random</option>
							<option value="easy">Easy</option>
							<option value="medium">Medium</option>
							<option value="hard">Hard</option>
						</select>
					</div>

					{readOnlyRow("Number of FRQs", `${replica.frqCount} — ${replica.frqCountLabel}`)}
					{readOnlyRow("Section timer", replica.timerLabel)}
				</div>

				<div className="px-5 py-3 bg-vanta-surface-elevated/50 border-t border-vanta-border flex justify-end gap-2">
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={start}
						className="rounded-full px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white border border-sky-700/25 shadow-md shadow-sky-600/20"
					>
						Start practice
					</Button>
				</div>
			</div>
		</div>
	);
}
