import './setupEnv.js'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { traceable } from 'langsmith/traceable'
import { generateAI, isGeminiConfigured as isAIConfigured, getGeminiModel as getAIModel } from '../backend/services/geminiService.js'
import { db } from './db.js'
import { TOOLS_CONFIG } from './prompts.js'
import { buildPromptForTool } from '../backend/config/toolPrompts.js'
import { executeApiCallAgent, executeWorkflowAgent } from '../backend/agents/apiCallAgent.js'
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
    configured: isAIConfigured(),
    provider: 'gemini',
  })
})

/**
 * GET /api/status
 * Overall system status & diagnostics
 */
app.get('/api/status', (_req, res) => {
  const configured = isAIConfigured()
  const key = process.env.GEMINI_API_KEY?.trim() || ''

  res.json({
    status: 'online',
    configured,
    provider: 'gemini',
    model: getAIModel(),
    ai: {
      hasKey: configured,
      provider: 'gemini',
      maskedKey: configured && key.length > 8 ? `${key.slice(0, 4)}...${key.slice(-4)}` : null,
      model: getAIModel(),
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
 * POST /api/agent/run
 * Central API Call Agent endpoint for individual tools
 */
app.post('/api/agent/run', async (req, res) => {
  const handleCreatorOSRequest = traceable(async (toolName: string, inputData: any) => {
    return await executeApiCallAgent(toolName, inputData)
  }, { name: "CreatorOS Request" })

  const { tool, input } = req.body
  const result = await handleCreatorOSRequest(tool, input || {})
  
  // Record generation into database history if successful
  if (result.success && tool) {
    const toolConfig = TOOLS_CONFIG.find(t => t.id === tool)
    db.addHistory({
      toolId: tool,
      toolName: toolConfig?.name || tool,
      promptSummary: `Generated output via API Call Agent`,
      durationMs: result.metadata?.executionTime || 0,
      status: 'success',
    })
  } else if (!result.success && tool) {
    db.addHistory({
      toolId: tool,
      toolName: tool,
      promptSummary: 'Failed API Agent request',
      durationMs: 0,
      status: 'error',
    })
  }
  
  return res.status(result.success ? 200 : (parseInt(result.error?.code) || 500)).json(result)
})

/**
 * POST /api/agent/workflow
 * Central API Call Agent endpoint for multi-tool orchestration
 */
app.post('/api/agent/workflow', async (req, res) => {
  const handleCreatorOSWorkflowRequest = traceable(async (workflowName: string, inputData: any) => {
    return await executeWorkflowAgent(workflowName, inputData)
  }, { name: "CreatorOS Request" })

  const { workflow, input } = req.body
  const result = await handleCreatorOSWorkflowRequest(workflow, input || {})
  return res.status(result.success ? 200 : 500).json(result)
})

/**
 * POST /api/settings/key
 * Update GEMINI_API_KEY dynamically and persist to .env
 */
app.post('/api/settings/key', (req, res) => {
  const { apiKey } = req.body
  if (typeof apiKey === 'string') {
    const cleanKey = apiKey.trim()
    process.env.GEMINI_API_KEY = cleanKey

    try {
      const envPath = path.join(__dirname, '..', '.env')
      let envContent = ''
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8')
      }

      if (/GEMINI_API_KEY=.*/.test(envContent)) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY=${cleanKey}`)
      } else {
        envContent += `\nGEMINI_API_KEY=${cleanKey}`
      }

      fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8')
    } catch (e) {
      console.warn('[CreatorOS Backend] Warning: Could not write key to .env file:', e)
    }

    return res.json({
      success: true,
      configured: isAIConfigured(),
      provider: 'gemini',
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
