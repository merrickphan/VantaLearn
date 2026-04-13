"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AP_COURSES } from "@/lib/apCatalog";
import { getCourseOverview } from "@/lib/apCourseOverviews";
import { AP_SECTIONS, getSectionIdForCourseId } from "@/lib/apCategories";
import { getUnitsForCourseId } from "@/lib/apUnits";
import { Card, Badge } from "@/components/ui";
import { SimpleIconBox } from "@/components/icons/SimpleIconBox";

export function ApCourseUnitList({
  courseId,
  backHref,
  backLabel,
  intro,
}: {
  courseId: string;
  backHref: string;
  backLabel: string;
  intro?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const course = AP_COURSES.find((c) => c.id === courseId);
  if (!course) return null;

  const overviewDoc = getCourseOverview(courseId);
  const showOverview = searchParams.get("overview") === "1";

  const toggleOverviewHref = () => {
    const q = new URLSearchParams();
    q.set("course", courseId);
    if (!showOverview) q.set("overview", "1");
    return `${pathname}?${q.toString()}`;
  };

  const units = getUnitsForCourseId(courseId);
  const sectionId = getSectionIdForCourseId(courseId);
  const sectionMeta = sectionId ? AP_SECTIONS.find((s) => s.id === sectionId) : undefined;

  return (
    <div className="rounded-2xl border border-vanta-border bg-vanta-surface/60 p-6 sm:p-8 mb-10 fade-up">
      <div className="mb-6">
        <Link href={backHref} className="text-sm text-vanta-muted hover:text-vanta-blue">
          {backLabel}
        </Link>
        {sectionMeta ? (
          <p className="text-xs font-medium text-sky-400/90 uppercase tracking-widest mt-4 mb-1">{sectionMeta.label}</p>
        ) : null}
        <div className="flex flex-wrap items-start gap-4 mt-1">
          <span aria-hidden>
            <SimpleIconBox name={course.icon} size={48} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-vanta-text tracking-wide">{course.name}</h2>
            <p className="text-vanta-muted text-base mt-1">{course.short}</p>
            {overviewDoc ? (
              <div className="mt-4">
                <Link
                  href={toggleOverviewHref()}
                  scroll={false}
                  className="inline-flex items-center justify-center font-semibold rounded-xl btn-shine btn-shine-outline bg-transparent border border-vanta-border hover:border-vanta-blue/60 text-vanta-text hover:text-vanta-blue hover:bg-vanta-blue-muted/40 text-sm px-4 py-2.5 min-h-[2.75rem]"
                  aria-expanded={showOverview}
                >
                  {showOverview ? "Hide course overview" : "Course overview"}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
        <p className="text-vanta-muted text-sm sm:text-base mt-4 max-w-2xl">
          {intro ??
            "Pick a unit for a fresh 10-question multiple-choice set. Each run uses new numbers and mixes so you can repeat the same unit as often as you like."}
        </p>
      </div>

      {showOverview && overviewDoc ? (
        <Card className="p-5 sm:p-6 mb-8 border-sky-500/25 bg-sky-500/5">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-400/90 mb-2">{overviewDoc.eyebrow}</p>
          <p className="text-vanta-text text-sm sm:text-base leading-relaxed mb-6">{overviewDoc.summary}</p>
          <div className="space-y-5">
            {overviewDoc.sections.map((s) => (
              <div key={s.title}>
                <h3 className="text-vanta-text font-semibold text-sm sm:text-base mb-1.5">{s.title}</h3>
                <p className="text-vanta-muted text-sm sm:text-base leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="space-y-3">
        {units.map((u) => (
          <Link
            key={u.id}
            href={`/study/exam?proc=1&course=${encodeURIComponent(course.id)}&unit=${encodeURIComponent(u.id)}`}
          >
            <Card hover className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-vanta-border/80">
              <div>
                <p className="text-sm font-medium text-vanta-blue mb-1">Unit {u.index}</p>
                <h3 className="text-vanta-text font-semibold text-base sm:text-lg">{u.title}</h3>
                <p className="text-vanta-muted text-sm mt-1 line-clamp-2">{u.summary}</p>
              </div>
              <Badge variant="blue">Practice</Badge>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
