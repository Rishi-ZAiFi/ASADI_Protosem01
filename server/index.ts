import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateAI, isOpenAIConfigured, getOpenAIModel } from '../backend/services/openaiService.js'
import { db } from './db.js'
import { TOOLS_CONFIG, buildPromptForTool } from './prompts.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '10mb' }))

/**
 * GET /api/ai/status
 * Official test endpoint: returns configured state and provider.
 * NEVER returns the API key.
 */
app.get('/api/ai/status', (_req, res) => {
  res.json({
    configured: isOpenAIConfigured(),
    provider: 'openai',
  })
})

/**
 * GET /api/status
 * Overall system status & diagnostics
 */
app.get('/api/status', (_req, res) => {
  const configured = isOpenAIConfigured()
  const key = process.env.OPENAI_API_KEY?.trim() || ''

  res.json({
    status: 'online',
    configured,
    provider: 'openai',
    model: getOpenAIModel(),
    ai: {
      hasKey: configured,
      provider: 'openai',
      maskedKey: configured && key.length > 8 ? `${key.slice(0, 4)}...${key.slice(-4)}` : null,
      model: getOpenAIModel(),
    },
    stats: db.getStats(),
  })
})

/**
 * GET /api/tools
 * Tool catalog for UI navigation
 */
app.get('/api/tools', (_req, res) => {
  res.json({ tools: TOOLS_CONFIG })
})

/**
 * POST /api/ai/generate
 * Centralized OpenAI generation endpoint.
 * Supports:
 *  1. Generic request: { systemPrompt, userPrompt, responseFormat }
 *  2. Tool-based request: { toolId, inputs }
 */
app.post('/api/ai/generate', async (req, res) => {
  const startTime = Date.now()
  const { systemPrompt, userPrompt, responseFormat, toolId, inputs } = req.body

  try {
    // 1. Generic request path
    if (systemPrompt && userPrompt) {
      const result = await generateAI({
        systemPrompt: String(systemPrompt),
        userPrompt: String(userPrompt),
        responseFormat: responseFormat === 'json' ? 'json' : 'text',
      })

      const durationMs = Date.now() - startTime
      return res.json({
        success: true,
        data: result.data || result.raw,
        raw: result.raw,
        model: result.model,
        provider: 'openai',
        durationMs,
      })
    }

    // 2. Tool-based request path (All 22 tools)
    if (toolId) {
      const toolConfig = TOOLS_CONFIG.find(t => t.id === toolId)
      if (!toolConfig) {
        return res.status(400).json({
          success: false,
          error: `Tool "${toolId}" is not recognized.`,
        })
      }

      const isJsonFormat = toolId === 'content-idea-generator'
      const { systemPrompt: generatedSystemPrompt, userPrompt: generatedUserPrompt } = buildPromptForTool(toolId, inputs || {})

      const result = await generateAI({
        systemPrompt: generatedSystemPrompt,
        userPrompt: generatedUserPrompt,
        responseFormat: isJsonFormat ? 'json' : 'text',
      })

      const durationMs = Date.now() - startTime

      let parsedData = null
      if (isJsonFormat) {
        parsedData = Array.isArray(result.data?.ideas)
          ? result.data.ideas
          : Array.isArray(result.data)
          ? result.data
          : []
      }

      // Record generation into database history
      db.addHistory({
        toolId: toolId,
        toolName: toolConfig.name,
        promptSummary: `Generated output for ${toolConfig.name}`,
        durationMs,
        status: 'success',
      })

      return res.json({
        success: true,
        ideas: parsedData, // Backward compatibility for specific tools
        data: {
          raw: result.raw,
          parsed: parsedData,
          modelUsed: result.model,
          provider: 'openai',
          isMock: false,
        },
        durationMs,
      })
    }

    // Input validation failure
    return res.status(400).json({
      success: false,
      error: 'Invalid request. Provide either { systemPrompt, userPrompt } or { toolId, inputs }.',
    })
  } catch (err: any) {
    const durationMs = Date.now() - startTime

    // Record error in database history if toolId was supplied
    if (toolId) {
      db.addHistory({
        toolId: String(toolId),
        toolName: 'Content Idea Generator',
        promptSummary: 'Failed generation request',
        durationMs,
        status: 'error',
      })
    }

    const safeMessage = err?.message || 'An error occurred during AI generation.'
    const isClientConfigError = safeMessage.includes('OPENAI_API_KEY is not configured') || safeMessage.includes('Invalid request')
    const statusCode = isClientConfigError ? 400 : 500

    return res.status(statusCode).json({
      success: false,
      error: safeMessage,
      durationMs,
    })
  }
})

/**
 * POST /api/settings/key
 * Update OPENAI_API_KEY dynamically and persist to .env
 */
app.post('/api/settings/key', (req, res) => {
  const { apiKey } = req.body
  if (typeof apiKey === 'string') {
    const cleanKey = apiKey.trim()
    process.env.OPENAI_API_KEY = cleanKey

    try {
      const envPath = path.join(__dirname, '..', '.env')
      let envContent = ''
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8')
      }

      if (/OPENAI_API_KEY=.*/.test(envContent)) {
        envContent = envContent.replace(/OPENAI_API_KEY=.*/, `OPENAI_API_KEY=${cleanKey}`)
      } else {
        envContent += `\nOPENAI_API_KEY=${cleanKey}`
      }

      fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8')
    } catch (e) {
      console.warn('[CreatorOS Backend] Warning: Could not write key to .env file:', e)
    }

    return res.json({
      success: true,
      configured: isOpenAIConfigured(),
      provider: 'openai',
    })
  }

  return res.status(400).json({ error: 'apiKey string is required' })
})

// Database Endpoints: Projects
app.get('/api/projects', (_req, res) => {
  res.json({ projects: db.getProjects() })
})

app.post('/api/projects', (req, res) => {
  const { title, description, niche, platform, tags } = req.body
  if (!title) {
    return res.status(400).json({ error: 'Project title is required' })
  }
  const created = db.createProject({
    title,
    description: description || '',
    niche: niche || 'General',
    platform: platform || 'Multi-platform',
    status: 'active',
    tags: tags || [],
  })
  res.json({ success: true, project: created })
})

// Database Endpoints: Ideas
app.get('/api/ideas', (_req, res) => {
  res.json({ ideas: db.getIdeas() })
})

app.post('/api/ideas', (req, res) => {
  const { title, angle, format, hook, description, toolId, projectId, tags } = req.body
  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }
  const saved = db.saveIdea({
    title,
    angle: angle || '',
    format: format || '',
    hook: hook || '',
    description: description || '',
    toolId: toolId || 'content-idea-generator',
    projectId,
    tags,
  })
  res.json({ success: true, idea: saved })
})

app.delete('/api/ideas/:id', (req, res) => {
  const ok = db.deleteIdea(req.params.id)
  res.json({ success: ok })
})

// Database Endpoints: Saved Content
app.get('/api/saved', (_req, res) => {
  res.json({ saved: db.getSavedContent() })
})

app.post('/api/saved', (req, res) => {
  const { toolId, toolName, inputs, output, summary } = req.body
  if (!toolId || !output) {
    return res.status(400).json({ error: 'toolId and output are required' })
  }
  const saved = db.saveContent({
    toolId,
    toolName: toolName || toolId,
    inputs: inputs || {},
    output,
    summary,
  })
  res.json({ success: true, saved })
})

app.delete('/api/saved/:id', (req, res) => {
  const ok = db.deleteSavedContent(req.params.id)
  res.json({ success: ok })
})

// Database Endpoints: History
app.get('/api/history', (_req, res) => {
  res.json({ history: db.getHistory() })
})

// Current User info
app.get('/api/user', (_req, res) => {
  res.json({ user: db.getUser() })
})

app.listen(PORT, () => {
  console.log(`[CreatorOS Backend] Server running on http://localhost:${PORT}`)
})
