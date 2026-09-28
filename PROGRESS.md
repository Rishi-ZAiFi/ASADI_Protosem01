# Master Progress Checklist

## Milestones

- [x] **M0 — Recon & scaffold:** Workspace inspection, documentation setup (`AGENTS.md`, `STATUS.md`, `DECISIONS.md`, `PROGRESS.md`), Next.js App Router setup, TypeScript, Tailwind CSS, shadcn/ui init, Vitest & ESLint configuration, env validation & Setup-Required screen, `.env.example`, `.gitignore`, git init.
- [ ] **M1 — Design system & shell:** Theme tokens, dark mode, base UI components, landing page, app shell (sidebar & mobile tabs), skeleton/empty/error states, toasts.
- [ ] **M2 — Database, auth, onboarding, profile:** Supabase client/server setup, `supabase/migrations/` & `supabase/schema.sql` with RLS, auth pages (login, signup, reset), route protection middleware, 6-step onboarding flow, creator profile management.
- [ ] **M3 — AI layer:** Provider interface (`lib/ai/provider.ts`) + Gemini implementation, Zod schemas, prompts (`lib/prompts/`), module generators (Trend, Angle, Hooks, Format, Script, Caption), timing skeleton allocator, validators, retry logic, orchestrator, usage service, logging. Unit tests.
- [ ] **M4 — Create flow & result workspace:** `/dashboard/new` multi-step form, `/api/analyze-trend`, streaming `/api/generate-content` (NDJSON), generation workspace (`/dashboard/generation/[id]`) with Angle equation card, hooks, script timeline, shot list, caption, CTA, hashtags, copy tools.
- [ ] **M5 — Phase 2 features:** Save functionality, history workspace (`/dashboard/history` - search, filter, open, duplicate, edit, delete, regenerate), single section regeneration with modifiers, inline text editing, markdown/txt export, feedback system (thumbs up/down + reasons).
- [ ] **M6 — Dashboard, live trends, memory:** Dashboard metrics cards, Trending Now section with RSS/HN trend sources, cron ingestion, user relevance scores, Creator Content Memory v1, settings page.
- [ ] **M7 — Hardening:** DB rate limits enforcement, error code mappings, security headers, prompt-injection defense, accessibility & responsive design audit.
- [ ] **M8 — Tests, docs, CI, final verification:** Integration & E2E tests, README.md & DEPLOY.md documentation, GitHub Actions CI workflow (`.github/workflows/ci.yml`), final acceptance checklist verification, final execution report.

## Current Milestone
- **M1 — Design system & shell**

## Next Steps
- Build theme tokens, dark mode provider, global styles (`app/globals.css`).
- Build reusable UI components (Button, Card, Input, Toast via Sonner, Dialog, Skeleton, Badge, Tabs, Stepper).
- Build App Shell (Left sidebar on desktop, bottom tab bar on mobile).
- Build Landing Page (`app/page.tsx`).
