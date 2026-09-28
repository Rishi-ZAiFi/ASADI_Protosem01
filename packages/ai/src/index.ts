import { LlmPort, UsageLedgerPort, ResearchCachePort, LlmRequest } from '@contentyou/schemas';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { search as ddSearch } from 'duck-duck-scrape';

export function createAiClient(deps: {
  usageLedger: UsageLedgerPort;
  researchCache: ResearchCachePort;
  config: { openaiApiKey?: string, geminiApiKey?: string };
}): LlmPort {
  const openaiKey = deps.config.openaiApiKey || process.env.OPENAI_API_KEY;
  const geminiKey = deps.config.geminiApiKey || process.env.GEMINI_API_KEY;
  
  const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;
  const gemini = geminiKey ? new GoogleGenAI({ apiKey: geminiKey }) : null;

  return {
    async generate<T extends z.ZodType>(request: LlmRequest<T>): Promise<z.infer<T>> {
      if (!openai && !gemini) {
         throw new Error("No API key found. Please add GEMINI_API_KEY or OPENAI_API_KEY to your .env file.");
      }
      
      console.log(`[AI] Generating response for prompt: ${request.prompt.substring(0, 100)}...`);

      // 1. Try Gemini first (Free Tier usually preferred by user)
      if (gemini) {
        try {
          const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: request.prompt + "\n\nIMPORTANT: You must output ONLY valid JSON matching this request. Do NOT include markdown blocks like ```json.",
            config: {
              temperature: request.temperature ?? 0.7,
              responseMimeType: 'application/json',
            }
          });
          
          if (!response.text) throw new Error("Empty response from Gemini");
          
          await deps.usageLedger.recordUsage('system', 0, 0, 1);
          return request.schema.parse(JSON.parse(response.text));
        } catch (error) {
          console.error("[AI] Gemini generation failed:", error);
          if (!openai) throw error;
          console.log("[AI] Falling back to OpenAI...");
        }
      }

      // 2. Fallback to OpenAI
      if (openai) {
        const response = await openai.beta.chat.completions.parse({
          model: 'gpt-4o-2024-08-06',
          messages: [
            { role: 'system', content: 'You are an expert autonomous content creator and planner. Always output valid JSON conforming strictly to the requested schema.' },
            { role: 'user', content: request.prompt }
          ],
          response_format: zodResponseFormat(request.schema as z.ZodTypeAny, 'result'),
          temperature: request.temperature ?? 0.7,
        });

        const parsed = response.choices[0].message.parsed;
        if (!parsed) throw new Error("Failed to parse LLM response");
        
        await deps.usageLedger.recordUsage('system', response.usage?.total_tokens || 0, 0.01, 1);
        return parsed;
      }

      throw new Error("Generation failed.");
    },
    
    async search(query: string) {
      console.log(`[AI] Searching web for: ${query}`);
      try {
        const results = await ddSearch(query, { safeSearch: 'off' });
        return results.results.slice(0, 5).map(r => ({
          title: r.title,
          url: r.url,
          snippet: r.description
        }));
      } catch (e) {
        console.error("[AI] Search failed:", e);
        return [];
      }
    }
  };
}
