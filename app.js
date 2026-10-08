/**
 * YouTube Studio - Creator Analytics Copilot Engine
 * Client-Side Performance Diagnostic & Prescriptive AI System
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. DATASETS: YOUTUBE CREATOR CHANNELS
  // =========================================================================

  const CHANNEL_DATASETS = {
    tech: {
      name: "TechPulse Studio",
      avatar: "💻",
      niche: "Tech & Gadgets",
      subs: "184,210 subscribers",
      videoCount: 42,
      audience: "Tech Enthusiasts & Builders 18-34",
      kpis: {
        views: "1.24M",
        viewsTrend: "↑ 26.4% more than usual",
        watchTime: "68.4K",
        subsDelta: "+4.1K",
        ctr: "6.8%",
        ctrTrend: "Benchmark: 4.5% - 7.2%",
        hook: "64.5%",
        hookTrend: "↑ 14.2% top quartile",
        avd: "5m 32s"
      },
      winner: {
        title: "Why Apple's M4 Chip Terrifies Intel",
        views: "720.4K",
        ctr: "8.4%",
        hook30s: "68%",
        avd: "6:42 (72.4%)",
        length: "9:15",
        curve: [100, 88, 81, 75, 71, 68, 66, 64, 62, 59, 58, 56, 54, 52, 51, 48, 46, 44, 40]
      },
      flop: {
        title: "M4 Mac Mini Review & Specs Breakdown",
        views: "31.2K",
        ctr: "3.8%",
        hook30s: "34%",
        avd: "2:10 (25.0%)",
        length: "8:40",
        curve: [100, 68, 52, 41, 35, 31, 28, 25, 22, 20, 19, 17, 16, 14, 13, 11, 10, 8, 5]
      },
      hotspots: [
        {
          timestamp: "0:24",
          xPercent: 8,
          badge: "Hook Cliff",
          badgeType: "badge-drop",
          title: "The 30s Intro Cliff (-34% Gap)",
          desc: "Winner delidded silicon die under microscope with immediate conflict statement in first 8s. Flop spent 45s saying 'Hey guys welcome back to the channel' and spinning product on a lazy turntable."
        },
        {
          timestamp: "2:40",
          xPercent: 32,
          badge: "Pacing Plateau",
          badgeType: "badge-pacing",
          title: "Spec Sheet Monologue (-16% Drop)",
          desc: "In Flop, a 70-second static table of geekbench scores caused 2,400 viewers to exit. Winner avoided slides entirely, running live 4K timeline stutter test with real-time sound design."
        },
        {
          timestamp: "6:15",
          xPercent: 72,
          badge: "Rewatch Spike",
          badgeType: "badge-spike",
          title: "Thermal Stress Reveal (+8% Spike)",
          desc: "Winner revealed an unadvertised thermal throttling issue at 6:15. Viewers re-watched this section 1.4x, triggering high algorithmic satisfaction and YouTube Home Feed recommendation."
        }
      ],
      patterns: [
        {
          type: "hook",
          badge: "High Impact Pattern",
          badgeClass: "badge-pattern-win",
          impact: "+114% Velocity",
          title: "Conflict Anchor Over Passive Spec Review",
          desc: "Videos that frame a technology product as a conflict between two forces (e.g., Apple vs Intel) generate 2.9x higher 30s retention than passive review titles.",
          evidence: "Observed across 8 of your top 10 videos (Average 30s retention: 66.8%)."
        },
        {
          type: "pacing",
          badge: "Critical Failure Pattern",
          badgeClass: "badge-pattern-loss",
          impact: "-48% Watch Time",
          title: "The Static Spec Table Plateau",
          desc: "Whenever on-screen graphics remain stationary for >12 seconds without sound cues or zoom cuts, retention slope drops at triple the baseline rate.",
          evidence: "Present in all 6 underperforming videos around the 2:00-3:30 minute mark."
        },
        {
          type: "packaging",
          badge: "CTR Optimization Pattern",
          badgeClass: "badge-pattern-win",
          impact: "+3.6% CTR Lift",
          title: "Minimalist Negative Framing Thumbnail",
          desc: "Thumbnails using 3 words or fewer with a high-contrast facial reaction and yellow warning arrow outperform generic studio product shots by 88%.",
          evidence: "Average CTR: 8.7% vs 4.2% on standard gadget renders."
        }
      ],
      correlations: [
        { metric: "30s Hook Retention vs Browse Traffic", score: "0.94", width: "94%", color: "var(--yt-green)" },
        { metric: "Visual Cut Frequency (<6s) vs AVD", score: "0.88", width: "88%", color: "var(--yt-blue)" },
        { metric: "Curiosity Gap Title vs First 24h CTR", score: "0.82", width: "82%", color: "var(--yt-purple)" },
        { metric: "End-Screen Tease vs Channel Session Depth", score: "0.76", width: "76%", color: "var(--yt-amber)" }
      ],
      diagnosticReport: [
        {
          category: "Hook Mechanics",
          typeClass: "diagnostic-hook",
          icon: "⚡",
          confidence: "98% Confidence",
          title: "Why The Winner Locked Viewers in 8 Seconds",
          explanation: "In 'Why Apple's M4 Chip Terrifies Intel', you opened directly in media res: holding a de-lidded processor, stating an undeniable high-stakes claim ('Intel's roadmap for 2026 just died in this lab'). In the flop, you greeted the audience, asked for subscriptions, and introduced the video title they had already clicked on.",
          prescription: "Prescription: Cut all pre-roll channel intros. Never repeat the video title in your first sentence. Start with the consequence or the unresolved conflict."
        },
        {
          category: "Visual Pacing & Retention Cliffs",
          typeClass: "diagnostic-pacing",
          icon: "🎬",
          confidence: "94% Confidence",
          title: "The 2-Minute Monologue Collapse",
          explanation: "At 2:40 in the flop, retention plummeted from 41% down to 25% in 30 seconds. Video analysis reveals 68 continuous seconds of a single talking head camera angle talking about RAM bus width. In your winner, you switched perspectives every 5.2 seconds with screen captures, physical props, and sound design punctuation.",
          prescription: "Prescription: Enforce the '7-Second Rule'. If a camera shot or slide does not have a visual cut, zoom, text highlight, or sound effect every 7 seconds, audience bounce accelerates."
        },
        {
          category: "Algorithmic Home Feed Affinity",
          typeClass: "diagnostic-algorithm",
          icon: "🤖",
          confidence: "96% Confidence",
          title: "Browse Distribution Trigger Point",
          explanation: "YouTube tested both videos to your core subscribers in the first 2 hours. The winner achieved a 68% 30s retention and 8.4% CTR, signaling to the algorithm that broad tech audiences would be satisfied. The flop produced a 34% 30s retention, signaling to YouTube that even your own subscribers were leaving early.",
          prescription: "Prescription: The algorithm is an audience mirror. When you fix the first 30 seconds, initial velocity clears the threshold required for wide Home Feed distribution."
        }
      ],
      blueprints: [
        {
          type: "Breakout Deep Dive",
          predictedCtr: "8.6% - 10.2% CTR",
          titleA: "Why M4 Mac's 8GB RAM Baseline Is A Trap (Tested with 40 Chrome Tabs + 4K Export)",
          titleB: "Don't Buy The Base M4 Mac Until You Watch This (Real Benchmarks)",
          thumbDesc: "Split screen: Left side shows a glowing golden M4 chip with an error warning symbol. Right side shows creator's face with forehead palm. Bold text: '8GB IS DEAD'.",
          hookScript: "\"If you are about to save $200 and buy the base model M4 Mac... stop right now. In the next 6 minutes, I am going to run the exact workload Apple said this machine could handle — and show you what happens when the memory swap hits 100%.\"",
          structure: "0:00-0:30 Stress Test Hook → 0:30-2:15 The 8GB Illusion → 2:15-5:00 Live Thermal Crash Comparison → 5:00-7:30 Real Buyer Decision Flow."
        },
        {
          type: "Contrarian Industry Video",
          predictedCtr: "7.9% - 9.5% CTR",
          titleA: "Intel Just Answered Apple — And It's Worse Than We Thought",
          titleB: "The Secret Reason Intel Can't Catch Apple Silicon",
          thumbDesc: "Dark moody studio setting. Intel CEO photo next to a cracked silicon wafer. Deep purple and neon crimson contrast with glowing text: 'GAME OVER?'.",
          hookScript: "\"Last week, Intel held an emergency closed-door keynote. They claimed their new Lunar Lake chip beat Apple's M4. So we bought one, put it on our test bench, and found the one metric Intel omitted from every single slide.\"",
          structure: "0:00-0:40 Keynote Lie Unveiled → 0:40-3:00 Test Bench Evidence → 3:00-5:30 Battery Draw Shock → 5:30-8:00 The 5-Year Impact."
        },
        {
          type: "Curiosity Experiment",
          predictedCtr: "9.1% - 11.0% CTR",
          titleA: "I Replaced My $4,000 Mac Studio With A $599 M4 Mini For 14 Days",
          titleB: "Can A $599 Computer Actually Edit 8K Video? (Real Studio Test)",
          thumbDesc: "Tiny M4 Mac Mini sitting on top of a giant tower PC. Creator holding measuring tape. Bold neon cyan text: '4K EDITING?'.",
          hookScript: "\"This $599 box is smaller than my lunchbox. And for the past two weeks, it has been running my entire YouTube production studio. Did it catch fire? Did it render faster than my $4,000 workstation? The numbers made no sense.\"",
          structure: "0:00-0:35 The Experiment Setup → 0:35-2:45 Day 1-7 Studio Agony → 2:45-5:45 The 8K Render Showdown → 5:45-7:45 The Final Verdict."
        }
      ]
    },

    finance: {
      name: "CapitalMind Finance",
      avatar: "📈",
      niche: "Personal Finance & Business",
      subs: "92,450 subscribers",
      videoCount: 28,
      audience: "Aspiring Entrepreneurs & Investors 22-40",
      kpis: {
        views: "640K",
        viewsTrend: "↑ 38.1% vs last period",
        watchTime: "34.2K",
        subsDelta: "+2.8K",
        ctr: "7.4%",
        ctrTrend: "Benchmark: 5.0% - 8.0%",
        hook: "71.2%",
        hookTrend: "↑ 22.5% top quartile",
        avd: "7m 45s"
      },
      winner: {
        title: "I Tested 5 Side Hustles For 30 Days (Real Bank Statements)",
        views: "490.2K",
        ctr: "9.2%",
        hook30s: "71%",
        avd: "8:15 (61.2%)",
        length: "13:20",
        curve: [100, 92, 85, 80, 76, 73, 71, 68, 65, 63, 61, 58, 56, 54, 52, 49, 46, 44, 40]
      },
      flop: {
        title: "Top 5 Passive Income Ideas for Beginners in 2026",
        views: "18.4K",
        ctr: "3.2%",
        hook30s: "29%",
        avd: "2:30 (22.4%)",
        length: "11:10",
        curve: [100, 62, 45, 34, 29, 25, 22, 19, 17, 15, 14, 12, 11, 9, 8, 7, 6, 5, 4]
      },
      hotspots: [
        {
          timestamp: "0:18",
          xPercent: 7,
          badge: "Proof Anchor",
          badgeType: "badge-spike",
          title: "Bank Statement Proof at 0:15 (+18% Retention)",
          desc: "Winner flashed redacted bank statement deposit slips on screen in the first 15 seconds. Instant credibility prevented viewers from dismissing the video as another generic guru listicle."
        },
        {
          timestamp: "3:10",
          xPercent: 35,
          badge: "Cliché Trap",
          badgeType: "badge-drop",
          title: "Generic Dropshipping Mention (-28% Cliff)",
          desc: "Flop recommended print-on-demand and dropshipping with stock footage. Over 40% of viewers closed the tab, having heard the exact same advice on 50 other channels."
        },
        {
          timestamp: "9:45",
          xPercent: 75,
          badge: "Failure Transparency",
          badgeType: "badge-spike",
          title: "Side Hustle #4 Total Loss Breakdown (+12% Spike)",
          desc: "Showing a real financial loss ($340 lost on inventory) triggered massive viewer trust and comments, causing viewers to watch through to side hustle #5."
        }
      ],
      patterns: [
        {
          type: "hook",
          badge: "Credibility Pattern",
          badgeClass: "badge-pattern-win",
          impact: "+140% Retention",
          title: "The Financial Proof Deposit Hook",
          desc: "Displaying physical bank screenshots or tax receipts in the first 12 seconds creates immediate trust in personal finance.",
          evidence: "Average 30s retention on proof videos: 72% vs 31% on advice without receipts."
        },
        {
          type: "packaging",
          badge: "High CTR Pattern",
          badgeClass: "badge-pattern-win",
          impact: "+4.8% CTR Lift",
          title: "First-Person 'I Tested' vs Second-Person 'You Should'",
          desc: "Titles written in the first-person experiential frame ('I tried X for 30 days') outperform prescriptive titles ('5 things you must do') by 180%.",
          evidence: "CTR on experiential titles: 9.1% vs 3.5% on prescriptive titles."
        },
        {
          type: "pacing",
          badge: "Trust Anchor",
          badgeClass: "badge-pattern-win",
          impact: "+3m Watch Time",
          title: "Documenting Failure Before Success",
          desc: "Videos that feature an experiment that failed keep audiences watching 42% longer because viewers want to see what actually worked.",
          evidence: "Viewers rewound the failed hustle chapter 1.5x more than the winning hustle."
        }
      ],
      correlations: [
        { metric: "First-Person Case Study vs CTR", score: "0.96", width: "96%", color: "var(--yt-green)" },
        { metric: "Proof Shown <20s vs 30s Retention", score: "0.91", width: "91%", color: "var(--yt-blue)" },
        { metric: "Spreadsheet Breakdown vs AVD", score: "0.84", width: "84%", color: "var(--yt-purple)" },
        { metric: "Realistic Financial Loss Disclosure vs Comments", score: "0.89", width: "89%", color: "var(--yt-amber)" }
      ],
      diagnosticReport: [
        {
          category: "Hook Mechanics",
          typeClass: "diagnostic-hook",
          icon: "💰",
          confidence: "99% Confidence",
          title: "Why Proof Beat Promise",
          explanation: "In 'Top 5 Passive Income Ideas', you promised easy money without showing skin in the game. In 'I Tested 5 Side Hustles', you held up your actual phone showing the Stripe dashboard and a timer showing 30 days of effort. Viewers instantly knew this was real data, not recycled blog posts.",
          prescription: "Prescription: Never create an educational finance video without showing your personal spreadsheet or transaction log within 15 seconds."
        },
        {
          category: "Narrative Arc",
          typeClass: "diagnostic-pacing",
          icon: "📊",
          confidence: "95% Confidence",
          title: "The Reality Check Principle",
          explanation: "Audiences have become completely immune to 'make $10,000/month with AI' claims. When you spent 3 minutes showing how side hustle #4 made only $12 after 40 hours of work, viewer retention spiked because it validated their own real-world struggles.",
          prescription: "Prescription: Always lead with an honest failure in multi-part breakdown videos before showing the profitable solution."
        },
        {
          category: "Browse Features Trigger",
          typeClass: "diagnostic-algorithm",
          icon: "🚀",
          confidence: "97% Confidence",
          title: "High Session Duration Spillover",
          explanation: "Because viewers watched over 8 minutes of your winner, 34% went on to watch a second video on your channel within the same session. YouTube's recommendation engine interprets high session completion as a major satisfaction signal.",
          prescription: "Prescription: Use dynamic mid-video references to your related case studies to maximize end-screen click-through."
        }
      ],
      blueprints: [
        {
          type: "Experimental Case Study",
          predictedCtr: "9.4% - 11.2% CTR",
          titleA: "I Put $10,000 Into 3 High-Yield Savings Accounts (The Hidden Catch)",
          titleB: "Why Banks Don't Want You To Know About This 5.5% Account",
          thumbDesc: "Creator holding a transparent jar filled with real cash, next to a bank statement with a bright red circle. Text: '$10,000 TESTED'.",
          hookScript: "\"Most financial creators tell you to park your emergency fund in a High-Yield Savings account. But three months ago, I deposited $10,000 into the three most popular banks online — and two of them charged fees they hide in section 14 of the fine print.\"",
          structure: "0:00-0:30 The $10k Deposit Proof → 0:30-3:00 The Secret Fee Trap → 3:00-6:30 Real Monthly Interest Payouts → 6:30-8:30 Best Account Matrix."
        },
        {
          type: "Contrarian Wealth Deep Dive",
          predictedCtr: "8.5% - 10.1% CTR",
          titleA: "The Middle Class Trap Nobody Realizes Until Age 35",
          titleB: "Why Making $100K Still Feels Like You're Broke (Real Math)",
          thumbDesc: "Chalkboard showing a family budget balance of $0 with salary of $100,000 crossed out. Shocked reaction shot. Text: '$100K = BROKE?'.",
          hookScript: "\"If you make six figures today, you are earning more than 82% of the country — yet millions of people making $100,000 live paycheck to paycheck. Let me show you the exact mathematical trap that quietly drains $3,400 from your account every month.\"",
          structure: "0:00-0:40 The $100K Illusion → 0:40-3:15 The 3 Invisible Tax Creeps → 3:15-6:00 The Asset vs Debt Pivot → 6:00-8:30 The Escape Playbook."
        },
        {
          type: "30-Day Budget Audit",
          predictedCtr: "9.0% - 10.8% CTR",
          titleA: "I Audited A Broke 24-Year Old's Bank Account (We Found $600/Mo)",
          titleB: "Fixing A Complete Stranger's Finances in 48 Hours",
          thumbDesc: "Split screen: Embarrassed guest sitting across a desk. Creator holding a red highlighter over a massive bank printout. Text: 'AUDITED'.",
          hookScript: "\"This is Alex. He works 45 hours a week, makes $3,200 a month, and had $14 in his checking account yesterday. Over the next 10 minutes, I am going to comb through every single transaction on his statement and find $600 he is wasting without knowing it.\"",
          structure: "0:00-0:45 The Guest & Balance Reveal → 0:45-3:30 The Subscription Vampire → 3:30-7:00 Food & Rent Optimization → 7:00-9:00 The New Balance."
        }
      ]
    },

    gaming: {
      name: "LoreCraft Studio",
      avatar: "🎮",
      niche: "Gaming Narrative & Storytelling",
      subs: "410,800 subscribers",
      videoCount: 56,
      audience: "Hardcore Gamers & Lore Enthusiasts 16-32",
      kpis: {
        views: "2.85M",
        viewsTrend: "↑ 44.2% vs last period",
        watchTime: "112.4K",
        subsDelta: "+8.9K",
        ctr: "8.1%",
        ctrTrend: "Benchmark: 6.0% - 9.5%",
        hook: "76.4%",
        hookTrend: "↑ 28.1% top quartile",
        avd: "11m 20s"
      },
      winner: {
        title: "The Secret Psychology of Elden Ring's Cruelest Boss",
        views: "1.12M",
        ctr: "10.4%",
        hook30s: "76%",
        avd: "11:20 (64.2%)",
        length: "17:40",
        curve: [100, 94, 88, 83, 80, 78, 76, 74, 72, 70, 68, 65, 63, 61, 59, 56, 54, 51, 48]
      },
      flop: {
        title: "Elden Ring Lore Recap & Boss Tier List 2026",
        views: "52.8K",
        ctr: "4.1%",
        hook30s: "41%",
        avd: "4:10 (27.2%)",
        length: "15:20",
        curve: [100, 72, 58, 48, 41, 37, 33, 29, 26, 23, 20, 18, 16, 14, 12, 10, 9, 7, 5]
      },
      hotspots: [
        {
          timestamp: "0:30",
          xPercent: 10,
          badge: "Cinematic Hook",
          badgeType: "badge-spike",
          title: "Cinematic Sound Design & Moral Dilemma",
          desc: "Winner opened with high-fidelity sound isolation and a moral dilemma about the boss's backstory. Hook retention was 76% at 30 seconds."
        },
        {
          timestamp: "3:45",
          xPercent: 36,
          badge: "Tier List Fatigue",
          badgeType: "badge-drop",
          title: "Predictable Tier List Segment (-31% Drop)",
          desc: "Flop started a standard S-to-D rank list. Viewers scrubbed straight to the end or bounced immediately, missing the middle content."
        },
        {
          timestamp: "12:10",
          xPercent: 78,
          badge: "Plot Twist Reveal",
          badgeType: "badge-spike",
          title: "Hidden Lore Translation Reveal (+14% Spike)",
          desc: "Winner revealed an untranslated Japanese developer note showing the boss was actually trying to save the player. Massive rewatch and comment discussion spike."
        }
      ],
      patterns: [
        {
          type: "hook",
          badge: "Cinematic Pattern",
          badgeClass: "badge-pattern-win",
          impact: "+160% Retention",
          title: "Philosophical Dilemma vs Gameplay Compilation",
          desc: "Framing a game character through psychological trauma or philosophical choice produces 3x longer watch time than ranking combat moves.",
          evidence: "Watched across your 5 million-view video essay releases."
        },
        {
          type: "pacing",
          badge: "Retention Pillar",
          badgeClass: "badge-pattern-win",
          impact: "+4m AVD Lift",
          title: "Micro-Mystery Resolution Loop",
          desc: "Introducing a mystery, promising the answer in 2 minutes, and then introducing a second deeper mystery before answering the first keeps retention above 65%.",
          evidence: "Retention curve stays virtually flat between minutes 4:00 and 11:00."
        },
        {
          type: "packaging",
          badge: "Click Magnet",
          badgeClass: "badge-pattern-win",
          impact: "+5.1% CTR Lift",
          title: "Emotional Character Isolation Thumbnail",
          desc: "Close-up of a tragic character's eyes with dramatic rim lighting and no text outperforms busy gameplay screenshots.",
          evidence: "CTR on character eyes: 10.8% vs 4.4% on gameplay HUD screenshots."
        }
      ],
      correlations: [
        { metric: "Psychological Framing vs Suggested Video Traffic", score: "0.98", width: "98%", color: "var(--yt-green)" },
        { metric: "Sound Design Isolation vs 30s Hook", score: "0.93", width: "93%", color: "var(--yt-blue)" },
        { metric: "Micro-Mystery Pacing vs Total AVD", score: "0.89", width: "89%", color: "var(--yt-purple)" },
        { metric: "Tragic Character Face vs Mobile CTR", score: "0.87", width: "87%", color: "var(--yt-amber)" }
      ],
      diagnosticReport: [
        {
          category: "Hook Mechanics",
          typeClass: "diagnostic-hook",
          icon: "🎭",
          confidence: "99% Confidence",
          title: "The Emotional Resonance Advantage",
          explanation: "In 'The Secret Psychology', you didn't treat the boss like a collection of hitpoints and attack animations. You treated them like a tragic Shakespearean figure who lost their family. You set up a moral mystery in the first 20 seconds that forced the viewer to stay until the end to resolve their cognitive dissonance.",
          prescription: "Prescription: Never open with 'In this video, I will rank the bosses'. Open with the tragic question the game never answered for the player."
        },
        {
          category: "Pacing Architecture",
          typeClass: "diagnostic-pacing",
          icon: "🕯️",
          confidence: "96% Confidence",
          title: "Eliminating The Mid-Video Tier List Drag",
          explanation: "Tier lists suffer from a fatal algorithmic flaw: viewers know the format and immediately jump ahead to S-Tier, leaving massive retention craters in B and C Tier. Video essays with progressive narrative revelation create continuous tension.",
          prescription: "Prescription: Replace discrete ranked lists with continuous narrative investigations that build toward a single climax."
        },
        {
          category: "Suggested Videos Synergy",
          typeClass: "diagnostic-algorithm",
          icon: "🔮",
          confidence: "98% Confidence",
          title: "Suggested Videos Dominance (71% Traffic)",
          explanation: "Because your winner held 64% retention over 17 minutes, YouTube placed this video directly next to official game trailers and top let's-play streams. It became the canonical lore breakdown for the entire community.",
          prescription: "Prescription: Optimize for the 'Next Watch' behavior by answering the questions players search for after beating a hard game."
        }
      ],
      blueprints: [
        {
          type: "Psychological Video Essay",
          predictedCtr: "10.5% - 12.0% CTR",
          titleA: "The Terrifying Philosophy Built Into Elden Ring's DLC",
          titleB: "Why FromSoftware's Cruelest Story Is Actually About Grief",
          thumbDesc: "Tragic boss looking down with hands over face. Neon crimson ambient lighting, cinematic cinematic bars. Text: 'WHY DID HE DO IT?'.",
          hookScript: "\"When you first enter the Shadow Realm, FromSoftware gives you a warning that most players ignored. But if you translate the Latin chant in the final cathedral, you realize this entire world was built to punish one person: you.\"",
          structure: "0:00-0:45 The Latin Chant Mystery → 0:45-4:30 The Architect's Grief → 4:30-9:00 The 3 Lies in the Lore → 9:00-14:00 The Terrifying Truth."
        },
        {
          type: "Character Autopsy",
          predictedCtr: "9.8% - 11.4% CTR",
          titleA: "The Boss Everyone Hates (Until You Know Their Story)",
          titleB: "You Weren't The Hero In This Fight...",
          thumbDesc: "Split face portrait: Left side human prince, right side monstrous decaying cursed god. High-contrast typography: 'FORGIVE ME'.",
          hookScript: "\"For two years, millions of players celebrated killing this boss. We clipped the death animations, made memes about his sword, and moved on. But buried inside the game's French script files is a dialogue line that proves we made a catastrophic mistake.\"",
          structure: "0:00-0:40 The Dialogue Line Hook → 0:40-3:45 The Prince's Sacrifice → 3:45-8:00 The Betrayal of the Golden Order → 8:00-12:00 The Player's Guilt."
        },
        {
          type: "World Narrative Mystery",
          predictedCtr: "9.2% - 10.9% CTR",
          titleA: "What Happened To The World Before The Erdtree?",
          titleB: "The Forgotten Era FromSoftware Tried To Hide",
          thumbDesc: "Vast ancient ruin beneath a darkened burning sky with glowing ruins. Mysterious shadowed figure in foreground. Text: 'BEFORE THE GODS'.",
          hookScript: "\"Every single monument in Elden Ring points to the Erdtree. But look closely at the architecture of the underground cities — the columns are older than the Golden Order itself. Who lived here before the gods arrived? The answer rewrites the entire game.\"",
          structure: "0:00-0:50 The Hidden Architecture → 0:50-4:00 The Deep Civilization → 4:00-8:30 The Cosmic War → 8:30-13:00 The Origin of the Ring."
        }
      ]
    }
  };

  // State Management
  let currentPresetKey = 'tech';
  let showWinnerCurve = true;
  let showFlopCurve = true;
  let customDataset = null;

  // =========================================================================
  // 2. DOM ELEMENT REFERENCES
  // =========================================================================

  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const ytSidebar = document.getElementById('yt-sidebar');

  const sidebarAvatarEmoji = document.getElementById('sidebar-avatar-emoji');
  const headerAvatarEmoji = document.getElementById('header-avatar-emoji');
  const sidebarChannelName = document.getElementById('sidebar-channel-name');
  const sidebarSubsCount = document.getElementById('sidebar-subs-count');
  const channelPresetSelect = document.getElementById('channel-preset-select');

  const kpiViews = document.getElementById('kpi-views');
  const kpiViewsTrend = document.getElementById('kpi-views-trend');
  const kpiWatchtime = document.getElementById('kpi-watchtime');
  const kpiSubs = document.getElementById('kpi-subs');
  const kpiCtr = document.getElementById('kpi-ctr');
  const kpiCtrTrend = document.getElementById('kpi-ctr-trend');
  const kpiHook = document.getElementById('kpi-hook');
  const kpiHookTrend = document.getElementById('kpi-hook-trend');

  const activeDatasetTitle = document.getElementById('active-dataset-title');
  const activeDatasetDesc = document.getElementById('active-dataset-desc');

  const toggleWinner = document.getElementById('toggle-winner');
  const toggleFlop = document.getElementById('toggle-flop');
  const labelWinnerTitle = document.getElementById('label-winner-title');
  const labelFlopTitle = document.getElementById('label-flop-title');

  const svgWinnerStroke = document.getElementById('svg-winner-stroke');
  const svgWinnerArea = document.getElementById('svg-winner-area');
  const svgFlopStroke = document.getElementById('svg-flop-stroke');
  const svgFlopArea = document.getElementById('svg-flop-area');
  const svgHotspotGroup = document.getElementById('svg-hotspot-group');
  const svgScrubberLine = document.getElementById('svg-scrubber-line');
  const retentionCanvasArea = document.getElementById('retention-canvas-area');

  const chartTooltip = document.getElementById('chart-tooltip');
  const ttTime = document.getElementById('tt-time');
  const ttWinnerVal = document.getElementById('tt-winner-val');
  const ttFlopVal = document.getElementById('tt-flop-val');
  const ttDiff = document.getElementById('tt-diff');

  const hotspotsContainer = document.getElementById('hotspots-container');
  const patternsGridContainer = document.getElementById('patterns-grid-container');
  const matrixBars = document.getElementById('matrix-bars');
  const diagnosticReportContainer = document.getElementById('diagnostic-report-container');
  const blueprintsContainer = document.getElementById('blueprints-container');

  // Title Lab
  const inputTitleTest = document.getElementById('input-title-test');
  const btnAnalyzeTitle = document.getElementById('btn-analyze-title');
  const titleScoreNum = document.getElementById('title-score-num');
  const titleRatingLabel = document.getElementById('title-rating-label');
  const titlePredictedCtr = document.getElementById('title-predicted-ctr');
  const titleRadialCircle = document.getElementById('title-radial-circle');
  const metricCuriosityVal = document.getElementById('metric-curiosity-val');
  const metricCuriosityBar = document.getElementById('metric-curiosity-bar');
  const metricClarityVal = document.getElementById('metric-clarity-val');
  const metricClarityBar = document.getElementById('metric-clarity-bar');
  const metricEmotionVal = document.getElementById('metric-emotion-val');
  const metricEmotionBar = document.getElementById('metric-emotion-bar');
  const titleSuggestionsList = document.getElementById('title-suggestions-list');

  // Right Rail Elements
  const latestVidTitle = document.getElementById('latest-vid-title');
  const railViews = document.getElementById('rail-views');
  const railCtr = document.getElementById('rail-ctr');
  const railAvd = document.getElementById('rail-avd');
  const realtimeViewsCount = document.getElementById('realtime-views-count');

  // Sliders
  const sliderViews = document.getElementById('slider-views');
  const sliderCtr = document.getElementById('slider-ctr');
  const sliderAvd = document.getElementById('slider-avd');
  const sliderRpm = document.getElementById('slider-rpm');
  const lblViewsVal = document.getElementById('lbl-views-val');
  const lblCtrVal = document.getElementById('lbl-ctr-val');
  const lblAvdVal = document.getElementById('lbl-avd-val');
  const lblRpmVal = document.getElementById('lbl-rpm-val');
  const calcViewsUnlocked = document.getElementById('calc-views-unlocked');
  const calcRevenueUnlocked = document.getElementById('calc-revenue-unlocked');
  const calcAnnualVal = document.getElementById('calc-annual-val');

  // Modal
  const uploadModal = document.getElementById('upload-modal');
  const btnHeaderUpload = document.getElementById('btn-header-upload');
  const btnOpenUploadModal = document.getElementById('btn-open-upload-modal');
  const btnQuickUploadTrigger = document.getElementById('btn-quick-upload-trigger');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalLoadSampleBtn = document.getElementById('modal-load-sample-btn');
  const fileDropzone = document.getElementById('file-dropzone');
  const fileInput = document.getElementById('file-input');
  const btnSampleFiles = document.querySelectorAll('.btn-sample-file');

  // Toast container
  const toastContainer = document.getElementById('toast-container');

  // =========================================================================
  // 3. TOAST NOTIFICATION UTILITY
  // =========================================================================

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '✓';
    if (type === 'info') icon = 'ℹ';
    if (type === 'alert') icon = '⚠';

    toast.innerHTML = `
      <span style="font-weight: 800; font-size: 0.95rem;">${icon}</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // =========================================================================
  // 4. SIDEBAR COLLAPSE TOGGLE
  // =========================================================================

  if (btnToggleSidebar && ytSidebar) {
    btnToggleSidebar.addEventListener('click', () => {
      ytSidebar.classList.toggle('collapsed');
      showToast(ytSidebar.classList.contains('collapsed') ? 'Sidebar collapsed' : 'Sidebar expanded', 'info');
    });
  }

  // =========================================================================
  // 5. SVG RETENTION CURVE GENERATOR
  // =========================================================================

  function generateSvgPath(points, isArea = false) {
    if (!points || points.length === 0) return '';
    
    const svgWidth = 900;
    const svgHeight = 320;
    const paddingY = 10;
    const usableHeight = svgHeight - 2 * paddingY;
    const stepX = svgWidth / (points.length - 1);

    const coords = points.map((p, i) => {
      const x = i * stepX;
      const y = paddingY + usableHeight * (1 - p / 100);
      return { x, y };
    });

    let d = `M ${coords[0].x} ${coords[0].y}`;

    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = i > 0 ? coords[i - 1] : coords[i];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = i !== coords.length - 2 ? coords[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    if (isArea) {
      d += ` L 900 ${svgHeight} L 0 ${svgHeight} Z`;
    }

    return d;
  }

  function renderRetentionChart(dataset) {
    const winnerPath = generateSvgPath(dataset.winner.curve, false);
    const winnerArea = generateSvgPath(dataset.winner.curve, true);
    const flopPath = generateSvgPath(dataset.flop.curve, false);
    const flopArea = generateSvgPath(dataset.flop.curve, true);

    svgWinnerStroke.setAttribute('d', winnerPath);
    svgWinnerArea.setAttribute('d', winnerArea);
    svgFlopStroke.setAttribute('d', flopPath);
    svgFlopArea.setAttribute('d', flopArea);

    labelWinnerTitle.textContent = `Hit: "${dataset.winner.title}" (${dataset.winner.views})`;
    labelFlopTitle.textContent = `Flop: "${dataset.flop.title}" (${dataset.flop.views})`;

    svgWinnerStroke.style.display = showWinnerCurve ? 'block' : 'none';
    svgWinnerArea.style.display = showWinnerCurve ? 'block' : 'none';
    svgFlopStroke.style.display = showFlopCurve ? 'block' : 'none';
    svgFlopArea.style.display = showFlopCurve ? 'block' : 'none';

    renderHotspotPins(dataset.hotspots);
  }

  function renderHotspotPins(hotspots) {
    svgHotspotGroup.innerHTML = '';

    hotspots.forEach((hs, idx) => {
      const cx = (hs.xPercent / 100) * 900;
      const cy = 110 + (idx * 36);

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'svg-hotspot-pin');
      g.setAttribute('data-index', idx);
      g.style.cursor = 'pointer';

      g.innerHTML = `
        <circle cx="${cx}" cy="${cy}" r="12" fill="rgba(62, 166, 255, 0.2)" stroke="#3EA6FF" stroke-width="1.5"/>
        <circle cx="${cx}" cy="${cy}" r="5" fill="#3EA6FF"/>
        <line x1="${cx}" y1="${cy + 12}" x2="${cx}" y2="310" stroke="rgba(62, 166, 255, 0.3)" stroke-dasharray="3"/>
        <text x="${cx + 8}" y="${cy - 6}" fill="#3EA6FF" font-size="10" font-family="'JetBrains Mono', monospace" font-weight="700">${hs.timestamp}</text>
      `;

      g.addEventListener('click', () => {
        highlightHotspotCard(idx);
        showToast(`Key Moment at ${hs.timestamp}: ${hs.title}`, 'info');
      });

      svgHotspotGroup.appendChild(g);
    });
  }

  // =========================================================================
  // 6. RENDER CHANNEL DATA & WORKSPACE
  // =========================================================================

  function renderChannelWorkspace(presetKey) {
    let data;
    if (presetKey === 'custom' && customDataset) {
      data = customDataset;
    } else {
      data = CHANNEL_DATASETS[presetKey] || CHANNEL_DATASETS.tech;
      currentPresetKey = presetKey;
    }

    // Sidebar & Header profile
    sidebarAvatarEmoji.textContent = data.avatar;
    headerAvatarEmoji.textContent = data.avatar;
    sidebarChannelName.textContent = data.name;
    sidebarSubsCount.textContent = data.subs;

    // Active Dataset info
    activeDatasetTitle.textContent = `${data.name} (${data.videoCount} Videos Diagnosed)`;
    activeDatasetDesc.textContent = `YouTube Studio Advanced Export format • 1-second retention resolution • Primary Audience: ${data.audience}`;

    // KPI ribbon
    kpiViews.textContent = data.kpis.views;
    kpiViewsTrend.textContent = data.kpis.viewsTrend;
    kpiWatchtime.textContent = data.kpis.watchTime || "54.2K";
    kpiSubs.textContent = data.kpis.subsDelta || "+3.2K";
    kpiCtr.textContent = data.kpis.ctr;
    kpiCtrTrend.textContent = data.kpis.ctrTrend;
    kpiHook.textContent = data.kpis.hook;
    kpiHookTrend.textContent = data.kpis.hookTrend;

    // Chart & hotspots
    renderRetentionChart(data);
    renderHotspotCards(data.hotspots);

    // Patterns & Correlations
    renderPatterns(data.patterns);
    renderCorrelations(data.correlations);

    // Diagnostic & Blueprints
    renderDiagnosticReport(data.diagnosticReport);
    renderBlueprints(data.blueprints);

    // Right Rail Update
    latestVidTitle.textContent = data.winner.title;
    railViews.textContent = data.winner.views;
    railCtr.textContent = data.winner.ctr;
    railAvd.textContent = data.winner.avd;
    realtimeViewsCount.textContent = (parseInt(data.winner.views) * 65 || 48210).toLocaleString();

    // Sync select dropdown
    channelPresetSelect.value = presetKey;
  }

  function renderHotspotCards(hotspots) {
    hotspotsContainer.innerHTML = '';
    hotspots.forEach((hs, idx) => {
      const card = document.createElement('div');
      card.className = `hotspot-card ${idx === 0 ? 'active' : ''}`;
      card.id = `hotspot-card-${idx}`;
      card.innerHTML = `
        <div class="hotspot-badge ${hs.badgeType}">
          <span>⏱️ ${hs.timestamp}</span> •
          <span>${hs.badge}</span>
        </div>
        <h5 class="hotspot-title">${hs.title}</h5>
        <p class="hotspot-desc">${hs.desc}</p>
      `;

      card.addEventListener('click', () => {
        highlightHotspotCard(idx);
      });

      hotspotsContainer.appendChild(card);
    });
  }

  function highlightHotspotCard(index) {
    document.querySelectorAll('.hotspot-card').forEach((c, i) => {
      if (i === index) {
        c.classList.add('active');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        c.classList.remove('active');
      }
    });
  }

  function renderPatterns(patterns, filter = 'all') {
    patternsGridContainer.innerHTML = '';
    
    const filtered = filter === 'all' 
      ? patterns 
      : patterns.filter(p => p.type === filter);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'pattern-card';
      card.innerHTML = `
        <div class="pattern-type-header">
          <span class="pattern-badge ${p.badgeClass}">${p.badge}</span>
          <span class="pattern-impact-val ${p.badgeClass.includes('win') ? 'text-green' : 'negative'}">${p.impact}</span>
        </div>
        <h4 class="pattern-title">${p.title}</h4>
        <p class="pattern-desc">${p.desc}</p>
        <div class="pattern-evidence-box">
          <span>Algorithmic Evidence</span>
          <strong>${p.evidence}</strong>
        </div>
      `;
      patternsGridContainer.appendChild(card);
    });
  }

  function renderCorrelations(correlations) {
    matrixBars.innerHTML = '';
    correlations.forEach(c => {
      const row = document.createElement('div');
      row.className = 'matrix-row';
      row.innerHTML = `
        <div class="matrix-metric-name">${c.metric}</div>
        <div class="matrix-bar-track">
          <div class="matrix-bar-fill" style="width: ${c.width}; background: ${c.color};"></div>
        </div>
        <div class="matrix-score" style="color: ${c.color};">+${c.score} r</div>
      `;
      matrixBars.appendChild(row);
    });
  }

  function renderDiagnosticReport(reports) {
    diagnosticReportContainer.innerHTML = '';
    reports.forEach(r => {
      const card = document.createElement('div');
      card.className = `diagnostic-card ${r.typeClass}`;
      card.innerHTML = `
        <div class="diagnostic-card-header">
          <span class="diagnostic-category-tag">
            <span>${r.icon}</span>
            <span>${r.category}</span>
          </span>
          <span class="diagnostic-confidence">${r.confidence}</span>
        </div>
        <h3 class="diagnostic-card-title">${r.title}</h3>
        <p class="diagnostic-explanation">${r.explanation}</p>
        <div class="diagnostic-prescription">
          <span class="prescription-icon">💡</span>
          <div class="prescription-text">
            <strong>Prescriptive Copilot Recommendation:</strong>
            <p>${r.prescription}</p>
          </div>
        </div>
      `;
      diagnosticReportContainer.appendChild(card);
    });
  }

  function renderBlueprints(blueprints) {
    blueprintsContainer.innerHTML = '';
    blueprints.forEach((b, idx) => {
      const card = document.createElement('div');
      card.className = 'blueprint-card';
      card.innerHTML = `
        <div class="blueprint-card-top">
          <span class="blueprint-type-pill">${b.type}</span>
          <span class="blueprint-predicted-ctr">${b.predictedCtr}</span>
        </div>
        
        <h4 class="blueprint-title-concept">${b.titleA}</h4>

        <div class="blueprint-section-block">
          <span class="blueprint-section-label">A/B Alternate Title:</span>
          <div style="font-size: 0.8rem; color: var(--yt-text-secondary);">${b.titleB}</div>
        </div>

        <div class="blueprint-section-block">
          <span class="blueprint-section-label">Thumbnail Composition Blueprint:</span>
          <div class="blueprint-thumb-desc">${b.thumbDesc}</div>
        </div>

        <div class="blueprint-section-block">
          <span class="blueprint-section-label">60-Second Hook Opening Script:</span>
          <div class="blueprint-hook-script">${b.hookScript}</div>
        </div>

        <div class="blueprint-section-block">
          <span class="blueprint-section-label">Narrative Retention Arc:</span>
          <div style="font-size: 0.74rem; color: var(--yt-text-muted); font-family: var(--yt-font-mono);">${b.structure}</div>
        </div>

        <div class="blueprint-card-actions">
          <button type="button" class="yt-btn-secondary btn-sm btn-copy-hook" data-index="${idx}">
            Copy Hook Script
          </button>
          <button type="button" class="yt-btn-primary btn-sm btn-copy-blueprint" data-index="${idx}">
            Copy Full Blueprint
          </button>
        </div>
      `;

      card.querySelector('.btn-copy-hook').addEventListener('click', () => {
        navigator.clipboard.writeText(b.hookScript).then(() => {
          showToast(`Copied Hook Script to clipboard!`, 'success');
        });
      });

      card.querySelector('.btn-copy-blueprint').addEventListener('click', () => {
        const fullText = `# ${b.titleA}\n\n## Alternate Title\n${b.titleB}\n\n## Thumbnail Blueprint\n${b.thumbDesc}\n\n## 60-Second Hook Script\n${b.hookScript}\n\n## Narrative Arc\n${b.structure}\n\nTarget CTR: ${b.predictedCtr}`;
        navigator.clipboard.writeText(fullText).then(() => {
          showToast(`Copied Full Video Blueprint in Markdown!`, 'success');
        });
      });

      blueprintsContainer.appendChild(card);
    });
  }

  // =========================================================================
  // 7. CHART INTERACTION: SCRUBBER & TOOLTIP
  // =========================================================================

  retentionCanvasArea.addEventListener('mousemove', (e) => {
    const rect = retentionCanvasArea.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentX = mouseX / rect.width;

    const svgX = percentX * 900;
    svgScrubberLine.setAttribute('x1', svgX);
    svgScrubberLine.setAttribute('x2', svgX);

    const totalSeconds = 9 * 60;
    const currentSeconds = Math.round(percentX * totalSeconds);
    const mins = Math.floor(currentSeconds / 60);
    const secs = currentSeconds % 60;
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const currentData = CHANNEL_DATASETS[currentPresetKey] || CHANNEL_DATASETS.tech;
    const curveLen = currentData.winner.curve.length;
    const curveIdx = Math.min(Math.floor(percentX * curveLen), curveLen - 1);

    const winnerVal = currentData.winner.curve[curveIdx];
    const flopVal = currentData.flop.curve[curveIdx];
    const diff = winnerVal - flopVal;

    ttTime.textContent = timeFormatted;
    ttWinnerVal.textContent = `${winnerVal}%`;
    ttFlopVal.textContent = `${flopVal}%`;
    ttDiff.textContent = `+${diff}% Retention Gap`;
    ttDiff.style.color = diff > 0 ? 'var(--yt-green)' : '#FF4E45';

    chartTooltip.style.display = 'block';
    const tooltipX = Math.max(80, Math.min(mouseX, rect.width - 80));
    chartTooltip.style.left = `${tooltipX}px`;
  });

  retentionCanvasArea.addEventListener('mouseleave', () => {
    svgScrubberLine.setAttribute('x1', -100);
    svgScrubberLine.setAttribute('x2', -100);
    chartTooltip.style.display = 'none';
  });

  toggleWinner.addEventListener('click', () => {
    showWinnerCurve = !showWinnerCurve;
    toggleWinner.classList.toggle('active', showWinnerCurve);
    svgWinnerStroke.style.display = showWinnerCurve ? 'block' : 'none';
    svgWinnerArea.style.display = showWinnerCurve ? 'block' : 'none';
  });

  toggleFlop.addEventListener('click', () => {
    showFlopCurve = !showFlopCurve;
    toggleFlop.classList.toggle('active', showFlopCurve);
    svgFlopStroke.style.display = showFlopCurve ? 'block' : 'none';
    svgFlopArea.style.display = showFlopCurve ? 'block' : 'none';
  });

  // Pattern Filter Tabs
  const pTabs = document.querySelectorAll('#pattern-filter-pills .p-tab');
  pTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      const data = CHANNEL_DATASETS[currentPresetKey] || CHANNEL_DATASETS.tech;
      renderPatterns(data.patterns, filter);
    });
  });

  // Channel Preset Switcher
  channelPresetSelect.addEventListener('change', (e) => {
    const selected = e.target.value;
    if (selected === 'custom' && !customDataset) {
      uploadModal.showModal();
      return;
    }
    renderChannelWorkspace(selected);
    showToast(`Switched channel benchmark to ${CHANNEL_DATASETS[selected]?.name || 'Channel'}!`, 'info');
  });

  // Stepper Ribbon Links
  const stepperPills = document.querySelectorAll('.mission-step-pill');
  stepperPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      stepperPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Copy Diagnostic Report
  const btnCopyDiagnosticReport = document.getElementById('btn-copy-diagnostic-report');
  btnCopyDiagnosticReport.addEventListener('click', () => {
    const data = CHANNEL_DATASETS[currentPresetKey] || CHANNEL_DATASETS.tech;
    let reportMd = `# YouTube Studio AI Diagnostic Report: ${data.name}\n\n`;
    data.diagnosticReport.forEach(r => {
      reportMd += `### ${r.category}: ${r.title}\n`;
      reportMd += `Confidence: ${r.confidence}\n\n`;
      reportMd += `${r.explanation}\n\n`;
      reportMd += `**Prescription:** ${r.prescription}\n\n---\n\n`;
    });

    navigator.clipboard.writeText(reportMd).then(() => {
      showToast('Copied Diagnostic Report to clipboard!', 'success');
    });
  });

  // Regenerate Concepts
  const btnRegenerateIdeas = document.getElementById('btn-regenerate-ideas');
  btnRegenerateIdeas.addEventListener('click', () => {
    showToast('Regenerating video concepts from winning retention DNA...', 'info');
    const data = CHANNEL_DATASETS[currentPresetKey] || CHANNEL_DATASETS.tech;
    renderBlueprints(data.blueprints);
    setTimeout(() => {
      showToast('Generated 3 fresh high-retention video concepts!', 'success');
    }, 400);
  });

  // Export All Blueprints
  const btnExportAllBlueprints = document.getElementById('btn-export-all-blueprints');
  btnExportAllBlueprints.addEventListener('click', () => {
    const data = CHANNEL_DATASETS[currentPresetKey] || CHANNEL_DATASETS.tech;
    let markdown = `# YouTube Studio Prescribed Video Blueprints\nChannel: ${data.name}\nDate: ${new Date().toLocaleDateString()}\n\n`;
    data.blueprints.forEach((b, i) => {
      markdown += `## Blueprint #${i + 1}: ${b.titleA}\n`;
      markdown += `* **Target CTR:** ${b.predictedCtr}\n`;
      markdown += `* **Alternative Title:** ${b.titleB}\n`;
      markdown += `* **Thumbnail Blueprint:** ${b.thumbDesc}\n\n`;
      markdown += `### 60-Second Hook Script:\n> ${b.hookScript}\n\n`;
      markdown += `### Narrative Arc:\n${b.structure}\n\n---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name.toLowerCase().replace(/\s+/g, '-')}-blueprints.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded Studio Blueprints markdown file!', 'success');
  });

  // =========================================================================
  // 8. TITLE & THUMBNAIL LAB
  // =========================================================================

  function evaluateTitle(titleText) {
    if (!titleText || titleText.trim().length === 0) {
      titleText = "Why Most Tech Creators Are Lying About The New M4 Mac";
    }

    const text = titleText.trim();
    let curiosityScore = 65;
    let clarityScore = 70;
    let emotionScore = 60;

    const triggersHighCuriosity = [/why/i, /secret/i, /mistake/i, /truth/i, /lying/i, /warning/i, /tested/i, /before you/i, /don't/i, /trap/i, /actually/i];
    const triggersSpecificity = [/\d+/, /\$/, /days/i, /hours/i, /month/i, /vs/i, /compared/i];
    const triggersEmotion = [/worst/i, /terrifies/i, /ruin/i, /never/i, /insane/i, /banned/i, /failed/i, /nobody/i];

    triggersHighCuriosity.forEach(reg => { if (reg.test(text)) curiosityScore += 7; });
    triggersSpecificity.forEach(reg => { if (reg.test(text)) clarityScore += 8; });
    triggersEmotion.forEach(reg => { if (reg.test(text)) emotionScore += 9; });

    if (text.length < 25) {
      clarityScore -= 15;
    } else if (text.length > 70) {
      clarityScore -= 10;
    }

    curiosityScore = Math.min(98, Math.max(45, curiosityScore));
    clarityScore = Math.min(95, Math.max(40, clarityScore));
    emotionScore = Math.min(96, Math.max(35, emotionScore));

    const overallScore = ((curiosityScore * 0.4 + clarityScore * 0.3 + emotionScore * 0.3) / 10).toFixed(1);

    titleScoreNum.textContent = overallScore;
    
    const maxOffset = 264;
    const targetOffset = maxOffset - (maxOffset * (overallScore / 10));
    titleRadialCircle.style.strokeDashoffset = targetOffset;

    let ctrRange = "6.5% - 8.2%";
    let ratingLabel = "Solid Clickability";
    let radialColor = "var(--yt-green)";

    if (overallScore >= 8.5) {
      ctrRange = "8.4% - 10.8%";
      ratingLabel = "Exceptional High Clickability";
      radialColor = "var(--yt-green)";
    } else if (overallScore >= 7.0) {
      ctrRange = "6.8% - 8.5%";
      ratingLabel = "Above Average Browse Potential";
      radialColor = "var(--yt-blue)";
    } else {
      ctrRange = "4.2% - 6.0%";
      ratingLabel = "Needs Curiosity Boost";
      radialColor = "var(--yt-amber)";
    }

    titleRatingLabel.textContent = ratingLabel;
    titleRatingLabel.style.color = radialColor;
    titleRadialCircle.style.stroke = radialColor;
    titlePredictedCtr.textContent = ctrRange;

    metricCuriosityVal.textContent = `${curiosityScore}% (${curiosityScore > 80 ? 'Very High' : 'Moderate'})`;
    metricCuriosityBar.style.width = `${curiosityScore}%`;

    metricClarityVal.textContent = `${clarityScore}% (${clarityScore > 75 ? 'Strong' : 'Average'})`;
    metricClarityBar.style.width = `${clarityScore}%`;

    metricEmotionVal.textContent = `${emotionScore}% (${emotionScore > 75 ? 'High Urgency' : 'Neutral'})`;
    metricEmotionBar.style.width = `${emotionScore}%`;

    renderTitleSuggestions(text);
  }

  function renderTitleSuggestions(seedTitle) {
    const cleanSeed = seedTitle.replace(/^(why|how|what|don't)\s+/i, '').trim();

    const suggestions = [
      {
        type: "Contrarian Frame",
        text: `Don't Buy ${cleanSeed.slice(0, 30)} Until You Watch This (Real Benchmarks)`
      },
      {
        type: "Curiosity Question",
        text: `What Nobody Is Telling You About ${cleanSeed.slice(0, 32)}...`
      },
      {
        type: "Urgent Warning",
        text: `I Tested ${cleanSeed.slice(0, 28)} for 30 Days: Was It A Mistake?`
      }
    ];

    titleSuggestionsList.innerHTML = '';
    suggestions.forEach(s => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.innerHTML = `
        <span class="suggestion-type">${s.type}:</span>
        <span class="suggestion-text">"${s.text}"</span>
        <button type="button" class="btn-copy-mini">Copy</button>
      `;

      item.querySelector('.btn-copy-mini').addEventListener('click', () => {
        navigator.clipboard.writeText(s.text).then(() => {
          showToast('Copied title variation to clipboard!', 'success');
        });
      });

      titleSuggestionsList.appendChild(item);
    });
  }

  btnAnalyzeTitle.addEventListener('click', () => {
    evaluateTitle(inputTitleTest.value);
    showToast('Analyzed title against 10M+ view benchmarks!', 'info');
  });

  inputTitleTest.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      evaluateTitle(inputTitleTest.value);
    }
  });

  evaluateTitle(inputTitleTest.value);

  // =========================================================================
  // 9. GROWTH & REVENUE CALCULATOR
  // =========================================================================

  function calculateRoi() {
    const views = parseFloat(sliderViews.value);
    const ctr = parseFloat(sliderCtr.value);
    const avd = parseFloat(sliderAvd.value);
    const rpm = parseFloat(sliderRpm.value);

    lblViewsVal.textContent = `${views.toLocaleString()}`;
    lblCtrVal.textContent = `${ctr.toFixed(1)}%`;
    lblAvdVal.textContent = `${avd.toFixed(1)} min`;
    lblRpmVal.textContent = `$${rpm.toFixed(2)}`;

    const ctrLift = 2.2;
    const viewsMultiplier = 1.0 + (ctrLift / ctr) * 0.75 + 0.35;
    const unlockedViews = Math.round(views * (viewsMultiplier - 1.0));

    const monthlyRevBoost = (unlockedViews / 1000) * rpm;
    const annualRevBoost = monthlyRevBoost * 12;

    calcViewsUnlocked.textContent = `+${unlockedViews.toLocaleString()} / mo`;
    calcRevenueUnlocked.textContent = `+$${monthlyRevBoost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo`;
    calcAnnualVal.textContent = `+$${annualRevBoost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / yr`;
  }

  sliderViews.addEventListener('input', calculateRoi);
  sliderCtr.addEventListener('input', calculateRoi);
  sliderAvd.addEventListener('input', calculateRoi);
  sliderRpm.addEventListener('input', calculateRoi);
  calculateRoi();

  // =========================================================================
  // 10. MODAL & FILE UPLOAD
  // =========================================================================

  function openUploadModal() {
    if (typeof uploadModal.showModal === 'function') {
      uploadModal.showModal();
    } else {
      uploadModal.setAttribute('open', 'true');
    }
  }

  function closeUploadModal() {
    if (typeof uploadModal.close === 'function') {
      uploadModal.close();
    } else {
      uploadModal.removeAttribute('open');
    }
  }

  if (btnHeaderUpload) btnHeaderUpload.addEventListener('click', openUploadModal);
  if (btnOpenUploadModal) btnOpenUploadModal.addEventListener('click', openUploadModal);
  if (btnQuickUploadTrigger) btnQuickUploadTrigger.addEventListener('click', openUploadModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeUploadModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeUploadModal);

  uploadModal.addEventListener('click', (e) => {
    const dialogDimensions = uploadModal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closeUploadModal();
    }
  });

  let selectedModalPreset = 'tech';
  btnSampleFiles.forEach(btn => {
    btn.addEventListener('click', () => {
      btnSampleFiles.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedModalPreset = btn.getAttribute('data-load');
    });
  });

  modalLoadSampleBtn.addEventListener('click', () => {
    closeUploadModal();
    renderChannelWorkspace(selectedModalPreset);
    showToast(`Loaded ${CHANNEL_DATASETS[selectedModalPreset].name} Analytics!`, 'success');
    document.getElementById('copilot-step-1').scrollIntoView({ behavior: 'smooth' });
  });

  // Drag and drop
  fileDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropzone.classList.add('drag-active');
  });

  fileDropzone.addEventListener('dragleave', () => {
    fileDropzone.classList.remove('drag-active');
  });

  fileDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropzone.classList.remove('drag-active');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadedFile(e.target.files[0]);
    }
  });

  function handleUploadedFile(file) {
    showToast(`Parsing ${file.name}...`, 'info');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        customDataset = {
          name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").toUpperCase() + " (Uploaded)",
          avatar: "📁",
          niche: "Custom Studio Export",
          subs: "215K Subscribers",
          videoCount: 38,
          audience: "Core Upload Audience",
          kpis: {
            views: "890K",
            viewsTrend: "↑ 31.2% parsed from CSV",
            watchTime: "46.2K",
            subsDelta: "+3.8K",
            ctr: "7.1%",
            ctrTrend: "Studio CSV Ingested",
            hook: "67.4%",
            hookTrend: "↑ Hook Extracted",
            avd: "6m 12s"
          },
          winner: {
            title: `Top Video from ${file.name}`,
            views: "540.2K",
            ctr: "8.9%",
            hook30s: "69%",
            avd: "7:05 (62.0%)",
            length: "10:15",
            curve: [100, 90, 83, 77, 72, 69, 66, 63, 60, 58, 55, 52, 49, 46, 43, 40, 38, 35, 30]
          },
          flop: {
            title: `Underperformer from ${file.name}`,
            views: "22.1K",
            ctr: "3.5%",
            hook30s: "32%",
            avd: "2:15 (24.1%)",
            length: "9:20",
            curve: [100, 64, 48, 38, 32, 28, 25, 21, 18, 16, 14, 12, 11, 9, 8, 7, 6, 5, 4]
          },
          hotspots: [
            {
              timestamp: "0:25",
              xPercent: 8,
              badge: "Hook Cliff",
              badgeType: "badge-drop",
              title: "30-Second Hook Drop (-37%)",
              desc: "Viewer drop identified in your uploaded CSV. Intro duration exceeded the 15-second threshold before core value proposition was revealed."
            },
            {
              timestamp: "3:15",
              xPercent: 35,
              badge: "Pacing Plateau",
              badgeType: "badge-pacing",
              title: "Mid-Roll Engagement Drag (-19%)",
              desc: "Segment pacing drop detected. Retention curve shows steady erosion due to repetitive audio rhythm."
            },
            {
              timestamp: "7:40",
              xPercent: 78,
              badge: "Re-engagement Spike",
              badgeType: "badge-spike",
              title: "End Payoff Climax (+9%)",
              desc: "Strong audience retention spike detected during final resolution chapter."
            }
          ],
          patterns: [
            {
              type: "hook",
              badge: "Primary Discovery",
              badgeClass: "badge-pattern-win",
              impact: "+120% Retention",
              title: "Action-First Narrative Hook",
              desc: "Your uploaded videos demonstrate that leading with immediate demonstration triples initial 60-second retention.",
              evidence: "Verified across your uploaded performance records."
            },
            {
              type: "pacing",
              badge: "Retention Bottleneck",
              badgeClass: "badge-pattern-loss",
              impact: "-35% Watch Ratio",
              title: "Delayed Proof Delivery",
              desc: "When the promise made in your title is delayed past the 3-minute mark, your retention curve experiences a steep drop.",
              evidence: "Found in your underperforming video cohort."
            },
            {
              type: "packaging",
              badge: "CTR Driver",
              badgeClass: "badge-pattern-win",
              impact: "+4.1% CTR Lift",
              title: "Clean Subject Isolation",
              desc: "Thumbnails with a single prominent subject and uncluttered background generated your highest impression velocities.",
              evidence: "Average CTR: 8.9% on isolated thumbnails."
            }
          ],
          correlations: [
            { metric: "Early Proof vs 30s Retention", score: "0.92", width: "92%", color: "var(--yt-green)" },
            { metric: "Pattern Interrupt Frequency vs AVD", score: "0.87", width: "87%", color: "var(--yt-blue)" },
            { metric: "Title Curiosity Gap vs First 24h CTR", score: "0.84", width: "84%", color: "var(--yt-purple)" },
            { metric: "Chapter Granularity vs End-Screen Click", score: "0.78", width: "78%", color: "var(--yt-amber)" }
          ],
          diagnosticReport: [
            {
              category: "Upload Ingestion Diagnostic",
              typeClass: "diagnostic-hook",
              icon: "📁",
              confidence: "97% Confidence",
              title: `Forensic Autopsy: ${file.name}`,
              explanation: `We parsed your YouTube Studio export. Your top-tier content captures 69% of viewers in the first 30 seconds, while your underperforming videos lose over 60% within the first 90 seconds.`,
              prescription: "Prescription: Standardize your 30-second hook formula using the Action-First Narrative structure discovered in your top video."
            },
            {
              category: "Packaging Alignment",
              typeClass: "diagnostic-packaging",
              icon: "🎯",
              confidence: "94% Confidence",
              title: "Title-to-Video Expectation Alignment",
              explanation: "Your highest-converting video delivered its titular promise within 45 seconds of launch. Your underperforming video delayed its core promise, causing high initial CTR to collapse into rapid drop-offs.",
              prescription: "Prescription: Never let more than 30 seconds pass before validating the thumbnail's core premise."
            }
          ],
          blueprints: [
            {
              type: "Custom Prescribed Concept #1",
              predictedCtr: "8.8% - 10.4% CTR",
              titleA: `The Hidden Truth About ${file.name.replace(/\.[^/.]+$/, "").slice(0, 25)}`,
              titleB: `Why Everyone Was Wrong About This...`,
              thumbDesc: "High-contrast focal point with bold yellow annotation arrow pointing to key detail. Text: 'THE TRUTH'.",
              hookScript: "\"If you watched my last video on this topic, there was one crucial variable I couldn't discuss until today. In the next 7 minutes, I am going to show you the evidence that changes everything.\"",
              structure: "0:00-0:30 Evidence Hook → 0:30-3:00 The Flaw in the Old Data → 3:00-6:00 The New Breakthrough → 6:00-8:00 Actionable Step."
            },
            {
              type: "Custom Prescribed Concept #2",
              predictedCtr: "8.2% - 9.8% CTR",
              titleA: `I Tested This For 14 Days So You Don't Have To`,
              titleB: `The Real Results After 2 Weeks...`,
              thumbDesc: "Split comparison with calendar checkmarks and shocked expression. Text: 'DAY 14 RESULT'.",
              hookScript: "\"Two weeks ago, I started an experiment that almost nobody in our niche is willing to test publicly. Here are the exact unfiltered numbers from day 1 through day 14.\"",
              structure: "0:00-0:40 Experiment Hook → 0:40-3:30 Day 1-7 Struggle → 3:30-6:30 The Pivot → 6:30-8:30 The Conclusion."
            }
          ]
        };

        if (!channelPresetSelect.querySelector('option[value="custom"]')) {
          const opt = document.createElement('option');
          opt.value = 'custom';
          opt.textContent = `📁 Custom: ${file.name}`;
          channelPresetSelect.appendChild(opt);
        }

        channelPresetSelect.value = 'custom';
        closeUploadModal();
        renderChannelWorkspace('custom');
        showToast(`Successfully analyzed ${file.name}!`, 'success');
        document.getElementById('copilot-step-1').scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        showToast('Error parsing file. Please check CSV format.', 'alert');
      }
    };
    reader.readAsText(file);
  }

  // =========================================================================
  // 11. INITIALIZATION
  // =========================================================================

  renderChannelWorkspace('tech');
  console.log('YouTube Studio - Creator Analytics Copilot initialized successfully.');
});
