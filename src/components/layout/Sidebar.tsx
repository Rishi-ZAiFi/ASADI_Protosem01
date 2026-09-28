import React, { useState } from 'react'
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Film,
  Cpu,
  Settings,
  Lightbulb,
  Repeat,
  Anchor,
  Calendar,
  Video,
  Scissors,
  Image,
  FileText,
  Megaphone,
  MessageSquare,
  Reply,
  Search,
  Mic2,
  Mic,
  Briefcase,
  RefreshCcw,
  DollarSign,
  Clapperboard,
  Brain,
  Workflow,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Layers,
} from 'lucide-react'
import { ALL_TOOLS } from '../../constants/tools'
import { ToolCategory } from '../../types'

interface SidebarProps {
  currentRoute: string
  onNavigate: (route: string) => void
  isOpen: boolean
  onCloseMobile: () => void
}

const CATEGORY_META: {
  key: ToolCategory
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { key: 'content-creation', label: 'Content Creation', icon: Sparkles },
  { key: 'audience-research', label: 'Audience & Research', icon: Users },
  { key: 'production', label: 'Production', icon: Film },
  { key: 'advanced-ai', label: 'Advanced AI', icon: Cpu },
]

export const getToolIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Lightbulb': return <Lightbulb className={className} />
    case 'Repeat': return <Repeat className={className} />
    case 'Anchor': return <Anchor className={className} />
    case 'Calendar': return <Calendar className={className} />
    case 'Video': return <Video className={className} />
    case 'Scissors': return <Scissors className={className} />
    case 'Image': return <Image className={className} />
    case 'FileText': return <FileText className={className} />
    case 'Megaphone': return <Megaphone className={className} />
    case 'MessageSquare': return <MessageSquare className={className} />
    case 'Reply': return <Reply className={className} />
    case 'Search': return <Search className={className} />
    case 'Mic2': return <Mic2 className={className} />
    case 'Mic': return <Mic className={className} />
    case 'Briefcase': return <Briefcase className={className} />
    case 'RefreshCcw': return <RefreshCcw className={className} />
    case 'DollarSign': return <DollarSign className={className} />
    case 'Clapperboard': return <Clapperboard className={className} />
    case 'Brain': return <Brain className={className} />
    case 'Film': return <Film className={className} />
    case 'Workflow': return <Workflow className={className} />
    case 'Sparkles': return <Sparkles className={className} />
    default: return <Sparkles className={className} />
  }
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, isOpen, onCloseMobile }) => {
  // Keep open states for categories
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({})

  const toggleCategory = (catKey: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [catKey]: !prev[catKey] }))
  }

  const handleNav = (route: string) => {
    onNavigate(route)
    onCloseMobile()
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0b0d14]/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Creator<span className="text-purple-400">OS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block -mt-1">
                22-in-1 Suite
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {/* Main Quick Nav */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentRoute === 'dashboard'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-purple-300" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('saved-content')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentRoute === 'saved-content'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-purple-300" />
                <span>Vault & Saved</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleNav('projects')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentRoute === 'projects'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-300" />
              <span>Projects & Channels</span>
            </button>
          </div>

          <div className="h-px bg-slate-800/80 my-2" />

          {/* 4 Tool Categories */}
          {CATEGORY_META.map((cat) => {
            const toolsInCat = ALL_TOOLS.filter((t) => t.category === cat.key)
            const isCollapsed = collapsedCategories[cat.key]
            const CatIcon = cat.icon

            return (
              <div key={cat.key} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.key)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 uppercase tracking-wider select-none cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <CatIcon className="w-3.5 h-3.5 text-purple-400/80 group-hover:text-purple-300" />
                    <span>{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono px-1.5 py-0.2 rounded bg-slate-800/60">
                      {toolsInCat.length}
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5 pl-1 pt-0.5">
                    {toolsInCat.map((tool) => {
                      const isActive = currentRoute === tool.id
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => handleNav(tool.id)}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all text-left cursor-pointer group ${
                            isActive
                              ? 'bg-purple-500/20 text-purple-200 border-l-2 border-purple-500 font-semibold pl-2.5'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className={isActive ? 'text-purple-300' : 'text-slate-500 group-hover:text-slate-300'}>
                              {getToolIcon(tool.iconName, 'w-3.5 h-3.5')}
                            </span>
                            <span className="truncate">{tool.name}</span>
                          </div>

                          {tool.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold shrink-0 ml-1.5 ${
                                tool.badge === 'Popular'
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                                  : tool.badge.includes('Stage') || tool.badge.includes('Multi')
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                              }`}
                            >
                              {tool.badge}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Settings & User */}
        <div className="p-3 border-t border-slate-800/80 shrink-0 space-y-2 bg-[#090b11]">
          <button
            type="button"
            onClick={() => handleNav('settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              currentRoute === 'settings'
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-purple-400" />
              <span>Settings & API Key</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Alex Rivera</p>
              <p className="text-[10px] text-purple-400 truncate">Pro Studio Creator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
