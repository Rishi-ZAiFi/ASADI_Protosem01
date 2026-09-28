import { ToolDefinition } from '../types'

export const ALL_TOOLS: ToolDefinition[] = [
  // 1. Content Idea Generator
  {
    id: 'content-idea-generator',
    name: 'Content Idea Generator',
    category: 'content-creation',
    badge: 'Popular',
    iconName: 'Lightbulb',
    description: 'Generate high-virality, structured content ideas with tailored angles, hooks, and formats.',
    samplePreset: {
      topic: 'Artificial Intelligence',
      audience: 'College Students',
      niche: 'Technology',
      platform: 'LinkedIn',
      goal: 'Education',
      count: 10,
    },
    inputs: [
      { name: 'topic', label: 'Topic or Core Focus', type: 'text', placeholder: 'e.g. Artificial Intelligence', required: true },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g. College Students', required: true },
      { name: 'niche', label: 'Niche / Category', type: 'text', placeholder: 'e.g. Technology', required: true },
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        options: [
          { label: 'LinkedIn', value: 'LinkedIn' },
          { label: 'YouTube & Longform', value: 'YouTube Longform' },
          { label: 'Instagram Reels & TikTok', value: 'Instagram Reels & TikTok' },
          { label: 'LinkedIn & Newsletter', value: 'LinkedIn & Newsletter' },
          { label: 'X (Twitter) & Threads', value: 'X & Threads' },
          { label: 'Omnichannel (All Platforms)', value: 'Omnichannel (All Platforms)' },
        ],
        defaultValue: 'LinkedIn',
      },
      {
        name: 'goal',
        label: 'Primary Goal',
        type: 'select',
        options: [
          { label: 'Education', value: 'Education' },
          { label: 'Viral reach & rapid follower growth', value: 'Viral reach & rapid follower growth' },
          { label: 'Deep audience trust & authority building', value: 'Deep audience trust & authority building' },
          { label: 'High inbound leads & digital product sales', value: 'High inbound leads & digital product sales' },
          { label: 'Community engagement & comments debate', value: 'Community engagement & comments debate' },
        ],
        defaultValue: 'Education',
      },
      {
        name: 'count',
        label: 'Number of Ideas',
        type: 'select',
        options: [
          { label: '3 Ideas', value: '3' },
          { label: '5 Ideas (Recommended)', value: '5' },
          { label: '8 Ideas', value: '8' },
          { label: '10 Ideas', value: '10' },
        ],
        defaultValue: '10',
      },
    ],
  },

  // 2. Content Repurposer
  {
    id: 'content-repurposer',
    name: 'Content Repurposer',
    category: 'content-creation',
    badge: 'High ROI',
    iconName: 'Repeat',
    description: 'Multiply 1 winning asset into 4 distinct cross-platform formats: Threads, LinkedIn, Reels, and Newsletters.',
    samplePreset: {
      sourceContent: 'The biggest mistake creators make is trying to edit everything themselves. When you outsource or automate your first rough cut, your creative bandwidth triples. I tested this for 6 months: output grew 240% while weekly working hours dropped from 50 to 22.',
      targetPlatforms: 'LinkedIn, X (Twitter), Instagram Reels, Email Newsletter',
      tone: 'Authoritative yet vulnerable and transparent',
    },
    inputs: [
      { name: 'sourceContent', label: 'Source Content (Script, Article, Video transcript, or Post)', type: 'textarea', rows: 5, placeholder: 'Paste your existing article, transcript, or ideas here...', required: true },
      { name: 'targetPlatforms', label: 'Target Platforms', type: 'text', placeholder: 'e.g. LinkedIn, X Thread, Reels Script, Substack', defaultValue: 'LinkedIn, X (Twitter), Reels, Newsletter' },
      {
        name: 'tone',
        label: 'Desired Tone',
        type: 'select',
        options: [
          { label: 'Authoritative & Data-driven', value: 'Authoritative & Data-driven' },
          { label: 'Casual & Conversational', value: 'Casual & Conversational' },
          { label: 'Contrarian & Provocative', value: 'Contrarian & Provocative' },
          { label: 'Cinematic & Inspiring', value: 'Cinematic & Inspiring' },
        ],
        defaultValue: 'Authoritative & Data-driven',
      },
    ],
  },

  // 3. Hook Generator
  {
    id: 'hook-generator',
    name: 'Hook Generator',
    category: 'content-creation',
    badge: 'Virality',
    iconName: 'Anchor',
    description: 'Generate 5 high-retention psychological hooks engineered to stop scrolling within the first 3 seconds.',
    samplePreset: {
      topic: 'Why you should stop filming in 4K for social media',
      trigger: 'Contrarian / Breaking Conventional Wisdom',
      platform: 'TikTok & Instagram Reels',
      audience: 'Video creators and iPhone cinematographers',
    },
    inputs: [
      { name: 'topic', label: 'Topic or Statement', type: 'text', placeholder: 'e.g. Why most creators never monetize their audience', required: true },
      {
        name: 'trigger',
        label: 'Emotional Trigger',
        type: 'select',
        options: [
          { label: 'Contrarian / Breaking Conventional Wisdom', value: 'Contrarian / Breaking Conventional Wisdom' },
          { label: 'Curiosity Gap / Hidden Secret', value: 'Curiosity Gap / Hidden Secret' },
          { label: 'Fear of Missing Out / Urgent Warning', value: 'Fear of Missing Out / Urgent Warning' },
          { label: 'Shocking Statistic / Hard Proof', value: 'Shocking Statistic / Hard Proof' },
          { label: 'Vulnerable Transformation Story', value: 'Vulnerable Transformation Story' },
        ],
        defaultValue: 'Contrarian / Breaking Conventional Wisdom',
      },
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        options: [
          { label: 'TikTok & Instagram Reels', value: 'TikTok & Instagram Reels' },
          { label: 'YouTube Longform & Shorts', value: 'YouTube Longform & Shorts' },
          { label: 'LinkedIn Hook Line', value: 'LinkedIn Hook Line' },
          { label: 'X (Twitter) First Tweet', value: 'X First Tweet' },
        ],
        defaultValue: 'TikTok & Instagram Reels',
      },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g. Designers, founders, hobbyists' },
    ],
  },

  // 4. Daily Content Planner
  {
    id: 'daily-content-planner',
    name: 'Daily Content Planner',
    category: 'content-creation',
    iconName: 'Calendar',
    description: 'Map out a frictionless 7-day content schedule with pillars, hooks, formats, and posting windows.',
    samplePreset: {
      niche: 'AI Coding & Tech Solopreneurship',
      frequency: 'Daily (7 Days)',
      platform: 'Instagram Reels & LinkedIn',
      goal: 'Position as a leading AI developer and drive community signups',
    },
    inputs: [
      { name: 'niche', label: 'Niche / Industry', type: 'text', placeholder: 'e.g. Personal Finance, AI Tools, Fitness', required: true },
      {
        name: 'frequency',
        label: 'Posting Frequency',
        type: 'select',
        options: [
          { label: 'Daily (7 days / week)', value: 'Daily (7 days)' },
          { label: '5 Days / week (Mon-Fri)', value: '5 Days / week' },
          { label: '3 High-impact Days / week', value: '3 Days / week' },
        ],
        defaultValue: 'Daily (7 days / week)',
      },
      { name: 'platform', label: 'Primary Platforms', type: 'text', placeholder: 'e.g. YouTube & X, Instagram & TikTok', defaultValue: 'Instagram Reels & LinkedIn' },
      { name: 'goal', label: 'Strategic Goal', type: 'text', placeholder: 'e.g. Authority, newsletter signups, sales', defaultValue: 'Drive authority and high retention' },
    ],
  },

  // 5. Reel Script Builder
  {
    id: 'reel-script-builder',
    name: 'Reel Script Builder',
    category: 'content-creation',
    badge: 'Short-Form',
    iconName: 'Video',
    description: 'Paced short-form scripts with second-by-second timestamps, B-roll directions, and audio cues.',
    samplePreset: {
      concept: 'The 3-stage morning routine that actually cures creative paralysis',
      duration: '30s',
      cta: 'Comment "ROUTINE" to get my free Notion tracker',
      tone: 'Punchy, cinematic, no fluff',
    },
    inputs: [
      { name: 'concept', label: 'Concept / Core Idea', type: 'text', placeholder: 'e.g. The 60-second rule to double your video watch time', required: true },
      {
        name: 'duration',
        label: 'Target Duration',
        type: 'select',
        options: [
          { label: '15 Seconds (Ultra punchy viral sound)', value: '15s' },
          { label: '30 Seconds (Optimal balance of retention & value)', value: '30s' },
          { label: '60 Seconds (Deep dive tactical breakdown)', value: '60s' },
        ],
        defaultValue: '30s',
      },
      { name: 'cta', label: 'Ending Call-to-Action', type: 'text', placeholder: 'e.g. Save this for your next shoot, comment for link', defaultValue: 'Save this for your next shoot' },
      { name: 'tone', label: 'Pacing & Tone', type: 'text', placeholder: 'e.g. Fast-paced, mysterious, relaxed conversational', defaultValue: 'Fast-paced, energetic, highly informative' },
    ],
  },

  // 6. Clip Finder
  {
    id: 'clip-finder',
    name: 'Clip Finder',
    category: 'production',
    iconName: 'Scissors',
    description: 'Pinpoint viral moments inside long podcasts, interviews, or video transcripts with virality ratings.',
    samplePreset: {
      transcript: `[04:12] Host: What was the moment you realized your old business was dying?
[04:20] Guest: It was 2 AM on a Tuesday. We were spending $40,000 a month on Facebook ads, and the CAC suddenly spiked 400% overnight because of iOS 14. I stared at our runway spreadsheet and realized: if we don't switch to organic founder-led video within 30 days, we are bankrupt.
[05:01] Host: Wow. And what did you do that next morning?
[05:08] Guest: I bought a $60 microphone on Amazon, set my phone on a stack of books, and posted my first candid breakdown. That one video generated 1.2M views and saved the company. The lesson was simple: people don't buy from faceless logos anymore. They buy from humans they trust.`,
      targetLength: '30-45 seconds',
      platform: 'TikTok, Reels & YouTube Shorts',
    },
    inputs: [
      { name: 'transcript', label: 'Paste Video Transcript or Conversation Excerpt', type: 'textarea', rows: 6, placeholder: 'Paste text or transcript segments here...', required: true },
      {
        name: 'targetLength',
        label: 'Target Clip Duration',
        type: 'select',
        options: [
          { label: 'Under 30 Seconds (Fast punchlines)', value: 'Under 30s' },
          { label: '30 - 60 Seconds (Story arc)', value: '30-60s' },
          { label: '60 - 90 Seconds (Deep lesson)', value: '60-90s' },
        ],
        defaultValue: '30-60s',
      },
      { name: 'platform', label: 'Target Platform', type: 'text', defaultValue: 'TikTok, Reels & YouTube Shorts' },
    ],
  },

  // 7. Thumbnail Ideator
  {
    id: 'thumbnail-ideator',
    name: 'Thumbnail Ideator',
    category: 'content-creation',
    iconName: 'Image',
    description: 'High-CTR YouTube thumbnail formulas with visual composition, text overlays, and contrast guidance.',
    samplePreset: {
      title: 'I Built a $100k AI Business in 14 Days (Full Blueprint)',
      topic: 'AI Micro-SaaS development and marketing',
      platform: 'YouTube',
      vibe: 'Shocking, authentic, high-contrast tech',
    },
    inputs: [
      { name: 'title', label: 'Video Title (or Working Title)', type: 'text', placeholder: 'e.g. Why I Quit My $200k Tech Job for YouTube', required: true },
      { name: 'topic', label: 'Core Subject', type: 'text', placeholder: 'e.g. Solo software engineering, productivity', required: true },
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        options: [
          { label: 'YouTube Longform (16:9)', value: 'YouTube' },
          { label: 'YouTube Shorts / Reels Cover (9:16)', value: 'Vertical Cover' },
          { label: 'Blog / Podcast Banner', value: 'Banner' },
        ],
        defaultValue: 'YouTube',
      },
      { name: 'vibe', label: 'Visual Vibe / Tone', type: 'text', defaultValue: 'Curious, high tech, shocking contrast' },
    ],
  },

  // 8. Caption Assistant
  {
    id: 'caption-assistant',
    name: 'Caption Assistant',
    category: 'content-creation',
    iconName: 'FileText',
    description: 'Craft high-converting captions with opening punchlines, formatting, and high-relevance hashtags.',
    samplePreset: {
      topic: 'Why burnout is a symptom of poor distribution, not too much work',
      platform: 'Instagram',
      tone: 'Raw, philosophical yet practical',
      length: 'Medium (3 paragraphs)',
      emojis: true,
      hashtags: true,
    },
    inputs: [
      { name: 'topic', label: 'Post Summary or Key Takeaway', type: 'textarea', rows: 3, placeholder: 'What is this post about?', required: true },
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        options: [
          { label: 'Instagram Post / Reel', value: 'Instagram' },
          { label: 'TikTok Description', value: 'TikTok' },
          { label: 'YouTube Video Description', value: 'YouTube' },
          { label: 'LinkedIn Post', value: 'LinkedIn' },
        ],
        defaultValue: 'Instagram',
      },
      {
        name: 'tone',
        label: 'Tone of Voice',
        type: 'select',
        options: [
          { label: 'Engaging & Authentic', value: 'Engaging & Authentic' },
          { label: 'Direct & Punchy', value: 'Direct & Punchy' },
          { label: 'Educational & In-depth', value: 'Educational & In-depth' },
          { label: 'Witty & Relatable', value: 'Witty & Relatable' },
        ],
        defaultValue: 'Engaging & Authentic',
      },
      {
        name: 'length',
        label: 'Caption Length',
        type: 'select',
        options: [
          { label: 'Short & Punchy (1-2 lines)', value: 'Short & Punchy' },
          { label: 'Medium (3 structured paragraphs)', value: 'Medium (3 paragraphs)' },
          { label: 'Long-Form Storytelling (Mini-blog)', value: 'Long-Form Storytelling' },
        ],
        defaultValue: 'Medium (3 paragraphs)',
      },
      { name: 'emojis', label: 'Include Smart Emojis', type: 'checkbox', defaultValue: true },
      { name: 'hashtags', label: 'Include Targeted Hashtags', type: 'checkbox', defaultValue: true },
    ],
  },

  // 9. CTA Generator
  {
    id: 'cta-generator',
    name: 'CTA Generator',
    category: 'content-creation',
    iconName: 'Megaphone',
    description: 'Engineered calls-to-action designed to trigger comments, shares, saves, and bio link clicks.',
    samplePreset: {
      offer: 'Free 12-page AI Prompt Engineering Cheatsheet PDF',
      goal: 'Comments to trigger ManyChat automation DM',
      placement: 'Reel ending & pinned comment',
    },
    inputs: [
      { name: 'offer', label: 'What value / resource are you offering?', type: 'text', placeholder: 'e.g. Free Notion template, consultation call, checklist', required: true },
      {
        name: 'goal',
        label: 'Primary Goal',
        type: 'select',
        options: [
          { label: 'Comments (to boost algorithm & trigger DM bot)', value: 'Comments to trigger automation DM' },
          { label: 'Saves (long-term bookmark value)', value: 'Bookmark / Save for reference' },
          { label: 'Shares (send to a peer/team)', value: 'Peer-to-peer Shares' },
          { label: 'Profile / Bio Link Clicks', value: 'Profile Link Clicks' },
        ],
        defaultValue: 'Comments to trigger automation DM',
      },
      { name: 'placement', label: 'CTA Placement', type: 'text', defaultValue: 'Reel ending & pinned comment' },
    ],
  },

  // 10. Comment Analyzer
  {
    id: 'comment-analyzer',
    name: 'Comment Analyzer',
    category: 'audience-research',
    badge: 'Insights',
    iconName: 'MessageSquare',
    description: 'Analyze audience comments for sentiment, underlying pain points, objections, and hidden content goldmines.',
    samplePreset: {
      comments: `- "I tried this but n8n kept crashing whenever I ran more than 10 workflows."
- "What if I don't know any Python or JavaScript? Can a beginner still do this?"
- "Love this breakdown! But how does this handle rate limits with the OpenAI API?"
- "Is this allowed by YouTube's terms of service?"
- "Great video man, subscribed immediately. Can you do a tutorial for Mac users?"
- "Cost seems crazy high if you run 1,000 articles a day..."`,
    },
    inputs: [
      { name: 'comments', label: 'Paste Comments Batch (5 to 30 comments)', type: 'textarea', rows: 7, placeholder: 'Paste user comments or feedback here...', required: true },
    ],
  },

  // 11. Comment-to-Content
  {
    id: 'comment-to-content',
    name: 'Comment-to-Content',
    category: 'audience-research',
    iconName: 'Reply',
    description: 'Convert real audience questions and spicy comments into viral reply videos and educational carousels.',
    samplePreset: {
      comment: ' "Sure, this works for tech influencers who already have 50k followers, but nobody is going to watch a beginner with zero audience do this."',
      context: 'Organic growth strategies for brand-new creators in saturated niches',
      format: 'Short-form Video Reply Script',
    },
    inputs: [
      { name: 'comment', label: 'The Exact Comment / Question', type: 'textarea', rows: 3, placeholder: 'Paste the exact user comment here...', required: true },
      { name: 'context', label: 'Your Niche / Perspective Context', type: 'text', placeholder: 'e.g. Solo SaaS, B2B coaching, fitness', required: true },
      {
        name: 'format',
        label: 'Desired Content Format',
        type: 'select',
        options: [
          { label: 'Short-form Video Reply Script (TikTok/Reels)', value: 'Short-form Video Reply Script' },
          { label: 'Educational LinkedIn Breakdown', value: 'Educational LinkedIn Breakdown' },
          { label: 'Step-by-step Carousel', value: 'Step-by-step Carousel' },
          { label: 'Deep Dive Newsletter Issue', value: 'Deep Dive Newsletter Issue' },
        ],
        defaultValue: 'Short-form Video Reply Script',
      },
    ],
  },

  // 12. Creator Research Assistant
  {
    id: 'creator-research-assistant',
    name: 'Creator Research Assistant',
    category: 'audience-research',
    iconName: 'Search',
    description: 'Deep dive into niche trends, competitor content gaps, and data-backed viral angles.',
    samplePreset: {
      topic: 'The rise of local open-source LLMs running on consumer laptops',
      niche: 'AI Engineering & Developer Productivity',
      competitors: 'Top tech YouTubers talking about Ollama, LM Studio, and DeepSeek',
    },
    inputs: [
      { name: 'topic', label: 'Target Topic to Research', type: 'text', placeholder: 'e.g. Why creators are ditching Premiere Pro for DaVinci Resolve', required: true },
      { name: 'niche', label: 'Niche / Market', type: 'text', placeholder: 'e.g. Tech, Finance, Filmmaking', required: true },
      { name: 'competitors', label: 'Competitor / Channel References', type: 'text', placeholder: 'e.g. Channels or creators currently covering this' },
    ],
  },

  // 13. Voice Replicator
  {
    id: 'voice-replicator',
    name: 'Voice Replicator',
    category: 'audience-research',
    badge: 'Persona',
    iconName: 'Mic2',
    description: 'Decode your personal writing style, tone nuances, and cadence to generate authentic on-brand content.',
    samplePreset: {
      sample: `Most people treat productivity like a spreadsheet. I treat it like an engine.
If you put cheap fuel in a Ferrari, it sputters. If you feed your brain 4 hours of short-form sludge before breakfast, you can't expect high-level creative output at 2 PM.
Here's my non-negotiable rule:
Zero input until your first output is done.
No emails. No Slack. No analytics. Just build.`,
      platform: 'LinkedIn & Newsletter',
    },
    inputs: [
      { name: 'sample', label: 'Paste Writing Sample (100 - 400 words of your authentic writing)', type: 'textarea', rows: 6, placeholder: 'Paste posts, emails, or scripts written by you...', required: true },
      {
        name: 'platform',
        label: 'Target Platform',
        type: 'select',
        options: [
          { label: 'LinkedIn & Newsletter', value: 'LinkedIn & Newsletter' },
          { label: 'X (Twitter) Short Punchy', value: 'X (Twitter) Short Punchy' },
          { label: 'Conversational Video Voiceover', value: 'Conversational Video Voiceover' },
        ],
        defaultValue: 'LinkedIn & Newsletter',
      },
    ],
  },

  // 14. Podcast Assistant
  {
    id: 'podcast-assistant',
    name: 'Podcast Assistant',
    category: 'production',
    iconName: 'Mic',
    description: 'Produce complete episode guides: provocative interview questions, intro hooks, and show notes.',
    samplePreset: {
      topic: 'How to bootstrap a $5M bootstrapped software company without VC funding',
      guest: 'Sarah Lin, Founder of AutoDoc AI',
      length: '45 minutes',
    },
    inputs: [
      { name: 'topic', label: 'Episode Topic & Central Thesis', type: 'text', placeholder: 'e.g. The Untold Reality of Bootstrapping in 2026', required: true },
      { name: 'guest', label: 'Guest Name & Brief Bio / Background', type: 'textarea', rows: 3, placeholder: 'e.g. Sarah Lin, ex-Google engineer who built a $5M ARR tool...', required: true },
      {
        name: 'length',
        label: 'Target Duration',
        type: 'select',
        options: [
          { label: '20-30 Minutes (Brisk & Tactical)', value: '25 minutes' },
          { label: '45-60 Minutes (Standard Deep Dive)', value: '45 minutes' },
          { label: '90+ Minutes (Longform Masterclass)', value: '90 minutes' },
        ],
        defaultValue: '45 minutes',
      },
    ],
  },

  // 15. Creator Workspace
  {
    id: 'creator-workspace',
    name: 'Creator Workspace',
    category: 'production',
    iconName: 'Briefcase',
    description: 'Centralized ideation studio to convert raw notes into structured creative production briefs.',
    samplePreset: {
      notes: `Idea for next video:
- Explain why traditional video editing will be replaced by script-based timeline editors
- Show comparison between cutting 1 hour footage manually vs using AI speech transcription
- Mention tools: Descript, Runway Gen-3, Claude Code
- The real bottleneck isn't software, it's having a clear story structure
- CTA should drive to my video production Notion template`,
      goal: 'Complete Multi-Asset Production Brief',
    },
    inputs: [
      { name: 'notes', label: 'Brain-dump / Raw Thought Notes', type: 'textarea', rows: 7, placeholder: 'Jot down messy ideas, links, rough bullets...', required: true },
      {
        name: 'goal',
        label: 'Desired Output Asset',
        type: 'select',
        options: [
          { label: 'Complete Multi-Asset Production Brief', value: 'Complete Multi-Asset Production Brief' },
          { label: 'Video Script Breakdown & Timeline', value: 'Video Script Breakdown & Timeline' },
          { label: 'Course Module Outline', value: 'Course Module Outline' },
        ],
        defaultValue: 'Complete Multi-Asset Production Brief',
      },
    ],
  },

  // 16. Content Recycler
  {
    id: 'content-recycler',
    name: 'Content Recycler',
    category: 'production',
    iconName: 'RefreshCcw',
    description: 'Revitalize past top-performing winners with fresh 2026 angles, contrarian framing, and updated data.',
    samplePreset: {
      oldPost: `In 2023, I stopped doing client calls on Mondays and Fridays.
Revenue went up 40% and our delivery speed doubled because we had 16 hours of uninterrupted deep work every single week.`,
      context: 'Update for the 2026 asynchronous AI agency model',
    },
    inputs: [
      { name: 'oldPost', label: 'Past Winning Content', type: 'textarea', rows: 5, placeholder: 'Paste your top performing old tweet, post, or video concept...', required: true },
      { name: 'context', label: 'Fresh Context or Modern Angle', type: 'text', placeholder: 'e.g. Modernized for 2026 AI tools or shifting economic climate', defaultValue: 'Update for current landscape' },
    ],
  },

  // 17. Brand Pitch Builder
  {
    id: 'brand-pitch-builder',
    name: 'Brand Pitch Builder',
    category: 'production',
    badge: 'Monetization',
    iconName: 'DollarSign',
    description: 'Generate high-response brand sponsorship pitches, deliverables packaging, and rate card guidelines.',
    samplePreset: {
      niche: 'AI Productivity, Tech Gear & Developer Tools',
      stats: '48,000 YouTube Subscribers, 72,000 Instagram Followers, 8.4% Engagement Rate',
      brand: 'Notion / Raycast',
      concept: 'Integrated 60-second workflow showcase in my "My Ultimate 2026 Desk Setup" video',
    },
    inputs: [
      { name: 'niche', label: 'Your Creator Niche', type: 'text', placeholder: 'e.g. Tech, Personal Finance, Gaming', required: true },
      { name: 'stats', label: 'Channel & Audience Metrics', type: 'text', placeholder: 'e.g. 50k subs, 60k IG followers, 10% avg engagement', required: true },
      { name: 'brand', label: 'Target Brand Name', type: 'text', placeholder: 'e.g. Figma, Epidemic Sound, Notion', required: true },
      { name: 'concept', label: 'Proposed Campaign Integration Idea', type: 'text', placeholder: 'e.g. Dedicated video sponsor, 60-second mid-roll, Instagram series' },
    ],
  },

  // 18. AI Content Director (Advanced Multi-Step)
  {
    id: 'ai-content-director',
    name: 'AI Content Director',
    category: 'advanced-ai',
    badge: '6-Stage Engine',
    iconName: 'Clapperboard',
    description: 'Multi-stage end-to-end creative direction: Research → Angles → Script → Visuals → Shot List → Publishing Copy.',
    isMultiStep: true,
    steps: ['Research', 'Angles', 'Script', 'Visuals', 'Shot List', 'Publishing Copy'],
    samplePreset: {
      concept: 'Why 99% of Content Creators Burn Out within 18 Months (And the 4-Hour System to Fix It)',
      platform: 'YouTube Longform (10-12 mins)',
      persona: 'Cinematic, documentary-style, authentic, grounded in systems thinking',
      goal: 'High retention educational video that builds deep subscriber loyalty',
    },
    inputs: [
      { name: 'concept', label: 'Master Video Concept / Thesis', type: 'textarea', rows: 3, placeholder: 'Describe the core narrative or argument...', required: true },
      {
        name: 'platform',
        label: 'Platform & Format',
        type: 'select',
        options: [
          { label: 'YouTube Longform (8-15 mins)', value: 'YouTube Longform' },
          { label: 'High-Production Documentary Mini-Doc', value: 'High-Production Mini-Doc' },
          { label: 'Multi-Part Episodic Series', value: 'Episodic Series' },
        ],
        defaultValue: 'YouTube Longform',
      },
      { name: 'persona', label: 'Directorial Style & Tone', type: 'text', defaultValue: 'Cinematic, thoughtful, tactical' },
      { name: 'goal', label: 'Primary Production Objective', type: 'text', defaultValue: 'High retention documentary-style video' },
    ],
  },

  // 19. Creator Second Brain
  {
    id: 'creator-second-brain',
    name: 'Creator Second Brain',
    category: 'audience-research',
    iconName: 'Brain',
    description: 'Synthesize research, literature notes, and loose thoughts into interconnected content assets.',
    samplePreset: {
      notes: `Read a passage in 'Building a Second Brain' by Tiago Forte about CODE (Capture, Organize, Distill, Express).
Notice how most creators stop at Organize and never reach Express.
Also saw Alex Hormozi mention that volume beats quality until quality catches up.
How do we bridge the gap between hoarding information and rapidly publishing?`,
      tags: 'Productivity, Creative Psychology, Knowledge Management',
    },
    inputs: [
      { name: 'notes', label: 'Notes, Quotes, Articles or Observations', type: 'textarea', rows: 6, placeholder: 'Dump knowledge fragments here...', required: true },
      { name: 'tags', label: 'Topic Tags', type: 'text', defaultValue: 'Productivity, AI, Storytelling' },
    ],
  },

  // 20. AI Screenplay Workspace
  {
    id: 'ai-screenplay-workspace',
    name: 'AI Screenplay Workspace',
    category: 'production',
    badge: 'Hollywood',
    iconName: 'Film',
    description: 'Hollywood-standard screenplay and narrative scene generator with dialogue, action, and sluglines.',
    samplePreset: {
      logline: 'An ambitious video editor uses an underground AI tool to clone his voice and face, only to realize the AI is taking over his actual life and memories.',
      genre: 'Psychological Thriller / Sci-Fi',
      protagonist: 'Leo, 28, sleep-deprived perfectionist video editor',
      setting: 'A claustrophobic apartment editing suite illuminated only by glowing OLED screens at 3:15 AM',
    },
    inputs: [
      { name: 'logline', label: 'Scene Logline / Dramatic Tension', type: 'textarea', rows: 3, placeholder: 'What happens in this scene?', required: true },
      {
        name: 'genre',
        label: 'Genre',
        type: 'select',
        options: [
          { label: 'Psychological Thriller / Sci-Fi', value: 'Psychological Thriller / Sci-Fi' },
          { label: 'Drama / Character Study', value: 'Drama / Character Study' },
          { label: 'Tech Satire / Dark Comedy', value: 'Tech Satire / Dark Comedy' },
          { label: 'Action / Heist', value: 'Action / Heist' },
        ],
        defaultValue: 'Psychological Thriller / Sci-Fi',
      },
      { name: 'protagonist', label: 'Protagonist Name & Traits', type: 'text', defaultValue: 'Leo, 28, obsessive video editor' },
      { name: 'setting', label: 'Setting / Environment', type: 'text', defaultValue: 'A dim, multi-monitor editing suite at 3 AM' },
    ],
  },

  // 21. Autonomous Content Pipeline (Advanced Multi-Step)
  {
    id: 'autonomous-content-pipeline',
    name: 'Autonomous Content Pipeline',
    category: 'advanced-ai',
    badge: '8-Asset Spawner',
    iconName: 'Workflow',
    description: 'One seed idea automatically spawned into YouTube Script → 3 Reels → LinkedIn → X Thread → Captions → Calendar.',
    isMultiStep: true,
    steps: ['Idea', 'Research', 'YouTube Script', '3 Reels', 'LinkedIn', 'X Thread', 'Captions', 'Calendar'],
    samplePreset: {
      topic: 'How to Build an Autonomous AI Creative Studio with $0 in 2026',
      audience: 'Independent creators, filmmakers, and digital marketers',
      objective: 'Establish definitive thought leadership and generate 5,000 newsletter subscribers',
    },
    inputs: [
      { name: 'topic', label: 'Master Seed Topic', type: 'text', placeholder: 'e.g. The 2026 AI Stack for Solo Creators', required: true },
      { name: 'audience', label: 'Target Audience Profile', type: 'text', placeholder: 'e.g. Creators, marketers, engineers', required: true },
      { name: 'objective', label: 'Primary Commercial / Growth Objective', type: 'text', placeholder: 'e.g. Drive newsletter signups, sell template, build authority', required: true },
    ],
  },

  // 22. AI Creative Producer (Advanced Multi-Step)
  {
    id: 'ai-creative-producer',
    name: 'AI Creative Producer',
    category: 'advanced-ai',
    badge: '30-Day Strategy',
    iconName: 'Sparkles',
    description: 'Strategic production planner: Audience → Content Pillars → 30-Day Strategy → Today’s Content → Performance Insights.',
    isMultiStep: true,
    steps: ['Audience', 'Content Pillars', '30-Day Strategy', "Today's Content", 'Performance Insights'],
    samplePreset: {
      persona: 'AI Educator & Tech Reviewer scaling from 25k to 100k subscribers',
      audience: 'Knowledge workers, software developers, and creators aged 22-40',
      target: 'Reach 100k subscribers and launch a $49/mo community within 90 days',
    },
    inputs: [
      { name: 'persona', label: 'Creator Persona & Current Stage', type: 'text', placeholder: 'e.g. Tech educator scaling from 20k to 100k', required: true },
      { name: 'audience', label: 'Audience Demographics & Core Pain Point', type: 'text', placeholder: 'e.g. Creators tired of spending 20 hours editing', required: true },
      { name: 'target', label: '90-Day Metric Target', type: 'text', placeholder: 'e.g. 100k subs and $20k monthly digital revenue', required: true },
    ],
  },
]
