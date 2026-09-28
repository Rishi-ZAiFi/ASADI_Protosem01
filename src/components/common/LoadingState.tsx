import React, { useEffect, useState } from 'react'
import { Sparkles, Wand2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  toolName?: string
}

const MESSAGES = [
  'Analyzing audience psychology & algorithmic triggers...',
  'Architecting high-retention narrative hooks...',
  'Synthesizing creative angles and format dynamics...',
  'Refining editorial cadence and visual directions...',
  'Applying virality benchmarks and final polish...',
]

export const LoadingState: React.FC<LoadingStateProps> = ({ message, toolName }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length)
    }, 2400)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="glass-panel rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center border border-purple-500/20 relative overflow-hidden my-4">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Pulsing icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-600/30 animate-pulse">
          <Wand2 className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-500/80 flex items-center justify-center text-white">
          <Sparkles className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white tracking-wide mb-2">
        {toolName ? `CreatorOS Generating: ${toolName}` : 'CreatorOS AI Engine at Work'}
      </h3>

      <p className="text-sm text-purple-300/90 font-medium h-6 transition-all duration-300">
        {message || MESSAGES[index]}
      </p>

      {/* Shimmer line */}
      <div className="w-48 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden relative">
        <div className="absolute inset-y-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full animate-[shimmer_1.5s_infinite]" />
      </div>

      <span className="text-xs text-slate-500 mt-4 font-mono">Connecting via Centralized AI API Gateway</span>
    </div>
  )
}
