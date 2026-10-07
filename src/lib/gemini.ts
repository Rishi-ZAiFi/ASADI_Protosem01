import { GenerateHooksRequest, HookItem, MultiAgentPipelineResult } from '@/types';
import {
  hookStrategistAgent,
  hookCriticAgent,
  hookRefinerAgent,
  multiAgentHookPipeline,
  runMultiAgentHookPipeline,
  getGeminiApiKey,
  REQUIRED_HOOK_STYLES,
} from './agents';

export {
  hookStrategistAgent,
  hookCriticAgent,
  hookRefinerAgent,
  multiAgentHookPipeline,
  runMultiAgentHookPipeline,
  getGeminiApiKey,
  REQUIRED_HOOK_STYLES,
};

/**
 * Generates 10 viral hooks using the 3-agent pipeline:
 * 1. Hook Strategist Agent: generates initial hooks across 10 styles
 * 2. Hook Critic Agent: critiques and evaluates the hooks for attention, platform fit, and data safety
 * 3. Hook Refiner Agent: applies critic feedback to optimize and produce the final 10 hooks
 */
export async function generateHooksWithGemini(
  params: GenerateHooksRequest
): Promise<HookItem[]> {
  const result: MultiAgentPipelineResult = await runMultiAgentHookPipeline(params);
  return result.finalHooks;
}
