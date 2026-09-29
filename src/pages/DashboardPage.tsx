import React, { useState } from 'react'
import {
  Sparkles,
  Zap,
  ArrowRight,
  Bookmark,
  Layers,
  Search,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { ALL_TOOLS } from '../constants/tools'
import { SystemStatus, HistoryItem, ToolCategory } from '../types'
import { getToolIcon } from '../components/layout/Sidebar'

interface DashboardPageProps {
  onNavigate: (route: string) => void
  systemStatus: SystemStatus | null
  history: HistoryItem[]
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  systemStatus,
  history,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filterQuery, setFilterQuery] = useState('')

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All 22 Tools' },
    { key: 'content-creation', label: 'Content Creation' },
    { key: 'audience-research', label: 'Audience & Research' },
    { key: 'production', label: 'Production' },
    { key: 'advanced-ai', label: 'Advanced AI' },
  ]

  const filteredTools = ALL_TOOLS.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
    const matchesSearch =
      !filterQuery.trim() ||
      t.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(filterQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-purple-500/20 p-6 md:p-10 bg-gradient-to-br from-[#121422] via-[#0d0f19] to-[#08090d]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Creator Operating System</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-white bg-clip-text text-transparent">Alex</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            All 22 specialized AI creation, research, and production engines are active. One centralized architecture powering your scripts, hooks, and automated pipelines.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('content-idea-generator')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-purple-200" />
              <span>Launch Content Idea Generator</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('autonomous-content-pipeline')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Autonomous Content Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* API Key Connection Alert if not configured */}
      {!systemStatus?.ai?.hasKey && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/40 bg-amber-950/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200">Connect OpenAI API Key</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Add your key to experience live real-time completions across all 22 tools.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer self-start sm:self-center shrink-0"
          >
            <span>Configure Key</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-purple-400" />
            Saved Assets
          </span>
          <p className="text-2xl font-black text-white font-mono">
            {systemStatus?.stats?.totalSaved ?? 0}
          </p>
          <span className="text-[11px] text-slate-500">In Content Vault</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Ideas Incubated
          </span>
          <p className="text-2xl font-black text-white font-mono">
            {systemStatus?.stats?.totalIdeas ?? 1}
          </p>
          <span className="text-[11px] text-slate-500">Structured concepts</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            AI Generations
          </span>
          <p className="text-2xl font-black text-white font-mono">
            {systemStatus?.stats?.totalGenerations ?? history.length}
          </p>
          <span className="text-[11px] text-slate-500">Logged in studio</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Active Channels
          </span>
          <p className="text-2xl font-black text-white font-mono">
            {systemStatus?.stats?.totalProjects ?? 2}
          </p>
          <span className="text-[11px] text-slate-500">Monitored pipelines</span>
        </div>
      </div>

      {/* Tools Directory Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              CreatorOS Tool Suite
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any of the 22 tools below to launch your dedicated generation studio.
            </p>
          </div>

          {/* Search inside tools */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                selectedCategory === cat.key
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 22-Tool Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-purple-500/40 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    {getToolIcon(tool.iconName, 'w-5 h-5')}
                  </div>
                  {tool.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        tool.badge === 'Popular'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : tool.badge.includes('Stage') || tool.badge.includes('Multi')
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-purple-400 font-medium group-hover:text-purple-300">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Generations Timeline */}
      {history.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Recent Generation Studio Runs
            </h3>
            <span className="text-xs text-slate-500 font-mono">Last {Math.min(history.length, 5)} runs</span>
          </div>

          <div className="glass-panel rounded-2xl divide-y divide-slate-800/80 border border-slate-800/80 overflow-hidden">
            {history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.toolId)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 text-xs shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-semibold text-slate-200 group-hover:text-purple-300 truncate">
                      {item.toolName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate max-w-md">{item.promptSummary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                    {item.durationMs ? `${(item.durationMs / 1000).toFixed(1)}s` : ''}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    {item.status}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
