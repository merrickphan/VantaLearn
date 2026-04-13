"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";
import { VantaLogo } from "@/components/branding/VantaLogo";
import { ALL_EXAMS, COMMON_EXAM_DATES } from "@/lib/utils";

type Step = "account" | "exams";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [examDates, setExamDates] = useState<Record<string, string>>(COMMON_EXAM_DATES);

  const supabase = createClient();

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setStep("exams");
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    // Save exam timers to DB (simplified — would hit API in prod)
    // For now, store in localStorage as fallback
    localStorage.setItem("vanta_exam_timers", JSON.stringify(
      selectedExams.map((exam) => ({ exam_name: exam, target_date: examDates[exam] || "" }))
    ));
    router.push("/dashboard");
    router.refresh();
  };

  const toggleExam = (exam: string) => {
    setSelectedExams((prev) =>
      prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam]
    );
  };

  if (step === "exams") {
    return (
      <div className="min-h-screen bg-vanta-bg px-4 py-12">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8 fade-up">
            <div className="w-10 h-10 bg-sky-500/20 border border-sky-400/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-sky-200 font-bold font-display">2</span>
            </div>
            <h1 className="text-2xl font-bold text-vanta-text mb-2">Which exams are you preparing for?</h1>
            <p className="text-vanta-muted text-sm">We&apos;ll set up countdown timers for your selected exams</p>
          </div>

          <div className="bg-vanta-surface border border-vanta-border rounded-card p-6 mb-6">
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
              {ALL_EXAMS.map((exam) => (
                <button
                  key={exam}
                  onClick={() => toggleExam(exam)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border
                    ${selectedExams.includes(exam)
                      ? "bg-vanta-blue/15 border-vanta-blue text-vanta-blue"
                      : "bg-transparent border-vanta-border text-vanta-muted hover:border-vanta-blue/50 hover:text-vanta-text"
                    }`}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>

          {selectedExams.length > 0 && (
            <div className="bg-vanta-surface border border-vanta-border rounded-card p-6 mb-6 space-y-3">
              <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider">Set exam dates</h2>
              {selectedExams.map((exam) => (
                <div key={exam} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-vanta-text flex-1">{exam}</span>
                  <input
                    type="date"
                    value={examDates[exam] || ""}
                    onChange={(e) => setExamDates((prev) => ({ ...prev, [exam]: e.target.value }))}
                    className="bg-vanta-surface-elevated text-vanta-text text-sm border border-vanta-border focus:border-vanta-blue rounded-lg px-3 py-1.5 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/dashboard")} className="flex-1">
              Skip for now
            </Button>
            <Button onClick={handleFinish} loading={loading} className="flex-1">
              Go to Dashboard →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanta-bg flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <span className="rounded-lg p-1 ring-1 ring-sky-500/25 bg-vanta-surface-elevated">
          <VantaLogo size={28} variant="command" />
        </span>
        <span className="font-display text-vanta-text font-semibold text-lg tracking-wide">VantaLearn</span>
      </Link>

      <div className="w-full max-w-sm bg-vanta-surface border border-vanta-border rounded-card p-8 shadow-card fade-up">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-vanta-muted bg-vanta-border px-2 py-0.5 rounded-full">Step 1 of 2</span>
        </div>
        <h1 className="text-2xl font-bold text-vanta-text mb-1">Create your account</h1>
        <p className="text-vanta-muted text-sm mb-8">Start studying smarter today — it&apos;s free</p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-vanta-error/10 border border-vanta-error/30 rounded-lg text-vanta-error text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-vanta-surface-elevated hover:bg-vanta-surface-hover border border-vanta-border hover:border-sky-500/35 text-vanta-text rounded-lg py-2.5 text-sm font-medium transition-all mb-6 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-vanta-border" />
          <span className="text-vanta-muted text-xs">or</span>
          <div className="flex-1 h-px bg-vanta-border" />
        </div>

        <form onSubmit={handleAccountSubmit} className="space-y-4">
          <Input id="name" label="Full name" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input id="email" label="Email" type="email" placeholder="student@school.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input id="password" label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          <Button type="submit" loading={loading} className="w-full">
            Create account →
          </Button>
        </form>

        <p className="text-center text-vanta-muted text-sm mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-vanta-blue hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
