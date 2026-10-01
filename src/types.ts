export type ToolCategory = 'create' | 'research' | 'produce' | 'ai-systems'

export interface InputFieldDefinition {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'checkbox'
  placeholder?: string
  defaultValue?: any
  options?: { label: string; value: string }[]
  rows?: number
  helpText?: string
  required?: boolean
}

export interface ToolDefinition {
  id: string
  name: string
  category: ToolCategory
  description: string
  iconName: string
  badge?: string
  isMultiStep?: boolean
  steps?: string[]
  inputs: InputFieldDefinition[]
  samplePreset?: Record<string, any>
}

export interface IdeaItem {
  id?: string
  title: string
  angle: string
  format: string
  hook: string
  description: string
  toolId?: string
  saved?: boolean
  createdAt?: string
}

export interface SavedItem {
  id: string
  toolId: string
  toolName: string
  inputs: Record<string, any>
  output: any
  summary?: string
  createdAt: string
}

export interface HistoryItem {
  id: string
  toolId: string
  toolName: string
  promptSummary: string
  durationMs: number
  status: 'success' | 'error'
  createdAt: string
}

export interface SystemStatus {
  status: string
  ai: {
    hasKey: boolean
    provider: 'openai'
    maskedKey: string | null
    model: string
  }
  stats: {
    totalSaved: number
    totalIdeas: number
    totalGenerations: number
    totalProjects: number
  }
}

export interface ProjectItem {
  id: string
  title: string
  description?: string
  niche: string
  platform: string
  status: 'active' | 'archived' | 'draft'
  tags: string[]
  createdAt: string
}
