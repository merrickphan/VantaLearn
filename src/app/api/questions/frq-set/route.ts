import { NextResponse } from "next/server";
import type { ProceduralDifficulty } from "@/lib/questions/procedural";
import { AP_FRQ_PRACTICE_SET_COUNT, generateApFrqPracticeSet } from "@/lib/questions/procedural/apFrqSets";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
		const unitId = typeof body.unitId === "string" ? body.unitId.trim() : "";
		const rawSet = typeof body.setIndex === "number" ? body.setIndex : parseInt(String(body.setIndex ?? ""), 10);
		const setIndex = Number.isFinite(rawSet)
			? Math.min(AP_FRQ_PRACTICE_SET_COUNT - 1, Math.max(0, Math.floor(rawSet)))
			: Math.floor(Math.random() * AP_FRQ_PRACTICE_SET_COUNT);
		const rawDiff = body.difficulty;
		const difficulty: ProceduralDifficulty | undefined =
			rawDiff === "random" || rawDiff === "easy" || rawDiff === "medium" || rawDiff === "hard" ? rawDiff : undefined;

		if (!courseId || !unitId) {
			return NextResponse.json({ error: "courseId and unitId are required" }, { status: 400 });
		}

		const questions = generateApFrqPracticeSet({ courseId, unitId, setIndex, difficulty });
		return NextResponse.json({ questions, setIndex });
	} catch (e) {
		const message = e instanceof Error ? e.message : "Failed to generate FRQ set";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
