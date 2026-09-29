# CreatorSpace AI — AI Content Creation & Productivity Platform

**CreatorSpace AI** is a full-stack content creation workspace designed for creators, solopreneurs, and marketers. It bridges the gap between raw ideas and ready-to-publish social media assets—providing format-engineered generation for **Instagram Reels**, **Carousels**, **Captions**, and **Stories** powered by the **Google Gemini API** (`gemini-3.5-flash-lite` with smart automatic failover).

---

## 🌟 Key Features

* **AI Studio (Multi-Format Generator)**:
  * Format-tailored outputs:
    * **Instagram Reel**: Viral hooks (0-3s), scene-by-scene script & b-roll directions, on-screen text, feed caption, and strategic hashtags.
    * **Multi-Slide Carousel**: Catchy cover title, slide-by-slide value breakdowns, layout cues, final CTA slide, caption, and hashtags.
    * **Social Caption**: High-retention openers, structured narrative body, call-to-action, and targeted hashtags.
    * **Story Sequence**: 3-5 frame visual flow with poll/sticker engagement prompts and creator pro-tips.
  * Target audience customization (Beginners, Students, Entrepreneurs, Tech Enthusiasts, etc.).
  * Writing tone control (Educational, Conversational, Professional, Creative, Humorous, Friendly).
  * Quick topic inspiration pill buttons (`+ 5 habits of top creators`, etc.).
  * 1-Click Copy to clipboard with instant user feedback.
  * 1-Click Save to local library.
  * Regenerate capability with current parameters.

* **Trend Radar**:
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

---

### Step 1: Set Up Backend

1. Navigate to `server/`:
   ```bash
   cd server
   ```
2. Configure your API key in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-3.5-flash-lite
   ```
3. Start the backend:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`.

---

### Step 2: Set Up Frontend

1. Navigate to `client/`:
   ```bash
   cd client
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

---

## 📄 License
MIT License. Built for modern creators and student developers.
