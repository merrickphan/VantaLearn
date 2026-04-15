# VantaLearn

## Project Description
A webapp designed to allow highschoolers/students study through study tips, practice AP® exams, etc. This webapp is called VantaLearn.

## Product Requirements Document
# Product Requirements Document: VantaLearn

## 1. Executive Summary
VantaLearn is a web-based educational platform designed to empower high school students by providing a comprehensive, free, and intuitive study environment. By combining AI-driven feedback, structured exam preparation tools, and progress tracking, VantaLearn aims to bridge the gap in accessible, high-quality study resources.

## 2. Goals & Objectives
- Provide a centralized, free platform for AP® preparation.
- Enable students to feel confident through structured, followable study modules.
- Achieve a launch-ready MVP within a 30-day timeline.
- Maintain a minimalistic, high-performance UI suitable for intensive study sessions.

## 3. User Persona
- Primary: High school students (grades 9-12) preparing for college-credit coursework (AP® exams).
- Needs: Efficient time management, immediate feedback on practice questions, and clear progress visualization.

## 4. Functional Requirements

### 4.1 Authentication
- Users must be able to create accounts and log in.
- Implement "Sign in with Google" for streamlined onboarding.
- Basic user session management to track individual progress and saved flashcards.

### 4.2 Study Tools
- Flashcards: Interactive card interface with flip functionality.
- Exam Practice: Practice question sets covering major AP® subjects.
- AI Feedback: Integration of an AI LLM (via API) to provide explanations and constructive critique for user answers.
- Score Calculators: Built-in tools for users to input raw scores and estimate their AP® results.

### 4.3 Progress & Time Tracking
- Countdown Timer: Dashboard-level widget displaying days/hours remaining until specific AP® exam dates.
- Progress Tracker: Visual dashboard indicating completion rates for study sets and improvements over time.

### 4.4 Content Management
- Administrator (Founder) portal to upload and manage practice questions, flashcard sets, and study guides.

## 5. UI/UX Design Vision
- Aesthetic: Dark-mode centric (inspired by Discord).
- Color Palette: Deep charcoal/black backgrounds with electric blue accents for primary buttons and interactive elements.
- Layout: Minimalistic, distraction-free interface.
- Responsiveness: Mobile-first design approach; layout must adapt seamlessly from mobile devices to desktop browsers.

## 6. Technical Requirements & Constraints
- Budget: Total development and infrastructure costs capped at $200 for the initial launch.
- Architecture: Web-application with mobile-first responsiveness.
- Future-Proofing: Architecture must allow for the future integration of a payment gateway (e.g., Stripe) for premium features like 1-on-1 AI tutoring.
- Privacy: Data storage limited to user authentication and progress tracking; no community-interactive features to minimize privacy overhead.

## 7. Roadmap & Timeline
- Week 1: Core architecture setup, Authentication integration, and initial UI/UX styling.
- Week 2: Development of Flashcard and Practice Question engine.
- Week 3: AI Feedback integration and Progress Tracking logic.
- Week 4: Final QA, content population, and deployment.

## 8. Success Metrics
- User acquisition: Number of registered students.
- Retention: Frequency of return logins for study sessions.
- Engagement: Number of practice sets completed per user.
- Feedback: Qualitative sentiment from student testers regarding confidence improvement.

## Technology Stack
# VantaLearn Technology Stack Documentation

## 1. Overview
VantaLearn is a high-performance, mobile-first web application designed to help students master AP® coursework. Given the one-month launch timeline and budget constraints, the stack focuses on rapid development, cost-efficiency, and a seamless user experience.

## 2. Frontend
- Framework: Next.js (React) - Chosen for its excellent SEO, performance, and built-in routing. It facilitates the mobile-first approach and ensures fast page loads for students.
- Styling: Tailwind CSS - Enables rapid development of the requested dark, minimalistic, Discord-like aesthetic. Its utility-first nature makes it easy to maintain the "blue" accent theme consistently.
- State Management: TanStack Query (React Query) - Essential for handling server state, caching study progress, and managing API feedback responses without unnecessary re-renders.

## 3. Backend & API
- Framework: Next.js API Routes (Serverless Functions) - Allows us to keep the backend and frontend in a single repository, significantly reducing deployment complexity and operational costs.
- AI Integration: OpenAI API (gpt-4o-mini) - Used for generating AI feedback on study questions. The "mini" model is highly cost-effective and fast, fitting within the project budget.

## 4. Database & Auth
- Database: Supabase (PostgreSQL) - Provides a managed database solution with a generous free tier. It handles user progress tracking, flashcard data, and exam results with ease.
- Authentication: Supabase Auth - Native integration with Google OAuth. It satisfies the user login requirement while ensuring security without the need for building a custom auth flow.

## 5. Deployment & Infrastructure
- Hosting: Vercel - The native platform for Next.js. It offers a robust free tier that can handle initial traffic, zero-config CI/CD, and automatic global scaling.
- Analytics: Vercel Web Analytics - Provides insight into how students navigate the app without compromising user privacy or adding complex tracking scripts.

## 6. Development Tools
- Version Control: GitHub - Used for repository management and tracking the one-month development roadmap.
- Content Management: Local JSON/Markdown - Since all content is authored by the project owner, static data files stored in the repository ensure zero latency and zero CMS costs.

## 7. Future-Proofing
- Payments: Stripe - The industry standard for payment processing. The architecture (Next.js/Supabase) is designed to integrate Stripe webhooks seamlessly when 1-on-1 AI tutoring features are implemented.

## 8. Rationale for Budget & Timeline
- Cost Efficiency: By utilizing the generous free tiers of Vercel and Supabase, the operational costs for the launch phase remain near $0. The only variable cost is the usage-based OpenAI API, which is highly controllable.
- Development Velocity: This "All-in-One" JavaScript/TypeScript stack allows for shared types between the frontend and backend, reducing bugs and accelerating the development of core features like progress tracking and exam timers.

## Project Structure
PROJECT STRUCTURE: VantaLearn

This document outlines the directory structure and organization for the VantaLearn web application. The architecture follows a standard Next.js (React) structure optimized for modularity, mobile-first responsiveness, and scalability.

/vanta-learn-root
├── /public              # Static assets (images, favicons, fonts)
├── /src                 # Main source code directory
│   ├── /app             # Next.js App Router (pages and layouts)
│   │   ├── /(auth)      # Protected authentication routes (login/signup)
│   │   ├── /dashboard   # Main user dashboard routes
│   │   ├── /study       # Flashcards and exam practice modules
│   │   ├── /api         # Server-side API endpoints (AI, Auth callbacks)
│   │   └── layout.tsx   # Global dark-themed layout wrapper
│   ├── /components      # Reusable UI components (minimalist design)
│   │   ├── /ui          # Atoms (buttons, inputs, cards)
│   │   ├── /features    # Domain-specific (FlashcardPlayer, Timer, ScoreCalculator)
│   │   └── /layout      # Navigation bar, Sidebar, Footer
│   ├── /lib             # Utility libraries and configuration
│   │   ├── /firebase    # Firebase/Supabase initialization and Auth logic
│   │   ├── /ai          # OpenAI/AI-SDK integration logic for feedback
│   │   └── /utils       # Helper functions (time tracking, date calculations)
│   ├── /hooks           # Custom React hooks (useTimer, useProgress)
│   ├── /store           # State management (Zustand or Context API)
│   └── /types           # TypeScript interfaces (User, Exam, Flashcard)
├── /styles              # Global CSS, Tailwind CSS configuration
├── .env.local           # Environment variables (API keys, Auth secrets)
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind configuration (customizing Discord-like dark mode)
└── package.json         # Project dependencies and scripts

DIRECTORY EXPLANATIONS:

/app: Utilizes Next.js App Router. The (auth) folder groups authentication pages, while the dashboard acts as the central hub for progress tracking.
/components/features: Houses the logic for core requirements. 'ScoreCalculator' and 'Timer' are modular components that can be reused across different study paths (AP®).
/lib/ai: Contains the bridge between student input and AI feedback engines. This is abstracted to allow for future integration of advanced 1-on-1 tutoring features.
/styles: Tailwind CSS is the primary styling engine. Configuration will define the 'Vanta Blue' accent palette against a deep dark-mode background consistent with the requested aesthetic.
/public: Contains the assets required for brand identity, optimized for fast loading and mobile-first performance.

ORGANIZATIONAL GUIDELINES:
- Mobile-First: All components in /components are built with mobile-first breakpoints (using Tailwind 'sm:' prefix).
- Authentication: All user data is secured within the Firebase/Supabase instance, separating logic into /lib/firebase to keep component files clean.
- Scalability: The structure separates 'domain logic' (study features) from 'presentation logic' (UI components) to ensure that adding a new exam subject requires minimal code changes."

## Database Schema Design
### VantaLearn Database Schema Design

#### 1. Overview
The VantaLearn database is designed for a relational structure (PostgreSQL recommended) to handle user progress, study materials, and AI-driven feedback loops. The architecture follows a normalized approach to ensure data integrity while supporting high-frequency updates for progress tracking.

#### 2. Entity Relationship Model

**Users**
- id: UUID (PK)
- email: VARCHAR (Unique, Indexed)
- password_hash: TEXT
- auth_provider: VARCHAR (e.g., 'google', 'email')
- created_at: TIMESTAMP

**StudyResources**
- id: UUID (PK)
- title: VARCHAR
- subject: VARCHAR (e.g., 'AP Calculus AB')
- type: VARCHAR (e.g., 'flashcard_set', 'practice_exam')
- content_data: JSONB (Stores structured questions/answers for flexibility)
- created_at: TIMESTAMP

**Flashcards**
- id: UUID (PK)
- deck_id: UUID (FK -> StudyResources)
- front: TEXT
- back: TEXT

**UserProgress**
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- resource_id: UUID (FK -> StudyResources)
- score: DECIMAL
- completed_at: TIMESTAMP
- time_spent_seconds: INTEGER

**ExamTimers**
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- exam_name: VARCHAR
- target_date: DATE

**AIFeedback**
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- resource_id: UUID (FK -> StudyResources)
- prompt: TEXT
- response: TEXT
- created_at: TIMESTAMP

#### 3. Data Relationships
- One-to-Many: Users -> UserProgress (Tracks history per user).
- One-to-Many: StudyResources -> Flashcards (Allows grouping of cards into decks).
- One-to-Many: Users -> AIFeedback (Stores history of AI interactions for tutoring).
- One-to-One: Users -> ExamTimers (Tracks specific exam countdowns per student profile).

#### 4. Implementation Notes
- JSONB usage: The 'content_data' field in the StudyResources table will allow for heterogeneous question types (multiple choice, open-ended) without requiring constant schema migrations as content evolves.
- Indexing: Indexes should be placed on 'user_id' in the UserProgress and AIFeedback tables to ensure fast dashboard load times.
- Privacy/Security: Given the requirement for minimal user data, PII (Personally Identifiable Information) is restricted to the Users table. Auth tokens and session state should be handled via the authentication provider (e.g., NextAuth.js or Clerk) to keep sensitive credentials outside the primary database.
- Future Scaling: The schema is designed to allow adding a 'Subscriptions' or 'Payments' table linked to 'Users' via a 'stripe_customer_id' field to facilitate the future transition to 1-on-1 AI tutoring features."

## User Flow
USERFLOW DOCUMENT: VANTALEARN

1. OVERVIEW
The VantaLearn user journey is designed for high school students seeking a frictionless, focused study environment. The architecture follows a mobile-first, minimalistic pattern, prioritizing quick access to practice materials and progress metrics. The interface utilizes a deep-charcoal theme with vibrant blue accents to reduce eye strain during extended study sessions.

2. ONBOARDING & AUTHENTICATION
- Entry Point: Landing page featuring a 'Get Started' CTA.
- Sign-Up/Login: Modal overlay supporting 'Sign in with Google' and Email/Password authentication.
- Initial Setup: A brief 2-step onboarding flow where the user selects their upcoming AP® exams and sets target dates. This data populates the 'Time-to-Exam' countdown widget on the user dashboard.

3. CORE USER JOURNEYS

3.1. Dashboard (The Command Center)
- Layout: Mobile-first vertical stack. Top section displays 'Days Remaining' countdowns for tracked exams. Middle section shows 'Continue Studying' cards for active subjects.
- Interaction: Quick-access buttons for 'Practice Exam', 'Flashcards', and 'Study Tips'.

3.2. Practice Exam Flow
- Selection: User selects subject/exam type.
- Execution: System presents questions sequentially. 
- Interaction Pattern: Minimalistic card-based layout. User selects answer -> Real-time AI validation -> Immediate feedback/explanation provided below the selection -> 'Next' button triggers smooth transition to subsequent question.
- Completion: Post-exam report page displaying raw score and a calculated score based on standard AP® practice curves.

3.3. Flashcard Flow
- Selection: User selects a flashcard deck (created by admin).
- Interaction: 3D flip card animation. Tap to flip; swipe left for 'Needs Review', swipe right for 'Got It'.
- Progress Tracking: Session summary shows retention rate and cards mastered.

3.4. AI Feedback Loop
- Trigger: Available after practice questions or writing prompts.
- Interaction: User submits a response -> System displays a 'Processing' animation (blue pulse) -> AI provides actionable tips for improvement.

4. WIREFRAME DESCRIPTION & DESIGN SYSTEM
- Theme: Dark-mode by default. Background: #121212; Accent Blue: #2F80ED.
- Typography: Sans-serif, clean, and legible (e.g., Inter or Geist).
- Navigation: Bottom sticky navigation bar (Mobile) or Sidebar (Desktop) containing: [Dashboard, Library, Progress, Settings].

5. INTERACTION PATTERNS
- Micro-interactions: Subtle blue highlights when hovering over buttons or selecting options.
- Progress Bars: Dynamic, animated blue bars tracking study session completion.
- Responsiveness: Fluid grid system ensuring content cards stack vertically on mobile and expand on tablet/desktop.

6. DATA & PRIVACY FLOW
- User Data: Minimal data storage focusing on authentication tokens and user-specific study progress (scores, flashcard mastery).
- Local Storage: Used for session-based progress to ensure low latency and offline-friendly interactions.

7. FUTURE EXPANSION PATHS
- Payment Integration: 'Upgrade' button in Settings to unlock 1-on-1 AI Tutoring, triggering a secure checkout flow (Stripe/similar).
- Custom Content: 'Create Deck' interface for power users (post-launch).

## Styling Guidelines
# VantaLearn Styling Guidelines

## 1. Design Philosophy
VantaLearn is built on the pillars of minimalism, focus, and academic confidence. The UI is designed to reduce cognitive load, allowing students to prioritize study materials over interface clutter. By utilizing a \"Dark-First\" aesthetic, we minimize eye strain during long study sessions, drawing inspiration from the professional utility of Discord and the intuitive navigation of Knowt.

## 2. Color Palette
The color scheme centers on a high-contrast dark theme. The objective is to provide depth while keeping the content legible.
- Primary Background (Deep Dark): #121212
- Surface/Card Background: #1E1E24
- Accent Blue (Brand Color): #4A90E2
- Text Primary (White): #E0E0E0
- Text Secondary (Gray): #A0A0A0
- Success Green (For Progress/Correct Answers): #4CAF50
- Alert Red (For Error/Wrong Answers): #FF5252
- UI Border/Separator: #2D2D36

## 3. Typography
Typography must be clean, readable, and professional. We utilize sans-serif fonts to ensure clarity on mobile devices.
- Primary Font: Inter (preferred) or System UI Font.
- Heading 1 (Large Titles): 2.5rem, Bold, Line-height: 1.2.
- Heading 2 (Section Titles): 1.75rem, Semi-Bold, Line-height: 1.3.
- Body Text: 1rem, Regular, Line-height: 1.5.
- Small/Meta Text (Timers/Stats): 0.85rem, Medium, Line-height: 1.4.

## 4. UI/UX Principles
- Mobile-First Responsiveness: All layout decisions must prioritize the mobile viewport. Use a grid-based approach where cards stack vertically on smaller screens and expand into columns on desktop.
- Minimalist Hierarchy: Utilize whitespace to separate study cards and progress trackers. Avoid excessive icons or animations that distract from the learning content.
- Interaction Feedback: Provide immediate visual feedback for AI-generated responses, correct/incorrect flashcard answers, and progress bar updates. Use subtle transitions (ease-in-out) for a premium feel.
- Focus State: Ensure all interactive elements (buttons, inputs) have a visible \"focus\" state using the #4A90E2 accent color to assist accessibility.

## 5. Component Styling Rules
- Flashcards: Use a container with a subtle shadow (box-shadow: 0 4px 6px rgba(0,0,0,0.3)) and rounded corners (border-radius: 12px).
- Buttons: Primary buttons should be solid #4A90E2 with white text. Secondary buttons should have a transparent background with a #2D2D36 border.
- Progress Bars: Progress tracks should be styled with a #2D2D36 background track and a #4A90E2 fill. Use rounded ends for a modern look.
- Input Fields: Backgrounds should be #2D2D36, with borderless entry until focus, when a 1px #4A90E2 border appears.

## 6. Accessibility
- Color Contrast: Ensure all text against background colors meets a minimum 4.5:1 ratio (WCAG AA compliant).
- Scalable Text: Ensure text sizing is defined in REM units to respect user browser settings for font enlargement.
- Navigation: Ensure the webapp is fully navigable via keyboard, specifically for fast-paced study modes like flashcards."
