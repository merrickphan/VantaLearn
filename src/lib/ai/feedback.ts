import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FeedbackOptions {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  subject: string;
}

export async function generateFeedback(
  options: FeedbackOptions
): Promise<string> {
  const { question, userAnswer, correctAnswer, subject } = options;

  const prompt = `You are a helpful tutor for ${subject}. A student answered a practice question.

Question: ${question}

Student's Answer: ${userAnswer}

Correct Answer: ${correctAnswer}

Please provide:
1. Whether the answer is correct or incorrect
2. A clear explanation of the correct answer
3. One actionable tip to help the student remember this concept
4. Encouragement to keep studying

Keep your response concise and student-friendly. Use clear, simple language suitable for high school students.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content ?? "Unable to generate feedback at this time.";
}

export interface StudyTipOptions {
  subject: string;
  topic?: string;
}

export async function generateStudyTip(
  options: StudyTipOptions
): Promise<string> {
  const { subject, topic } = options;

  const prompt = `Give a high school student one highly specific, actionable study tip for ${subject}${topic ? ` focused on "${topic}"` : ""}. 
  
  Format it as:
  - A clear tip title (bold)
  - 2-3 sentences explaining how to apply it
  - A quick example if helpful
  
  Be encouraging and practical. Avoid generic advice.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 250,
    temperature: 0.8,
  });

  return response.choices[0]?.message?.content ?? "Keep practicing consistently — every session builds your confidence!";
}
