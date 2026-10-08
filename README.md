# 🎬 Creator Analytics Copilot — YouTube Studio Edition

> **Assigned Problem No.:** 24  
> **Application Name:** Creator Analytics Copilot  
> **Assigned Branch:** `24_Creator_Analytics_Copilot`  
> **Student:** Bhuvanashree K R  

---

## 📌 Problem Statement & Build Challenge

* **Problem Statement:** Creators have performance data in YouTube Studio but struggle to understand *why* some content works better.
* **Core Workflow / Build Challenge:**  
  $$\text{Upload Content Analytics} \longrightarrow \text{Identify Patterns} \longrightarrow \text{Explain What Worked} \longrightarrow \text{Recommend Next Content Ideas}$$

---

## 🌟 Key Features

### 1. YouTube Studio Native Interface
* Designed and structured in the **exact look, feel, and navigation of YouTube Studio (`studio.youtube.com`)**.
* Includes the collapsible sidebar navigation, channel identity, top studio app bar, and search tools.

### 2. The 4-Step Copilot Pipeline
1. **📤 Upload Content Analytics & Channel Telemetry:**
   * Ingest YouTube Studio CSV/JSON exports (video metrics, watch duration, impressions, and retention curves) or choose verified benchmarks (*TechPulse 184K*, *CapitalMind Finance 92K*, *LoreCraft Gaming 410K*).
   * Displays primary YouTube Studio KPI tiles with sparklines and trend indicators.
2. **🔍 Identify Patterns (Key Moments for Audience Retention):**
   * Head-to-Head interactive SVG audience retention curve comparing top outlier hits vs underperforming flops across **Intro (0:00 - 0:30)**, **Continuous segments**, and **Climax**.
   * Second-by-second cursor scrubber with hover deltas.
   * Clickable forensic drop-off hotspots (*0:24 Hook Cliff*, *2:40 Pacing Drag*, *6:15 Thermal Stress Spike*).
   * Pearson $r$ Browse Feature recommendation correlation matrix.
3. **🧠 Explain What Worked ("The Why" — Algorithmic Causal Diagnoses):**
   * Plain-English causal explanations of why the YouTube recommendation engine pushed content to Browse Features (Home Feed) or dropped it.
   * Diagnostic prescriptions for pacing, hook mechanics, and audience expectation fulfillment.
4. **💡 Recommend Next Content Ideas (Prescriptive Video Blueprints):**
   * Data-backed video concepts generated from the channel's winning retention DNA.
   * Each blueprint includes Title A/B options, thumbnail composition guide, full **60-second opening hook script**, and retention arc.
   * One-click copy and export to Markdown/Notion.

### 3. YouTube Title & Thumbnail Clickability Lab
* Real-time pre-production sandbox evaluating curiosity gaps, clickability velocity, and suggesting 3 high-converting title rewrites.

### 4. Channel Growth & Revenue ROI Calculator
* Interactive sliders for Monthly Views, CTR, Average View Duration, and RPM with live projected view and ad revenue lifts.

### 5. Multi-Mode Implementation
* **Web Edition (Standalone HTML/CSS/JS):** Open [`index.html`](index.html) directly in any modern browser with zero dependencies!
* **Python/Streamlit Edition:** Complete Streamlit analytics dashboard in [`app.py`](app.py) with test suite.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5 Semantic Structure, Vanilla CSS3 (YouTube Studio Dark Theme), Vanilla JavaScript (ES6+)
* **Data Visualization:** Custom Interactive SVG Curve Generator, Canvas Scrubber, CSS Responsive Grid
* **Python Engine:** Streamlit, Pandas, NumPy, Plotly
* **Testing:** Pytest

---

## 🚀 How to Run Locally

### Option A: YouTube Studio Web Application (Recommended, Zero Dependencies)
1. Navigate to the repository root directory.
2. Open [`index.html`](index.html) directly in any web browser (Chrome, Edge, Firefox, Brave):
   ```bash
   # On Windows (PowerShell):
   Start-Process index.html
   ```
3. Or serve using Python's built-in HTTP server:
   ```bash
   python -m http.server 3030
   # Open http://localhost:3030 in your browser
   ```

### Option B: Streamlit Dashboard
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the Streamlit app:
   ```bash
   streamlit run app.py
   ```
3. Run automated tests:
   ```bash
   pytest
   ```

---

## 📁 Repository Structure

```text
├── index.html                  # Main YouTube Studio Web Application
├── styles.css                  # YouTube Studio Dark Mode design system
├── app.js                      # Client-side analytics & SVG curve logic
├── assets/
│   ├── hero-dashboard.jpg      # Dashboard visualization asset
│   ├── sample_data.csv         # Sample YouTube performance metrics
│   └── style.css               # Streamlit custom styling
├── app.py                      # Streamlit application entry point
├── src/                        # Python analytics engine modules
│   ├── analytics.py
│   ├── config.py
│   ├── loader.py
│   ├── mapping.py
│   └── ui.py
├── tests/                      # Automated test suite
│   ├── test_analytics.py
│   └── test_loader.py
├── requirements.txt            # Python dependencies
├── .env.example                # Example environment configuration
└── README.md                   # Project documentation
```

---

## 👤 Author
**Bhuvanashree K R**  
Assigned Problem: `24_Creator_Analytics_Copilot`
