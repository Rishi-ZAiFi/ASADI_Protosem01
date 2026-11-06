import {
  StageInfo,
  ContentPipelineProject,
  ResearchData,
  AnglesData,
  NarrativeData,
  ScriptData,
  VisualsData,
  ShotListData,
  PublishingData,
  Platform,
  Tone,
} from '../types';

export const STAGES_CONFIG: StageInfo[] = [
  {
    number: 1,
    key: 'research',
    title: 'Research & Facts',
    shortDesc: 'Key facts, statistics, trends, and pain points',
    icon: 'Search',
    directorTip: 'Focus on extracting surprising, counter-intuitive data points. High-performing content hooks viewers with validated facts that shatter existing assumptions.',
  },
  {
    number: 2,
    key: 'angles',
    title: 'Content Angles',
    shortDesc: '5 distinct hooks, emotions, and positioning angles',
    icon: 'Compass',
    directorTip: 'Choose the angle with the highest emotional tension and relevance to your audience. The opening hook determines whether 80% of your audience continues watching.',
  },
  {
    number: 3,
    key: 'narrative',
    title: 'Narrative Storyboard',
    shortDesc: 'Story structure, core theme, and beat outline',
    icon: 'GitFork',
    directorTip: 'Notice the pacing curve: structure each beat so the audience is left waiting for the resolution of the next question before you answer the previous one.',
  },
  {
    number: 4,
    key: 'script',
    title: 'Spoken Script',
    shortDesc: 'Full word-for-word script with delivery cues',
    icon: 'FileText',
    directorTip: 'Read the dialogue aloud. Eliminate industry jargon and clunky sentences. Aim for ~140-150 words per minute to keep spoken cadence brisk and engaging.',
  },
  {
    number: 5,
    key: 'visuals',
    title: 'Visuals & B-Roll',
    shortDesc: 'On-screen framing, B-roll, stock search, graphics',
    icon: 'Film',
    directorTip: 'The 45-Second Visual Reset rule: Never leave the screen static for more than 4-5 seconds without a kinetic overlay, angle change, or B-roll cutaway.',
  },
  {
    number: 6,
    key: 'shotList',
    title: 'Production Shot List',
    shortDesc: 'Camera movements, angles, lighting setup, and durations',
    icon: 'Camera',
    directorTip: 'Check off shots during production. Group similar setups (e.g. all Studio Desk shots) together to minimize camera repositioning time.',
  },
  {
    number: 7,
    key: 'publishing',
    title: 'Publishing & Packaging',
    shortDesc: 'Viral titles, SEO description, thumbnails, multi-platform copy',
    icon: 'Share2',
    directorTip: 'Pair high-curiosity titles with high-contrast, uncluttered thumbnail concepts. Test at least 2 title variations in your community within the first 3 hours of posting.',
  },
];

export function generatePipelineForTopic(
  topic: string,
  platform: Platform = 'YouTube Shorts',
  tone: Tone = 'Cinematic',
  targetAudience: string = 'Digital Creators & Tech Enthusiasts'
): ContentPipelineProject {
  const id = `pipe-${Date.now()}`;
  const now = new Date().toISOString();

  const research: ResearchData = {
    topicOverview: `Comprehensive creative direction breakdown for "${topic}", analyzing audience psychology, retention triggers, high-velocity formats, and market saturation markers.`,
    keyFacts: [
      `Videos that pose a contrarian dilemma in the first 2.5 seconds achieve 2.8x higher average retention.`,
      `Audience fatigue metrics show viewers drop off by 40% when tone feels lecture-like; conversational banter increases completion to 73%.`,
      `Short-form vertical video distribution favors high-density visual cuts with on-screen kinetic captions.`,
      `Sound design (subtle bass drops, paper crinkles, risers) accounts for 35% of perceived video production value.`,
    ],
    statistics: [
      { stat: '3.4x Reach Lift', context: 'When using curiosity-gap hooks instead of standard introductions.', source: 'CreatorStudio Analytics Census' },
      { stat: '78% 3-Second Hold Rate', context: 'Benchmarked across top-decile viral shorts in this category.', source: 'Platform Retention Telemetry' },
    ],
    trends: [
      'Micro-story arcs inside 60-second reels',
      'Dual-camera casual conversational style replacing hyper-polished studio sets',
      'Meme B-roll integration for comic relief during dense analytical explanations',
    ],
    commonQuestions: [
      `What is the secret behind ${topic}?`,
      `Why do 90% of people get ${topic} completely wrong?`,
      `Is it worth the hype, or just clever marketing?`,
    ],
    audiencePainPoints: [
      'Information overload with overly generic advice',
      'Boring, slow-paced introductions that waste time',
      'Lack of actionable, step-by-step demonstrations',
    ],
    sources: [
      { title: `${topic} Global Industry Report`, url: 'https://creator-insights.ai', snippet: 'Empirical data on consumer interest patterns.' },
      { title: 'Viral Algorithm Mechanics', url: 'https://trend-engine.internal', snippet: 'Pacing benchmarks and audio hook correlation.' },
    ],
  };

  const angles: AnglesData = {
    primaryConcept: topic,
    angles: [
      {
        id: 'ang-1',
        title: 'The Uncomfortable Truth (Contrarian)',
        hook: `Stop doing ${topic} the way everyone tells you. Here's why 95% of people fail...`,
        targetEmotion: 'Surprise & Urgency',
        difficultyScore: 4,
        uniquenessScore: 9,
        description: 'Debunks a widely accepted myth with hard evidence and personal confession.',
        targetAudienceFit: 'High intent learners seeking competitive advantage.',
      },
      {
        id: 'ang-2',
        title: 'The 24-Hour Stress Test (Experiment)',
        hook: `I tested ${topic} for 24 hours straight so you don't have to...`,
        targetEmotion: 'Curiosity & Entertainment',
        difficultyScore: 7,
        uniquenessScore: 8,
        description: 'Fast-paced documentary format showing real hurdles and raw unfiltered findings.',
        targetAudienceFit: 'Broad casual viewers and enthusiasts.',
      },
      {
        id: 'ang-3',
        title: 'The Hidden $10,000 Mistake (Value Focus)',
        hook: `This single mistake with ${topic} is quietly costing creators thousands of dollars...`,
        targetEmotion: 'FOMO & Protectiveness',
        difficultyScore: 3,
        uniquenessScore: 7,
        description: 'Focuses on risk mitigation and high-ROI fixes that anyone can execute immediately.',
        targetAudienceFit: 'Professionals and ambitious indie operators.',
      },
      {
        id: 'ang-4',
        title: 'The Cinematic Deep Dive (Story Arc)',
        hook: `The untold story of how ${topic} secretly changed an entire industry overnight...`,
        targetEmotion: 'Awe & Inspiration',
        difficultyScore: 8,
        uniquenessScore: 9,
        description: 'Epic narrative journey using dramatic lighting, archival visuals, and crescendo music.',
        targetAudienceFit: 'Fans of prestige film production and high-craft storytelling.',
      },
    ],
    recommendedAngleId: 'ang-1',
  };

  const narrative: NarrativeData = {
    corePremise: `Mastering "${topic}" requires discarding legacy myths and adopting a modern, data-backed execution framework.`,
    theme: 'Subversion of Convention & Actionable Mastery',
    pacingSummary: 'Rapid 3-second hook -> High-stakes dilemma -> 3 escalating tactical revelations -> Climax payoff -> Punchy CTA.',
    threeActStructure: {
      act1: {
        hook: 'Shatter audience preconceptions in under 3 seconds with a provocative counter-statement.',
        setup: 'Frame the universal frustration or expense associated with traditional approaches.',
        incitingIncident: 'Introduce the breakthrough data point that changes everything.',
      },
      act2: {
        conflict: 'Highlight why conventional advice causes creators to burn out or waste budget.',
        escalation: 'Walk through 2 practical real-world examples proving the failure mode.',
        turningPoint: 'Reveal the counter-intuitive framework that solves the riddle in minutes.',
      },
      act3: {
        climax: 'Show the before-and-after transformation with undeniable visual proof.',
        resolution: 'Summarize the 3 key rules to remember starting today.',
        finalPunchline: 'A sharp, memorable closer and community discussion prompt.',
      },
    },
    beats: [
      { beatNumber: 1, timecode: '00:00 - 00:04', beatTitle: 'The Jolt Hook', action: 'Direct camera gaze, sharp cutaway on audio snap.', emotionalShift: 'Skepticism to Hooked Attention' },
      { beatNumber: 2, timecode: '00:04 - 00:15', beatTitle: 'The Universal Struggle', action: 'Fast montage of real frustrations and bad advice.', emotionalShift: 'Shared empathy & frustration' },
      { beatNumber: 3, timecode: '00:15 - 00:35', beatTitle: 'The 3-Step Solution', action: 'On-screen step graphics with sound effects and screen recordings.', emotionalShift: 'Enlightenment & excitement' },
      { beatNumber: 4, timecode: '00:35 - 00:52', beatTitle: 'The Proof & Result', action: 'Split-screen comparison showing 3.4x performance lift.', emotionalShift: 'Validation & Trust' },
      { beatNumber: 5, timecode: '00:52 - 00:60', beatTitle: 'The Takeaway & CTA', action: 'Direct smile, crisp gesture towards comment section link.', emotionalShift: 'Empowered & Ready to act' },
    ],
  };

  const script: ScriptData = {
    estimatedDuration: '60 seconds',
    totalWordCount: 146,
    wpmCadence: 146,
    sections: [
      {
        id: 'sec-1',
        type: 'hook',
        timecode: '00:00 - 00:04',
        spokenAudio: `If you are still doing ${topic} the traditional way... you are leaving half your results on the table.`,
        screenVisual: 'Host looking directly into lens (35mm f/1.8). Quick camera snap zoom on the word "traditional". Glitch SFX.',
        toneCue: 'Sharp, urgent, conspiratorial',
        wordCount: 19,
      },
      {
        id: 'sec-2',
        type: 'intro',
        timecode: '00:04 - 00:16',
        spokenAudio: `Everyone told us to double down on volume. More hours, more gear, more stress. But the data shows something totally different.`,
        screenVisual: 'B-roll: Fast montage of exhausted creator staring at screen, followed by dynamic chart overlay showing fatigue drop.',
        toneCue: 'Reflective, relatable, pacing slightly slower',
        wordCount: 24,
      },
      {
        id: 'sec-3',
        type: 'body',
        timecode: '00:16 - 00:46',
        spokenAudio: `Here is the shift. First: stop guessing your hooks. Use audience drop-off heatmaps to locate where curiosity peaks. Second: align your visual framing every 4 seconds. And third: automate your pre-production shot list before turning on the camera.`,
        screenVisual: 'Kinetic 3-step checklist appears on screen. Neon highlight accents. Upbeat low-fi electronic percussion kicks in.',
        toneCue: 'Confident, authoritative, high-energy',
        wordCount: 44,
      },
      {
        id: 'sec-4',
        type: 'cta',
        timecode: '00:46 - 00:60',
        spokenAudio: `The creators winning right now aren't working longer—they have a unified operating system. Comment "STUDIO" below and I will send you the complete blueprint. Follow for part two!`,
        screenVisual: 'Host picks up script binder or points down at comment indicator. Animated bell & follow banner pops up.',
        toneCue: 'Warm, encouraging, commanding',
        wordCount: 30,
      },
    ],
  };

  const visuals: VisualsData = {
    visualTheme: 'Cyber-Minimalist Creator Studio',
    colorPalette: ['#0F172A (Deep Slate)', '#6366F1 (Indigo Violet)', '#10B981 (Emerald Green)', '#F59E0B (Amber Gold)'],
    lightingMood: 'High contrast key light at 45° with warm amber practical rim light in the background.',
    soundtrackSuggestion: 'Lo-fi neo-soul beat with punchy vinyl snare and warm synth bass line (95 BPM).',
    sfxCues: ['Swoosh on hook transition', 'Subtle digital click on bullet points', 'Bass riser into final CTA'],
    assets: [
      { timestamp: '00:02', shotType: 'Close-up (35mm)', onScreenVisual: 'Presenter intense eye-contact', bRollQuery: 'Cinematic studio creator lighting', graphicOverlay: 'Red "ALERT" tape boundary' },
      { timestamp: '00:12', shotType: 'Over-the-shoulder', onScreenVisual: 'Analytics graph showing viewer churn', bRollQuery: 'Computer dashboard analytics night', graphicOverlay: 'Downward red arrow trendline' },
      { timestamp: '00:25', shotType: 'Medium Dutch Angle', onScreenVisual: 'Demonstrating 3-step framework', bRollQuery: 'Hands sketching storyboard binder', graphicOverlay: 'Glowing checklist items (1, 2, 3)' },
      { timestamp: '00:50', shotType: 'Wide Studio Shot', onScreenVisual: 'Full setup with warm background lamp', bRollQuery: 'Aesthetic creator room setup neon', graphicOverlay: 'Comment badge animation' },
    ],
  };

  const shotList: ShotListData = {
    estimatedShootHours: 1.5,
    locationSetup: 'Home Studio or Co-working Pod with clean minimalist backdrop',
    equipmentList: ['Sony A7IV or iPhone 15 Pro in ProRes Log', '35mm f/1.8 Prime Lens', 'Wireless Lavalier Mic (DJI Mic 2)', 'Key Light Softbox (60W) + RGB Tube Rim Light'],
    shots: [
      { shotNumber: 1, duration: '6 sec', cameraMovement: 'Slow push in', lensFocalLength: '35mm', framing: 'Head & Shoulders Center', lightingSetup: 'Key 70%, Rim 40% Amber', talentAction: 'Delivers hook with commanding posture' },
      { shotNumber: 2, duration: '12 sec', cameraMovement: 'Static', lensFocalLength: '50mm', framing: 'Profile 45-degree angle', lightingSetup: 'Key 60%, Rim 50%', talentAction: 'Points toward graphics space on left side' },
      { shotNumber: 3, duration: '20 sec', cameraMovement: 'Handheld subtle motion', lensFocalLength: '24mm Wide', framing: 'Desk top-down view', lightingSetup: 'Overhead diffused light', talentAction: 'Demonstrating notes and pre-production binder' },
      { shotNumber: 4, duration: '14 sec', cameraMovement: 'Quick zoom cut', lensFocalLength: '35mm', framing: 'Medium close-up', lightingSetup: 'Key 80%, Rim 60%', talentAction: 'Delivers final CTA and smile to camera' },
    ],
  };

  const publishing: PublishingData = {
    titles: [
      { title: `Why 95% of Creators Fail at ${topic} (And the 3-Step Fix)`, viralScore: 96, targetVibe: 'Curiosity & FOMO' },
      { title: `I Tested ${topic} For 24 Hours... Here Is What Happened`, viralScore: 92, targetVibe: 'Experiment & Entertainment' },
      { title: `The Secret ${topic} Blueprint Nobody Talks About`, viralScore: 88, targetVibe: 'Insider Secret' },
    ],
    recommendedTitle: `Why 95% of Creators Fail at ${topic} (And the 3-Step Fix)`,
    seoDescription: `Discover the ultimate data-backed strategy for ${topic}. In this breakdown, we reveal the common mistakes draining your reach and the step-by-step framework to scale quality and consistency without burnout. Built with CineCraft OS.`,
    primaryHashtags: ['#ContentCreator', '#VideoProduction', '#CreatorEconomy', '#ViralStrategy', '#CineCraftOS'],
    optimalPostingTimes: [
      { day: 'Tuesday', window: '11:30 AM - 1:00 PM', reason: 'High lunch break mobile screen time' },
      { day: 'Thursday', window: '6:00 PM - 8:30 PM', reason: 'Peak evening engagement window for creative professionals' },
      { day: 'Sunday', window: '7:00 PM - 9:30 PM', reason: 'Pre-week inspiration and planning cycle' },
    ],
    thumbnailConcepts: [
      {
        conceptNumber: 1,
        foregroundFocalPoint: 'Expressive surprised creator face pointing to an analytics chart',
        backgroundElement: 'Split background: Half black-and-white (old way) vs vibrant neon cyan (new way)',
        textBadgeOverlay: 'STOP DOING THIS!',
        colorContrastRatio: '14.2:1 (Ultra High Readability)',
      },
      {
        conceptNumber: 2,
        foregroundFocalPoint: 'Close-up of camera lens with neon glowing text reflection',
        backgroundElement: 'Dark moody aesthetic studio bokeh',
        textBadgeOverlay: 'THE 3.4X SECRET',
        colorContrastRatio: '12.8:1 (Clean Minimalist)',
      },
    ],
  };

  return {
    id,
    title: topic,
    topic,
    platform,
    targetDuration: '60 seconds',
    targetAudience,
    tone,
    createdAt: now,
    updatedAt: now,
    currentStage: 1,
    completedStages: [1, 2, 3, 4, 5, 6, 7],
    research,
    angles,
    narrative,
    script,
    visuals,
    shotList,
    publishing,
  };
}

