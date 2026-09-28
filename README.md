# TREND-TO-CONTENT ENGINE 🚀

> **"Turn trends into content that actually fits YOU."**

A SaaS-style creator strategy web application built with Next.js App Router, Supabase, Tailwind CSS, and Google Gemini AI. The Trend-to-Content Engine transforms raw viral trends into personalized, high-converting content packages tailored specifically to a creator's niche, tone, audience pain points, target platform, and experience level.

---

## 🏗️ Architecture & Pipeline

```text
TREND + CREATOR IDENTITY + AUDIENCE PAIN POINT + PLATFORM + CONTENT GOAL + CREATOR HISTORY
                         ↓
              PERSONALIZED CONTENT STRATEGY
                         ↓
   Angle → Hooks (7 framework categories) → Format (parallel) → Script → Shot list → Caption → CTA → Hashtags
```

### The Angle Equation (Core Differentiator)
Unlike generic AI tools (`Trend → LLM → Generic Script`), the **Angle Engine** combines:
- **Trend Topic & Source Snippets**
- **Creator Niche & Sub-niche**
- **Target Audience Pain Point**
- **Target Platform Norms**
- **Content Goal Directives**

Output: A creator-positioned statement explaining **why this trend fits YOU**.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript (strict mode)
- **Styling & UI:** Tailwind CSS, Lucide Icons, shadcn/ui components, `next-themes` (Dark/Light)
- **Database & Auth:** Supabase (Postgres, Row Level Security, Auth with `@supabase/ssr`)
- **AI Integration:** Google Gemini via `@google/genai` SDK
- **Validation:** Zod schemas for all runtime inputs & structured JSON responses
- **Testing:** Vitest & React Testing Library (unit/integration), Playwright (e2e)

---

## 📂 Project Structure

```text
/app
  page.tsx                       # Marketing landing page
  (auth)/login signup forgot-password reset-password
  auth/callback/route.ts
  onboarding/page.tsx
  dashboard/
    layout.tsx                   # App shell
    page.tsx                     # Main dashboard & live trend cards
    new/page.tsx                 # 3-step Create Content stepper
    generation/[id]/page.tsx     # Result workspace & section editor
    history/page.tsx            # Content strategy history
    profile/page.tsx            # Creator profile editor
    settings/page.tsx           # Settings & Creator Content Memory
  api/
    analyze-trend generate-content generations feedback profile trends health
/components
  ui/                            # Reusable UI components (Button, Card, Stepper, etc.)
  dashboard/                     # App shell, Sidebar, MobileBottomNav, Header
/lib
  ai/                            # Provider interface, Gemini provider, modules, orchestrator
  domain/                        # Platform, goal, timing skeleton & shot-list logic
  db/                            # Supabase client, server, admin & repositories
  prompts/                       # Isolated AI prompts (Angle, Hooks, Script, Caption)
  validation/                    # Zod schemas
/supabase                        # Database SQL schema & migrations
/tests                           # Unit, integration & e2e tests
```

---

## ⚙️ Environment Variables

Create `.env.local` by copying `.env.example`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key
AI_MODEL=gemini-1.5-flash        # Stable Flash-class model
AI_TIMEOUT_MS=45000

# Quota & Limits
DAILY_GENERATION_LIMIT=15
DAILY_REGEN_LIMIT=60

# Trends & Cron
TREND_REGION=IN
CRON_SECRET=your-cron-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

*Note: The project builds cleanly with zero env vars set. Missing keys render a friendly `/components/ui/SetupRequired.tsx` screen at runtime.*

---

## 🚀 Local Setup & Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Database:**
   Paste the contents of `supabase/schema.sql` into your Supabase project's SQL Editor and run it.

3. **Run Dev Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run Quality Gates:**
   ```bash
   npm run typecheck
   npm run lint
   npm run test
   npm run build
   ```

---

## 🤖 AI Model Configuration & Upgrades

- **Default Model:** `gemini-1.5-flash` or `gemini-2.0-flash` (Stable Flash-class models recommended by Google AI Studio).
- **Upgrading:** You can upgrade to a stronger model (e.g. `gemini-1.5-pro`) by changing `AI_MODEL=gemini-1.5-pro` in `.env.local` without code changes.

---

## ⚠️ Known Limitations & Roadmap

- **Rate Limits:** Google Gemini free tier has strict per-minute quota limits.
- **Trend Discovery:** Ingests live RSS feeds (Google Trends RSS) and public APIs (Hacker News Algolia). If feeds are unreachable, manual input is supported.
- **Future Roadmap:** Social media posting integration, competitor channel tracking, and multi-user agency workspaces.
