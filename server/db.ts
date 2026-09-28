import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  tier: string
  createdAt: string
}

export interface Project {
  id: string
  title: string
  description?: string
  niche: string
  platform: string
  status: 'active' | 'archived' | 'draft'
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface IdeaItem {
  id: string
  title: string
  angle: string
  format: string
  hook: string
  description: string
  toolId: string
  projectId?: string
  tags?: string[]
  createdAt: string
}

export interface GeneratedContent {
  id: string
  toolId: string
  toolName: string
  inputs: Record<string, any>
  output: any
  summary?: string
  saved: boolean
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

export interface DatabaseSchema {
  users: User[]
  projects: Project[]
  ideas: IdeaItem[]
  savedContent: GeneratedContent[]
  history: HistoryItem[]
}

const DATA_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'creator_os_db.json')

class Database {
  private data: DatabaseSchema

  constructor() {
    this.ensureDirectory()
    this.data = this.loadData()
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  }

  private getInitialData(): DatabaseSchema {
    return {
      users: [
        {
          id: 'user_default',
          name: 'Alex Rivera',
          email: 'creator@creatoros.ai',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          tier: 'Pro Studio Creator',
          createdAt: new Date().toISOString(),
        },
      ],
      projects: [
        {
          id: 'proj_1',
          title: 'AI Tech & Productivity Channel',
          description: 'Weekly long-form YouTube essays and daily short-form reels on practical AI tools.',
          niche: 'Artificial Intelligence & Productivity',
          platform: 'YouTube & Instagram',
          status: 'active',
          tags: ['AI', 'Tech', 'Growth'],
          createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'proj_2',
          title: 'Solopreneur Brand Launch',
          description: 'LinkedIn authority building and X thread repurposing for high-ticket clients.',
          niche: 'B2B Solopreneurship',
          platform: 'LinkedIn & X',
          status: 'active',
          tags: ['B2B', 'Branding', 'Newsletter'],
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      ideas: [
        {
          id: 'idea_seed_1',
          title: '5 AI Agents That Will Replace 90% of Boring Content Tasks in 2026',
          angle: 'Contrarian efficiency breakdown with live screen demos',
          format: 'YouTube Video + 3 Reels',
          hook: 'If you are still spending 4 hours editing reels, you are working in 2022.',
          description: 'A deep-dive into autonomous research pipelines, thumbnail AI validators, and clip extractors.',
          toolId: 'content-idea-generator',
          createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        },
      ],
      savedContent: [],
      history: [],
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8')
        return JSON.parse(raw)
      }
    } catch (err) {
      console.error('Error loading db file, reinitializing default:', err)
    }
    const initial = this.getInitialData()
    this.persist(initial)
    return initial
  }

  private persist(dataToSave?: DatabaseSchema) {
    try {
      this.ensureDirectory()
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8')
    } catch (err) {
      console.error('Error persisting database:', err)
    }
  }

  // --- Projects ---
  getProjects(): Project[] {
    return this.data.projects
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProj: Project = {
      ...project,
      id: 'proj_' + Date.now() + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.data.projects.unshift(newProj)
    this.persist()
    return newProj
  }

  // --- Ideas ---
  getIdeas(): IdeaItem[] {
    return this.data.ideas
  }

  saveIdea(idea: Omit<IdeaItem, 'id' | 'createdAt'>): IdeaItem {
    const newIdea: IdeaItem = {
      ...idea,
      id: 'idea_' + Date.now() + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    }
    this.data.ideas.unshift(newIdea)
    this.persist()
    return newIdea
  }

  deleteIdea(id: string): boolean {
    const initLen = this.data.ideas.length
    this.data.ideas = this.data.ideas.filter((i) => i.id !== id)
    if (this.data.ideas.length !== initLen) {
      this.persist()
      return true
    }
    return false
  }

  // --- Saved Content ---
  getSavedContent(): GeneratedContent[] {
    return this.data.savedContent
  }

  saveContent(item: Omit<GeneratedContent, 'id' | 'createdAt' | 'saved'>): GeneratedContent {
    const newItem: GeneratedContent = {
      ...item,
      id: 'save_' + Date.now() + Math.random().toString(36).substring(2, 6),
      saved: true,
      createdAt: new Date().toISOString(),
    }
    this.data.savedContent.unshift(newItem)
    this.persist()
    return newItem
  }

  deleteSavedContent(id: string): boolean {
    const initLen = this.data.savedContent.length
    this.data.savedContent = this.data.savedContent.filter((c) => c.id !== id)
    if (this.data.savedContent.length !== initLen) {
      this.persist()
      return true
    }
    return false
  }

  // --- History ---
  getHistory(limit = 50): HistoryItem[] {
    return this.data.history.slice(0, limit)
  }

  addHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>): HistoryItem {
    const newHistory: HistoryItem = {
      ...item,
      id: 'hist_' + Date.now() + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    }
    this.data.history.unshift(newHistory)
    if (this.data.history.length > 200) {
      this.data.history = this.data.history.slice(0, 200)
    }
    this.persist()
    return newHistory
  }

  // --- User ---
  getUser(): User {
    return this.data.users[0]
  }

  getStats() {
    return {
      totalSaved: this.data.savedContent.length,
      totalIdeas: this.data.ideas.length,
      totalGenerations: this.data.history.length,
      totalProjects: this.data.projects.length,
    }
  }
}

export const db = new Database()
