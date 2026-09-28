import React from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

interface GenerateButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  label?: string
  loadingLabel?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'purple'
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  label = 'Generate with AI',
  loadingLabel = 'Architecting with AI...',
  className = '',
  variant = 'purple',
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none overflow-hidden group shadow-lg active:scale-[0.98]'

  const variantClasses = {
    purple:
      'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25 hover:shadow-purple-600/40 border border-purple-400/30',
    primary:
      'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25 hover:shadow-blue-600/40 border border-blue-400/30',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-slate-600 shadow-black/20',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-6 py-3.5 text-sm md:text-base ${baseClasses} ${variantClasses[variant]} ${
        disabled || loading ? 'opacity-60 cursor-not-allowed shadow-none' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Subtle shine effect on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      {loading ? (
        <span className="flex items-center gap-2.5">
          <Loader2 className="w-5 h-5 animate-spin text-purple-200" />
          <span>{loadingLabel}</span>
        </span>
      ) : (
        <span className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-purple-200 group-hover:rotate-12 transition-transform duration-300" />
          <span>{label}</span>
        </span>
      )}
    </button>
  )
}
