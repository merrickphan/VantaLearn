"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AP_COURSES } from "@/lib/apCatalog";
import { getUnitsForCourseId } from "@/lib/apUnits";
import { Card } from "@/components/ui";

export default function AiUnitsPage() {
  const [courseId, setCourseId] = useState(AP_COURSES[0].id);

  const units = useMemo(() => getUnitsForCourseId(courseId), [courseId]);
  const course = useMemo(() => AP_COURSES.find((c) => c.id === courseId)!, [courseId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 fade-up">
        <Link href="/study" className="text-xs text-vanta-muted hover:text-sky-400">
          ← Practice library
        </Link>
        <h1 className="font-display text-2xl font-bold text-vanta-text tracking-wide mt-2">AI practice by unit</h1>
        <p className="text-vanta-muted text-sm mt-1 max-w-2xl">
          Each unit has its own generation procedure: curriculum scope + rotating question hooks so every batch stays on-topic but
          varies stems, datasets, and figures. Pick a course, then open a unit.
        </p>
      </div>

      <div className="mb-6">
        <label className="text-xs font-semibold text-vanta-muted uppercase tracking-wider block mb-2">Course</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full max-w-md bg-vanta-surface-elevated text-vanta-text rounded-lg px-3 py-2.5 text-sm border border-vanta-border focus:border-sky-400 focus:outline-none"
        >
          {AP_COURSES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-vanta-muted mt-2">{course.short}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 stagger">
        {units.map((u) => (
          <Link key={u.id} href={`/study/exam?ai=1&subject=${encodeURIComponent(course.name)}&unit=${encodeURIComponent(u.id)}`}>
            <Card
              hover
              className="p-4 h-full border-vanta-border/80 bg-vanta-surface/60 hover:border-sky-500/30 transition-all exam-card-enter"
            >
              <p className="text-[10px] font-mono text-sky-400/90 mb-1">Unit {u.index}</p>
              <h2 className="text-sm font-semibold text-vanta-text leading-snug mb-2">{u.title}</h2>
              <p className="text-[11px] text-vanta-muted leading-relaxed line-clamp-3">{u.summary}</p>
              <p className="text-[10px] text-emerald-400/90 mt-3 font-medium">Open AI exam →</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
