# CreatorSpace AI — AI Content Creation & Productivity Platform

**CreatorSpace AI** is a full-stack content creation workspace designed for creators, solopreneurs, and marketers. It bridges the gap between raw ideas and ready-to-publish social media assets—providing format-engineered generation for **Instagram Reels**, **Carousels**, **Captions**, and **Stories** powered by the **Google Gemini API** (`gemini-3.5-flash-lite` with smart automatic failover).

---

## 🌟 3-Agent Autonomous Creator Architecture

CreatorSpace AI is powered by a coordinated 3-agent intelligence pipeline engineered with Google Gemini 3.5:

```
┌────────────────────────┐      ┌─────────────────────────┐      ┌────────────────────────┐
│  AGENT 1: TREND SCOUT  │ ───► │ AGENT 2: SCRIPT BUILDER │ ───► │ AGENT 3: CONTENT CRITIC│
│  Live Market Signals & │      │ Platform-Adapted Copy   │      │ Retention, Hook & CTA  │
│  Viral Velocity Angles │      │ (Reels/Carousels/Story) │      │ Scoring & Optimization │
└────────────────────────┘      └─────────────────────────┘      └────────────────────────┘
```

1. **Agent 1: Trend Scout Agent (`/api/gemini/trends/scout`)**:
   * Scouts high-velocity narrative angles, breakout hooks, and algorithmic shifts tailored to any creator niche or platform.
   * Calculates viral velocity scores (0-100), recommends ideal formats, tags, and suggested creative angles.
   * 1-Click transfer from Trend Radar into the AI Studio.

2. **Agent 2: Script Builder Agent (`/api/gemini/generate`)**:
   * Crafts platform-adapted copy engineered for conversions and attention:
     * **Instagram Reel**: Viral hook (0-3s), scene-by-scene b-roll, pacing directions, on-screen text, caption, and strategic hashtags.
     * **Multi-Slide Carousel**: Catchy cover title, slide-by-slide value breakdowns, layout cues, final CTA slide, caption, and hashtags.
     * **Social Caption**: High-retention openers, structured narrative body, call-to-action, and targeted hashtags.
     * **Story Sequence**: 3-5 frame visual flow with poll/sticker engagement prompts and creator pro-tips.
   * Tone adaptation (Educational, Conversational, Professional, Creative, Humorous, Friendly).
   * Target audience customization (Beginners, Students, Entrepreneurs, Tech Enthusiasts, etc.).

3. **Agent 3: Content Critic & Evaluator Agent (`/api/gemini/evaluate`)**:
   * Evaluates generated scripts against retention benchmarks before publishing.
   * Multi-dimensional scoring (1-10) for:
     * **Hook Strength** (0-3s attention grab)
     * **Retention & Pacing** (flow, drop-off mitigation)
     * **CTA Power** (conversion trigger, comment/save prompt)
     * **Clarity & Value** (actionability, cognitive load)
   * Overall Quality Score (0-100) & Letter Grade (A+, A, B, etc.).
   * Bulleted Strengths and Actionable Improvements.
   * **AI-Engineered Optimized Hook**: 1-click **"Apply Hook to Script"** button dynamically injects the improved opener into your working draft!

---

## 🚀 Key Modules & Capabilities

* **AI Studio (Multi-Agent Workspace)**:
  * 3-Agent Creator Pipeline status bar showing active stage.
  * Interactive script generation with quick topic pills (`+ 5 habits of top creators`, etc.).
  * Embedded **Content Critic Scorecard** with metric progress bars, actionable critique, and hook applicator.
  * 1-Click Copy and Save to Library.

* **Trend Radar**:
  * Dedicated **Agent 1 AI Trend Scout Panel** with live niche querying and platform filters.
  * Curated industry trend database categorized by Technology & AI, Creator Economy, Productivity, Marketing, and Lifestyle.
  * Search, category filtering, and bookmarking.
  * **"Create Content From Trend" Action**: Automatically pre-populates AI Studio with the selected trend title and angle for seamless workflow acceleration.

* **Dashboard**:
  * Real-time metrics computed directly from application data (Total Saved Content, Bookmarked Trends, Recent Activities).
  * Format-specific quick action launchers (Generate a Reel, Create a Carousel, Write a Caption, Create a Story).
  * Recent activity feed with quick View, Copy, and Delete actions.

* **Saved Content Library**:
  * Comprehensive draft management with format filter tabs and search.
  * Full content modal viewer.
  * Safe deletion workflow with confirmation modal.
  * Persisted across browser sessions using local storage.

* **Google Gemini AI Engine**:
  * Ultra-fast cloud generation using Google's multimodal Gemini Flash models (`gemini-3.5-flash-lite`).
  * Smart multi-model failover for high availability during peak demand periods.
  * Secure backend key management with zero frontend credential exposure.

* **Workspace Settings**:
  * Live status check for Google Gemini API.
  * Secure backend environment setup instructions for Google Gemini API keys.
  * Default writing tone and audience preferences persisted in local storage.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18, Vite 6 |
| **Routing** | React Router v6 |
| **Icons & UI** | Lucide React |
| **Styling** | Custom Responsive Design System (CSS3 Custom Properties) |
| **Backend Framework** | Node.js (v20+), Express.js |
| **AI Provider** | Google Gemini API (`gemini-3.5-flash-lite`, `gemini-flash-latest`) |
| **Storage Layer** | Modular Web Storage API (localStorage) |

---

## 📁 Project Directory Structure

```
creatorspace-ai/
├── README.md                      # Complete project documentation
├── .gitignore                     # Git ignore rules
│
├── server/                        # Express.js REST API Backend (Port 5000)
│   ├── package.json               # Backend dependencies
│   ├── .env.example               # Environment variables template
│   ├── .env                       # Local environment configuration
│   ├── server.js                  # Main server entry & CORS middleware
│   ├── config/
│   │   └── config.js              # Centralized environment configuration
│   ├── routes/
│   │   ├── health.js              # GET /api/health
│   │   └── gemini.js              # POST /api/gemini/generate
│   ├── controllers/
│   │   └── geminiController.js    # Request validation & Gemini handler
│   └── services/
│       ├── promptService.js       # Reusable format-specific prompt engineering
│       └── geminiService.js       # Google Gemini integration & smart model failover
│
└── client/                        # React + Vite Frontend (Port 5173)
    ├── package.json               # React 18, React Router v6, Lucide React
    ├── vite.config.js             # Vite config & API reverse proxy (/api -> :5000)
    ├── index.html                 # HTML template with Google Fonts
    └── src/
        ├── main.jsx               # React entry point with BrowserRouter
        ├── App.jsx                # Layout shell, routes, toast & state persistence
        ├── index.css              # CreatorSpace AI design system
        ├── components/
        │   ├── Sidebar.jsx        # Navigation sidebar with responsive mobile drawer
        │   ├── Header.jsx         # Top navigation bar with active model pill
        │   ├── FormatBadge.jsx    # Visual badges for Reels, Carousels, Stories, Captions
        │   ├── Toast.jsx          # Notification toast system (copy, save, errors)
        │   └── DeleteConfirmModal.jsx # Deletion confirmation dialog
        ├── pages/
        │   ├── Dashboard.jsx      # Workspace overview & quick actions
        │   ├── AiStudio.jsx       # Multi-format AI generator
        │   ├── TrendRadar.jsx     # Trend exploration & bookmarking
        │   ├── SavedContent.jsx   # Drafts library with search & filter
        │   └── Settings.jsx       # Gemini status & content preferences
        ├── services/
        │   ├── api.js             # REST API client
        │   └── storage.js         # LocalStorage persistence service
        └── data/
            └── sampleTrends.js    # Curated sample trend dataset
```

---

## 🚀 Installation & Getting Started

### Prerequisites

* **Node.js**: v18.x or v20.x installed (`node -v`)
* **npm**: v9.x or v10+ (`npm -v`)
* **Google Gemini API Key**: [Get key from Google AI Studio](https://aistudio.google.com/)

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# LangSmith Tracing
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key
LANGCHAIN_PROJECT=creator-os
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com

# Server Configuration
PORT=3002
APP_URL=http://localhost:3002
```

### 3. Installation & Local Development
```bash
# 1. Install all monorepo dependencies
pnpm install

# 2. Run the Next.js Unified Dashboard
pnpm dev --filter web

# 3. (Optional) Run the Fastify LangGraph Agent Service
pnpm dev --filter agent
```

Open **[http://localhost:3002](http://localhost:3002)** in your browser.

---

## 🧪 Testing & Verification

Run the test suite across all monorepo packages:
```bash
# Run unit tests across packages
pnpm test

# Run typechecks across TypeScript packages
pnpm typecheck
```

### Live Test Results:
* **UI Routes:** All routes (`/`, `/ideas`, `/hooks`, `/reels`, `/thumbnails`, `/brain`) returning `200 OK`.
* **API Endpoints:** Live generation verified with Gemini 2.5 Flash.
* **LangSmith Traces:** Verified multi-agent trace tree active in project `creator-os`.
