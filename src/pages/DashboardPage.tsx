import React, { useState } from 'react'
import {
  Sparkles,
  Zap,
  ArrowRight,
  Bookmark,
  Layers,
  Search,
  KeyRound,
  TrendingUp,
  Cpu,
  Clock,
  MessageSquare,
  Video,
  PenTool,
  Workflow,
  Send,
  Lightbulb
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
  const [prompt, setPrompt] = useState('')

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-[2rem] overflow-hidden glass-panel border border-slate-800/80 p-8 md:p-14 bg-gradient-to-b from-[#0f111a] to-[#08090d] flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl w-full space-y-6">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs font-medium mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>CreatorFlow AI Workspace</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Create something <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">worth sharing.</span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Turn ideas into research, scripts, content and publishing assets with one AI workspace.
          </p>

          {/* Large central AI input */}
          <div className="mt-8 relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl" />
            <div className="relative flex items-center bg-[#131521] border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What do you want to create? e.g. Turn my idea about AI agents into a 60-second reel..."
                className="w-full bg-transparent border-none focus:outline-none text-slate-200 placeholder:text-slate-500 px-4 py-3 text-sm md:text-base"
              />
              <button 
                type="button"
                className="shrink-0 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
               <button onClick={() => onNavigate('content-idea-generator')} className="px-4 py-2 text-xs font-medium bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl text-slate-300 transition-colors cursor-pointer">Generate</button>
               <button onClick={() => onNavigate('daily-content-planner')} className="px-4 py-2 text-xs font-medium bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl text-slate-300 transition-colors cursor-pointer">Plan Content</button>
               <button onClick={() => onNavigate('autonomous-content-pipeline')} className="px-4 py-2 text-xs font-medium bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl text-slate-300 transition-colors cursor-pointer">Start Workflow</button>
            </div>
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

      {/* Quick Create Section */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" />
          Quick Create
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Content Idea', icon: Lightbulb, toolId: 'content-idea-generator' },
            { label: 'Reel Script', icon: Video, toolId: 'reel-script-builder' },
            { label: 'Hook', icon: Zap, toolId: 'hook-generator' },
            { label: 'Caption', icon: MessageSquare, toolId: 'caption-assistant' },
            { label: 'LinkedIn Post', icon: PenTool, toolId: 'content-repurposer' },
            { label: 'YouTube Script', icon: Video, toolId: 'ai-content-director' },
          ].map((item, i) => (
             <button
               key={i}
               onClick={() => onNavigate(item.toolId)}
               className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl glass-card border border-slate-800 hover:border-purple-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
             >
               <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-300 group-hover:bg-purple-500/20 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors">
                  <item.icon className="w-5 h-5" />
               </div>
               <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
             </button>
          ))}
        </div>
      </div>

      {/* AI Workflows Section */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Workflow className="w-5 h-5 text-indigo-400" />
          AI WORKFLOWS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div onClick={() => onNavigate('ai-content-director')} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform mb-4">
               <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">AI Content Director</h4>
            <p className="text-sm text-slate-400 mb-6 flex-grow">A full strategic suite.</p>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-2 flex-wrap">
              <span>Research</span> <ArrowRight className="w-3 h-3 text-slate-500"/> <span>Angles</span> <ArrowRight className="w-3 h-3 text-slate-500"/> <span>Narrative</span> <ArrowRight className="w-3 h-3 text-slate-500"/> <span>Script</span> <ArrowRight className="w-3 h-3 text-slate-500"/> <span>Visuals</span> <ArrowRight className="w-3 h-3 text-slate-500"/> <span>Publishing</span>
            </div>
            <div className="mt-6 flex items-center text-sm font-semibold text-indigo-400">
               Start Workflow <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div onClick={() => onNavigate('autonomous-content-pipeline')} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-4">
               <Workflow className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">Autonomous Content Pipeline</h4>
            <p className="text-sm text-slate-400 mb-6 flex-grow">Create multi-platform content from a single seed idea.</p>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-2 flex-wrap">
              <span>One idea</span> <ArrowRight className="w-3 h-3 text-slate-500"/> <span>Multi-platform content</span>
            </div>
            <div className="mt-6 flex items-center text-sm font-semibold text-purple-400">
               Start Workflow <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div onClick={() => onNavigate('ai-creative-producer')} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer group flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-4">
               <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">AI Creative Producer</h4>
            <p className="text-sm text-slate-400 mb-6 flex-grow">Strategic adaptation engine.</p>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-2 flex-wrap">
              <span>Goal</span> <ArrowRight className="w-3 h-3 text-slate-500"/> <span>Audience</span> <ArrowRight className="w-3 h-3 text-slate-500"/> <span>Strategy</span> <ArrowRight className="w-3 h-3 text-slate-500"/> <span>Content</span> <ArrowRight className="w-3 h-3 text-slate-500"/> <span>Adaptation</span>
            </div>
            <div className="mt-6 flex items-center text-sm font-semibold text-blue-400">
               Start Workflow <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
