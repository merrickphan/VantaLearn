import { NextResponse } from "next/server";
import { proceduralPracticeMcqCountForCourse } from "@/lib/apPracticeExamFormat";
import { generateProceduralQuestions } from "@/lib/questions/procedural";

export async function POST(req: Request) {
 try {
 const body = await req.json();
 const courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
 const unitId = typeof body.unitId === "string" ? body.unitId.trim() : undefined;
 const rawCount =
 typeof body.count === "number" ? body.count : proceduralPracticeMcqCountForCourse(courseId);
 const count = Math.min(100, Math.max(1, Math.floor(rawCount)));
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
