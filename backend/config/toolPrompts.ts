export function buildPromptForTool(toolId: string, inputs: Record<string, any>): { systemPrompt: string; userPrompt: string } {
  switch (toolId) {
    case 'content-idea-generator': {
      const systemPrompt = `You are an elite Content Ideation Expert. Your goal is to generate high-virality, structured content ideas tailored to specific niches and audiences. 
Always return structured, beautifully formatted content with high editorial taste. You MUST respond with valid JSON in the exact required structure.`
      
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
      const systemPrompt = `You are a Master Content Strategist. Your expertise lies in transforming one piece of content into multiple tailored formats across different platforms (LinkedIn, X, Reels, Newsletters) while maintaining the core message and adapting to platform-specific algorithms. You MUST respond with valid JSON.`
      
      const source = inputs.sourceContent || ''
      const targetPlatforms = inputs.targetPlatforms || 'LinkedIn, X (Twitter), Instagram Reels, Email Newsletter'

      const userPrompt = `Repurpose the following core content into high-performing formats:
Source Content:
"""${source}"""

Target Platforms: ${targetPlatforms}

You MUST respond with valid JSON in this exact structure:
{
  "linkedin": "Full LinkedIn authority post",
  "instagram": "Instagram Reel script or carousel outline",
  "x": "Twitter thread",
  "youtube": "YouTube short script"
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'hook-generator': {
      const systemPrompt = `You are a Psychological Copywriter specializing in scroll-stopping hooks. You understand human psychology, curiosity gaps, and retention metrics. You generate hooks that maximize 3-second retention. You MUST respond with valid JSON.`
      
      const topic = inputs.topic || ''
      const trigger = inputs.trigger || 'Curiosity & Fear of Missing Out'
      const audience = inputs.audience || 'Creators & builders'

      const userPrompt = `Generate 10 viral hooks for:
Topic: "${topic}"
Emotional Trigger: "${trigger}"
Target Audience: "${audience}"

You MUST respond with valid JSON in this exact structure:
{
  "hooks": [
    {
      "style": "Hook style name (e.g. Contrarian, Curiosity Gap)",
      "hook": "The exact hook text"
    }
  ]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'daily-content-planner': {
      const systemPrompt = `You are a Social Media Manager and Content Architect. You automate 7-day posting blueprints with structured themes, formats, and optimal release strategies. You MUST respond with valid JSON.`
      
      const niche = inputs.niche || 'Digital Marketing'
      const platform = inputs.platform || 'Instagram & LinkedIn'
      const goal = inputs.goal || 'Authority & lead generation'
      const audience = inputs.audience || 'General'

      const userPrompt = `Create a 7-Day Content Masterplan for:
Niche: ${niche}
Primary Platform: ${platform}
Goal: ${goal}
Audience: ${audience}

You MUST respond with valid JSON in this exact structure:
{
  "topic": "Weekly theme",
  "format": "Primary content format",
  "hook": "Overall weekly hook/theme",
  "outline": [
    {
      "day": "Day 1",
      "postType": "Educational/Case Study/etc",
      "title": "Post title",
      "description": "Post details"
    }
  ],
  "cta": "Weekly call to action"
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'reel-script-builder': {
      const systemPrompt = `You are a Short-Form Video Director. You construct viral short-form scripts with second-by-second pacing, audio suggestions, and visual cues. You MUST respond with valid JSON.`
      
      const concept = inputs.concept || ''
      const duration = inputs.duration || '30s'
      const tone = inputs.tone || 'Fast-paced, energetic'
      const audience = inputs.audience || 'General'

      const userPrompt = `Write a viral short-form video script (${duration}) for:
Idea/Concept: "${concept}"
Tone: "${tone}"
Audience: "${audience}"

You MUST respond with valid JSON in this exact structure:
{
  "hook": "The exact 3-second opening hook",
  "body": "The main content and value delivery",
  "cta": "Call to action",
  "timestamps": [
    {
      "time": "00:00 - 00:03",
      "action": "Visual/Audio cue description"
    }
  ]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'clip-finder': {
      const systemPrompt = `You are an AI Video Editor. You scan transcripts or long video topics to pinpoint viral micro-moments with virality scores. You MUST respond with valid JSON.`
      
      const transcript = inputs.transcript || ''

      const userPrompt = `Scan this video transcript and identify the most viral standalone clips:
Transcript:
"""${transcript}"""

You MUST respond with valid JSON in this exact structure:
{
  "clips": [
    {
      "title": "Punchy clip title",
      "startTimestamp": "00:00",
      "endTimestamp": "00:30",
      "hook": "The opening words of the clip",
      "reason": "Why this clip works for short-form",
      "caption": "Suggested social media caption"
    }
  ]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'thumbnail-ideator': {
      const systemPrompt = `You are a YouTube Thumbnail Designer. You create high-CTR thumbnail concepts with strong visual composition, text overlays, and contrast guidance. You MUST respond with valid JSON.`
      
      const title = inputs.videoTitle || inputs.title || ''
      const topic = inputs.topic || ''
      const audience = inputs.audience || 'YouTube viewers'

      const userPrompt = `Develop high-CTR thumbnail concepts for:
Title: "${title}"
Topic: "${topic}"
Audience: "${audience}"

You MUST respond with valid JSON in this exact structure:
{
  "concepts": [
    {
      "visualConcept": "Description of the main image",
      "thumbnailText": "Text overlay (max 3 words)",
      "composition": "Layout and framing",
      "emotion": "Target viewer emotion",
      "background": "Background details"
    }
  ]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'caption-assistant': {
      const systemPrompt = `You are a Social Media Copywriter. You craft high-converting captions with opening punchlines, formatting, and high-relevance hashtags. You MUST respond with valid JSON.`
      
      const content = inputs.content || inputs.topic || ''
      const imageDescription = inputs.imageDescription || 'N/A'
      const platform = inputs.platform || 'Instagram'
      const tone = inputs.tone || 'Engaging & Authentic'

      const userPrompt = `Write an optimized caption for:
Content/Topic: "${content}"
Image Description: "${imageDescription}"
Platform: "${platform}"
Tone: "${tone}"

You MUST respond with valid JSON in this exact structure:
{
  "caption": "The full formatted caption text",
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'cta-generator': {
      const systemPrompt = `You are a Conversion Rate Optimization Expert. You engineer calls-to-action designed to trigger comments, shares, saves, and bio link clicks. You MUST respond with valid JSON.`
      
      const content = inputs.content || inputs.offer || ''
      const goal = inputs.goal || 'Comments to trigger automation DM'
      const audience = inputs.audience || 'General'

      const userPrompt = `Generate high-conversion Call-To-Action (CTA) formulas for:
Content/Value: "${content}"
Goal: "${goal}"
Audience: "${audience}"

You MUST respond with valid JSON in this exact structure:
{
  "ctas": [
    {
      "type": "CTA Strategy (e.g. FOMO, Value-Exchange)",
      "text": "The exact CTA copy"
    }
  ]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'comment-analyzer': {
      const systemPrompt = `You are an Audience Insights Analyst. You analyze audience comments for sentiment, underlying pain points, objections, and hidden content goldmines. You MUST respond with valid JSON.`
      
      const comments = inputs.comments || ''

      const userPrompt = `Analyze the following audience comments:
"""${comments}"""

You MUST respond with valid JSON in this exact structure:
{
  "sentiment": {
    "positive": "percentage",
    "negative": "percentage",
    "neutral": "percentage"
  },
  "themes": ["Recurring topic 1", "Recurring topic 2"],
  "questions": ["Common question 1", "Common question 2"],
  "complaints": ["Objection 1", "Objection 2"],
  "opportunities": ["Content idea 1", "Content idea 2"]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'comment-to-content': {
      const systemPrompt = `You are a Community Engagement Strategist. You convert real audience questions and spicy comments into viral reply videos and educational carousels. You MUST respond with valid JSON.`
      
      const comments = inputs.comments || inputs.comment || ''

      const userPrompt = `Convert audience comments into viral content assets:
Comments: "${comments}"

You MUST respond with valid JSON in this exact structure:
{
  "ideas": [
    {
      "idea": "Content title or concept",
      "format": "Suggested format (e.g. Short, Carousel)",
      "sourceComment": "The original comment addressed",
      "reason": "Why this will perform well"
    }
  ]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'creator-research-assistant': {
      const systemPrompt = `You are a specialized Creator Research Assistant. You dive deep into niche trends, competitor content gaps, and data-backed viral angles. Do not invent sources. You MUST respond with valid JSON.`
      
      const topic = inputs.topic || ''

      const userPrompt = `Conduct creator intelligence research for:
Topic: "${topic}"

Important: Do not invent sources. If you cannot verify facts, state that they require verification.

You MUST respond with valid JSON in this exact structure:
{
  "keyFacts": ["Fact 1", "Fact 2"],
  "concepts": ["Concept 1", "Concept 2"],
  "angles": ["Angle 1", "Angle 2"],
  "questions": ["Question 1", "Question 2"],
  "sources": ["Source 1 or Note about verification"],
  "contentStructure": ["Section 1", "Section 2"]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'voice-replicator': {
      const systemPrompt = `You are an AI Ghostwriter and Voice Replicator. You decode personal writing style, tone nuances, and cadence to generate authentic on-brand content. You MUST respond with valid JSON.`
      
      const writingSamples = inputs.writingSamples || inputs.sample || ''
      const newTopic = inputs.newTopic || 'Consistency vs Intensity'

      const userPrompt = `Analyze this writing sample and generate content in the same voice:
Sample:
"""${writingSamples}"""

New Topic: "${newTopic}"

You MUST respond with valid JSON in this exact structure:
{
  "styleAnalysis": {
    "tone": "Tone description",
    "vocabulary": "Vocabulary analysis",
    "sentenceStyle": "Sentence length and structure",
    "hookStyle": "How they open",
    "ctaStyle": "How they close"
  },
  "generatedContent": "The newly generated post on the new topic in their exact voice"
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'podcast-assistant': {
      const systemPrompt = `You are a Podcast Producer. You produce complete episode guides: provocative interview questions, intro hooks, and show notes from transcripts. You MUST respond with valid JSON.`
      
      const transcript = inputs.transcript || ''

      const userPrompt = `Build a podcast episode breakdown from this transcript:
Transcript:
"""${transcript}"""

You MUST respond with valid JSON in this exact structure:
{
  "title": "Episode title",
  "description": "Episode description",
  "chapters": [
    {
      "timestamp": "00:00",
      "title": "Chapter title"
    }
  ],
  "highlights": ["Highlight 1", "Highlight 2"],
  "keyTakeaways": ["Takeaway 1", "Takeaway 2"],
  "socialPosts": ["Post idea 1", "Post idea 2"]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'creator-workspace': {
      const systemPrompt = `You are an Ideation Studio Assistant. You help convert raw notes into structured creative production briefs and assist with the current project stage. You MUST respond with valid JSON.`
      
      const idea = inputs.idea || inputs.notes || ''
      const research = inputs.research || ''
      const script = inputs.script || ''
      const published = inputs.published || ''

      const userPrompt = `Assist with the Creator Workspace based on the current context.
Idea/Notes: ${idea}
Research: ${research}
Script: ${script}
Published info: ${published}

Provide a structured production brief for the next stage.
You MUST respond with valid JSON in this exact structure:
{
  "currentStage": "Ideation / Scripting / Production / Post",
  "nextSteps": ["Step 1", "Step 2"],
  "generatedAsset": "The script, outline, or plan generated based on the inputs",
  "missingContext": "What you need from the creator next"
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'content-recycler': {
      const systemPrompt = `You are a Content Recycler. You revitalize past top-performing winners with fresh angles, contrarian framing, and updated data. You MUST respond with valid JSON.`
      
      const contentHistory = inputs.contentHistory || inputs.oldPost || ''

      const userPrompt = `Architect modern recycled iterations from this past content:
Content History:
"""${contentHistory}"""

You MUST respond with valid JSON in this exact structure:
{
  "recommendations": [
    {
      "content": "The new content piece or title",
      "action": "Update / Invert / Expand",
      "reason": "Why this works now",
      "newFormat": "The target format"
    }
  ]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'brand-pitch-builder': {
      const systemPrompt = `You are a Brand Sponsorship Manager. You generate high-response brand sponsorship pitches, deliverables packaging, and rate card guidelines. You MUST respond with valid JSON.`
      
      const creatorProfile = inputs.creatorProfile || inputs.stats || ''
      const brandInformation = inputs.brandInformation || inputs.brand || ''
      const campaignInformation = inputs.campaignInformation || inputs.concept || ''

      const userPrompt = `Write an irresistible brand partnership sponsorship pitch:
Creator Profile: ${creatorProfile}
Brand Info: ${brandInformation}
Campaign Info: ${campaignInformation}

You MUST respond with valid JSON in this exact structure:
{
  "pitch": "The full email pitch body",
  "proposal": "Campaign proposal summary",
  "deliverables": ["Deliverable 1", "Deliverable 2"],
  "valueProposition": "Why this partnership makes sense",
  "followUp": "Suggested follow-up timeline/message"
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'ai-content-director': {
      const systemPrompt = `You are an AI Content Director. You oversee multi-stage end-to-end creative direction: Research → Angles → Script → Visuals → Shot List → Publishing Copy. You MUST respond with valid JSON.`
      
      const concept = inputs.concept || ''
      const platform = inputs.platform || ''
      const persona = inputs.persona || ''
      const goal = inputs.goal || ''

      const userPrompt = `Direct a high-production creator video.
Concept: "${concept}"
Platform: "${platform}"
Persona: "${persona}"
Goal: "${goal}"

You MUST respond with valid JSON in this exact structure:
{
  "research": "Deep research and premise",
  "angles": ["Angle 1", "Angle 2", "Angle 3"],
  "narrative": "Story arc",
  "script": "Full line-by-line script",
  "visuals": "Art direction and visual cues",
  "bRoll": ["B-Roll shot 1", "B-Roll shot 2"],
  "shotList": ["Shot 1", "Shot 2"],
  "publishingCopy": "Title variants and description"
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'creator-second-brain': {
      const systemPrompt = `You are a Creator Second Brain. You synthesize research, literature notes, and loose thoughts into interconnected content assets. Use stored creator content as context. Do not invent content not present. You MUST respond with valid JSON.`
      
      const savedContent = inputs.savedContent || inputs.notes || ''
      const searchQuery = inputs.searchQuery || ''
      const question = inputs.question || ''

      const userPrompt = `Act as the Creator's Second Brain.
Saved Content / Notes: """${savedContent}"""
Search/Question: "${searchQuery || question}"

Only use the provided knowledge. Do not invent content not present.
You MUST respond with valid JSON in this exact structure:
{
  "answer": "Direct answer to the query",
  "relevantConcepts": ["Concept 1", "Concept 2"],
  "sourcesUsed": ["Source note 1"],
  "contentSpawns": ["Idea to create from this knowledge"]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'ai-screenplay-workspace': {
      const systemPrompt = `You are a Hollywood Screenplay Generator. You create screenplay and narrative scenes with dialogue, action, and sluglines. You MUST respond with valid JSON.`
      
      const characters = inputs.characters || ''
      const locations = inputs.locations || ''
      const scenes = inputs.scenes || ''
      const storyContext = inputs.storyContext || inputs.logline || ''
      const userRequest = inputs.userRequest || 'Generate next scene'

      const userPrompt = `Write or analyze a screenplay based on the context.
Story Context: ${storyContext}
Characters: ${characters}
Locations: ${locations}
Scenes: ${scenes}
Request: ${userRequest}

You MUST respond with valid JSON in this exact structure:
{
  "dialogue": ["Character 1: ...", "Character 2: ..."],
  "action": "Action lines and visual description",
  "sceneContinuation": "Next beats in the scene",
  "rewrites": "Suggested improvements",
  "summaries": "Scene summary"
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'autonomous-content-pipeline': {
      const systemPrompt = `You are an Autonomous Content Pipeline Engine. You spawn a seed idea into YouTube Script, Reels, LinkedIn, X, Captions, and a Calendar. You MUST respond with valid JSON.`
      
      const topic = inputs.topic || ''
      const audience = inputs.audience || ''
      const objective = inputs.objective || ''

      const userPrompt = `Execute the Autonomous Multi-Asset Content Pipeline:
Topic: "${topic}"
Audience: "${audience}"
Objective: "${objective}"

You MUST respond with valid JSON in this exact structure:
{
  "idea": "Core premise",
  "research": "Key insights",
  "youtubeScript": "Full anchor script",
  "reel1": "Reel 1 script",
  "reel2": "Reel 2 script",
  "reel3": "Reel 3 script",
  "linkedinPost": "LinkedIn article",
  "xThread": "Twitter thread",
  "captions": "Universal captions",
  "publishingCalendar": ["Day 1: ...", "Day 2: ..."]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    case 'ai-creative-producer': {
      const systemPrompt = `You are an Executive AI Creative Producer. You strategically plan Audience, Content Pillars, 30-Day Strategy, Today's Content, and Performance Insights. You MUST respond with valid JSON.`
      
      const creatorGoal = inputs.creatorGoal || ''
      const audience = inputs.audience || ''
      const niche = inputs.niche || ''
      const platforms = inputs.platforms || ''
      const availableTime = inputs.availableTime || ''
      const postingFrequency = inputs.postingFrequency || ''
      const businessObjective = inputs.businessObjective || ''
      const performanceHistory = inputs.performanceHistory || ''

      const userPrompt = `Formulate a master strategy as the AI Creative Producer:
Goal: ${creatorGoal}
Audience: ${audience}
Niche: ${niche}
Platforms: ${platforms}
Time: ${availableTime}
Frequency: ${postingFrequency}
Business Obj: ${businessObjective}
History: ${performanceHistory}

You MUST respond with valid JSON in this exact structure:
{
  "audience": {
    "demographics": "...",
    "painPoints": "..."
  },
  "contentPillars": ["Pillar 1", "Pillar 2"],
  "thirtyDayStrategy": ["Week 1 Focus", "Week 2 Focus"],
  "todaysContent": {
    "title": "...",
    "format": "...",
    "script": "..."
  },
  "performanceInsights": ["Insight 1", "Insight 2"],
  "adaptationRecommendations": ["Rec 1", "Rec 2"]
}
Do NOT include backticks or explanation outside the JSON.`
      return { systemPrompt, userPrompt }
    }

    default: {
      const systemPrompt = `You are an AI assistant. Output JSON only.`
      const userPrompt = `Generate output for tool "${toolId}" with inputs: ${JSON.stringify(inputs)}. Respond in valid JSON format.`
      return { systemPrompt, userPrompt }
    }
  }
}
