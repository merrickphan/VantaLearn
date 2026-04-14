import { NextResponse } from "next/server";
import { proceduralPracticeMcqCountForCourse } from "@/lib/apPracticeExamFormat";
import { generateProceduralQuestions } from "@/lib/questions/procedural";
import { createClient } from "@/lib/supabase/server";
import { proceduralUniqKey, randomSeedEntropy } from "@/lib/questions/procedural/utils";

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

  // If the user is authenticated, avoid returning procedural question variants they have already seen.
  // Falls back to the original behavior if auth/db is unavailable.
  let avoid = new Set<string>();
  let userId: string | null = null;
  try {
   const supabase = await createClient();
   const { data } = await supabase.auth.getUser();
   userId = data.user?.id ?? null;
   if (userId) {
    const { data: rows } = await supabase
     .from("procedural_seen_questions")
     .select("fingerprint")
     .eq("user_id", userId)
     .eq("course_id", courseId);
    if (rows) {
     avoid = new Set(rows.map((r: { fingerprint: string }) => r.fingerprint));
    }
   }
  } catch {
   // ignore (unauthenticated or table not set up)
  }

  const MAX_ROUNDS = 12;
  let questions = generateProceduralQuestions({ courseId, unitId, count, seed, avoidKeys: avoid });

  // If we couldn't get enough unseen variants, keep trying with new entropy seeds.
  // If still stuck, treat it as "exhausted" and reset the seen set for this course/unit.
  if (userId) {
   for (let round = 0; round < MAX_ROUNDS; round++) {
    const unseen = questions.filter((q) => !avoid.has(proceduralUniqKey(q)));
    if (unseen.length >= count) {
     questions = unseen.slice(0, count);
     break;
    }
    const nextSeed = `${seed ?? ""}|u${userId.slice(0, 8)}|r${round}|${randomSeedEntropy()}`;
    const more = generateProceduralQuestions({
     courseId,
     unitId,
     count,
     seed: nextSeed,
     avoidKeys: avoid,
    });
    for (const q of more) {
     const key = proceduralUniqKey(q);
     if (!avoid.has(key)) questions.push(q);
    }
   }

   const final: typeof questions = [];
   for (const q of questions) {
    const key = proceduralUniqKey(q);
    if (avoid.has(key)) continue;
    avoid.add(key);
    final.push(q);
    if (final.length >= count) break;
   }
   questions = final;

   // Reset only when we're clearly stuck (likely exhausted).
   if (questions.length < count) {
    try {
     const supabase = await createClient();
     await supabase
      .from("procedural_seen_questions")
      .delete()
      .eq("user_id", userId)
      .eq("course_id", courseId);
     avoid.clear();
     questions = generateProceduralQuestions({ courseId, unitId, count, seed, avoidKeys: avoid });
    } catch {
     // ignore
    }
   }

   // Persist newly served fingerprints.
   try {
    const supabase = await createClient();
    const inserts = questions.map((q) => ({
     user_id: userId,
     course_id: courseId,
     unit_id: unitId ?? "",
     fingerprint: proceduralUniqKey(q),
    }));
    if (inserts.length) {
     await supabase.from("procedural_seen_questions").upsert(inserts, { onConflict: "user_id,fingerprint" });
    }
   } catch {
    // ignore (table missing or RLS)
   }
  }

  return NextResponse.json({ questions, seed: seed ?? null });
 } catch (e) {
 const message = e instanceof Error ? e.message : "Failed to generate questions";
 return NextResponse.json({ error: message }, { status: 400 });
 }
}
