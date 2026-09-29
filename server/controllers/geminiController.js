import { generateWithGemini } from '../services/geminiService.js';

/**
 * Controller for Gemini content generation
 */
export async function handleGeminiGenerate(req, res) {
  try {
    const { topic, format, audience, tone, apiKey } = req.body;

    // Validation
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Topic is required and cannot be empty.',
      });
    }

    if (!format || typeof format !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Content format is required.',
      });
    }

    const result = await generateWithGemini({
      topic: topic.trim(),
      format: format.trim(),
      audience: audience ? audience.trim() : 'General audience',
      tone: tone ? tone.trim() : 'Engaging',
      apiKeyOverride: apiKey,
    });

    return res.status(200).json({
      success: true,
      data: {
        topic: topic.trim(),
        format: format.trim(),
        audience: audience || 'General audience',
        tone: tone || 'Engaging',
        content: result.content,
        provider: result.provider,
        model: result.model,
        timestamp: result.timestamp,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.code || 'GENERATION_FAILED',
      message: error.message || 'An unexpected error occurred during Gemini generation.',
    });
  }
}
