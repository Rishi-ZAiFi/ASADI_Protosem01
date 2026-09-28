import dotenv from 'dotenv'
import { buildPromptForTool } from './prompts.js'

dotenv.config()

interface GenerateOptions {
  toolId: string
  inputs: Record<string, any>
  apiKeyOverride?: string
}

export interface GenerateResult {
  raw: string
  parsed?: any
  modelUsed: string
  provider: 'gemini' | 'openai' | 'fallback'
  isMock: boolean
}

export class AIService {
  private activeKey: string = ''
  private provider: 'gemini' | 'openai' = 'gemini'

  constructor() {
    this.refreshKey()
  }

  public refreshKey(customKey?: string) {
    if (customKey) {
      this.activeKey = customKey.trim()
    } else {
      this.activeKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || ''
    }

    if (this.activeKey.startsWith('sk-')) {
      this.provider = 'openai'
    } else {
      this.provider = 'gemini'
    }
  }

  public getStatus() {
    const hasKey = Boolean(this.activeKey && this.activeKey.length > 5)
    return {
      hasKey,
      provider: this.provider,
      maskedKey: hasKey ? `${this.activeKey.substring(0, 4)}...${this.activeKey.slice(-4)}` : null,
      model: this.provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o-mini',
    }
  }

  public async generate(options: GenerateOptions): Promise<GenerateResult> {
    const { toolId, inputs, apiKeyOverride } = options
    const effectiveKey = (apiKeyOverride || this.activeKey || '').trim()
    const { systemPrompt, userPrompt } = buildPromptForTool(toolId, inputs)

    if (effectiveKey) {
      try {
        if (effectiveKey.startsWith('sk-')) {
          return await this.callOpenAI(systemPrompt, userPrompt, effectiveKey, toolId)
        } else {
          return await this.callGemini(systemPrompt, userPrompt, effectiveKey, toolId)
        }
      } catch (err: any) {
        console.error(`AI API error for ${toolId}:`, err?.message || err)
        throw new Error(err?.message || 'Failed to generate with AI API')
      }
    }

    // If no API key is configured, inform the user or return structured sample
    throw new Error('No AI API key found. Please set your GEMINI_API_KEY or OPENAI_API_KEY in .env or via Settings in CreatorOS.')
  }

  private async callGemini(systemPrompt: string, userPrompt: string, apiKey: string, toolId: string): Promise<GenerateResult> {
    // Try gemini-2.5-flash first, fall back to gemini-1.5-flash if needed
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash']
    let lastError: any = null

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2500,
            },
          }),
        })

        if (!res.ok) {
          const errBody = await res.text()
          lastError = new Error(`Gemini API returned ${res.status}: ${errBody}`)
          continue
        }

        const data: any = await res.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

        return {
          raw: text,
          parsed: this.tryParseOutput(toolId, text),
          modelUsed: model,
          provider: 'gemini',
          isMock: false,
        }
      } catch (err: any) {
        lastError = err
      }
    }

    throw lastError || new Error('Failed to connect to Google Gemini API.')
  }

  private async callOpenAI(systemPrompt: string, userPrompt: string, apiKey: string, toolId: string): Promise<GenerateResult> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`OpenAI API returned ${res.status}: ${errBody}`)
    }

    const data: any = await res.json()
    const text = data?.choices?.[0]?.message?.content || ''

    return {
      raw: text,
      parsed: this.tryParseOutput(toolId, text),
      modelUsed: 'gpt-4o-mini',
      provider: 'openai',
      isMock: false,
    }
  }

  private tryParseOutput(toolId: string, text: string): any {
    if (toolId === 'content-idea-generator') {
      try {
        // Strip markdown code fences if present
        let clean = text.trim()
        if (clean.startsWith('```json')) {
          clean = clean.replace(/^```json/, '').replace(/```$/, '').trim()
        } else if (clean.startsWith('```')) {
          clean = clean.replace(/^```/, '').replace(/```$/, '').trim()
        }
        const json = JSON.parse(clean)
        if (json.ideas && Array.isArray(json.ideas)) {
          return json.ideas
        }
        return json
      } catch (e) {
        // Return raw text if not strictly JSON
        return null
      }
    }
    return null
  }
}

export const aiService = new AIService()
