# 🌟 CreatorOS — Unified Creator AI Platform (22-in-1)

> **Branch:** `27_Unified-Creator-AI-Platform`  
> **Repository:** [ASADI_Protosem01](https://github.com/harish31052006hk-dotcom/ASADI_Protosem01)  
> **Status:** ✅ Production Ready & Fully Functional  

---

## 📖 Overview

**CreatorOS** is an all-in-one, comprehensive AI Operating System designed for digital creators, writers, marketers, and social media strategists. It unifies all **22 specialized creator tools** into a single cohesive, high-performance workspace powered by **React 19, TypeScript, Vite, Tailwind CSS**, and a **Node.js/Express AI backend engine** supporting both live LLM inference (OpenAI / Gemini) and instant offline fallback mode.

---

## ⚡ Key Features & The 22 Integrated Tools

The platform organizes all 22 AI creator modules into 4 distinct workflows:

### 1. 💡 Content Ideation & Strategy
1. **Content Idea Generator** (`01`): Generate tailored content ideas across niches and platforms with angles, hooks, and formats.
2. **Content Repurposer** (`02`): Transform 1 piece of content into 4 formats (LinkedIn, X/Twitter, Reels, Newsletters).
3. **Hook Generator** (`03`): Generate high-converting attention hooks across Curiosity, Contrarian, Story, and Data styles.
4. **Daily Content Planner** (`04`): Generate personalized daily publishing agendas and batching schedules.
5. **Brand Pitch Builder** (`17`): Formulate tailored brand collaboration proposals and rate cards.
6. **AI Creative Producer** (`22`): Formulate a 30-day overarching editorial strategy, content pillars, and iterative feedback loops.

### 2. 🎬 Production & Scriptwriting
7. **Reel Script Builder** (`05`): Build structured 30–60s video scripts with hook, body, visual cues, and CTA.
8. **Clip Finder** (`06`): Analyze long-form transcripts to locate high-impact short-form clip segments with timestamps.
9. **Thumbnail Ideator** (`07`): Produce clickable YouTube & short-form thumbnail concepts, text overlays, and composition notes.
10. **Caption Assistant** (`08`): Generate platform-optimized captions with hashtags and engagement prompts.
11. **CTA Generator** (`09`): Generate high-converting, non-repetitive calls to action based on creator goals.
12. **AI Content Director** (`18`): Generate full production dossiers: narratives, B-roll recommendations, and shot lists.
13. **AI Screenplay Workspace** (`20`): Scene-by-scene script writing with character, tone, and continuity awareness.

### 3. 📊 Audience Intelligence & Analytics
14. **Comment Analyzer** (`10`): Categorize audience feedback into sentiment, questions, pain points, and opportunities.
15. **Comment-to-Content** (`11`): Extract audience queries and transform them directly into future video or post drafts.
16. **Voice Replicator** (`13`): Analyze a creator's writing samples to capture cadence, vocabulary, and brand voice.
17. **Content Recycler** (`16`): Audit previous high-performing content to recommend fresh repost angles and updates.

### 4. 🧠 Deep Research & Autonomous Pipelines
18. **Creator Research Assistant** (`12`): Curate deep research summaries, verified data points, counter-arguments, and sources.
19. **Podcast Assistant** (`14`): Extract episode titles, timestamps, chapter summaries, key takeaways, and promotional snippets.
20. **Creator Workspace** (`15`): Manage the end-to-end Idea → Research → Draft → Publish lifecycle.
21. **Creator Second Brain** (`19`): Query past content semantic archive to identify patterns, recurring topics, and new spin-offs.
22. **Autonomous Content Pipeline** (`21`): Multi-stage autonomous pipeline executing Research → Script → 3 Reels → LinkedIn → X Thread → Calendar in one flow.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend Server:** Node.js, Express, TypeScript (`tsx`)
- **AI Engine:**
  - Gemini API (`gemini-3.5-flash-lite` / configurable)
  - Google Gemini API integration ready
  - Resilient mock response generator for offline testing or without API credentials
- **State & Storage:** Local persistent JSON storage and reactive UI state
- **Tooling & Quality:** ESLint / Oxlint, PostCSS, TypeScript compiler

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` / `pnpm`

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/harish31052006hk-dotcom/ASADI_Protosem01.git
cd ASADI_Protosem01
git checkout 27_Unified-Creator-AI-Platform
npm install
```

### 2. Configure Environment Variables (Optional)
Copy the example environment file:
```bash
cp .env.example .env
```
Inside `.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
```
*(Note: If no API key is provided, CreatorOS automatically falls back to high-fidelity structured generation so all 22 tools remain 100% interactive and testable).*

### 3. Run the Development Server
Run both the frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

### 4. Build for Production
To verify and compile TypeScript & Vite bundles:
```bash
npm run build
```

---

## 🔒 Security & Best Practices
- **No Leaked Secrets:** `.env` is omitted and strictly covered under `.gitignore`.
- **Safe Key Handling:** API keys remain strictly server-side and are never exposed to the client bundle.
- **Type Safety:** 100% TypeScript typed across client, server, and shared interfaces.

---

## 👥 Author
- **Harish** ([@harish31052006hk-dotcom](https://github.com/harish31052006hk-dotcom))
