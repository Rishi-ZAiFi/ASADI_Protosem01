import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { buildPromptForTool } from '../config/toolPrompts.js'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { isGeminiConfigured, getGeminiModel } from '../services/geminiService.js'

// Helper to create a LangChain tool for each of the 22 CreatorOS tools
function createCreatorOSTool(toolId: string, name: string, description: string) {
  return new DynamicStructuredTool({
    name: toolId,
    description: description,
    schema: z.object({
      inputs: z.record(z.any()).describe('The inputs provided by the user from the CreatorOS UI'),
    }),
    func: async ({ inputs }) => {
      if (!isGeminiConfigured()) {
        throw new Error('GEMINI_API_KEY is not configured')
      }

      const { systemPrompt, userPrompt } = buildPromptForTool(toolId, inputs)
      
      const model = new ChatGoogleGenerativeAI({
        model: getGeminiModel(),
        apiKey: process.env.GEMINI_API_KEY,
        temperature: 0.7,
      })

      const startTime = Date.now()

      try {
        const response = await model.invoke([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ], {
          metadata: {
            tool_name: name,
            tool_id: toolId,
            user_input: inputs,
            model: getGeminiModel(),
            provider: 'gemini',
            execution_status: 'running'
          }
        })

        let content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content)
        
        // Cleanup markdown if present
        if (content && typeof content === 'string') {
          if (content.startsWith('```json')) {
            content = content.replace(/^```json/, '').replace(/```$/, '').trim()
          } else if (content.startsWith('```')) {
            content = content.replace(/^```/, '').replace(/```$/, '').trim()
          }
        }

        return content // Returns JSON string which orchestrator will parse
      } catch (err: any) {
        throw err
      }
    },
  })
}

// 22 Registered Tools
export const toolRegistry = {
  'content-idea-generator': createCreatorOSTool('content-idea-generator', 'Content Idea Generator', 'Generates high-virality, structured content ideas'),
  'content-repurposer': createCreatorOSTool('content-repurposer', 'Content Repurposer', 'Transforms one piece of content into multiple formats'),
  'hook-generator': createCreatorOSTool('hook-generator', 'Hook Generator', 'Generates scroll-stopping hooks'),
  'daily-content-planner': createCreatorOSTool('daily-content-planner', 'Daily Content Planner', 'Automates 7-day posting blueprints'),
  'reel-script-builder': createCreatorOSTool('reel-script-builder', 'Reel Script Builder', 'Constructs viral short-form scripts'),
  'clip-finder': createCreatorOSTool('clip-finder', 'Clip Finder', 'Pinpoints viral micro-moments from transcripts'),
  'thumbnail-ideator': createCreatorOSTool('thumbnail-ideator', 'Thumbnail Ideator', 'Creates high-CTR thumbnail concepts'),
  'caption-assistant': createCreatorOSTool('caption-assistant', 'Caption Assistant', 'Crafts high-converting captions'),
  'cta-generator': createCreatorOSTool('cta-generator', 'CTA Generator', 'Engineers calls-to-action'),
  'comment-analyzer': createCreatorOSTool('comment-analyzer', 'Comment Analyzer', 'Analyzes audience comments for sentiment and ideas'),
  'comment-to-content': createCreatorOSTool('comment-to-content', 'Comment to Content', 'Converts comments into viral content assets'),
  'creator-research-assistant': createCreatorOSTool('creator-research-assistant', 'Creator Research Assistant', 'Dives deep into niche trends and facts'),
  'voice-replicator': createCreatorOSTool('voice-replicator', 'Voice Replicator', 'Replicates writing style and tone'),
  'podcast-assistant': createCreatorOSTool('podcast-assistant', 'Podcast Assistant', 'Produces complete episode guides'),
  'creator-workspace': createCreatorOSTool('creator-workspace', 'Creator Workspace', 'Converts raw notes into production briefs'),
  'content-recycler': createCreatorOSTool('content-recycler', 'Content Recycler', 'Revitalizes past top-performing winners'),
  'brand-pitch-builder': createCreatorOSTool('brand-pitch-builder', 'Brand Pitch Builder', 'Generates high-response brand sponsorship pitches'),
  'ai-content-director': createCreatorOSTool('ai-content-director', 'AI Content Director', 'Oversees multi-stage end-to-end creative direction'),
  'creator-second-brain': createCreatorOSTool('creator-second-brain', 'Creator Second Brain', 'Synthesizes research into content assets'),
  'ai-screenplay-workspace': createCreatorOSTool('ai-screenplay-workspace', 'AI Screenplay Workspace', 'Creates screenplay scenes with dialogue and action'),
  'autonomous-content-pipeline': createCreatorOSTool('autonomous-content-pipeline', 'Autonomous Content Pipeline', 'Spawns seed idea into multiple content assets'),
  'ai-creative-producer': createCreatorOSTool('ai-creative-producer', 'AI Creative Producer', 'Strategically plans audience, pillars, and content')
}
