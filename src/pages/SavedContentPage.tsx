import React, { useState, useEffect } from 'react'
import {
  Bookmark,
  Trash2,
  Copy,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Flame,
} from 'lucide-react'
import { IdeaItem, SavedItem } from '../types'
import {
  getSavedIdeas,
  deleteIdeaFromDb,
  getSavedContent,
  deleteSavedContentFromDb,
} from '../services/api'
import { CopyButton } from '../components/common/CopyButton'
import { ResultCard } from '../components/common/ResultCard'

interface SavedContentPageProps {
  onNavigate: (route: string) => void
  onRefreshStats?: () => void
}

export const SavedContentPage: React.FC<SavedContentPageProps> = ({
  onNavigate,
  onRefreshStats,
}) => {
  const [tab, setTab] = useState<'ideas' | 'outputs'>('ideas')
  const [ideas, setIdeas] = useState<IdeaItem[]>([])
  const [outputs, setOutputs] = useState<SavedItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [savedIdeas, savedOutputs] = await Promise.all([
        getSavedIdeas(),
        getSavedContent(),
      ])
      setIdeas(savedIdeas)
      setOutputs(savedOutputs)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDeleteIdea = async (id?: string) => {
    if (!id) return
    try {
      await deleteIdeaFromDb(id)
      setIdeas((prev) => prev.filter((i) => i.id !== id))
      if (onRefreshStats) onRefreshStats()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteOutput = async (id: string) => {
    try {
      await deleteSavedContentFromDb(id)
      setOutputs((prev) => prev.filter((o) => o.id !== id))
      if (onRefreshStats) onRefreshStats()
    } catch (e) {
      console.error(e)
    }
  }

  const filteredIdeas = ideas.filter(
    (i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.hook?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOutputs = outputs.filter(
    (o) =>
      o.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Bookmark className="w-7 h-7 text-purple-400" />
            Content Vault & Saved Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Access your curated ideas, scripts, angles, and pipeline blueprints stored in the CreatorFlow AI database.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved items..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setTab('ideas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            tab === 'ideas'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Saved Ideas ({ideas.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('outputs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            tab === 'outputs'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tool Outputs & Blueprints ({outputs.length})</span>
        </button>
      </div>

      {/* List Display */}
      {tab === 'ideas' && (
        <div className="space-y-4">
          {filteredIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                      {idea.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <CopyButton
                        textToCopy={`Title: ${idea.title}\nAngle: ${idea.angle}\nFormat: ${idea.format}\nHook: ${idea.hook}\nDescription: ${idea.description}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete idea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {idea.angle && (
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {idea.angle}
                      </span>
                    )}
                    {idea.format && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {idea.format}
                      </span>
                    )}
                  </div>

                  {idea.hook && (
                    <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs italic text-slate-300">
                      <span className="text-[10px] text-purple-400 font-semibold not-italic block uppercase tracking-wider mb-0.5">
                        Hook
                      </span>
                      "{idea.hook}"
                    </div>
                  )}

                  {idea.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">{idea.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-4 border border-dashed border-slate-800">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-slate-300">Your creative workspace is empty.</h4>
                <p className="text-xs text-slate-500">
                  {searchQuery
                    ? `No ideas matching "${searchQuery}"`
                    : 'Start with an idea and let CreatorFlow turn it into something publishable.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('content-idea-generator')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
              >
                <span>Create your first idea →</span>
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'outputs' && (
        <div className="space-y-4">
          {filteredOutputs.length > 0 ? (
            <div className="space-y-4">
              {filteredOutputs.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-purple-500/30 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 mr-2">
                        {item.toolName}
                      </span>
                      <span className="text-sm font-bold text-white">{item.summary}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CopyButton
                        textToCopy={
                          typeof item.output === 'object'
                            ? JSON.stringify(item.output, null, 2)
                            : String(item.output)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteOutput(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete saved output"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs md:text-sm text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto font-sans leading-relaxed bg-[#0b0d14] p-4 rounded-xl border border-slate-900">
                    {typeof item.output === 'object'
                      ? JSON.stringify(item.output, null, 2)
                      : String(item.output)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-4 border border-dashed border-slate-800">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-slate-300">No saved tool outputs</h4>
                <p className="text-xs text-slate-500">
                  Whenever you generate scripts, reels, or pipelines, click "Save Output" to bookmark them here.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
