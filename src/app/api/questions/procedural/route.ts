import { NextResponse } from "next/server";
import { proceduralPracticeMcqCountForCourse } from "@/lib/apPracticeExamFormat";
import {
 generateProceduralQuestions,
 type CalculatorSectionPolicy,
 type ProceduralDifficulty,
} from "@/lib/questions/procedural";
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
 const clientAvoidRaw = body.avoidFingerprints;
 const clientAvoid: string[] = Array.isArray(clientAvoidRaw)
  ? clientAvoidRaw
    .filter((x: unknown) => typeof x === "string" && (x as string).length > 0 && (x as string).length < 900)
    .slice(0, 600)
  : [];
 const rawCalcSection = body.calculatorSection;
 const calculatorSection: CalculatorSectionPolicy | undefined =
  rawCalcSection === "no_calculator" || rawCalcSection === "calculator" ? rawCalcSection : undefined;
 const rawDiff = body.difficulty;
 const difficulty: ProceduralDifficulty | undefined =
  rawDiff === "random" || rawDiff === "easy" || rawDiff === "medium" || rawDiff === "hard" ? rawDiff : undefined;

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

 for (const fp of clientAvoid) {
  avoid.add(fp);
 }

  const MAX_ROUNDS = 12;
  let questions = generateProceduralQuestions({
   courseId,
   unitId,
   count,
   seed,
   avoidKeys: avoid,
   calculatorSection,
   difficulty,
  });

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
     calculatorSection,
     difficulty,
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

   // If the variant space is tight, drop oldest seen rows instead of wiping the whole course
   // (full wipes caused the same fixed templates to reappear immediately).
   if (questions.length < count) {
    try {
     const supabase = await createClient();
     const { data: oldest } = await supabase
      .from("procedural_seen_questions")
      .select("id, fingerprint")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .order("created_at", { ascending: true })
      .limit(500);
     if (oldest?.length) {
      const ids = oldest.map((r: { id: string }) => r.id);
      await supabase.from("procedural_seen_questions").delete().in("id", ids);
      for (const row of oldest as { fingerprint: string }[]) {
       avoid.delete(row.fingerprint);
      }
      questions = generateProceduralQuestions({
       courseId,
       unitId,
       count,
       seed,
       avoidKeys: avoid,
       calculatorSection,
       difficulty,
      });
     }
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
