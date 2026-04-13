"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { ALL_EXAMS, COMMON_EXAM_DATES } from "@/lib/utils";

interface ExamTimer { exam_name: string; target_date: string; }

export default function SettingsPage() {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [examDates, setExamDates] = useState<Record<string, string>>(COMMON_EXAM_DATES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ email: data.user.email, name: data.user.user_metadata?.full_name });
      }
    });
    try {
      const stored = localStorage.getItem("vanta_exam_timers");
      if (stored) {
        const parsed = JSON.parse(stored) as ExamTimer[];
        setSelectedExams(parsed.map((t) => t.exam_name));
        const dates: Record<string, string> = { ...COMMON_EXAM_DATES };
        parsed.forEach((t) => { dates[t.exam_name] = t.target_date; });
        setExamDates(dates);
      }
    } catch {}
  }, []);

  const toggleExam = (exam: string) => {
    setSelectedExams((prev) => prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam]);
  };

  const saveSettings = () => {
    const timers: ExamTimer[] = selectedExams.map((exam) => ({ exam_name: exam, target_date: examDates[exam] || "" }));
    localStorage.setItem("vanta_exam_timers", JSON.stringify(timers));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 fade-up">
        <h1 className="text-2xl font-bold text-vanta-text">Settings</h1>
        <p className="text-vanta-muted text-sm mt-1">Manage your account and exam preferences</p>
      </div>

      {/* Account Info */}
      <Card className="p-6 mb-6 fade-up">
        <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-vanta-muted">Name</span>
            <span className="text-sm text-vanta-text">{user?.name || "—"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-vanta-muted">Email</span>
            <span className="text-sm text-vanta-text">{user?.email || "—"}</span>
          </div>
        </div>
      </Card>

      {/* Exam Timers */}
      <Card className="p-6 mb-6 fade-up">
        <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-2">Exam Countdowns</h2>
        <p className="text-vanta-muted text-xs mb-4">Select exams to track on your dashboard</p>

        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto mb-4">
          {ALL_EXAMS.map((exam) => (
            <button
              key={exam}
              onClick={() => toggleExam(exam)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                ${selectedExams.includes(exam)
                  ? "bg-vanta-blue/15 border-vanta-blue text-vanta-blue"
                  : "border-vanta-border text-vanta-muted hover:border-vanta-blue/40"
                }`}
            >
              {exam}
            </button>
          ))}
        </div>

        {selectedExams.length > 0 && (
          <div className="space-y-2 border-t border-vanta-border pt-4">
            {selectedExams.map((exam) => (
              <div key={exam} className="flex items-center gap-3">
                <span className="text-xs text-vanta-text flex-1">{exam}</span>
                <input
                  type="date"
                  value={examDates[exam] || ""}
                  onChange={(e) => setExamDates((p) => ({ ...p, [exam]: e.target.value }))}
                  className="bg-vanta-border/60 text-vanta-text text-xs border border-transparent focus:border-vanta-blue rounded-lg px-3 py-1.5 focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      <Button onClick={saveSettings} className="w-full">
        {saved ? "✓ Saved!" : "Save Settings"}
      </Button>
    </div>
  );
}
