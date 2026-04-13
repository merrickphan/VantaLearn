"use client";

import { Card, ProgressBar, Badge } from "@/components/ui";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";

export default function ProgressPage() {
 // In production this would come from Supabase UserProgress table
 const mockProgress = [
 { resourceId: "1", title: "AP Biology: Cell Processes", type: "flashcard_set", score: 83, completedAt: "2025-04-10", timeSpent: 420 },
 { resourceId: "3", title: "AP US History: Chapter 1-5", type: "practice_exam", score: 66, completedAt: "2025-04-09", timeSpent: 1800 },
 { resourceId: "4", title: "AP Calculus AB: Derivatives", type: "practice_exam", score: 50, completedAt: "2025-04-08", timeSpent: 960 },
 ];

 const avgScore = Math.round(mockProgress.reduce((a, p) => a + p.score, 0) / mockProgress.length);
 const totalTime = mockProgress.reduce((a, p) => a + p.timeSpent, 0);
 const totalHours = Math.floor(totalTime / 3600);
 const totalMins = Math.floor((totalTime % 3600) / 60);

 const typeLabel = (t: string) => t === "flashcard_set" ? "Flashcards" : "Practice Exam";
 const typeBadge = (t: string) => t === "flashcard_set" ? "blue" : "gray";

 const scoreColor = (s: number) =>
 s >= 75 ? "text-vanta-success" : s >= 50 ? "text-vanta-blue" : "text-vanta-error";

 return (
 <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
 <div className="mb-8 fade-up">
 <h1 className="text-2xl font-bold text-vanta-text">Progress</h1>
 <p className="text-vanta-muted text-sm mt-1">Track your study history and improvement over time</p>
 </div>

 {/* Summary stats */}
 <div className="grid grid-cols-3 gap-4 mb-8 stagger">
 {[
 { label: "Sessions", value: mockProgress.length, suffix: "" },
 { label: "Avg. Score", value: avgScore, suffix: "%" },
 { label: "Time Studied", value: totalHours > 0 ? `${totalHours}h ${totalMins}m` : `${totalMins}m`, suffix: "" },
 ].map((stat) => (
 <Card key={stat.label} className="p-4 text-center fade-up">
 <p className="text-2xl font-bold text-vanta-blue">{stat.value}{stat.suffix}</p>
 <p className="text-xs text-vanta-muted mt-1">{stat.label}</p>
 </Card>
 ))}
 </div>

 {/* Subject breakdown */}
 <section className="mb-8">
 <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Subject Performance</h2>
 <div className="space-y-3 stagger">
 {mockProgress.map((item) => (
 <Card key={item.resourceId} className="p-4 fade-up">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 <Badge variant={typeBadge(item.type) as "blue" | "gray"}>{typeLabel(item.type)}</Badge>
 <span className="text-sm text-vanta-text font-medium">{item.title}</span>
 </div>
 <span className={`text-sm font-bold ${scoreColor(item.score)}`}>{item.score}%</span>
 </div>
 <ProgressBar
 value={item.score}
 color={item.score >= 60 ? "green" : "blue"}
 className="mb-2"
 />
 <p className="text-xs text-vanta-muted">
 Completed {new Date(item.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
 {" | "}
 {Math.floor(item.timeSpent / 60)}m spent
 </p>
 </Card>
 ))}
 </div>
 </section>

 {/* Overall progress toward mastery */}
 <section>
 <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Overall Mastery</h2>
 <Card className="p-6 fade-up">
 {SAMPLE_RESOURCES.map((resource) => {
 const progress = mockProgress.find((p) => p.resourceId === resource.id);
 return (
 <div key={resource.id} className="mb-4 last:mb-0">
 <div className="flex justify-between text-sm mb-1.5">
 <span className="text-vanta-text">{resource.title}</span>
 <span className="text-vanta-muted">{progress ? `${progress.score}%` : "Not started"}</span>
 </div>
 <ProgressBar
 value={progress?.score ?? 0}
 color={progress && progress.score >= 60 ? "green" : "blue"}
 />
 </div>
 );
 })}
 </Card>
 </section>
 </div>
 );
}
