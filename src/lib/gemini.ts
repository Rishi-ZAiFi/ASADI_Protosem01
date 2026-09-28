import { GoogleGenAI, Type } from '@google/genai';
import { GenerateHooksRequest, HookItem, HOOK_STYLES } from '@/types';

// The 10 mandatory styles in exact order
const REQUIRED_STYLES = [
  'Curiosity',
  'Question',
  'Contrarian',
  'Bold Claim',
  'Statistic/Data',
  'Story',
  'Problem/Pain Point',
  'Fear/Urgency',
  'Future/Possibility',
  'Surprise/Twist',
] as const;

export async function generateHooksWithGemini(
  params: GenerateHooksRequest
): Promise<HookItem[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add your valid Google Gemini API key to the .env file.'
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const audienceText = params.audience?.trim()
    ? `Target Audience: ${params.audience.trim()}`
    : 'Target Audience: General audience interested in this space';

  const systemInstruction = `You are HookForge, an elite viral copywriter and content strategist specializing in creating irresistible, scroll-stopping hooks for social media.
Your mission is to generate EXACTLY 10 distinct, high-performing hooks for a given topic, tailored precisely to the specified platform, audience, and tone.

Each of the 10 hooks MUST correspond to one of the following 10 styles in this exact order:
1. Curiosity: Stirs intense intrigue or hints at an unspoken secret.
2. Question: A provocative, thought-provoking question that demands an answer.
3. Contrarian: Challenges conventional wisdom or attacks a sacred cow.
4. Bold Claim: A definitive, confident statement that stops people in their tracks.
5. Statistic/Data: A data-centric perspective highlighting trends or measurable reality.
6. Story: The opening line of a captivating personal or observational narrative.
7. Problem/Pain Point: Directly highlights an acute frustration or obstacle.
8. Fear/Urgency: Creates FOMO, warns of costly mistakes, or sparks timely concern.
9. Future/Possibility: Inspires with what could be or paints an exciting vision.
10. Surprise/Twist: Subverts expectations with an unexpected juxtaposition or pivot.

CRITICAL STATISTIC SAFETY RULE:
For the 'Statistic/Data' hook:
- NEVER invent statistics, percentages, fake study figures, sample sizes, or fabricated claims.
- If the user did not supply a verified statistic in the prompt, frame the hook around the data reality, trend shifts, or verifiable metrics WITHOUT inventing numbers.
- BAD EXAMPLE: "87% of creators fail because of one mistake."
- GOOD EXAMPLE: "The data behind why most creators lose momentum points to a single hidden bottleneck."

REQUIREMENTS:
- Each hook must feel organic and tailored to the platform (${params.platform}) and tone (${params.tone}).
- The hooks must be genuinely different angles and frameworks—do NOT just rewrite the same sentence 10 times.
- Format strictly as JSON with exactly 10 hook objects.`;

  const userPrompt = `Generate 10 viral hooks for:
Topic: "${params.topic}"
${audienceText}
Platform: ${params.platform}
Tone: ${params.tone}

Output exactly 10 hooks covering the 10 styles:
1. Curiosity
2. Question
3. Contrarian
4. Bold Claim
5. Statistic/Data
6. Story
7. Problem/Pain Point
8. Fear/Urgency
9. Future/Possibility
10. Surprise/Twist`;

  // We attempt gemini-2.5-pro first as requested, with fallback to gemini-2.0-flash if 2.5-pro is unavailable
  const modelsToTry = ['gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  let lastError: Error | null = null;
  let rawText = '';

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hooks: {
                type: Type.ARRAY,
                description: 'An array of exactly 10 hooks with their corresponding style.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    style: {
                      type: Type.STRING,
                      description: 'The style of hook (e.g., Curiosity, Question, Contrarian, etc.)',
                    },
                    hook: {
                      type: Type.STRING,
                      description: 'The hook copy.',
                    },
                  },
                  required: ['style', 'hook'],
                },
              },
            },
            required: ['hooks'],
          },
        },
      });

      rawText = response.text || '';
      if (rawText) {
        break; // Successfully got response
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      lastError = new Error(errMessage);
      // If error indicates model not found or unsupported, continue to next model; else break if invalid key
      if (
        errMessage.includes('API_KEY_INVALID') ||
        errMessage.includes('API key not valid') ||
        errMessage.includes('PERMISSION_DENIED')
      ) {
        throw new Error(
          'Invalid Gemini API key. Please verify your GEMINI_API_KEY in the .env file.'
        );
      }
    }
  }

  if (!rawText) {
    throw new Error(
      lastError?.message || 'Failed to receive a response from Gemini. Please try again.'
    );
  }

  // Parse structured JSON
  let parsedData: { hooks?: Array<{ style?: string; hook?: string }> };
  try {
    const cleaned = rawText.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    parsedData = JSON.parse(cleaned);
  } catch {
    throw new Error('Received an unparseable response from Gemini. Please regenerate.');
  }

  if (!parsedData.hooks || !Array.isArray(parsedData.hooks) || parsedData.hooks.length === 0) {
    throw new Error('Gemini response did not contain the expected hooks array.');
  }

  // Validate and normalize exactly 10 hooks
  const validatedHooks: HookItem[] = [];

  for (let i = 0; i < REQUIRED_STYLES.length; i++) {
    const targetStyle = REQUIRED_STYLES[i];
    // Find matching hook from response or use the i-th item
    const matched =
      parsedData.hooks.find(
        (h) => h.style?.toLowerCase() === targetStyle.toLowerCase()
      ) || parsedData.hooks[i];

    if (matched && matched.hook && matched.hook.trim()) {
      validatedHooks.push({
        id: i + 1,
        style: targetStyle,
        hook: matched.hook.trim(),
      });
    } else {
      // Fallback if missing
      validatedHooks.push({
        id: i + 1,
        style: targetStyle,
        hook: `Discover how ${params.topic} is transforming the game for ${params.platform}.`,
      });
    }
  }

  if (validatedHooks.length !== 10) {
    throw new Error(`Expected exactly 10 hooks, received ${validatedHooks.length}.`);
  }

  return validatedHooks;
}
