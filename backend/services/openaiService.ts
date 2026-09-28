import OpenAI from 'openai'
import dotenv from 'dotenv'

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
  provider: 'openai' | 'gemini'
}

/**
 * Check if an AI key is configured in backend environment
 */
export function isOpenAIConfigured(): boolean {
  const key = (process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || '').trim()
  return Boolean(key && key.length > 5 && !key.includes('your_openai_api_key_here'))
}

/**
 * Get configured model name
 */
export function getOpenAIModel(): string {
  const key = (process.env.OPENAI_API_KEY || '').trim()
  if (key.startsWith('AQ.') || key.startsWith('AIzaSy')) {
    return 'gemini-3.8-flash'
  }
  return process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini'
}

/**
 * Call Google Gemini API (used when user supplies a Google AI Studio key in .env)
 */
async function callGeminiAPI<T = any>(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  responseFormat: 'json' | 'text'
): Promise<GenerateAIResponse<T>> {
  const models = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-flash-latest']
  let lastError: any = null

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
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
              maxOutputTokens: 3500,
            },
          }),
        })

        if (!res.ok) {
          const errText = await res.text()
          if (res.status === 503 && attempt < 2) {
            await new Promise((r) => setTimeout(r, 1200))
            continue
          }
          lastError = new Error(`Gemini API ${res.status}: ${errText}`)
          break // try next model
        }

        const data: any = await res.json()
        const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

        if (!outputText) {
          throw new Error('Gemini returned an empty response.')
        }

        if (responseFormat === 'json') {
          let cleanText = outputText.trim()
          if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim()
          } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim()
          }

          const parsed = JSON.parse(cleanText)
          return {
            raw: outputText,
            data: parsed,
            model,
            provider: 'gemini',
          }
        }

        return {
          raw: outputText,
          model,
          provider: 'gemini',
        }
      } catch (err: any) {
        lastError = err
      }
    }
  }

  throw lastError || new Error('Failed to generate response using Gemini API.')
}

/**
 * Central reusable AI generation function using OpenAI SDK (with Gemini fallback)
 */
export async function generateAI<T = any>(options: GenerateAIOptions): Promise<GenerateAIResponse<T>> {
  const { systemPrompt, userPrompt, responseFormat = 'text' } = options

  if (!isOpenAIConfigured()) {
    throw new Error('OPENAI_API_KEY is not configured. Please set OPENAI_API_KEY in the backend .env file.')
  }

  const apiKey = (process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY)!.trim()

  // 1. If key format matches Google AI Studio key, query Gemini API
  if (apiKey.startsWith('AQ.') || apiKey.startsWith('AIzaSy')) {
    return await callGeminiAPI<T>(apiKey, systemPrompt, userPrompt, responseFormat)
  }

  // 2. Official OpenAI SDK path
  const model = getOpenAIModel()
  const client = new OpenAI({
    apiKey,
    timeout: 30000,
    maxRetries: 2,
  })

  let outputText = ''

  try {
    // Primary path: OpenAI Responses API
    try {
      const response = await client.responses.create({
        model,
        instructions: systemPrompt,
        input: userPrompt,
      })

      outputText = response.output_text || ''
    } catch (responsesErr: any) {
      console.warn('[OpenAI Responses API fallback to chat completions]:', responsesErr?.message || responsesErr)

      const chatCompletion = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        ...(responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {}),
      })

      outputText = chatCompletion.choices?.[0]?.message?.content || ''
    }

    if (!outputText) {
      throw new Error('OpenAI returned an empty response. Please retry.')
    }

    if (responseFormat === 'json') {
      let cleanText = outputText.trim()
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim()
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim()
      }

      const parsed = JSON.parse(cleanText)
      return {
        raw: outputText,
        data: parsed,
        model,
        provider: 'openai',
      }
    }

    return {
      raw: outputText,
      model,
      provider: 'openai',
    }
  } catch (err: any) {
    const errorMessage = sanitizeOpenAIError(err)
    console.error('[OpenAI Generation Error]:', errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Sanitize error messages to protect credentials, stack traces, and internal URLs
 */
function sanitizeOpenAIError(err: any): string {
  if (!err) return 'An unknown error occurred while communicating with OpenAI.'

  const msg: string = String(err.message || err)
  const status: number | undefined = err.status || err.statusCode

  if (msg.includes('OPENAI_API_KEY is not configured')) {
    return 'OPENAI_API_KEY is not configured. Please set OPENAI_API_KEY in the backend .env file.'
  }

  if (status === 401 || msg.includes('401') || msg.toLowerCase().includes('incorrect api key') || msg.toLowerCase().includes('invalid api key')) {
    return 'Invalid OpenAI API key. Please check your OPENAI_API_KEY in the backend .env file.'
  }

  if (status === 429 || msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate limit')) {
    return 'OpenAI rate limit exceeded or credit balance depleted. Please verify your OpenAI usage quota and billing status.'
  }

  if (status === 408 || msg.toLowerCase().includes('timeout') || msg.toLowerCase().includes('etimedout')) {
    return 'The request to OpenAI timed out. Please try again in a few moments.'
  }

  if (msg.toLowerCase().includes('enotfound') || msg.toLowerCase().includes('econnrefused') || msg.toLowerCase().includes('fetch failed')) {
    return 'Network connection failure while contacting OpenAI API. Please check your internet connectivity.'
  }

  if (msg.includes('malformed JSON')) {
    return msg
  }

  return 'AI service was unable to fulfill this request. Please check your model settings and try again.'
}
