import { NextRequest, NextResponse } from "next/server";
import { generateExamQuestions } from "@/lib/ai/questionGenerator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    if (!subject || subject.length > 120) {
      return NextResponse.json({ error: "Invalid subject" }, { status: 400 });
    }

    const count = typeof body.count === "number" ? body.count : 6;
    const topic = typeof body.topic === "string" ? body.topic.trim() : undefined;
    const includeFigures = body.includeFigures !== false;

    const questions = await generateExamQuestions({
      subject,
      topic,
      count,
      includeFigures,
    });

    return NextResponse.json({ questions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate questions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
