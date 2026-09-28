import { LlmPort, Plan } from '@contentyou/schemas';
import { z } from 'zod';
import { PlanSchema } from '@contentyou/schemas';

export async function executePlanAgent(idea: string, llm: LlmPort): Promise<Plan> {
  console.log(`[Agent] Starting autonomous plan generation for idea: "${idea}"`);
  
  // 1. Formulate Search Queries
  console.log(`[Agent] Formulating research queries...`);
  const querySchema = z.object({
    queries: z.array(z.string()).describe("3 targeted search queries to research the idea and find viral/best content")
  });
  
  const queryResult = await llm.generate({
    prompt: `The user wants to create content based on this idea: "${idea}". 
Generate 3 highly targeted internet search queries to find the best, most viral, and most factual information related to this.`,
    schema: querySchema,
    temperature: 0.7
  });

  // 2. Execute Web Searches
  console.log(`[Agent] Executing searches...`);
  const researchData = [];
  for (const query of queryResult.queries) {
    const results = await llm.search(query);
    researchData.push({ query, results });
  }

  // 3. Synthesize and Generate Plan
  console.log(`[Agent] Synthesizing research and generating plan...`);
  const planResult = await llm.generate({
    prompt: `You are an expert content strategist.
Idea: "${idea}"

Research Context from Web:
${JSON.stringify(researchData, null, 2)}

Create a detailed content plan based on this idea and research. 
The plan should have sections (e.g. "Hook", "Body", "Call to Action") with claims.
Each claim must include citationIds mapping to the URLs found in the research context. Ensure citationIds array is never empty.`,
    schema: PlanSchema,
    temperature: 0.5
  });

  console.log(`[Agent] Plan generated successfully!`);
  return planResult;
}
