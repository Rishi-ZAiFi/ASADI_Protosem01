/**
 * Prompt Engineering Service for CreatorSpace AI
 * Builds structured, format-adapted prompts for social media content creation.
 */

export const FORMAT_TYPES = {
  REEL: 'Instagram Reel',
  CAROUSEL: 'Carousel',
  CAPTION: 'Caption',
  STORY: 'Story',
};

/**
 * Builds the system instruction tailored for social media strategy
 */
export function buildSystemInstruction() {
  return `You are an elite social media content strategist and creative copywriter for CreatorSpace AI.
Your mission is to produce viral, high-converting, audience-tailored social media content.

Core Guidelines:
1. Always adhere strictly to the requested content format, tone, and target audience.
2. Produce clean, immediately publishable copy.
3. NEVER generate generic conversational filler like "Here is your content" or "Sure, I'd be happy to help".
4. Do NOT invent fake statistics, unverifiable scientific claims, or misleading facts.
5. Use clear, markdown-formatted headings (##, ###) and bullet points to organize each section logically.
6. Make hooks captivating, relatable, and designed to stop the scroll.`;
}

/**
 * Builds user prompt adapted to specific formats
 */
export function buildPrompt({ topic, format, audience, tone }) {
  const normalizedFormat = (format || 'Caption').trim();
  const normalizedAudience = (audience || 'General audience').trim();
  const normalizedTone = (tone || 'Engaging').trim();
  const normalizedTopic = topic.trim();

  let formatSpecificGuidelines = '';

  switch (normalizedFormat) {
    case 'Instagram Reel':
    case 'Reel':
      formatSpecificGuidelines = `
FORMAT: INSTAGRAM REEL (15-60 seconds)
Please structure your response with the following exact sections:

## 🪝 The Hook (0-3s)
Provide 2-3 high-retention opening hooks (verbal hook + visual action hook to stop scrolling).

## 🎬 Scene-by-Scene Script & Visuals
Break down into 3-5 distinct scenes:
- **Scene [X] ([Timestamp])**:
  - **Visual / Action**: Describe camera angle, b-roll, or facial expression.
  - **On-Screen Text**: Punchy captions for viewers watching on mute.
  - **Spoken Audio**: Word-for-word script in the requested tone.

## 💡 On-Screen Text Suggestions
List quick bulleted highlights or overlay stickers to maintain visual rhythm.

## 📝 High-Converting Caption
Write a compelling feed caption that expands on the reel topic with an engaging call-to-action (CTA).

## 🏷️ Strategic Hashtags
Provide 10-15 well-researched, categorized hashtags (niche, broad, and trending).
`;
      break;

    case 'Carousel':
      formatSpecificGuidelines = `
FORMAT: MULTI-SLIDE CAROUSEL (5-8 Slides)
Please structure your response with the following exact sections:

## 📌 Attention-Grabbing Title & Cover (Slide 1)
- **Cover Headline**: Bold, curiosity-inducing title.
- **Subtitle / Promise**: What value the reader will get.
- **Suggested Cover Visual**: Graphic, color scheme, or illustration direction.

## 📑 Slide-by-Slide Content (Slides 2 to N-1)
For each slide (Slides 2 to 6/7):
- **Slide [X] Title**:
- **Main Value / Takeaway**: 2-3 concise, digestible bullet points (under 30 words).
- **Suggested Visual / Layout**: Layout idea (e.g., comparison table, diagram, icon, quote box).

## 🏁 Final Slide (Slide N) - Call to Action
- **Closing Punchline**: Memorable summary.
- **Action Step**: Clear prompt to save, share, comment, or check link in bio.

## 📝 Accompanying Caption
A full caption that provides context and encourages saving the carousel.

## 🏷️ Strategic Hashtags
Provide 10-15 relevant hashtags tailored for carousel discoverability.
`;
      break;

    case 'Story':
      formatSpecificGuidelines = `
FORMAT: INSTAGRAM / SOCIAL STORY SEQUENCE (3-5 Frames)
Please structure your response with the following exact sections:

## 📱 Frame 1: The Curiosity Spark
- **Visual Direction**: Background photo, video style, or selfie camera setup.
- **On-Screen Text**: Tease the topic or ask an intriguing question.
- **Interactive Element**: e.g., Poll sticker, Slider emoji, or Quiz question with options.

## 📱 Frame 2-4: The Value & Story Delivery
For each sequential frame:
- **Frame [X] Visual**:
- **Text Overlay**: Short, readable bite-sized paragraphs.
- **Engagement Trigger**: e.g., "Tap for the next part", "Did you know?", etc.

## 📱 Final Frame: The Call to Action
- **Visual Direction**:
- **Closing Message**:
- **Sticker / Action**: Question box, Link sticker, or DM trigger ("DM me 'KEYWORD'").

## 💡 Creator Pro-Tips
2 actionable tips for filming or posting this story for maximum completion rate.
`;
      break;

    case 'Caption':
    default:
      formatSpecificGuidelines = `
FORMAT: SOCIAL MEDIA CAPTION
Please structure your response with the following exact sections:

## 🪝 Attention-Grabbing First Line
Provide 2 strong hook options that preview before the "...more" cut-off.

## 📖 Main Caption Body
A well-structured narrative or value-packed breakdown using short paragraphs, line breaks, and emojis matching the chosen tone.

## 🎯 High-Converting Call to Action (CTA)
A clear, specific question or prompt that drives comments, saves, or shares.

## 🏷️ Curated Hashtags
10-15 targeted hashtags organized by broad reach, community, and niche relevance.
`;
      break;
  }

  return `Topic / Content Idea: "${normalizedTopic}"
Target Audience: ${normalizedAudience}
Tone of Voice: ${normalizedTone}
Content Format: ${normalizedFormat}

${formatSpecificGuidelines}

Deliver the output with clean formatting, crisp headers, and actionable creative content.`;
}
