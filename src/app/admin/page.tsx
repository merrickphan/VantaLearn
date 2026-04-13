"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Button, Input, Textarea, Badge } from "@/components/ui";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";

type Tab = "resources" | "add_flashcard" | "add_exam";

export default function AdminPage() {
 const [tab, setTab] = useState<Tab>("resources");
 const [saved, setSaved] = useState(false);

 // Flashcard form state
 const [deckTitle, setDeckTitle] = useState("");
 const [deckSubject, setDeckSubject] = useState("");
 const [cardFront, setCardFront] = useState("");
 const [cardBack, setCardBack] = useState("");
 const [cards, setCards] = useState<{ front: string; back: string }[]>([]);

 // Exam form state
 const [examTitle, setExamTitle] = useState("");
 const [examSubject, setExamSubject] = useState("");
 const [question, setQuestion] = useState("");
 const [options, setOptions] = useState(["", "", "", ""]);
 const [correctAnswer, setCorrectAnswer] = useState("");
 const [explanation, setExplanation] = useState("");
 const [questions, setQuestions] = useState<{ question: string; options: string[]; correct_answer: string; explanation: string }[]>([]);

 const addCard = () => {
 if (!cardFront.trim() || !cardBack.trim()) return;
 setCards((prev) => [...prev, { front: cardFront, back: cardBack }]);
 setCardFront("");
 setCardBack("");
 };

 const addQuestion = () => {
 if (!question.trim() || !correctAnswer.trim()) return;
 setQuestions((prev) => [...prev, { question, options: options.filter(Boolean), correct_answer: correctAnswer, explanation }]);
 setQuestion("");
 setOptions(["", "", "", ""]);
 setCorrectAnswer("");
 setExplanation("");
 };

 const handleSave = () => {
 // In production: POST to Supabase via server action or API route
 setSaved(true);
 setTimeout(() => setSaved(false), 2000);
 };

 const tabs: { id: Tab; label: string }[] = [
 { id: "resources", label: "All Resources" },
 { id: "add_flashcard", label: "Add Flashcard Deck" },
 { id: "add_exam", label: "Add Practice Exam" },
 ];

 return (
 <AppShell>
 <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
 <div className="mb-8 fade-up">
 <div className="flex items-center gap-3 mb-1">
 <h1 className="text-2xl font-bold text-vanta-text">Admin Portal</h1>
 <Badge variant="red">Founder Only</Badge>
 </div>
 <p className="text-vanta-muted text-sm">Manage flashcard decks, practice exams, and study guides</p>
 </div>

 {/* Tabs */}
 <div className="flex gap-1 bg-vanta-surface border border-vanta-border rounded-lg p-1 mb-6 w-fit">
 {tabs.map((t) => (
 <button
 key={t.id}
 onClick={() => setTab(t.id)}
 className={`px-4 py-2 rounded-md text-sm font-medium transition-all
 ${tab === t.id ? "bg-sky-500/20 text-sky-200 border border-sky-400/40" : "text-vanta-muted hover:text-vanta-text"}`}
 >
 {t.label}
 </button>
 ))}
 </div>

 {/* All Resources */}
 {tab === "resources" && (
 <div className="space-y-3 stagger">
 {SAMPLE_RESOURCES.map((r) => (
 <Card key={r.id} className="p-4 fade-up">
 <div className="flex items-center justify-between">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <Badge variant={r.type === "flashcard_set" ? "blue" : "gray"}>
 {r.type === "flashcard_set" ? "Flashcard Deck" : "Practice Exam"}
 </Badge>
 <span className="text-vanta-text font-medium text-sm">{r.title}</span>
 </div>
 <p className="text-xs text-vanta-muted">{r.subject}</p>
 </div>
 <div className="flex gap-2">
 <Button variant="secondary" size="sm">Edit</Button>
 <Button variant="danger" size="sm">Delete</Button>
 </div>
 </div>
 </Card>
 ))}
 </div>
 )}

 {/* Add Flashcard Deck */}
 {tab === "add_flashcard" && (
 <div className="space-y-6 fade-up">
 <Card className="p-6">
 <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Deck Info</h2>
 <div className="space-y-4">
 <Input id="deck-title" label="Deck Title" placeholder="e.g. AP Chemistry: Periodic Table" value={deckTitle} onChange={(e) => setDeckTitle(e.target.value)} />
 <Input id="deck-subject" label="Subject" placeholder="e.g. AP Chemistry" value={deckSubject} onChange={(e) => setDeckSubject(e.target.value)} />
 </div>
 </Card>

 <Card className="p-6">
 <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Add Cards</h2>
 <div className="space-y-4 mb-4">
 <Textarea id="card-front" label="Front (Question/Term)" placeholder="What is..." value={cardFront} onChange={(e) => setCardFront(e.target.value)} rows={2} />
 <Textarea id="card-back" label="Back (Answer/Definition)" placeholder="The answer is..." value={cardBack} onChange={(e) => setCardBack(e.target.value)} rows={3} />
 <Button variant="secondary" onClick={addCard}>+ Add Card</Button>
 </div>

 {cards.length > 0 && (
 <div className="space-y-2 border-t border-vanta-border pt-4">
 <p className="text-xs text-vanta-muted font-semibold">{cards.length} card{cards.length !== 1 ? "s" : ""} added</p>
 {cards.map((c, i) => (
 <div key={i} className="bg-vanta-bg rounded-lg px-4 py-2 flex items-center justify-between">
 <span className="text-sm text-vanta-text truncate">{c.front}</span>
 <button onClick={() => setCards((prev) => prev.filter((_, j) => j !== i))} className="text-vanta-error text-xs hover:underline ml-4 shrink-0">Remove</button>
 </div>
 ))}
 </div>
 )}
 </Card>

 <Button onClick={handleSave} disabled={!deckTitle || cards.length === 0} className="w-full">
 {saved ? "OK Saved!" : "Save Flashcard Deck"}
 </Button>
 </div>
 )}

 {/* Add Practice Exam */}
 {tab === "add_exam" && (
 <div className="space-y-6 fade-up">
 <Card className="p-6">
 <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Exam Info</h2>
 <div className="space-y-4">
 <Input id="exam-title" label="Exam Title" placeholder="e.g. AP US History: Unit 3 Quiz" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
 <Input id="exam-subject" label="Subject" placeholder="e.g. AP US History" value={examSubject} onChange={(e) => setExamSubject(e.target.value)} />
 </div>
 </Card>

 <Card className="p-6">
 <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-4">Add Questions</h2>
 <div className="space-y-4 mb-4">
 <Textarea id="q-text" label="Question" placeholder="Enter the question..." value={question} onChange={(e) => setQuestion(e.target.value)} rows={2} />
 <div>
 <label className="text-sm text-vanta-muted font-medium block mb-2">Answer Choices (leave blank to skip)</label>
 {options.map((opt, i) => (
 <input
 key={i}
 type="text"
 placeholder={`Option ${String.fromCharCode(65 + i)}`}
 value={opt}
 onChange={(e) => setOptions((prev) => prev.map((o, j) => j === i ? e.target.value : o))}
 className="w-full bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/70 rounded-lg px-4 py-2 text-sm border border-vanta-border focus:border-vanta-blue focus:outline-none mb-2"
 />
 ))}
 </div>
 <Input id="correct-ans" label="Correct Answer (exact text)" placeholder="Must match one of the options above" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} />
 <Textarea id="explanation" label="Explanation (optional)" placeholder="Explain why this is the correct answer..." value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} />
 <Button variant="secondary" onClick={addQuestion}>+ Add Question</Button>
 </div>

 {questions.length > 0 && (
 <div className="space-y-2 border-t border-vanta-border pt-4">
 <p className="text-xs text-vanta-muted font-semibold">{questions.length} question{questions.length !== 1 ? "s" : ""} added</p>
 {questions.map((q, i) => (
 <div key={i} className="bg-vanta-bg rounded-lg px-4 py-2 flex items-center justify-between">
 <span className="text-sm text-vanta-text truncate">{q.question}</span>
 <button onClick={() => setQuestions((prev) => prev.filter((_, j) => j !== i))} className="text-vanta-error text-xs hover:underline ml-4 shrink-0">Remove</button>
 </div>
 ))}
 </div>
 )}
 </Card>

 <Button onClick={handleSave} disabled={!examTitle || questions.length === 0} className="w-full">
 {saved ? "OK Saved!" : "Save Practice Exam"}
 </Button>
 </div>
 )}
 </div>
 </AppShell>
 );
}
