import { NextRequest, NextResponse } from "next/server";
import { generateFeedback, generateStudyTip } from "@/lib/ai/feedback";

export async function POST(request: NextRequest) {
 try {
 const body = await request.json();

 // Study tip request
 if (body.type === "study_tip") {
 const tip = await generateStudyTip({
 subject: body.subject,
 topic: body.topic,
 });
 return NextResponse.json({ tip });
 }

 // Exam feedback request
 const { question, userAnswer, correctAnswer, subject } = body;
 if (!question || !subject) {
 return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
 }

 const feedback = await generateFeedback({ question, userAnswer, correctAnswer, subject });
 return NextResponse.json({ feedback });
 } catch (error: unknown) {
 const message = error instanceof Error ? error.message : "Internal server error";
 return NextResponse.json({ error: message }, { status: 500 });
 }
}
