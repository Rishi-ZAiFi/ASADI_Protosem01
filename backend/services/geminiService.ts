import dotenv from 'dotenv'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

dotenv.config()

export interface GenerateAIOptions {
  systemPrompt: string
  userPrompt: string
  responseFormat?: 'json' | 'text'
}

export interface GenerateAIResponse<T = any> {
  raw: string
  data?: T
  model: string
  provider: 'gemini'
}

/**
 * Check if a Gemini API key is configured in backend environment
 */
export function isGeminiConfigured(): boolean {
  const key = (process.env.GEMINI_API_KEY || '').trim()
  return Boolean(key && key.length > 5 && !key.includes('your_gemini_api_key_here'))
}

/**
 * Get configured model name
 */
export function getGeminiModel(): string {
  // Free tier model default
  return process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite'
}

/**
 * Central reusable AI generation function using Gemini
 */
export async function generateAI<T = any>(options: GenerateAIOptions): Promise<GenerateAIResponse<T>> {
  const { systemPrompt, userPrompt, responseFormat = 'text' } = options

  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in the backend .env file.')
  }

  const apiKey = (process.env.GEMINI_API_KEY)!.trim()
  const modelName = getGeminiModel()

  try {
    const model = new ChatGoogleGenerativeAI({
      model: modelName,
      apiKey,
      temperature: 0.7,
      maxRetries: 2,
    })

    const response = await model.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])

    let outputText = typeof response.content === 'string' ? response.content : JSON.stringify(response.content)

    if (!outputText) {
      throw new Error('Gemini returned an empty response. Please retry.')
    }

    if (responseFormat === 'json') {
      let cleanText = outputText?.trim() || ''
      if (cleanText && typeof cleanText === 'string') {
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim()
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim()
        }
      }

      const parsed = JSON.parse(cleanText)
      return {
        raw: outputText,
        data: parsed,
        model: modelName,
        provider: 'gemini',
      }
    }

    return {
      raw: outputText,
      model: modelName,
      provider: 'gemini',
    }
  } catch (err: any) {
    const errorMessage = sanitizeGeminiError(err)
    console.error('[Gemini Generation Error]:', errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Sanitize error messages to protect credentials, stack traces, and internal URLs
 */
function sanitizeGeminiError(err: any): string {
  if (!err) return 'An unknown error occurred while communicating with Gemini.'

  const msg: string = String(err.message || err)
  const status: number | undefined = err.status || err.statusCode

  if (msg.includes('GEMINI_API_KEY is not configured')) {
    return 'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in the backend .env file.'
  }

  if (status === 401 || msg.includes('401') || msg.toLowerCase().includes('api key not valid') || msg.toLowerCase().includes('authentication')) {
    return 'Invalid Gemini API key. Please check your GEMINI_API_KEY in the backend .env file.'
  }

  if (status === 429 || msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate limit')) {
    return 'Gemini rate limit exceeded or free-tier exhausted. Please wait or verify your API usage.'
  }

  if (status === 408 || msg.toLowerCase().includes('timeout') || msg.toLowerCase().includes('etimedout')) {
    return 'The request to Gemini timed out. Please try again in a few moments.'
  }

  if (msg.toLowerCase().includes('enotfound') || msg.toLowerCase().includes('econnrefused') || msg.toLowerCase().includes('fetch failed')) {
    return 'Network connection failure while contacting Gemini API. Please check your internet connectivity.'
  }

  if (msg.includes('malformed JSON') || msg.includes('Unexpected token')) {
    return 'Gemini returned malformed JSON.'
  }

  return 'AI service was unable to fulfill this request. Please check your model settings and try again. Details: ' + msg.substring(0, 100)
}
