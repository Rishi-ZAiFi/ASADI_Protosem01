export interface ToolConfig {
  id: string
  name: string
  category: 'content-creation' | 'audience-research' | 'production' | 'advanced-ai'
  description: string
  isMultiStep?: boolean
  steps?: string[]
}

export const TOOLS_CONFIG: ToolConfig[] = [
  {
    id: 'content-idea-generator',
    name: 'Content Idea Generator',
    category: 'content-creation',
    description: 'Generate high-virality, structured content ideas tailored to your niche, audience, and platform.',
  },
  {
    id: 'content-repurposer',
    name: 'Content Repurposer',
    category: 'content-creation',
    description: 'Transform 1 piece of content into multiple tailored formats across LinkedIn, X, Reels, and Newsletters.',
  },
  {
    id: 'hook-generator',
    name: 'Hook Generator',
    category: 'content-creation',
    description: 'Generate scroll-stopping hooks tested across psychology triggers to maximize 3-second retention.',
  },
  {
    id: 'daily-content-planner',
    name: 'Daily Content Planner',
    category: 'content-creation',
    description: 'Automate your 7-day posting blueprint with structured themes, formats, and optimal release times.',
  },
  {
    id: 'reel-script-builder',
    name: 'Reel Script Builder',
    category: 'content-creation',
    description: 'Construct viral short-form scripts with second-by-second pacing, audio suggestions, and visual cues.',
  },
  {
    id: 'clip-finder',
    name: 'Clip Finder',
    category: 'production',
    description: 'Scan transcripts or long video topics to pinpoint viral micro-moments with virality scores.',
  },
  {
    id: 'thumbnail-ideator',
    name: 'Thumbnail Ideator',
    category: 'content-creation',
    description: 'High-CTR YouTube thumbnail concepts with visual composition, text overlays, and contrast guidance.',
  },
  {
    id: 'caption-assistant',
    name: 'Caption Assistant',
    category: 'content-creation',
    description: 'Craft high-converting captions with opening punchlines, formatting, and high-relevance hashtags.',
  },
  {
    id: 'cta-generator',
    name: 'CTA Generator',
    category: 'content-creation',
    description: 'Engineered calls-to-action designed to trigger comments, shares, saves, and bio link clicks.',
  },
  {
    id: 'comment-analyzer',
    name: 'Comment Analyzer',
    category: 'audience-research',
    description: 'Analyze audience comments for sentiment, underlying pain points, objections, and hidden content goldmines.',
  },
  {
    id: 'comment-to-content',
    name: 'Comment-to-Content',
    category: 'audience-research',
    description: 'Convert real audience questions and spicy comments into viral reply videos and educational carousels.',
  },
  {
    id: 'creator-research-assistant',
    name: 'Creator Research Assistant',
    category: 'audience-research',
    description: 'Deep dive into niche trends, competitor content gaps, and data-backed viral angles.',
  },
  {
    id: 'voice-replicator',
    name: 'Voice Replicator',
    category: 'audience-research',
    description: 'Decode your personal writing style, tone nuances, and cadence to generate authentic on-brand content.',
  },
  {
    id: 'podcast-assistant',
    name: 'Podcast Assistant',
    category: 'production',
    description: 'Produce complete episode guides: provocative interview questions, intro hooks, and show notes.',
  },
  {
    id: 'creator-workspace',
    name: 'Creator Workspace',
    category: 'production',
    description: 'Centralized ideation studio to convert raw notes into structured creative production briefs.',
  },
  {
    id: 'content-recycler',
    name: 'Content Recycler',
    category: 'production',
    description: 'Revitalize past top-performing winners with fresh 2026 angles, contrarian framing, and updated data.',
  },
  {
    id: 'brand-pitch-builder',
    name: 'Brand Pitch Builder',
    category: 'production',
    description: 'Generate high-response brand sponsorship pitches, deliverables packaging, and rate card guidelines.',
  },
  {
    id: 'ai-content-director',
    name: 'AI Content Director',
    category: 'advanced-ai',
    description: 'Multi-stage end-to-end creative direction: Research → Angles → Script → Visuals → Shot List → Publishing Copy.',
    isMultiStep: true,
    steps: ['Research', 'Angles', 'Script', 'Visuals', 'Shot List', 'Publishing Copy'],
  },
  {
    id: 'creator-second-brain',
    name: 'Creator Second Brain',
    category: 'audience-research',
    description: 'Synthesize research, literature notes, and loose thoughts into interconnected content assets.',
  },
  {
    id: 'ai-screenplay-workspace',
    name: 'AI Screenplay Workspace',
    category: 'production',
    description: 'Hollywood-standard screenplay and narrative scene generator with dialogue, action, and sluglines.',
  },
  {
    id: 'autonomous-content-pipeline',
    name: 'Autonomous Content Pipeline',
    category: 'advanced-ai',
    description: 'One seed idea automatically spawned into YouTube Script → 3 Reels → LinkedIn → X Thread → Captions → Calendar.',
    isMultiStep: true,
    steps: ['Idea', 'Research', 'YouTube Script', '3 Reels', 'LinkedIn', 'X Thread', 'Captions', 'Calendar'],
  },
  {
    id: 'ai-creative-producer',
    name: 'AI Creative Producer',
    category: 'advanced-ai',
    description: 'Strategic production planner: Audience → Content Pillars → 30-Day Strategy → Today’s Content → Performance Insights.',
    isMultiStep: true,
    steps: ['Audience', 'Content Pillars', '30-Day Strategy', "Today's Content", 'Performance Insights'],
  },
]

export function buildPromptForTool(toolId: string, inputs: Record<string, any>): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are CreatorOS, the world's most elite AI Operating System for digital creators, filmmakers, scriptwriters, and media strategists.
You produce top-tier, non-generic, high-converting content with punchy hooks, modern psychology, and actionable creative breakdowns.
Always return structured, beautifully formatted content with high editorial taste. When JSON is requested, strictly return valid JSON without markdown wrapping.`

  switch (toolId) {
    case 'content-idea-generator': {
      const topic = inputs.topic || 'AI & Digital Productivity'
      const audience = inputs.audience || 'Entrepreneurs and creators'
      const niche = inputs.niche || 'Technology'
      const platform = inputs.platform || 'YouTube & Instagram'
      const goal = inputs.goal || 'Viral reach & follower growth'
      const count = Number(inputs.count) || 5

      const userPrompt = `Generate exactly ${count} distinct, high-impact content ideas for:
Topic: "${topic}"
Target Audience: "${audience}"
Niche: "${niche}"
Platform: "${platform}"
Goal: "${goal}"

You MUST respond with valid JSON in this exact structure:
{
  "ideas": [
    {
      "title": "Compelling Title",
      "angle": "Unique perspective or contrarian framing",
      "format": "e.g. Talking head with b-roll, Screen demo, Carousel, 3-act story",
      "hook": "Exact first 3 seconds verbal or on-screen hook",
      "description": "2-3 sentences explaining the core value, retention loop, and payoff"
    }
  ]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'content-repurposer': {
      const source = inputs.sourceContent || ''
      const targetPlatforms = inputs.targetPlatforms || 'LinkedIn, X (Twitter), Instagram Reels, Email Newsletter'
      const tone = inputs.tone || 'Authoritative yet conversational'

      const userPrompt = `Repurpose the following core content into 4 high-performing formats:
Source Content:
"""${source}"""

Target Platforms: ${targetPlatforms}
Tone: ${tone}

Format your output with clear markdown headings:
### 1. LinkedIn Authority Post (Hook, white space, key insights, discussion CTA)
### 2. X (Twitter) 5-Tweet Thread (Scroll-stopping tweet 1, value tweets 2-4, closing takeaway + retweet prompt)
### 3. 30-Second Short-Form Script (Visual cues, audio suggestion, exact spoken dialogue)
### 4. High-Open-Rate Newsletter Blurb (Subject line, personal intro, bulleted essence, one action item)`
      return { systemPrompt, userPrompt }
    }

    case 'hook-generator': {
      const topic = inputs.topic || ''
      const trigger = inputs.trigger || 'Curiosity & Fear of Missing Out'
      const platform = inputs.platform || 'Shorts / Reels / TikTok'
      const audience = inputs.audience || 'Creators & builders'

      const userPrompt = `Generate 5 viral hooks for:
Topic: "${topic}"
Emotional Trigger: "${trigger}"
Platform: "${platform}"
Target Audience: "${audience}"

Provide 5 hook types with explanation of why they work:
1. **The Contrarian Hook** (Breaks conventional wisdom)
2. **The Curiosity Gap Hook** (Creates an open psychological loop)
3. **The Data / Shocking Stat Hook** (Uses specific numbers to anchor credibility)
4. **The Personal Story Hook** ("I spent 30 days doing X so you don't have to...")
5. **The High-Stakes Question Hook** (Forces an internal "Yes" or self-assessment)

Include visual/text-on-screen suggestions for each.`
      return { systemPrompt, userPrompt }
    }

    case 'daily-content-planner': {
      const niche = inputs.niche || 'Digital Marketing'
      const frequency = inputs.frequency || 'Daily (7 days)'
      const platform = inputs.platform || 'Instagram & LinkedIn'
      const goal = inputs.goal || 'Authority & lead generation'

      const userPrompt = `Create a complete 7-Day Content Masterplan for:
Niche: ${niche}
Frequency: ${frequency}
Primary Platform: ${platform}
Goal: ${goal}

Format as a structured day-by-day table and execution guide:
For each day (Monday through Sunday):
- Day & Pillar (e.g. Educational, Proof/Case Study, Contrarian, Relatable/Behind the scenes, Hard CTA)
- Working Title & Hook
- Format & Visual Style
- Core Takeaway
- Recommended Posting Window (EST/UTC)`
      return { systemPrompt, userPrompt }
    }

    case 'reel-script-builder': {
      const concept = inputs.concept || ''
      const duration = inputs.duration || '30s'
      const cta = inputs.cta || 'Save this for later'
      const tone = inputs.tone || 'Fast-paced, energetic, highly informative'

      const userPrompt = `Write a viral short-form video script (${duration}) for:
Concept: "${concept}"
Tone: "${tone}"
Goal CTA: "${cta}"

Break it down by second timestamps:
1. [00:00 - 00:03] THE HOOK (Verbal spoken line + On-screen text + Physical movement/jump cut)
2. [00:03 - 00:12] THE AGITATION / CONTEXT (Why conventional methods fail)
3. [00:12 - 00:24] THE SECRET / SOLUTION (The 1-2 rapid tactical steps with sound effect triggers)
4. [00:24 - 00:30] RETENTION LOOP & CTA (Seamless ending that loops back or drives comment/save)
Include B-roll directives and music mood suggestion.`
      return { systemPrompt, userPrompt }
    }

    case 'clip-finder': {
      const transcript = inputs.transcript || ''
      const targetLength = inputs.targetLength || '30-60 seconds'
      const platform = inputs.platform || 'TikTok & Reels'

      const userPrompt = `Scan this video transcript/outline and identify the TOP 3 most viral standalone clips:
Target Length: ${targetLength}
Platform: ${platform}

Transcript/Content:
"""${transcript}"""

For each of the 3 clips, output:
- **Clip Title**: Punchy YouTube Shorts/Reels title
- **Estimated Timestamp / Section**: Where it begins and ends
- **Virality Score**: 1-100 with rationale
- **Opening Text Overlay**: The hook words displayed on screen
- **Core Soundbite**: The exact verbatim punchline that will get clipped and shared`
      return { systemPrompt, userPrompt }
    }

    case 'thumbnail-ideator': {
      const title = inputs.title || ''
      const topic = inputs.topic || ''
      const platform = inputs.platform || 'YouTube'
      const vibe = inputs.vibe || 'Curious, high tech, shocking'

      const userPrompt = `Develop 4 high-CTR thumbnail concepts for:
Title: "${title}"
Topic: "${topic}"
Platform: "${platform}"
Vibe: "${vibe}"

For each of the 4 concepts provide:
1. **Composition Layout** (Rule of thirds, zoom level, focal subject)
2. **Foreground Subject** (Facial expression, hand gesture, prop)
3. **Background & Lighting** (Colors, depth of field, contrast elements)
4. **Bold Text Overlay** (Strictly 2 to 4 words max with font color styling)
5. **Psychological Trigger** (Why a viewer clicks in under 200ms)`
      return { systemPrompt, userPrompt }
    }

    case 'caption-assistant': {
      const topic = inputs.topic || ''
      const platform = inputs.platform || 'Instagram'
      const tone = inputs.tone || 'Engaging & Authentic'
      const length = inputs.length || 'Medium (3 paragraphs)'
      const emojis = inputs.emojis !== false
      const hashtags = inputs.hashtags !== false

      const userPrompt = `Write an optimized caption for:
Topic: "${topic}"
Platform: "${platform}"
Tone: "${tone}"
Length: "${length}"
Include Emojis: ${emojis}
Include Hashtags: ${hashtags}

Structure:
- Line 1: Scroll-stopping hook line (before the "...more" button)
- Body: 2-3 short, easily scannable sections with clear whitespace
- Micro-CTA: Specific question that makes it effortless for viewers to comment
- Strategic Hashtag Block: Mix of 5 broad, 5 niche, and 3 trending tags.`
      return { systemPrompt, userPrompt }
    }

    case 'cta-generator': {
      const offer = inputs.offer || ''
      const goal = inputs.goal || 'Comments to trigger automation DM'
      const placement = inputs.placement || 'Reel ending & pinned comment'

      const userPrompt = `Generate 6 high-conversion Call-To-Action (CTA) formulas for:
Value Proposition: "${offer}"
Desired Goal: "${goal}"
Placement: "${placement}"

Categories:
1. The Low-Friction Word Trigger ("Comment [KEYWORD] and I'll send...")
2. The FOMO / Scarcity Trigger
3. The Value-Exchange Trigger ("Save this so you don't lose the blueprint")
4. The Debate / Polarizing Opinion Trigger ("Drop your hot take below")
5. The Micro-Commitment Trigger
6. The Bio Link Bridge`
      return { systemPrompt, userPrompt }
    }

    case 'comment-analyzer': {
      const comments = inputs.comments || ''

      const userPrompt = `Analyze the following audience comments:
"""${comments}"""

Provide a deep analytical report:
1. **Sentiment Breakdown**: (Estimated % Positive, % Skeptical, % Curious, % Frustrated)
2. **Top 3 Recurring Themes & Pain Points**: What are viewers desperately struggling with?
3. **Frequently Asked Questions**: The top 3 recurring questions
4. **5 High-Yield Content Spinoffs**: Content ideas directly answering these commenters`
      return { systemPrompt, userPrompt }
    }

    case 'comment-to-content': {
      const comment = inputs.comment || ''
      const context = inputs.context || ''
      const format = inputs.format || 'Short-form Video Script'

      const userPrompt = `Convert this specific audience comment into a viral content asset:
Comment: "${comment}"
Creator Niche/Context: "${context}"
Desired Format: "${format}"

Provide:
1. **The Sticky Frame**: How to visually highlight the comment on screen
2. **The First 5 Seconds**: Verbal acknowledgement that hooks everyone else who has this same question
3. **The Step-by-Step Educational Breakdown**: Practical, no-fluff answer
4. **The Mic-Drop Closer**: Final insight that establishes you as the undisputed authority`
      return { systemPrompt, userPrompt }
    }

    case 'creator-research-assistant': {
      const topic = inputs.topic || ''
      const niche = inputs.niche || ''
      const competitors = inputs.competitors || ''

      const userPrompt = `Conduct an exhaustive creator intelligence brief for:
Topic: "${topic}"
Niche: "${niche}"
Competitor References: "${competitors}"

Generate:
1. **Current Market Saturation & Trend Velocity**: What is currently being overdone?
2. **The "Unanswered Question" (Content Gap)**: What are top creators failing to mention?
3. **3 Data Points or Case Studies** that add undeniable credibility
4. **The Viral Angle Formula**: How to present this topic so it feels 100% brand new`
      return { systemPrompt, userPrompt }
    }

    case 'voice-replicator': {
      const sample = inputs.sample || ''
      const platform = inputs.platform || 'LinkedIn & Newsletter'

      const userPrompt = `Analyze this writing sample and construct an authentic Creator Voice Blueprint:
Sample Text:
"""${sample}"""

Target Platform: ${platform}

Output:
1. **Voice DNA**: Tone adjectives, sentence length variety, reading grade level, humor style
2. **Signature Cadence Rules**: Punctuation habits, line break usage, transition words
3. **Vocabulary & Slang Matrix**: Words this creator uses vs. words they would NEVER say
4. **On-Brand Example Post**: Generate a 150-word post on "Consistency vs Intensity" in this exact cloned voice`
      return { systemPrompt, userPrompt }
    }

    case 'podcast-assistant': {
      const topic = inputs.topic || ''
      const guest = inputs.guest || 'Industry Leader'
      const length = inputs.length || '45 minutes'

      const userPrompt = `Build an elite podcast interview guide for:
Topic: "${topic}"
Guest: "${guest}"
Target Episode Duration: "${length}"

Structure:
1. **Cold Open Hook Script**: (30-second teaser for the top of the episode)
2. **Icebreaker Question**: Gets the guest out of their rehearsed PR mode
3. **Deep-Dive Segment (5 Non-Obvious Questions)**: Probing questions touching on failure, secrets, and contrarian tactics
4. **Rapid-Fire Lightning Round (4 Questions)**
5. **Show Notes & Episode Title Options**: 3 click-worthy title variations and 3 bullet highlights`
      return { systemPrompt, userPrompt }
    }

    case 'creator-workspace': {
      const notes = inputs.notes || ''
      const goal = inputs.goal || 'Production Brief'

      const userPrompt = `Transform these messy creator notes into a structured, production-ready master brief:
Raw Notes:
"""${notes}"""
Objective: ${goal}

Deliver:
1. **Core Thesis & Logline**
2. **Key Talking Points & Evidence**
3. **Production Asset Checklist** (B-roll requirements, graphics needed, audio cues)
4. **Cross-Platform Distribution Strategy**`
      return { systemPrompt, userPrompt }
    }

    case 'content-recycler': {
      const oldPost = inputs.oldPost || ''
      const context = inputs.context || 'Update for current landscape'

      const userPrompt = `Take this winning past content and architect 3 modern recycled iterations:
Original Post:
"""${oldPost}"""
Context/Update: "${context}"

Generate:
1. **Version 1: The 2026 Modernized Take** (Incorporating fresh tech and tools)
2. **Version 2: The Contrarian Inversion** (Arguing the polar opposite angle for engagement)
3. **Version 3: The Micro-Case-Study Framework** (Reframing the lesson as a practical breakdown)`
      return { systemPrompt, userPrompt }
    }

    case 'brand-pitch-builder': {
      const niche = inputs.niche || 'Tech & Productivity'
      const stats = inputs.stats || '50k YouTube subscribers, 80k Instagram followers, 12% avg engagement'
      const brand = inputs.brand || 'Notion / Supabase'
      const concept = inputs.concept || 'Dedicated integration in workflow tutorial'

      const userPrompt = `Write an irresistible brand partnership sponsorship pitch:
Creator Niche: ${niche}
Channel Metrics: ${stats}
Target Brand: ${brand}
Campaign Concept: ${concept}

Generate:
1. **Subject Line Options** (3 high open rate variants)
2. **The Email Pitch** (Warm intro, specific praise for the brand, audience demographic alignment, creative deliverable proposal, soft CTA)
3. **Recommended Deliverables Package**: Dedicated video + Story bundle + 30-day usage rights
4. **Pricing Guidance**: Recommended rate bracket based on industry CPMs`
      return { systemPrompt, userPrompt }
    }

    case 'ai-content-director': {
      const concept = inputs.concept || 'Why 99% of creators burn out and how to build a 4-hour creator workflow'
      const platform = inputs.platform || 'YouTube Longform'
      const persona = inputs.persona || 'Cinematic, thoughtful, tactical'
      const goal = inputs.goal || 'High retention documentary-style video'

      const userPrompt = `You are directing a premier high-production creator video. Execute the complete 6-stage master blueprint:
Concept: "${concept}"
Platform: "${platform}"
Persona: "${persona}"
Goal: "${goal}"

You must deliver all 6 stages thoroughly:
### STAGE 1: DEEP RESEARCH & CONTRARIAN PREMISE
The core thesis, psychological hooks, and unique positioning.

### STAGE 2: 3 CREATIVE ANGLES & HOOK VARIANTS
Three distinct directorial lenses (e.g. Investigative, Story-driven, Tactical).

### STAGE 3: FULL PRODUCTION SCRIPT
Complete line-by-line script with speaker lines, tone shifts, and pacing marks.

### STAGE 4: VISUAL ART DIRECTION
Color grading, lighting mood, aspect ratio, camera focal lengths, and graphic styling.

### STAGE 5: DETAILED SHOT LIST
Table or sequence list: Shot #, Framing (Wide/Medium/Macro), Camera Movement, On-screen Asset.

### STAGE 6: PUBLISHING COPY & THUMBNAIL BRIEFS
Click-optimized title variants, description with timestamps, and A/B thumbnail concepts.`
      return { systemPrompt, userPrompt }
    }

    case 'creator-second-brain': {
      const notes = inputs.notes || ''
      const tags = inputs.tags || 'Productivity, AI, Storytelling'

      const userPrompt = `Process and catalog this information into the Creator Second Brain knowledge vault:
Input Notes / Thoughts:
"""${notes}"""
Tags: ${tags}

Output:
1. **Synthesized Knowledge Card**: Central thesis in 1 crisp sentence
2. **Mental Models & Principles**: Key concepts extracted
3. **Cross-Domain Connections**: How this connects to creative psychology, storytelling, or business
4. **3 Actionable Content Spawns**: Specific videos, threads, or newsletter topics you can produce immediately from this knowledge`
      return { systemPrompt, userPrompt }
    }

    case 'ai-screenplay-workspace': {
      const logline = inputs.logline || 'A burnt-out content creator discovers an AI clone of himself that begins posting videos and stealing his audience.'
      const genre = inputs.genre || 'Sci-Fi / Psychological Thriller'
      const protagonist = inputs.protagonist || 'Leo, 28, obsessive video editor'
      const setting = inputs.setting || 'A dim, multi-monitor editing suite at 3 AM'

      const userPrompt = `Write a cinematic, industry-standard screenplay scene for:
Logline: "${logline}"
Genre: "${genre}"
Protagonist: "${protagonist}"
Setting: "${setting}"

Format using standard screenplay conventions:
- Scene Heading: INT./EXT. LOCATION - TIME OF DAY
- Action Lines (Active voice, sensory details, visual cues)
- Character Names (Centered in CAPS)
- Parentheticals (beat, whispers, intensely)
- Naturalistic, subtext-rich Dialogue
- Compelling dramatic turning point / cliffhanger`
      return { systemPrompt, userPrompt }
    }

    case 'autonomous-content-pipeline': {
      const topic = inputs.topic || 'The Future of AI Video Production in 2026'
      const audience = inputs.audience || 'Filmmakers, video editors, and digital creators'
      const objective = inputs.objective || 'Position as the definitive voice in AI cinematography'

      const userPrompt = `Execute the complete Autonomous Multi-Asset Content Pipeline from one seed idea:
Seed Topic: "${topic}"
Target Audience: "${audience}"
Primary Objective: "${objective}"

Generate all 8 interconnected pipeline assets:
### 1. Research & Angle Brief
Core insight, contrarian stance, and target retention hook.

### 2. Full YouTube Anchor Script (approx 1,200 words outline + full intro/outro)
The pillar anchor asset that powers all downstream content.

### 3. Reel 1: The Shocking Stat / Hook Clip
15-30s vertical script with camera cues and caption prompt.

### 4. Reel 2: The Tactical Step-by-Step
30-45s vertical script explaining the core trick.

### 5. Reel 3: The Contrarian Rant
20-30s punchy opinion vertical script.

### 6. High-Engagement LinkedIn Article
Long-form thought leadership post with clean formatting and discussion trigger.

### 7. 7-Part X (Twitter) Mega-Thread
Tweet 1 hook + Tweets 2-6 breakdowns + Tweet 7 resource takeaway & bookmark CTA.

### 8. 7-Day Publishing & Repurposing Calendar
When and how to release each asset for maximum algorithmic synergy.`
      return { systemPrompt, userPrompt }
    }

    case 'ai-creative-producer': {
      const persona = inputs.persona || 'Tech & AI Educator scaling from 20k to 100k'
      const audience = inputs.audience || 'Knowledge workers and creators looking to automate workflows'
      const target = inputs.target || '100k followers & $20k/mo digital products'

      const userPrompt = `Act as an executive AI Creative Producer. Formulate an end-to-end master strategy:
Creator Profile: "${persona}"
Audience: "${audience}"
Growth Target: "${target}"

Generate the 5 strategic pillars:
### 1. AUDIENCE PSYCHOGRAPHY & VALUE PROPOSITION
Who they are, what keeps them awake at 2 AM, and your unfair advantage.

### 2. THE 4 CONTENT PILLARS (The 70-20-10 Rule)
- Foundation (Educational Searchable)
- Authority (Case Studies & Systems)
- Culture (Hot takes & Polarizing debates)
- Conversion (Product & Community triggers)

### 3. 30-DAY PRODUCTION & RELEASE CALENDAR
Week-by-week thematic roadmap with 30 distinct content titles.

### 4. TODAY'S PRIORITY SHOOT
Complete script and shoot brief for the #1 highest-leverage piece to record today.

### 5. PERFORMANCE RETENTION & ALGORITHM BENCHMARKS
Expected 30-day CTR, Average View Duration target, and comment conversion benchmarks.`
      return { systemPrompt, userPrompt }
    }

    default: {
      const userPrompt = `Generate comprehensive creative output for tool "${toolId}" with inputs: ${JSON.stringify(inputs, null, 2)}`
      return { systemPrompt, userPrompt }
    }
  }
}
