import { config } from '../config/config.js';
import { buildPrompt, buildSystemInstruction } from './promptService.js';

/**
 * Service to handle content generation using Google Gemini API
 */
export async function generateWithGemini({ topic, format, audience, tone, apiKeyOverride }) {
  const apiKey = (apiKeyOverride || config.gemini.apiKey || '').trim();

  if (!apiKey) {
    const error = new Error(
      'Gemini API key is not configured. Please add your GEMINI_API_KEY to the backend .env file or configure it in Settings.'
    );
    error.statusCode = 400;
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  const systemInstruction = buildSystemInstruction();
  const prompt = buildPrompt({ topic, format, audience, tone });

  // Priority models that are verified active, quota-friendly, and ultra-fast
  const candidateModels = [
    config.gemini.model || 'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.6-flash',
  ];

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const requestBody = {
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error?.message || `HTTP ${response.status}`;

        // If 503 high demand or 429 rate limit or 404 deprecated, try the next model candidate
        if (response.status === 503 || response.status === 429 || response.status === 404) {
          console.warn(`Model ${modelName} returned ${response.status} (${errorMsg.substring(0, 80)}...), falling back...`);
          lastError = new Error(errorMsg);
          continue;
        }

        const err = new Error(errorMsg);
        err.statusCode = response.status >= 400 && response.status < 500 ? response.status : 502;
        err.code = data.error?.status || 'GEMINI_API_ERROR';
        throw err;
      }

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]
      ) {
        return {
          content: data.candidates[0].content.parts[0].text.trim(),
          provider: 'gemini',
          model: modelName,
          timestamp: new Date().toISOString(),
        };
      } else {
        throw new Error('Gemini API returned an empty or unparseable response.');
      }
    } catch (error) {
      lastError = error;
      if (error.statusCode && error.statusCode !== 503 && error.statusCode !== 429 && error.statusCode !== 404) {
        throw error;
      }
    }
  }

  // If all candidate models failed
  const err = new Error(lastError?.message || 'Failed to generate content with Gemini API');
  err.statusCode = 502;
  err.code = 'GEMINI_API_ERROR';
  throw err;
}
