-- VantaLearn Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- Note: Supabase Auth handles the auth.users table automatically.
-- We create a public.users profile table linked to auth.users.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  auth_provider VARCHAR DEFAULT 'email',
  stripe_customer_id VARCHAR, -- for future Stripe integration
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'provider', 'email')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- STUDY RESOURCES TABLE
-- Stores flashcard sets, practice exams, and study guides
-- ============================================================
CREATE TABLE IF NOT EXISTS public.study_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  subject VARCHAR NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('flashcard_set', 'practice_exam', 'study_guide')),
  content_data JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES public.users(id),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FLASHCARDS TABLE
-- Individual cards linked to a flashcard_set resource
-- ============================================================
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID NOT NULL REFERENCES public.study_resources(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- ============================================================
-- USER PROGRESS TABLE
-- Tracks completion and scores for each study resource per user
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.study_resources(id) ON DELETE CASCADE,
  score DECIMAL(5,2), -- percentage 0.00 - 100.00
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  session_data JSONB DEFAULT '{}', -- stores per-card or per-question results
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast dashboard queries
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_resource_id ON public.user_progress(resource_id);

-- ============================================================
-- EXAM TIMERS TABLE
-- Stores countdown timer data per user per exam
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exam_timers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exam_name VARCHAR NOT NULL,
  target_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_timers_user_id ON public.exam_timers(user_id);

-- ============================================================
-- AI FEEDBACK TABLE
-- Stores history of AI interactions for each user
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.study_resources(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  feedback_type VARCHAR DEFAULT 'exam_feedback' CHECK (feedback_type IN ('exam_feedback', 'study_tip')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_feedback_user_id ON public.ai_feedback(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Ensure users can only access their own data
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_timers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- User progress: users only see their own
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Exam timers: users only see their own
CREATE POLICY "Users can manage own timers" ON public.exam_timers FOR ALL USING (auth.uid() = user_id);

-- AI feedback: users only see their own
CREATE POLICY "Users can manage own ai_feedback" ON public.ai_feedback FOR ALL USING (auth.uid() = user_id);

-- Study resources: all authenticated users can read published resources
CREATE POLICY "Authenticated users can view published resources" ON public.study_resources
  FOR SELECT USING (auth.role() = 'authenticated' AND is_published = TRUE);

-- Flashcards: all authenticated users can read
CREATE POLICY "Authenticated users can view flashcards" ON public.flashcards
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_study_resources_updated_at
  BEFORE UPDATE ON public.study_resources
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
