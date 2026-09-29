import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Menu,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Bookmark,
  ChevronRight,
  X,
} from 'lucide-react'
import { ALL_TOOLS } from '../../constants/tools'
import { SystemStatus } from '../../types'
import { getToolIcon } from './Sidebar'

interface NavbarProps {
  currentRoute: string
  onNavigate: (route: string) => void
  onToggleSidebar: () => void
  systemStatus: SystemStatus | null
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onToggleSidebar,
  systemStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Find active tool if any
  const activeTool = ALL_TOOLS.find((t) => t.id === currentRoute)

  // Filter tools based on query
  const searchResults = searchQuery.trim()
    ? ALL_TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  // Close search dropdown on click outside or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 50)
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#08090d]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-400 truncate">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="hover:text-purple-300 transition-colors cursor-pointer hidden sm:inline"
          >
            CreatorOS
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="text-white font-semibold truncate">
            {activeTool ? activeTool.name : currentRoute === 'settings' ? 'Settings & API Keys' : currentRoute === 'saved-content' ? 'Content Vault' : currentRoute === 'projects' ? 'Projects & Channels' : 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Center: Search Trigger Bar */}
      <div className="relative flex-1 max-w-md mx-2 hidden sm:block">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsSearchOpen(true)
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search 22 AI tools (e.g. Hooks, Scripts, Thumbnails)..."
            className="w-full pl-9 pr-14 py-2 bg-slate-900/70 border border-slate-800 hover:border-slate-700 focus:border-purple-500 rounded-xl text-xs md:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />
            <div className="absolute left-0 right-0 mt-2 bg-[#0e111a] border border-slate-800/90 rounded-2xl shadow-2xl p-2 z-50 max-h-96 overflow-y-auto space-y-1 backdrop-blur-2xl">
              <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/60 mb-1">
                <span>{searchQuery ? `Matching Tools (${searchResults.length})` : 'Popular Tools'}</span>
                <span className="text-[10px] text-slate-500">ESC to close</span>
              </div>

              {(searchQuery ? searchResults : ALL_TOOLS.slice(0, 6)).map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => {
                    onNavigate(tool.id)
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                      {getToolIcon(tool.iconName, 'w-3.5 h-3.5')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 truncate">
                        {tool.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{tool.description}</p>
                    </div>
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium shrink-0 ml-2">
                      {tool.badge}
                    </span>
                  )}
                </button>
              ))}

              {searchQuery && searchResults.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  No tools found for "{searchQuery}". Try searching for "Hook", "Reel", "Script", or "Idea".
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right: AI Key Status Badge & Quick Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Launch Idea Button */}
        <button
          type="button"
          onClick={() => onNavigate('content-idea-generator')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 text-purple-200 border border-purple-500/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>New Idea</span>
        </button>

        {/* Vault Shortcut */}
        <button
          type="button"
          onClick={() => onNavigate('saved-content')}
          title="Saved Items Vault"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer relative"
        >
          <Bookmark className="w-4 h-4" />
          {systemStatus?.stats?.totalSaved ? (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
          ) : null}
        </button>

        {/* Real-time AI Status Indicator */}
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            systemStatus?.ai?.hasKey
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
          }`}
          title="Click to manage API keys & AI settings"
        >
          {systemStatus?.ai?.hasKey ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">
                Gemini Active
              </span>
              <span className="md:hidden">AI Online</span>
            </>
          ) : (
            <>
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Connect AI Key</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}
