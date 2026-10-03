import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { RunnableSequence, RunnableLambda } from '@langchain/core/runnables';
import { LangChainTracer } from '@langchain/core/tracers/tracer_langchain';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import {
  GenerateHooksRequest,
  HookItem,
  HOOK_STYLES,
  HookStyle,
  MultiAgentPipelineResult,
} from '@/types';

// The 10 mandatory styles in exact order
export const REQUIRED_HOOK_STYLES = [
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

// Candidate models in priority order with instant fallback resilience
const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-flash-lite-latest',
];

// Zod schemas for structured outputs
const HookListSchema = z.object({
  hooks: z
    .array(
      z.object({
        style: z.string().describe('The style of hook (e.g. Curiosity, Question, Contrarian)'),
        hook: z.string().describe('The hook copy text'),
      })
    )
    .describe('Array of 10 hooks matching the required styles'),
});

const CriticEvaluationSchema = z.object({
  evaluations: z
    .array(
      z.object({
        style: z.string().describe('The hook style evaluated'),
        score: z.number().describe('Rating from 1 to 10 for scroll-stopping impact'),
        critique: z.string().describe('Detailed evaluation of strengths and weaknesses'),
        suggestions: z.string().describe('Specific, actionable guidance for the Refiner agent'),
        isSafeStatistic: z
          .boolean()
          .describe('True if no fabricated or fake numbers were used in the Statistic/Data hook'),
      })
    )
    .describe('Evaluations for each of the 10 hooks'),
  overallFeedback: z
    .string()
    .describe('High-level assessment of platform alignment, audience fit, and tone consistency'),
});

/**
 * Safely resolves the GEMINI_API_KEY from process.env or .env file.
 * Also synchronizes LANGSMITH_* environment variables with LangChain standards.
 */
export function getGeminiApiKey(): string | null {
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey && envKey.trim() !== '' && envKey !== 'your_gemini_api_key_here') {
    syncLangSmithEnv();
    return envKey.trim();
  }

  const candidateFiles = ['.env.local', '.env'];
  for (const file of candidateFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
          const [k, ...vParts] = trimmed.split('=');
          const key = k.trim();
          const val = vParts.join('=').trim().replace(/^["']|["']$/g, '');
          if (val) {
            process.env[key] = val;
          }
        }
      } catch {
        // Ignore file read error
      }
    }
  }

  syncLangSmithEnv();
  const loadedKey = process.env.GEMINI_API_KEY;
  return loadedKey && loadedKey !== 'your_gemini_api_key_here' ? loadedKey.trim() : null;
}

function syncLangSmithEnv(): void {
  if (process.env.LANGSMITH_API_KEY && !process.env.LANGCHAIN_API_KEY) {
    process.env.LANGCHAIN_API_KEY = process.env.LANGSMITH_API_KEY;
  }
  if (process.env.LANGSMITH_TRACING && !process.env.LANGCHAIN_TRACING_V2) {
    process.env.LANGCHAIN_TRACING_V2 = process.env.LANGSMITH_TRACING;
  }
  if (process.env.LANGSMITH_PROJECT && !process.env.LANGCHAIN_PROJECT) {
    process.env.LANGCHAIN_PROJECT = process.env.LANGSMITH_PROJECT;
  }
}

/**
 * Invokes a structured LLM with automated model fallback to protect against
 * single-model rate limits (429) or transient API errors (503/404).
 */
async function invokeStructuredWithFallback<T>(
  schema: z.ZodType<T>,
  messages: [SystemMessage, HumanMessage],
  apiKey: string,
  runName: string,
  config?: any
): Promise<T> {
  let lastError: Error | null = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const llm = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey,
        maxRetries: 0,
      }).withStructuredOutput(schema);

      const invokeConfig = {
        runName,
        ...(config || {}),
      };

      return (await llm.invoke(messages, invokeConfig)) as T;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      lastError = new Error(msg);

      if (
        msg.includes('API_KEY_INVALID') ||
        msg.includes('API key not valid') ||
        msg.includes('PERMISSION_DENIED')
      ) {
        throw new Error(
          'Invalid Gemini API key. Please verify your GEMINI_API_KEY in the .env file.'
        );
      }

      console.warn(`[${runName}] Model ${modelName} error (${msg.slice(0, 100)}). Trying fallback...`);
    }
  }

  throw (
    lastError ||
    new Error(`All Gemini models failed to generate response for ${runName}. Please try again.`)
  );
}

// ============================================================================
// AGENT 1: HOOK STRATEGIST AGENT
// ============================================================================
export const hookStrategistAgent = RunnableLambda.from(
  async (input: GenerateHooksRequest, config) => {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in .env file.');
    }

    const audienceText = input.audience?.trim()
      ? `Target Audience: ${input.audience.trim()}`
      : 'Target Audience: General audience interested in this topic';

    const systemPrompt = `You are the Hook Strategist Agent, an elite viral copywriter and creative ideation strategist.
Your mission is to generate the initial draft of EXACTLY 10 distinct, high-impact hooks for the given topic, tailored precisely to the specified platform and tone.

Each of the 10 hooks MUST correspond to one of the following 10 styles in this exact order:
1. Curiosity: Stirs intense intrigue or hints at an unspoken secret.
2. Question: A provocative question that demands an immediate reaction.
3. Contrarian: Challenges common advice or attacks conventional wisdom.
4. Bold Claim: A definitive, unapologetic statement that stops people in their tracks.
5. Statistic/Data: A data-centric perspective highlighting trends or measurable realities WITHOUT inventing numbers.
6. Story: The opening line of a captivating personal or observational narrative.
7. Problem/Pain Point: Directly targets an acute frustration or bottleneck.
8. Fear/Urgency: Warns of costly mistakes or creates urgency.
9. Future/Possibility: Inspires with what could be or paints a forward-looking vision.
10. Surprise/Twist: Subverts expectations with an unexpected juxtaposition.

CRITICAL STATISTIC SAFETY RULE:
For the 'Statistic/Data' hook:
- NEVER invent statistics, fake study figures, sample sizes, or fabricated percentages.
- If the user did not supply a verified statistic in the prompt, frame the hook around measurable trend shifts or data realities WITHOUT fabricating numbers.
- BAD EXAMPLE: "87% of engineers don't know how to code."
- GOOD EXAMPLE: "The data behind how engineers are spending their sprint time is shifting faster than ever."

Platform: ${input.platform}
Tone: ${input.tone}
Return strictly 10 hook objects corresponding to these 10 styles.`;

    const userPrompt = `Topic: "${input.topic}"
${audienceText}
Platform: ${input.platform}
Tone: ${input.tone}

Generate the initial 10 hooks covering all 10 styles.`;

    const res = await invokeStructuredWithFallback(
      HookListSchema,
      [new SystemMessage(systemPrompt), new HumanMessage(userPrompt)],
      apiKey,
      'Hook Strategist Agent LLM',
      config
    );

    return {
      ...input,
      initialHooks: res.hooks,
    };
  }
).withConfig({ runName: 'Hook Strategist Agent' });

// ============================================================================
// AGENT 2: HOOK CRITIC AGENT
// ============================================================================
export const hookCriticAgent = RunnableLambda.from(
  async (
    input: GenerateHooksRequest & { initialHooks: Array<{ style: string; hook: string }> },
    config
  ) => {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in .env file.');
    }

    const systemPrompt = `You are the Hook Critic Agent, a world-class content editor and viral copy evaluator.
Your mission is to rigorously analyze and evaluate the 10 hooks produced by the Hook Strategist Agent.

Evaluate each hook for:
1. Attention-grabbing potential (scroll-stopping power in the first 3-5 words)
2. Relevance to topic: "${input.topic}"
3. Platform suitability: Format and cadence appropriate for ${input.platform}
4. Audience resonance: Compelling for ${input.audience || 'the target audience'}
5. Tone consistency: Matches the requested ${input.tone} tone
6. Style authenticity: Does the hook authentically match its declared style?
7. STATISTIC SAFETY: For the 'Statistic/Data' hook, verify that NO fake percentages, studies, or numbers were invented. If fabricated numbers are found, flag isSafeStatistic=false and instruct the Refiner to reframe.

Provide actionable, specific recommendations for the Hook Refiner Agent for each hook, and summarize overall feedback.`;

    const userPrompt = `Topic: "${input.topic}"
Platform: ${input.platform}
Tone: ${input.tone}

Initial Hooks from Hook Strategist Agent:
${JSON.stringify(input.initialHooks, null, 2)}

Provide detailed evaluation and specific improvement suggestions for each hook.`;

    const res = await invokeStructuredWithFallback(
      CriticEvaluationSchema,
      [new SystemMessage(systemPrompt), new HumanMessage(userPrompt)],
      apiKey,
      'Hook Critic Agent LLM',
      config
    );

    return {
      ...input,
      critique: res,
    };
  }
).withConfig({ runName: 'Hook Critic Agent' });

// ============================================================================
// AGENT 3: HOOK REFINER AGENT
// ============================================================================
export const hookRefinerAgent = RunnableLambda.from(
  async (
    input: GenerateHooksRequest & {
      initialHooks: Array<{ style: string; hook: string }>;
      critique: z.infer<typeof CriticEvaluationSchema>;
    },
    config
  ) => {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in .env file.');
    }

    const systemPrompt = `You are the Hook Refiner Agent, an elite copy optimizer and final polish specialist.
Your mission is to take the initial hooks from the Hook Strategist Agent and the detailed feedback from the Hook Critic Agent, and craft the FINAL, perfected 10 hooks.

Refinement Requirements:
1. Implement the specific suggestions from the Hook Critic Agent to maximize scroll-stopping power.
2. Sharpen the opening 3-5 words to make them impossible to scroll past.
3. Strictly preserve all 10 styles in exact order:
   1. Curiosity, 2. Question, 3. Contrarian, 4. Bold Claim, 5. Statistic/Data,
   6. Story, 7. Problem/Pain Point, 8. Fear/Urgency, 9. Future/Possibility, 10. Surprise/Twist.
4. STRICT STATISTIC SAFETY RULE: NEVER invent fake percentages or studies. Frame around verifiable data realities or trend shifts.
5. Maximize cadence, punctuation, and punchiness for ${input.platform} in a ${input.tone} tone.`;

    const userPrompt = `Topic: "${input.topic}"
Platform: ${input.platform}
Tone: ${input.tone}
Audience: ${input.audience || 'General audience'}

Initial Hooks:
${JSON.stringify(input.initialHooks, null, 2)}

Critic Evaluations & Feedback:
${JSON.stringify(input.critique, null, 2)}

Produce the final refined 10 hooks.`;

    const res = await invokeStructuredWithFallback(
      HookListSchema,
      [new SystemMessage(systemPrompt), new HumanMessage(userPrompt)],
      apiKey,
      'Hook Refiner Agent LLM',
      config
    );

    return {
      ...input,
      finalHooks: res.hooks,
    };
  }
).withConfig({ runName: 'Hook Refiner Agent' });

// ============================================================================
// MULTI-AGENT WORKFLOW PIPELINE
// ============================================================================
export const multiAgentHookPipeline = RunnableSequence.from([
  hookStrategistAgent,
  hookCriticAgent,
  hookRefinerAgent,
]).withConfig({ runName: 'Multi-Agent Hook Pipeline' });

/**
 * Coordinates the full 3-agent pipeline with LangSmith tracing and returns
 * the validated final hooks, initial hooks, and critic feedback.
 */
export async function runMultiAgentHookPipeline(
  params: GenerateHooksRequest
): Promise<MultiAgentPipelineResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add your valid Google Gemini API key to the .env file.'
    );
  }

  // Set up LangSmith tracer if tracing is configured
  const callbacks: any[] = [];
  if (
    process.env.LANGSMITH_TRACING === 'true' ||
    process.env.LANGCHAIN_TRACING_V2 === 'true'
  ) {
    try {
      const tracer = new LangChainTracer({
        projectName:
          process.env.LANGSMITH_PROJECT ||
          process.env.LANGCHAIN_PROJECT ||
          'hook-generator',
      });
      callbacks.push(tracer);
    } catch {
      // Continue even if tracer initialization encounters issue
    }
  }

  const result = (await multiAgentHookPipeline.invoke(params, {
    callbacks,
  })) as {
    initialHooks: Array<{ style: string; hook: string }>;
    critique: z.infer<typeof CriticEvaluationSchema>;
    finalHooks: Array<{ style: string; hook: string }>;
  };

  // Validate and normalize exactly 10 hooks with sequential IDs
  const rawFinal = result.finalHooks || result.initialHooks || [];
  const normalizedHooks: HookItem[] = [];

  for (let i = 0; i < REQUIRED_HOOK_STYLES.length; i++) {
    const targetStyle = REQUIRED_HOOK_STYLES[i];
    const matched =
      rawFinal.find((h) => h.style?.toLowerCase() === targetStyle.toLowerCase()) ||
      rawFinal[i];

    if (matched && matched.hook && matched.hook.trim()) {
      normalizedHooks.push({
        id: i + 1,
        style: targetStyle,
        hook: matched.hook.trim(),
      });
    } else {
      normalizedHooks.push({
        id: i + 1,
        style: targetStyle,
        hook: `Discover how ${params.topic} is changing the game for ${params.platform}.`,
      });
    }
  }

  return {
    initialHooks: result.initialHooks,
    critique: result.critique,
    finalHooks: normalizedHooks,
  };
}
