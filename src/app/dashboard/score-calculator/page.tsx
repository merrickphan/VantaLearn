"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { calculateAPScore, calculateSATScore } from "@/lib/utils";

type ExamType = "ap" | "sat_math" | "sat_rw";

export default function ScoreCalculatorPage() {
  const [examType, setExamType] = useState<ExamType>("ap");
  const [rawScore, setRawScore] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [result, setResult] = useState<null | {
    percentage: number;
    apScore?: number;
    scaledScore?: number;
    label: string;
    color: string;
  }>(null);

  const calculate = () => {
    const raw = parseInt(rawScore);
    const total = parseInt(totalQuestions);
    if (isNaN(raw) || isNaN(total) || total <= 0 || raw < 0 || raw > total) return;

    if (examType === "ap") {
      const { apScore, percentage } = calculateAPScore({ rawScore: raw, totalQuestions: total });
      const colors = { 5: "text-vanta-success", 4: "text-vanta-blue", 3: "text-vanta-blue", 2: "text-vanta-muted", 1: "text-vanta-error" };
      setResult({ percentage, apScore, label: `AP Score: ${apScore}`, color: colors[apScore] });
    } else {
      const { scaledScore, percentage } = calculateSATScore({ rawScore: raw, totalQuestions: total });
      setResult({ percentage, scaledScore, label: `SAT Score: ${scaledScore}`, color: percentage >= 75 ? "text-vanta-success" : percentage >= 50 ? "text-vanta-blue" : "text-vanta-error" });
    }
  };

  const apScoreDescriptions = {
    5: "Extremely well qualified 🏆",
    4: "Well qualified ⭐",
    3: "Qualified ✓",
    2: "Possibly qualified",
    1: "No recommendation",
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 fade-up">
        <h1 className="text-2xl font-bold text-vanta-text">Score Calculator</h1>
        <p className="text-vanta-muted text-sm mt-1">Estimate your AP or SAT scaled score</p>
      </div>

      <Card className="p-6 mb-6 fade-up">
        {/* Exam type selector */}
        <div className="mb-6">
          <p className="text-sm text-vanta-muted font-medium mb-3">Exam Type</p>
          <div className="flex gap-2">
            {(["ap", "sat_math", "sat_rw"] as ExamType[]).map((type) => (
              <button
                key={type}
                onClick={() => { setExamType(type); setResult(null); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all
                  ${examType === type
                    ? "bg-vanta-blue/15 border-vanta-blue text-vanta-blue"
                    : "border-vanta-border text-vanta-muted hover:border-vanta-blue/50"
                  }`}
              >
                {type === "ap" ? "AP Exam" : type === "sat_math" ? "SAT Math" : "SAT R&W"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-vanta-muted font-medium block mb-1.5">Questions Correct (Raw Score)</label>
            <input
              type="number"
              min="0"
              value={rawScore}
              onChange={(e) => setRawScore(e.target.value)}
              placeholder="e.g. 38"
              className="w-full bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/70 rounded-lg px-4 py-2.5 text-sm border border-vanta-border focus:border-vanta-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-vanta-muted font-medium block mb-1.5">Total Questions</label>
            <input
              type="number"
              min="1"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(e.target.value)}
              placeholder="e.g. 45"
              className="w-full bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/70 rounded-lg px-4 py-2.5 text-sm border border-vanta-border focus:border-vanta-blue focus:outline-none"
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">Calculate Score</Button>
      </Card>

      {result && (
        <Card className="p-6 fade-up">
          <p className="text-sm text-vanta-muted mb-4">Estimated Result</p>
          <div className="text-center mb-6">
            <p className={`text-5xl font-bold mb-2 ${result.color}`}>
              {result.apScore ?? result.scaledScore}
            </p>
            <p className="text-vanta-muted text-sm">
              {result.apScore ? apScoreDescriptions[result.apScore as keyof typeof apScoreDescriptions] : "Scaled Score"}
            </p>
          </div>

          <div className="bg-vanta-bg rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-vanta-muted">Accuracy</span>
              <span className="text-vanta-text font-medium">{result.percentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-vanta-border rounded-full overflow-hidden">
              <div
                className="h-full bg-vanta-blue rounded-full transition-all duration-700"
                style={{ width: `${result.percentage}%` }}
              />
            </div>
          </div>

          {result.apScore && (
            <div className="mt-4 grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map((score) => (
                <div
                  key={score}
                  className={`text-center py-2 rounded-lg text-sm font-bold ${
                    score === result.apScore
                      ? "bg-sky-500/20 text-sky-200 border border-sky-400/40"
                      : score < (result.apScore ?? 0)
                      ? "bg-vanta-blue/20 text-vanta-blue"
                      : "bg-vanta-border/50 text-vanta-muted"
                  }`}
                >
                  {score}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
