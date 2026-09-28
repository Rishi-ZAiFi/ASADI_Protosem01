import { IdeaItem, SavedItem, HistoryItem, SystemStatus, ProjectItem } from '../types'

const API_BASE = '/api'

export async function getSystemStatus(): Promise<SystemStatus> {
  const res = await fetch(`${API_BASE}/status`)
  if (!res.ok) throw new Error('Failed to retrieve system status')
  return res.json()
}

export async function getAIStatus(): Promise<{ configured: boolean; provider: string }> {
  const res = await fetch(`${API_BASE}/ai/status`)
  if (!res.ok) throw new Error('Failed to retrieve AI status')
  return res.json()
}

export async function updateServerApiKey(apiKey: string): Promise<SystemStatus> {
  const res = await fetch(`${API_BASE}/settings/key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update API key')
  }
  return res.json()
}

export async function generateAI(
  toolId: string,
  inputs: Record<string, any>,
  apiKeyOverride?: string
): Promise<{ success: boolean; data: { raw: string; parsed?: any; modelUsed: string; provider: string; isMock: boolean }; durationMs: number }> {
  const res = await fetch(`${API_BASE}/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolId, inputs, apiKeyOverride }),
  })

  const payload = await res.json()
  if (!res.ok || !payload.success) {
    throw new Error(payload.error || 'AI generation failed')
  }
  return payload
}

export async function getSavedIdeas(): Promise<IdeaItem[]> {
  const res = await fetch(`${API_BASE}/ideas`)
  if (!res.ok) throw new Error('Failed to fetch ideas')
  const data = await res.json()
  return data.ideas || []
}

export async function saveIdeaToDb(idea: Omit<IdeaItem, 'id' | 'createdAt'>): Promise<IdeaItem> {
  const res = await fetch(`${API_BASE}/ideas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(idea),
  })
  if (!res.ok) throw new Error('Failed to save idea')
  const data = await res.json()
  return data.idea
}

export async function deleteIdeaFromDb(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/ideas/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete idea')
  const data = await res.json()
  return data.success
}

export async function getSavedContent(): Promise<SavedItem[]> {
  const res = await fetch(`${API_BASE}/saved`)
  if (!res.ok) throw new Error('Failed to fetch saved content')
  const data = await res.json()
  return data.saved || []
}

export async function saveContentToDb(item: {
  toolId: string
  toolName: string
  inputs: Record<string, any>
  output: any
  summary?: string
}): Promise<SavedItem> {
  const res = await fetch(`${API_BASE}/saved`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error('Failed to save content')
  const data = await res.json()
  return data.saved
}

export async function deleteSavedContentFromDb(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/saved/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete item')
  const data = await res.json()
  return data.success
}

export async function getHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/history`)
  if (!res.ok) throw new Error('Failed to fetch history')
  const data = await res.json()
  return data.history || []
}

export async function getProjects(): Promise<ProjectItem[]> {
  const res = await fetch(`${API_BASE}/projects`)
  if (!res.ok) throw new Error('Failed to fetch projects')
  const data = await res.json()
  return data.projects || []
}

export async function createProject(project: {
  title: string
  description?: string
  niche: string
  platform: string
  tags: string[]
}): Promise<ProjectItem> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  })
  if (!res.ok) throw new Error('Failed to create project')
  const data = await res.json()
  return data.project
}
