import OpenAI from "openai";
import type { ExamFigure, ExamQuestion } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface GenerateQuestionsInput {
  subject: string;
  /** Short topic focus, e.g. "derivatives" */
  topic?: string;
  /** Number of MC questions (max 12 per request for latency) */
  count: number;
  /** Encourage figures: charts, tables, graphs where appropriate */
  includeFigures: boolean;
}

interface RawAiQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  figure?: ExamFigure | null;
}

interface RawAiPayload {
  questions: RawAiQuestion[];
}

function clampCount(n: number): number {
  return Math.min(12, Math.max(1, Math.floor(n)));
}

function normalizeFigure(f: unknown): ExamFigure | undefined {
  if (!f || typeof f !== "object") return undefined;
  const fig = f as Record<string, unknown>;
  const kind = fig.kind;
  if (kind === "table" && Array.isArray(fig.headers) && Array.isArray(fig.rows)) {
    return {
      kind: "table",
      title: typeof fig.title === "string" ? fig.title : undefined,
      headers: fig.headers.map(String),
      rows: (fig.rows as unknown[]).map((r) => (Array.isArray(r) ? r.map(String) : [])),
    };
  }
  if (kind === "bar_chart" && Array.isArray(fig.bars)) {
    const bars = (fig.bars as { label?: unknown; value?: unknown }[])
      .filter((b) => b && typeof b.label === "string" && typeof b.value === "number")
      .map((b) => ({ label: String(b.label), value: Number(b.value) }));
    if (bars.length === 0) return undefined;
    return {
      kind: "bar_chart",
      title: typeof fig.title === "string" ? fig.title : undefined,
      yLabel: typeof fig.yLabel === "string" ? fig.yLabel : undefined,
      bars,
    };
  }
  if (kind === "line_chart" && Array.isArray(fig.points)) {
    const points = (fig.points as { x?: unknown; y?: unknown }[])
      .filter((p) => p && typeof p.x === "string" && typeof p.y === "number")
      .map((p) => ({ x: String(p.x), y: Number(p.y) }));
    if (points.length === 0) return undefined;
    return {
      kind: "line_chart",
      title: typeof fig.title === "string" ? fig.title : undefined,
      yLabel: typeof fig.yLabel === "string" ? fig.yLabel : undefined,
      points,
    };
  }
  return undefined;
}

function toExamQuestion(subject: string, raw: RawAiQuestion, index: number): ExamQuestion {
  const opts = raw.options.map((o) => String(o).trim()).filter(Boolean);
  const correct = String(raw.correct_answer).trim();
  if (opts.length < 4) {
    throw new Error("Invalid question: need 4 options");
  }
  if (!opts.includes(correct)) {
    throw new Error("correct_answer must match one option exactly");
  }
  const id = `ai-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`;
  const figure = normalizeFigure(raw.figure);
  return {
    id,
    subject,
    type: "multiple_choice",
    question: String(raw.question).trim(),
    options: opts.slice(0, 4),
    correct_answer: correct,
    explanation: String(raw.explanation ?? "").trim() || undefined,
    ...(figure ? { figure } : {}),
  };
}

export async function generateExamQuestions(input: GenerateQuestionsInput): Promise<ExamQuestion[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const count = clampCount(input.count);
  const topicLine = input.topic ? ` Focus on: ${input.topic}.` : "";

  const figureInstructions = input.includeFigures
    ? `For about half of the questions, include a "figure" object with realistic exam-style data:
- bar_chart: compare categories (labs, GDP, populations, concentrations, etc.)
- line_chart: trends over time (temperature, concentration, population, velocity)
- table: experimental results, survey data, or reference values
Figures must be consistent with the stem so the question is answerable ONLY using the figure + stem.`
    : `Set "figure" to null for every question (text-only stems).`;

  const system = `You write official-style AP multiple-choice questions. Output ONLY valid JSON, no markdown.

JSON schema:
{
  "questions": [
    {
      "question": "stem text",
      "options": ["A","B","C","D"],
      "correct_answer": "exactly one string that equals one of the four options",
      "explanation": "1-3 sentences why the answer is correct",
      "figure": null OR a figure object
    }
  ]
}

Figure object shapes:
- {"kind":"table","title":"optional","headers":["h1","h2"],"rows":[["a","b"],["c","d"]]}
- {"kind":"bar_chart","title":"optional","yLabel":"optional","bars":[{"label":"L1","value":12},...]}
- {"kind":"line_chart","title":"optional","yLabel":"optional","points":[{"x":"t1","y":3},...]}

Rules:
- Match the style and difficulty of the real AP exam for this subject.
- Use varied stems: NOT only word problems — include data interpretation, models, graphs, experimental design, and qualitative reasoning.
- Distractors must be plausible.
- Options must be exactly 4 strings.
- correct_answer must be character-for-character equal to one option.`;

  const user = `Subject: ${input.subject}.${topicLine}
Generate ${count} distinct multiple-choice questions.

${figureInstructions}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
    temperature: 0.85,
    max_tokens: 8000,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("Empty AI response");

  let parsed: RawAiPayload;
  try {
    parsed = JSON.parse(text) as RawAiPayload;
  } catch {
    throw new Error("Invalid JSON from model");
  }

  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error("No questions in response");
  }

  const out: ExamQuestion[] = [];
  let i = 0;
  for (const q of parsed.questions) {
    if (out.length >= count) break;
    try {
      out.push(toExamQuestion(input.subject, q as RawAiQuestion, i));
      i++;
    } catch {
      continue;
    }
  }

  if (out.length === 0) {
    throw new Error("Could not parse any valid questions");
  }

  return out;
}
