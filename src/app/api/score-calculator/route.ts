import { NextRequest, NextResponse } from "next/server";
import { computeApSubjectScore } from "@/lib/apScoreBySubject";

export async function POST(request: NextRequest) {
 try {
 const body = await request.json();
 const { examType, courseId, sectionScores } = body;

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

 return NextResponse.json(
 { error: "Use examType ap_subject with courseId and sectionScores" },
 { status: 400 }
 );
 } catch (error: unknown) {
 const message = error instanceof Error ? error.message : "Internal server error";
 return NextResponse.json({ error: message }, { status: 500 });
 }
}
