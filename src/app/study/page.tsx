import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";

export default function StudyPage() {
  const flashcardSets = SAMPLE_RESOURCES.filter((r) => r.type === "flashcard_set");
  const practiceExams = SAMPLE_RESOURCES.filter((r) => r.type === "practice_exam");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 fade-up">
        <h1 className="text-2xl font-bold text-vanta-text">Study Library</h1>
        <p className="text-vanta-muted text-sm mt-1">Browse all flashcard decks and practice exams</p>
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Flashcard Decks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
          {flashcardSets.map((set) => {
            const cards = (set.content_data as { cards: unknown[] }).cards;
            return (
              <Link key={set.id} href={`/study/flashcards?id=${set.id}`}>
                <Card hover className="p-5 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">🃏</span>
                    <Badge variant="blue">{cards.length} cards</Badge>
                  </div>
                  <h3 className="text-vanta-text font-semibold mb-1">{set.title}</h3>
                  <p className="text-vanta-muted text-sm">{set.subject}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Practice Exams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
          {practiceExams.map((exam) => {
            const { questions, time_limit_minutes } = exam.content_data as { questions: unknown[]; time_limit_minutes?: number };
            return (
              <Link key={exam.id} href={`/study/exam?id=${exam.id}`}>
                <Card hover className="p-5 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">📝</span>
                    <div className="flex gap-2">
                      <Badge variant="gray">{questions.length} Qs</Badge>
                      {time_limit_minutes && <Badge variant="blue">{time_limit_minutes}m</Badge>}
                    </div>
                  </div>
                  <h3 className="text-vanta-text font-semibold mb-1">{exam.title}</h3>
                  <p className="text-vanta-muted text-sm">{exam.subject}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Quick Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/study/tips">
            <Card hover className="p-5">
              <span className="text-2xl mb-3 block">🤖</span>
              <h3 className="text-vanta-text font-semibold mb-1">AI Study Tips</h3>
              <p className="text-vanta-muted text-sm">Get personalized, subject-specific study advice</p>
            </Card>
          </Link>
          <Link href="/dashboard/score-calculator">
            <Card hover className="p-5">
              <span className="text-2xl mb-3 block">🧮</span>
              <h3 className="text-vanta-text font-semibold mb-1">Score Calculator</h3>
              <p className="text-vanta-muted text-sm">Estimate your AP (1–5) or SAT scaled score</p>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
