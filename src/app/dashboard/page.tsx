"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { AP_COURSES } from "@/lib/apCatalog";
import { AP_CATEGORY_ORDER, getCoursesGroupedByCategory } from "@/lib/apCategories";
import { FriendlyCourseIcon } from "@/components/study/FriendlyCourseIcon";
import { useCountdown } from "@/hooks/useTimer";
import { loadCmdStats, type CommandCenterStats } from "@/lib/cmdStats";
import { SimpleIconBox } from "@/components/icons/SimpleIconBox";

function SubjectCard({
  name,
  short,
  examDate,
  courseId,
}: {
  name: string;
  short: string;
  examDate: string;
  courseId: string;
}) {
  const { days, hours, minutes } = useCountdown(examDate);
  const done = days <= 0 && hours <= 0 && minutes <= 0;
  const timerLabel = done ? "Exam window" : `${days}d ${hours}h ${minutes}m`;

  return (
    <Card
      hover
      className="p-4 h-full border-vanta-border/80 bg-vanta-surface/60 hover:border-sky-500/30 hover:bg-vanta-surface-hover transition-all flex flex-col rounded-3xl"
    >
      <Link href={`/study?subject=${encodeURIComponent(name)}`} className="block flex-1 min-h-0">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span aria-hidden>
            <FriendlyCourseIcon courseId={courseId} size={40} />
          </span>
          <span className="text-[10px] font-mono tabular-nums shrink-0 rounded px-1.5 py-0.5 bg-slate-200 text-slate-900">
            {timerLabel}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-vanta-text leading-snug mb-1">{name}</h3>
        <p className="text-[11px] text-vanta-muted leading-relaxed line-clamp-2">{short}</p>
      </Link>
      <Link
        href={`/study/exam?ai=1&subject=${encodeURIComponent(name)}`}
        className="mt-3 text-[10px] font-medium text-emerald-400/90 hover:text-emerald-300 hover:underline w-fit"
      >
        AI exam →
      </Link>
    </Card>
  );
}

export default function DashboardPage() {
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
  const coursesByArea = useMemo(() => getCoursesGroupedByCategory(), []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <section className="mb-10 fade-up flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <p className="text-[10px] text-sky-400 uppercase tracking-[0.2em] font-semibold mb-2">Command center</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-vanta-text tracking-wide">
            Your AP command center
          </h1>
          <p className="text-vanta-muted text-sm mt-2 max-w-xl">
            CB-style practice • Live countdowns • Score predictor • Analytics — {userName ? `${userName}, ` : ""}
            stay exam-ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 lg:gap-10 font-display">
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-sky-400 tabular-nums">{AP_COURSES.length}</p>
            <p className="text-[10px] text-vanta-muted uppercase tracking-widest">Subjects</p>
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-vanta-text tabular-nums">{attempts}</p>
            <p className="text-[10px] text-vanta-muted uppercase tracking-widest">Attempts</p>
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums">{attempts ? `${accuracy}%` : "—"}</p>
            <p className="text-[10px] text-vanta-muted uppercase tracking-widest">Accuracy</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 stagger">
        <Card className="p-4 border-vanta-border bg-vanta-surface/50">
          <span className="mb-2 inline-block" aria-hidden>
            <SimpleIconBox name="clipboard" size={28} />
          </span>
          <p className="text-2xl font-display font-bold text-vanta-text">{attempts}</p>
          <p className="text-[11px] text-vanta-muted uppercase tracking-wider">Total attempts</p>
        </Card>
        <Card className="p-4 border-vanta-border bg-vanta-surface/50">
          <span className="mb-2 inline-block" aria-hidden>
            <SimpleIconBox name="check" size={28} />
          </span>
          <p className="text-2xl font-display font-bold text-emerald-400">{correct}</p>
          <p className="text-[11px] text-vanta-muted uppercase tracking-wider">Correct answers</p>
        </Card>
        <Card className="p-4 border-vanta-border bg-vanta-surface/50">
          <span className="mb-2 inline-block" aria-hidden>
            <SimpleIconBox name="book" size={28} />
          </span>
          <p className="text-2xl font-display font-bold text-sky-400">{subjectsPracticed}</p>
          <p className="text-[11px] text-vanta-muted uppercase tracking-wider">Subjects practiced</p>
        </Card>
        <Card className="p-4 border-vanta-border bg-vanta-surface/50">
          <span className="mb-2 inline-block" aria-hidden>
            <SimpleIconBox name="flame" size={28} />
          </span>
          <p className="text-2xl font-display font-bold text-amber-400">{streak}</p>
          <p className="text-[11px] text-vanta-muted uppercase tracking-wider">Strong-exam streak</p>
        </Card>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-vanta-muted uppercase tracking-widest">AP exams by area</h2>
          <Link href="/study" className="text-xs text-sky-400 hover:underline">
            Open practice library →
          </Link>
        </div>
        <div className="space-y-8">
          {AP_CATEGORY_ORDER.map((cat) => {
            const courses = coursesByArea[cat.id];
            if (!courses.length) return null;
            return (
              <div key={cat.id}>
                <h3 className="text-[11px] font-semibold text-sky-400/90 uppercase tracking-wider mb-1">{cat.label}</h3>
                <p className="text-[10px] text-vanta-muted mb-3">{cat.short}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {courses.map((c) => (
                    <SubjectCard key={c.id} courseId={c.id} name={c.name} short={c.short} examDate={c.examDate} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-vanta-muted uppercase tracking-widest mb-3">Featured practice sets</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {practiceExams.slice(0, 6).map((exam) => {
            const n = (exam.content_data as { questions: unknown[] }).questions.length;
            return (
              <Link key={exam.id} href={`/study/exam?id=${exam.id}`}>
                <Card hover className="p-4 h-full border-vanta-border/80">
                  <p className="text-xs text-sky-400 font-medium mb-1">{exam.subject}</p>
                  <p className="text-sm font-semibold text-vanta-text">{exam.title}</p>
                  <p className="text-[11px] text-vanta-muted mt-2">{n} questions · MC & figures where noted</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
