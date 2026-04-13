# VantaLearn

> Free AI-powered AP & SAT study platform for high school students.

Built with Next.js 15, Tailwind CSS 4, Supabase, and OpenAI.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local` and fill in your keys:

```bash
# Supabase — get from https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI — get from https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key

# App
NEXTAUTH_SECRET=any_random_string_32_chars
NEXTAUTH_URL=http://localhost:3000
```

### 3. Set up the database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Paste and run the contents of `schema.sql`

### 4. Enable Google OAuth (optional)

1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Enable Google and add your OAuth credentials from [console.cloud.google.com](https://console.cloud.google.com)
3. Set the redirect URL to `https://your-project.supabase.co/auth/v1/callback`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── auth/
│   │   ├── login/page.tsx        # Login
│   │   ├── signup/page.tsx       # Signup + onboarding
│   │   └── callback/route.ts     # OAuth callback
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── progress/page.tsx     # Progress tracker
│   │   ├── settings/page.tsx     # Exam timers & settings
│   │   └── score-calculator/     # AP/SAT score calculator
│   ├── study/
│   │   ├── page.tsx              # Study library
│   │   ├── flashcards/page.tsx   # Flashcard player
│   │   ├── exam/page.tsx         # Practice exam
│   │   └── tips/page.tsx         # AI study tips
│   ├── admin/page.tsx            # Admin content portal
│   └── api/
│       ├── ai/feedback/route.ts  # OpenAI feedback endpoint
│       └── score-calculator/     # Score calculation endpoint
├── components/
│   ├── ui/index.tsx              # Button, Card, Badge, Input, etc.
│   ├── layout/AppShell.tsx       # Sidebar + mobile nav
│   └── Providers.tsx             # React Query provider
├── hooks/
│   ├── useTimer.ts               # Countdown & study timer hooks
│   └── useProgress.ts            # Flashcard & exam progress hooks
├── lib/
│   ├── supabase/                 # Client, server, middleware helpers
│   ├── ai/feedback.ts            # OpenAI integration
│   └── utils/                    # Score calculators, date utils, sample data
└── types/index.ts                # TypeScript interfaces
```

---

## Features

| Feature | Status |
|---|---|
| Google OAuth + Email/Password auth | ✅ |
| 2-step onboarding (exam selection) | ✅ |
| Dashboard with countdown timers | ✅ |
| 3D flip flashcard player | ✅ |
| Practice exams with scoring | ✅ |
| AI feedback on answers (GPT-4o-mini) | ✅ |
| AI study tips by subject | ✅ |
| AP & SAT score calculator | ✅ |
| Progress tracker | ✅ |
| Admin content portal | ✅ |
| Mobile-first responsive layout | ✅ |
| Dark mode UI | ✅ |

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard or:
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Future Roadmap

- [ ] Stripe integration for 1-on-1 AI tutoring
- [ ] Custom flashcard deck creation for students
- [ ] Spaced repetition algorithm
- [ ] Vercel Web Analytics integration
- [ ] Push notifications for exam countdowns
- [ ] Study streak tracking
