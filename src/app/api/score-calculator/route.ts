import { NextRequest, NextResponse } from "next/server";
import { calculateAPScore, calculateSATScore } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { examType, rawScore, totalQuestions } = await request.json();

    if (typeof rawScore !== "number" || typeof totalQuestions !== "number") {
      return NextResponse.json({ error: "rawScore and totalQuestions must be numbers" }, { status: 400 });
    }

    if (examType === "ap") {
      const result = calculateAPScore({ rawScore, totalQuestions });
      return NextResponse.json(result);
    } else {
      const result = calculateSATScore({ rawScore, totalQuestions });
      return NextResponse.json(result);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
