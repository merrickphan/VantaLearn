"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { AP_COURSES } from "@/lib/apCatalog";
import { AP_SECTION_ORDER, AP_SECTIONS, getCoursesInSection, type ApSectionId } from "@/lib/apCategories";
import { getUnitsForCourseId } from "@/lib/apUnits";
import { Card, Badge, Button } from "@/components/ui";
import { SimpleIconBox } from "@/components/icons/SimpleIconBox";

function ApPracticeInner() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course")?.trim() || "";

  const course = useMemo(() => AP_COURSES.find((c) => c.id === courseId), [courseId]);

  if (courseId && course) {
    const units = getUnitsForCourseId(course.id);
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 md:py-12">
        <div className="mb-8 fade-up">
          <Link href="/study/ap-practice" className="text-sm text-vanta-muted hover:text-vanta-blue">
            ← All sections
          </Link>
          <div className="flex flex-wrap items-start gap-4 mt-3">
            <span aria-hidden>
              <SimpleIconBox name={course.icon} size={48} />
            </span>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-vanta-text tracking-wide">{course.name}</h1>
              <p className="text-vanta-muted text-lg mt-1">{course.short}</p>
            </div>
          </div>
        </div>

        <p className="text-vanta-muted text-base mb-6 max-w-2xl">
          Each link starts a new 10-question multiple-choice set. Problems are generated on demand with randomized parameters so you can practice the same unit many times.
        </p>

        <div className="space-y-3 stagger">
          {units.map((u) => (
            <Link
              key={u.id}
              href={`/study/exam?proc=1&course=${encodeURIComponent(course.id)}&unit=${encodeURIComponent(u.id)}`}
            >
              <Card hover className="p-6 flex flex-wrap items-center justify-between gap-4 border-vanta-border/80">
                <div>
                  <p className="text-sm font-medium text-vanta-blue mb-1">Unit {u.index}</p>
                  <h3 className="text-vanta-text font-semibold text-lg">{u.title}</h3>
                  <p className="text-vanta-muted text-sm mt-1">{u.summary}</p>
                </div>
                <Badge variant="blue">Practice</Badge>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (courseId && !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-vanta-muted mb-4">Course not found.</p>
        <Link href="/study/ap-practice">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 md:py-12">
      <div className="mb-10 fade-up">
        <Link href="/study" className="text-sm text-vanta-muted hover:text-vanta-blue">
          ← Practice library
        </Link>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-vanta-text tracking-wide mt-3">AP by section & unit</h1>
        <p className="text-vanta-muted text-lg mt-2 max-w-2xl">
          Browse by subject area, open a course, then pick a unit for unlimited auto-generated multiple-choice practice (new parameters each session).
        </p>
      </div>

      <div className="space-y-12">
        {AP_SECTION_ORDER.map((sectionId: ApSectionId) => {
          const meta = AP_SECTIONS.find((s) => s.id === sectionId);
          const courses = getCoursesInSection(sectionId, AP_COURSES);
          if (courses.length === 0) return null;
          return (
            <section key={sectionId} className="fade-up">
              <h2 className="text-xl font-semibold text-vanta-text mb-1">{meta?.label ?? sectionId}</h2>
              <p className="text-vanta-muted text-sm mb-5 max-w-2xl">{meta?.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
                {courses.map((c) => (
                  <Link key={c.id} href={`/study/ap-practice?course=${encodeURIComponent(c.id)}`}>
                    <Card hover className="p-6 h-full border-vanta-border/80 flex gap-4">
                      <span className="shrink-0" aria-hidden>
                        <SimpleIconBox name={c.icon} size={40} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-vanta-text font-semibold text-lg leading-snug">{c.name}</h3>
                        <p className="text-vanta-muted text-sm mt-1 line-clamp-2">{c.short}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function ApPracticePage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-vanta-muted text-lg">Loading…</div>}>
      <ApPracticeInner />
    </Suspense>
  );
}
