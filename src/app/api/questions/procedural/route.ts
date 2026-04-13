import { NextRequest, NextResponse } from "next/server";
import { generateProceduralQuestions } from "@/lib/questions/procedural";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    if (!subject || subject.length > 120) {
      return NextResponse.json({ error: "Invalid subject" }, { status: 400 });
    }
    const count = typeof body.count === "number" ? body.count : 8;
    const unitId = typeof body.unitId === "string" ? body.unitId.trim() : undefined;

    const questions = generateProceduralQuestions({
      subject,
      unitId,
      count,
    });

    return NextResponse.json({
      questions,
      source: "procedural" as const,
      note: "Generated locally with randomized parameters — no API usage.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate questions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
