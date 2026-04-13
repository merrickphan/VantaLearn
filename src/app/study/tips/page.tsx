"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { AP_SUBJECTS, SAT_SUBJECTS } from "@/lib/utils";

export default function StudyTipsPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allSubjects = [...AP_SUBJECTS, ...SAT_SUBJECTS];

  const getTip = async () => {
    if (!selectedSubject) return;
    setLoading(true);
    setError("");
    setTip("");

    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "study_tip",
          subject: selectedSubject,
          topic: topic || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTip(data.tip || data.feedback || "");
    } catch {
      setError("Could not generate tip. Please check your OpenAI API key in .env.local");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 fade-up">
        <h1 className="text-2xl font-bold text-vanta-text">AI Study Tips</h1>
        <p className="text-vanta-muted text-sm mt-1">Get personalized, subject-specific study advice from AI</p>
      </div>

      <Card className="p-6 mb-6 fade-up">
        <div className="mb-5">
          <label className="text-sm text-vanta-muted font-medium block mb-2">Select Subject</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {allSubjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                  ${selectedSubject === subj
                    ? "bg-vanta-blue/15 border-vanta-blue text-vanta-blue"
                    : "border-vanta-border text-vanta-muted hover:border-vanta-blue/40"
                  }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="text-sm text-vanta-muted font-medium block mb-2">
            Specific Topic <span className="text-vanta-muted/60 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. integration by parts, essay structure..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/70 rounded-lg px-4 py-2.5 text-sm border border-vanta-border focus:border-vanta-blue focus:outline-none"
          />
        </div>

        <Button
          onClick={getTip}
          disabled={!selectedSubject || loading}
          loading={loading}
          className="w-full"
        >
          {loading ? "Generating tip..." : "✨ Get Study Tip"}
        </Button>
      </Card>

      {error && (
        <Card className="p-5 border-vanta-error/30 mb-4 fade-up">
          <p className="text-vanta-error text-sm">{error}</p>
        </Card>
      )}

      {loading && (
        <Card className="p-6 fade-up">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-vanta-blue ai-pulse" />
            <p className="text-vanta-muted text-sm">Generating your personalized study tip...</p>
          </div>
        </Card>
      )}

      {tip && !loading && (
        <Card className="p-6 border-vanta-blue/20 fade-up">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-xs text-vanta-blue font-semibold uppercase tracking-wider">AI Study Tip</p>
              {selectedSubject && <p className="text-xs text-vanta-muted">{selectedSubject}{topic ? ` · ${topic}` : ""}</p>}
            </div>
          </div>
          <div className="text-vanta-text text-sm leading-relaxed whitespace-pre-line">{tip}</div>
          <div className="mt-4 pt-4 border-t border-vanta-border">
            <Button variant="ghost" size="sm" onClick={getTip}>↻ Generate another tip</Button>
          </div>
        </Card>
      )}

      {/* Quick tips while waiting */}
      {!tip && !loading && (
        <div className="mt-6">
          <p className="text-xs text-vanta-muted uppercase tracking-wider font-semibold mb-3">General Study Tips</p>
          <div className="space-y-3 stagger">
            {[
              { icon: "🕐", tip: "Use the Pomodoro technique: 25 min focused study, 5 min break." },
              { icon: "✍️", tip: "Active recall beats re-reading. Quiz yourself instead of highlighting." },
              { icon: "🌙", tip: "Sleep consolidates memory. Study before sleep for better retention." },
              { icon: "🔄", tip: "Spaced repetition: review material at increasing intervals over days." },
            ].map((item) => (
              <div key={item.tip} className="fade-up flex gap-3 bg-vanta-surface border border-vanta-border rounded-lg px-4 py-3">
                <span className="text-lg">{item.icon}</span>
                <p className="text-sm text-vanta-text leading-relaxed">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
