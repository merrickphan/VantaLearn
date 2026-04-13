import { NextRequest, NextResponse } from "next/server";
import { calculateAPScore } from "@/lib/calculateAPScore";
import { computeApSubjectScore } from "@/lib/utils";

export async function POST(request: NextRequest) {
 try {
 const body = await request.json();
 const { examType, rawScore, totalQuestions, courseId, sectionScores } = body;

 if (examType === "ap_subject" && typeof courseId === "string" && sectionScores && typeof sectionScores === "object") {
 const earned: Record<string, number> = {};
 for (const [k, v] of Object.entries(sectionScores)) {
 const n = typeof v === "number" ? v : parseFloat(String(v));
 earned[k] = Number.isFinite(n) ? n : 0;
 }
 const out = computeApSubjectScore(courseId, earned);
 if ("error" in out) {
 return NextResponse.json({ error: out.error }, { status: 400 });
 }
 return NextResponse.json({
 kind: "ap_subject",
 apScore: out.apScore,
 compositePercent: out.compositePercent,
 totalEarned: out.totalEarned,
 totalPossible: out.totalPossible,
 bySection: out.bySection,
 scaledDisplay: out.scaledDisplay ?? null,
 courseId: out.model.courseId,
 courseName: out.model.courseName,
 });
 }

 if (typeof rawScore !== "number" || typeof totalQuestions !== "number") {
 return NextResponse.json({ error: "rawScore and totalQuestions must be numbers" }, { status: 400 });
 }

 if (examType === "ap" || examType === "ap_quick") {
 const result = calculateAPScore({ rawScore, totalQuestions });
 return NextResponse.json({ kind: "ap_quick", ...result });
 }

 return NextResponse.json(
 { error: "Use examType ap, ap_quick, or ap_subject (with courseId and sectionScores)" },
 { status: 400 }
 );
 } catch (error: unknown) {
 const message = error instanceof Error ? error.message : "Internal server error";
 return NextResponse.json({ error: message }, { status: 500 });
 }
}
