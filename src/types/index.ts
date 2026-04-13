// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  auth_provider: "google" | "email";
  created_at: string;
}

// Study Resource types
export type ResourceType = "flashcard_set" | "practice_exam" | "study_guide";

export interface StudyResource {
  id: string;
  title: string;
  subject: string;
  type: ResourceType;
  content_data: FlashcardContent | ExamContent;
  created_at: string;
}

// Flashcard types
export interface FlashcardContent {
  cards: FlashcardItem[];
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
}

export type FlashcardStatus = "unseen" | "needs_review" | "got_it";

export interface FlashcardSession {
  cardId: string;
  status: FlashcardStatus;
}

// Exam types
export type QuestionType = "multiple_choice" | "free_response";

export interface ExamContent {
  questions: ExamQuestion[];
  time_limit_minutes?: number;
}

export interface ExamQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  subject: string;
}

export interface ExamAttempt {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  aiFeedback?: string;
}

// Progress types
export interface UserProgress {
  id: string;
  user_id: string;
  resource_id: string;
  score?: number;
  completed_at?: string;
  time_spent_seconds: number;
}

// Exam Timer types
export interface ExamTimer {
  id: string;
  user_id: string;
  exam_name: string;
  target_date: string;
}

// AI Feedback types
export interface AIFeedback {
  id: string;
  user_id: string;
  resource_id: string;
  prompt: string;
  response: string;
  created_at: string;
}

// Score Calculator types
export interface ScoreResult {
  rawScore: number;
  scaledScore: number;
  percentage: number;
  estimatedGrade?: string;
}

// Onboarding types
export interface OnboardingData {
  selectedExams: string[];
  examDates: Record<string, string>;
}
