"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { AP_COURSES, getCourseByName } from "@/lib/apCatalog";
import { AP_SECTION_ORDER, AP_SECTIONS, getCoursesInSection, type ApSectionId } from "@/lib/apCategories";
import { getUnitsForCourseId } from "@/lib/apUnits";
import { useCountdown } from "@/hooks/useTimer";
import { loadCmdStats, type CommandCenterStats } from "@/lib/cmdStats";
import { SimpleIconBox, type SimpleIconId } from "@/components/icons/SimpleIconBox";
import { ApCourseUnitList } from "@/components/ap/ApCourseUnitList";

function DashboardContent() {
  const searchParams = useSearchParams();
  const selectedCourseId = searchParams.get("course")?.trim() || "";
  const selectedCourse = selectedCourseId ? AP_COURSES.find((c) => c.id === selectedCourseId) : undefined;

  const [userName, setUserName] = useState("");
  const [cmdStats, setCmdStats] = useState<CommandCenterStats | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserName(data.user.user_metadata?.full_name?.split(" ")[0] || "Student");
      }
    });
    setCmdStats(loadCmdStats());
  }, []);

  const practiceExams = SAMPLE_RESOURCES.filter((r) => r.type === "practice_exam");
  const attempts = cmdStats?.attempts ?? 0;
  const correct = cmdStats?.correct ?? 0;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  const subjectsPracticed = cmdStats?.subjectsPracticed?.length ?? 0;
  const streak = cmdStats?.streak ?? 0;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 md:py-12">
      <section className="mb-12 fade-up flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div>
          <p className="text-xs text-sky-400 uppercase tracking-[0.2em] font-semibold mb-3">Command center</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-vanta-text tracking-wide">
            Your AP command center
          </h1>
          <p className="text-vanta-muted text-lg mt-3 max-w-xl">
            Exam-style practice • Live countdowns • Score predictor • Analytics — {userName ? `${userName}, ` : ""}
            stay exam-ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 lg:gap-12 font-display">
          <div className="text-right">
            <p className="text-3xl sm:text-4xl font-bold text-sky-400 tabular-nums">{AP_COURSES.length}</p>
            <p className="text-xs text-vanta-muted uppercase tracking-widest">Subjects</p>
          </div>
          <div className="text-right">
            <p className="text-3xl sm:text-4xl font-bold text-vanta-text tabular-nums">{attempts}</p>
            <p className="text-xs text-vanta-muted uppercase tracking-widest">Attempts</p>
          </div>
          <div className="text-right">
            <p className="text-3xl sm:text-4xl font-bold text-emerald-400 tabular-nums">{attempts ? `${accuracy}%` : "—"}</p>
            <p className="text-xs text-vanta-muted uppercase tracking-widest">Accuracy</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 stagger">
        <Card className="p-6 border-vanta-border bg-vanta-surface/50">
          <span className="mb-3 inline-block" aria-hidden>
            <SimpleIconBox name="clipboard" size={36} />
          </span>
          <p className="text-3xl font-display font-bold text-vanta-text">{attempts}</p>
          <p className="text-sm text-vanta-muted uppercase tracking-wider">Total attempts</p>
        </Card>
        <Card className="p-6 border-vanta-border bg-vanta-surface/50">
          <span className="mb-3 inline-block" aria-hidden>
            <SimpleIconBox name="check" size={36} />
          </span>
          <p className="text-3xl font-display font-bold text-emerald-400">{correct}</p>
          <p className="text-sm text-vanta-muted uppercase tracking-wider">Correct answers</p>
        </Card>
        <Card className="p-6 border-vanta-border bg-vanta-surface/50">
          <span className="mb-3 inline-block" aria-hidden>
            <SimpleIconBox name="book" size={36} />
          </span>
          <p className="text-3xl font-display font-bold text-sky-400">{subjectsPracticed}</p>
          <p className="text-sm text-vanta-muted uppercase tracking-wider">Subjects practiced</p>
        </Card>
        <Card className="p-6 border-vanta-border bg-vanta-surface/50">
          <span className="mb-3 inline-block" aria-hidden>
            <SimpleIconBox name="flame" size={36} />
          </span>
          <p className="text-3xl font-display font-bold text-amber-400">{streak}</p>
          <p className="text-sm text-vanta-muted uppercase tracking-wider">Strong-exam streak</p>
        </Card>
      </section>

      {selectedCourse && (
        <ApCourseUnitList
          courseId={selectedCourse.id}
          backHref="/dashboard"
          backLabel="← All AP exams"
          intro={
            selectedCourse.id === "wh"
              ? "Multiple-choice practice is organized by historical era (nine spans from 1200 CE to the present). Pick an era to drill themes and terms—items stay within that time frame."
              : selectedCourse.id === "hum-geo"
                ? "Multiple-choice practice is grouped by topic (seven themes from geographic foundations through economic development). Pick a theme so generated items stay in that area."
                : selectedCourse.id === "ush"
                  ? "Multiple-choice practice follows nine chronological spans from Indigenous North America and early contact through the late 20th and 21st centuries. Pick a span so generated items stay in that window."
                  : undefined
          }
        />
      )}

      {selectedCourseId && !selectedCourse && (
        <Card className="p-6 mb-10 border-vanta-border border-amber-500/30 bg-amber-500/5">
          <p className="text-vanta-text font-medium mb-2">Unknown course</p>
          <p className="text-vanta-muted text-sm mb-4">That exam id is not in the catalog.</p>
          <Link href="/dashboard" className="text-sm text-sky-400 hover:underline">
            Clear and return to dashboard
          </Link>
        </Card>
      )}

      <section className="mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-widest">
              {selectedCourse ? "All AP exams" : "All AP exams by section"}
            </h2>
            {!selectedCourse ? (
              <p className="text-vanta-muted text-sm mt-2 max-w-2xl">
                Choose a subject area, then an exam. You’ll see each topic unit and can start unlimited generated practice for any unit.
              </p>
            ) : (
              <p className="text-vanta-muted text-sm mt-2 max-w-2xl">
                Open another course to browse its units, or use the library for static decks and sample exams.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <Link href="/study/ap-practice" className="text-sm text-sky-400 hover:underline whitespace-nowrap">
              AP practice (full page) →
            </Link>
            <Link href="/study" className="text-sm text-vanta-muted hover:text-sky-400 whitespace-nowrap">
              Practice library →
            </Link>
          </div>
        </div>

        <div className="space-y-12">
          {AP_SECTION_ORDER.map((sectionId: ApSectionId) => {
            const meta = AP_SECTIONS.find((s) => s.id === sectionId);
            const courses = getCoursesInSection(sectionId, AP_COURSES);
            if (courses.length === 0) return null;
            return (
              <section key={sectionId} className="fade-up">
                <h3 className="text-lg font-semibold text-vanta-text mb-1">{meta?.label ?? sectionId}</h3>
                <p className="text-vanta-muted text-sm mb-5 max-w-3xl">{meta?.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger">
                  {courses.map((c) => (
                    <CourseExamCard
                      key={c.id}
                      icon={c.icon}
                      name={c.name}
                      short={c.short}
                      examDate={c.examDate}
                      courseId={c.id}
                      unitCount={getUnitsForCourseId(c.id).length}
                      isActive={selectedCourseId === c.id}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-widest">Featured practice sets</h2>
          <p className="text-xs text-vanta-muted">Static exams · Link to unit drills when the subject matches an AP course</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {practiceExams.slice(0, 6).map((exam) => {
            const n = (exam.content_data as { questions: unknown[] }).questions.length;
            const matched = getCourseByName(exam.subject);
            return (
              <Card key={exam.id} className="p-6 h-full border-vanta-border/80 flex flex-col">
                <p className="text-sm text-sky-400 font-medium mb-2">{exam.subject}</p>
                <Link href={`/study/exam?id=${exam.id}`} className="group">
                  <p className="text-lg font-semibold text-vanta-text group-hover:text-sky-300 transition-colors">{exam.title}</p>
                </Link>
                <p className="text-sm text-vanta-muted mt-3 flex-1">{n} questions · MC & figures where noted</p>
                {matched ? (
                  <Link
                    href={`/dashboard?course=${encodeURIComponent(matched.id)}`}
                    className="text-sm text-sky-400 hover:underline mt-4 inline-flex items-center gap-1"
                  >
                    <span aria-hidden>
                      <SimpleIconBox name="lineTrend" size={18} />
                    </span>
                    Practice by unit ({getUnitsForCourseId(matched.id).length} units)
                  </Link>
                ) : null}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CourseExamCard({
  icon,
  name,
  short,
  examDate,
  courseId,
  unitCount,
  isActive,
}: {
  icon: SimpleIconId;
  name: string;
  short: string;
  examDate: string;
  courseId: string;
  unitCount: number;
  isActive: boolean;
}) {
  const { days, hours, minutes } = useCountdown(examDate);
  const done = days <= 0 && hours <= 0 && minutes <= 0;
  const timerLabel = done ? "Exam window" : `${days}d ${hours}h ${minutes}m`;

  return (
    <Link href={`/dashboard?course=${encodeURIComponent(courseId)}`}>
      <Card
        hover
        className={`p-6 h-full border transition-all ${
          isActive
            ? "border-sky-500/50 bg-sky-500/10 ring-1 ring-sky-500/20"
            : "border-vanta-border/80 bg-vanta-surface/60 hover:border-sky-500/30 hover:bg-vanta-surface-hover"
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-4">
          <span aria-hidden>
            <SimpleIconBox name={icon} size={40} />
          </span>
          <span className="text-xs font-mono tabular-nums shrink-0 rounded-md px-2 py-1 bg-slate-200 text-slate-900">
            {timerLabel}
          </span>
        </div>
        <h3 className="text-base font-semibold text-vanta-text leading-snug mb-2">{name}</h3>
        <p className="text-sm text-vanta-muted leading-relaxed line-clamp-3 mb-3">{short}</p>
        <p className="text-xs font-medium text-sky-400/90 uppercase tracking-wider">{unitCount} units · tap for drills</p>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16 flex items-center justify-center text-vanta-muted text-lg">
          Loading dashboard…
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
