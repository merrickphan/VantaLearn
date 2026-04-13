import { NextResponse } from "next/server";
import { generateProceduralQuestions } from "@/lib/questions/procedural";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
    const unitId = typeof body.unitId === "string" ? body.unitId.trim() : undefined;
    const count = typeof body.count === "number" ? body.count : 10;
    const seed = typeof body.seed === "string" ? body.seed : undefined;

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const questions = generateProceduralQuestions({ courseId, unitId, count, seed });
    return NextResponse.json({ questions, seed: seed ?? null });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to generate questions";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
