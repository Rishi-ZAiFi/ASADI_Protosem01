"""Rule-based deterministic insights and offline fallback engine for Creator Analytics Copilot."""

from typing import Dict, Any, List


def generate_rule_based_insights(kpis: Dict[str, Any], patterns: Dict[str, Any]) -> Dict[str, Any]:
    """Generates structured, plain-language insights with confidence labels and hypotheses without LLM."""
    what_worked: List[Dict[str, Any]] = []
    what_didnt: List[Dict[str, Any]] = []
    why_hypotheses: List[Dict[str, Any]] = []

    # 1. Format Insights
    format_patterns = patterns.get("format_patterns", [])
    if format_patterns:
        best_fmt = format_patterns[0]
        if best_fmt["lift_pct"] > 5:
            what_worked.append({
                "statement": f"Content format '{best_fmt['category']}' outperforms your baseline, generating {best_fmt['median_views']:,.0f} median views ({best_fmt['lift_pct']:+.1f}% lift).",
                "dimension": "Format",
                "confidence": best_fmt["confidence"],
                "sample_size": best_fmt["sample_size"],
                "caveat": best_fmt.get("caveat"),
            })
            why_hypotheses.append({
                "topic": f"Format Advantage: {best_fmt['category']}",
                "hypothesis": f"Audiences in your niche strongly favor '{best_fmt['category']}', which the recommendation engine rewards with higher distribution and repeat viewer retention.",
            })

        worst_fmt = format_patterns[-1]
        if worst_fmt["lift_pct"] < -10 and worst_fmt["sample_size"] >= 3:
            what_didnt.append({
                "statement": f"'{worst_fmt['category']}' trails behind, with {worst_fmt['median_views']:,.0f} median views ({worst_fmt['lift_pct']:.1f}% below baseline).",
                "dimension": "Format",
                "confidence": worst_fmt["confidence"],
                "sample_size": worst_fmt["sample_size"],
                "caveat": worst_fmt.get("caveat"),
            })

    # 2. Timing Insights
    time_patterns = patterns.get("time_patterns", [])
    if time_patterns:
        best_time = time_patterns[0]
        if best_time["lift_pct"] > 5:
            what_worked.append({
                "statement": f"Posting during '{best_time['category']}' drives peak velocity, achieving {best_time['median_views']:,.0f} median views ({best_time['lift_pct']:+.1f}% lift).",
                "dimension": "Posting Window",
                "confidence": best_time["confidence"],
                "sample_size": best_time["sample_size"],
                "caveat": best_time.get("caveat"),
            })
            why_hypotheses.append({
                "topic": f"Timing Velocity: {best_time['category']}",
                "hypothesis": f"Publishing during '{best_time['category']}' aligns with your viewers' active browsing periods, yielding higher initial momentum within the first 2 hours of release.",
            })

        worst_time = time_patterns[-1]
        if worst_time["lift_pct"] < -10 and worst_time["sample_size"] >= 3:
            what_didnt.append({
                "statement": f"Content released during '{worst_time['category']}' sees lower engagement ({worst_time['lift_pct']:.1f}% vs baseline).",
                "dimension": "Posting Window",
                "confidence": worst_time["confidence"],
                "sample_size": worst_time["sample_size"],
                "caveat": worst_time.get("caveat"),
            })

    # 3. Question Hooks
    question_patterns = patterns.get("question_patterns", [])
    q_hook = next((p for p in question_patterns if "Includes Question" in p["category"]), None)
    if q_hook and q_hook["lift_pct"] > 5:
        what_worked.append({
            "statement": f"Question hooks in titles boost discovery, generating {q_hook['median_views']:,.0f} median views ({q_hook['lift_pct']:+.1f}% lift).",
            "dimension": "Title Psychology",
            "confidence": q_hook["confidence"],
            "sample_size": q_hook["sample_size"],
            "caveat": q_hook.get("caveat"),
        })
        why_hypotheses.append({
            "topic": "Question Hook Psychological Pull",
            "hypothesis": "Questions trigger an open curiosity loop in readers' minds, prompting higher click-through rates from browse and recommended feeds.",
        })

    # 4. Numbers in Titles
    number_patterns = patterns.get("number_patterns", [])
    num_pattern = next((p for p in number_patterns if "Includes Number" in p["category"]), None)
    if num_pattern and num_pattern["lift_pct"] > 5:
        what_worked.append({
            "statement": f"Titles featuring specific numbers achieve {num_pattern['median_views']:,.0f} median views ({num_pattern['lift_pct']:+.1f}% lift).",
            "dimension": "Title Psychology",
            "confidence": num_pattern["confidence"],
            "sample_size": num_pattern["sample_size"],
            "caveat": num_pattern.get("caveat"),
        })
        why_hypotheses.append({
            "topic": "Cognitive Specificity of Numbers",
            "hypothesis": "Numbers (e.g., '7 Tools', '3 Mistakes') set concrete expectations of structure and bite-sized value, lowering reader friction.",
        })

    # 5. Duration Buckets
    duration_patterns = patterns.get("duration_patterns", [])
    if duration_patterns:
        best_dur = duration_patterns[0]
        if best_dur["lift_pct"] > 5:
            what_worked.append({
                "statement": f"Duration bracket '{best_dur['category']}' yields highest viewer yield ({best_dur['lift_pct']:+.1f}% lift).",
                "dimension": "Content Duration",
                "confidence": best_dur["confidence"],
                "sample_size": best_dur["sample_size"],
                "caveat": best_dur.get("caveat"),
            })
            why_hypotheses.append({
                "topic": "Attention Pacing & Completion",
                "hypothesis": f"Content within '{best_dur['category']}' hits the optimal sweet spot between value density and completion rate before audience fatigue sets in.",
            })

    # Fallback if no extreme patterns found
    if not what_worked:
        what_worked.append({
            "statement": f"Your catalog shows steady performance around {kpis.get('median_views', 0):,.0f} median views with {kpis.get('mean_engagement_rate', 0):.2f}% average engagement.",
            "dimension": "Catalog Baseline",
            "confidence": "Medium",
            "sample_size": kpis.get("total_posts", 0),
            "caveat": None,
        })

    if not what_didnt:
        what_didnt.append({
            "statement": "No severe underperforming outliers detected across tested dimensions.",
            "dimension": "General",
            "confidence": "Medium",
            "sample_size": kpis.get("total_posts", 0),
            "caveat": None,
        })

    return {
        "what_worked": what_worked,
        "what_didnt": what_didnt,
        "why_hypotheses": why_hypotheses,
    }


def generate_rule_based_ideas(kpis: Dict[str, Any], patterns: Dict[str, Any]) -> List[Dict[str, str]]:
    """Generates 10 deterministic, data-backed content ideas tailored to detected winning patterns."""
    best_fmt = "Shorts"
    if patterns.get("format_patterns"):
        best_fmt = patterns["format_patterns"][0]["category"]

    best_time = "Evening (5PM - 10PM)"
    if patterns.get("time_patterns"):
        best_time = patterns["time_patterns"][0]["category"]

    idea_templates = [
        ("Why 99% of People Fail at {niche} (And How to Fix It)", "Stop scrolling if you are struggling with {niche}...", "Proven question hook + curiosity gap"),
        ("7 Secret Tools I Use Daily for {niche}", "These 7 tools saved me over 20 hours this week...", "Listicle structure + numbers lift CTR"),
        ("The Brutal Truth About {niche} in 2026", "Nobody wants to admit this, but here is what changed...", "Contrarian angle with urgency"),
        ("How I Doubled My Results in 30 Days with {niche}", "Here is the exact step-by-step roadmap I used...", "Case study proof format"),
        ("3 Costly Mistakes You Are Making with {niche}", "If you do this one thing, you are wasting time...", "Loss-aversion psychological trigger"),
        ("Stop Doing {niche} the Hard Way — Do This Instead", "There is a 10x faster approach to...", "High-converting 'Stop Doing This' pattern"),
        ("My Complete Beginner Blueprint for {niche}", "If I had to start over from zero today, here is my plan...", "High bookmark/shareability index"),
        ("Is {niche} Worth It in 2026? Honest Review", "I spent 100+ hours testing this so you don't have to...", "Review hook with high search intent"),
        ("5 Underrated Hacks for Faster {niche}", "Number 4 is something almost nobody talks about...", "Tactical value density pattern"),
        ("The Only 3 Rules You Need to Master {niche}", "Forget the 50-step guides, master these 3...", "Simplification hook for busy viewers"),
    ]

    ideas = []
    for title_tmpl, hook_tmpl, reason in idea_templates:
        ideas.append({
            "title": title_tmpl.format(niche="Your Core Niche"),
            "hook": hook_tmpl.format(niche="your content"),
            "format": best_fmt,
            "best_posting_slot": best_time,
            "data_backed_reason": f"{reason}. Backed by your highest performing '{best_fmt}' format and '{best_time}' publishing slot.",
        })

    return ideas


def answer_data_query_rule_based(query: str, kpis: Dict[str, Any], patterns: Dict[str, Any]) -> str:
    """Answers creator questions strictly grounded in computed statistics with explicit boundaries."""
    q = query.lower()

    if "best time" in q or "when should i post" in q or "when to post" in q:
        time_p = patterns.get("time_patterns", [])
        if time_p:
            best = time_p[0]
            return f"Based on your data, your top posting window is **{best['category']}**, generating **{best['median_views']:,.0f} median views** ({best['lift_pct']:+.1f}% lift vs your catalog baseline). Confidence: **{best['confidence']}** (based on {best['sample_size']} posts)."
        return "I don't see enough timestamp variation in your data to identify a definitive best posting window."

    elif "best format" in q or "which format" in q or "what format" in q or "type of content" in q:
        fmt_p = patterns.get("format_patterns", [])
        if fmt_p:
            best = fmt_p[0]
            return f"Your top-performing format is **{best['category']}**, achieving **{best['median_views']:,.0f} median views** ({best['lift_pct']:+.1f}% lift vs baseline) with a **{best['confidence']} confidence rating** across {best['sample_size']} posts."
        return "No format breakdown is available in your current dataset."

    elif "question" in q or "questions" in q:
        q_p = patterns.get("question_patterns", [])
        hook = next((p for p in q_p if "Includes Question" in p["category"]), None)
        if hook:
            return f"Yes! Posts with question hooks generate **{hook['median_views']:,.0f} median views** ({hook['lift_pct']:+.1f}% lift) compared to posts without questions. Confidence: **{hook['confidence']}** (sample size: {hook['sample_size']} posts)."
        return "Not enough data to measure the impact of question hooks in your titles."

    elif "number" in q or "numbers" in q:
        num_p = patterns.get("number_patterns", [])
        num = next((p for p in num_p if "Includes Number" in p["category"]), None)
        if num:
            return f"Titles featuring numbers achieve **{num['median_views']:,.0f} median views** ({num['lift_pct']:+.1f}% lift). Confidence: **{num['confidence']}** (based on {num['sample_size']} posts)."
        return "Numbers in titles did not show a statistically distinct sample in your dataset."

    elif "total views" in q or "how many views" in q:
        return f"Across your entire uploaded catalog of **{kpis.get('total_posts', 0):,} posts**, you have accumulated **{kpis.get('total_views', 0):,} total views**, averaging **{kpis.get('mean_views', 0):,.0f} views per post** (median: **{kpis.get('median_views', 0):,.0f}**)."

    elif "engagement" in q or "engagement rate" in q:
        return f"Your average engagement rate is **{kpis.get('mean_engagement_rate', 0):.2f}%** (median: **{kpis.get('median_engagement_rate', 0):.2f}%**). Top 10% posts average **{patterns.get('top_vs_bottom', {}).get('top_summary', {}).get('mean_engagement', 0):.2f}%** engagement."

    elif "predict" in q or "future" in q or "next week" in q:
        return "⚠️ **Limitation Notice:** The data reflects your historical performance patterns and statistical probabilities. External platform algorithms and shifting audience trends cannot be predicted with 100% certainty. Use these patterns as tactical guidelines rather than guarantees."

    else:
        # Default grounded response
        return (
            f"Here is what your data confirms:\n"
            f"- **Catalog Size:** {kpis.get('total_posts', 0)} posts\n"
            f"- **Median Views:** {kpis.get('median_views', 0):,.0f}\n"
            f"- **Average Engagement:** {kpis.get('mean_engagement_rate', 0):.2f}%\n"
            f"- **Top Format:** {patterns.get('format_patterns', [{}])[0].get('category', 'N/A')}\n"
            f"- **Best Window:** {patterns.get('time_patterns', [{}])[0].get('category', 'N/A')}\n\n"
            f"*If your question is outside these computed metrics, the current dataset does not contain sufficient data to answer.*"
        )
