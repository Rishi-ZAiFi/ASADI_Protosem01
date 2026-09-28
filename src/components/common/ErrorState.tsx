import React from 'react'
import { AlertTriangle, RefreshCw, KeyRound, ArrowRight } from 'lucide-react'

interface ErrorStateProps {
  error: string
  onRetry?: () => void
  onOpenSettings?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onOpenSettings }) => {
  const isKeyError =
    error.toLowerCase().includes('api key') ||
    error.toLowerCase().includes('401') ||
    error.toLowerCase().includes('gemini_api_key') ||
    error.toLowerCase().includes('openai_api_key')

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 border border-red-500/30 bg-red-950/10 my-4 relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="flex-1 space-y-2">
          <h4 className="text-base font-semibold text-red-200">
            {isKeyError ? 'AI API Key Required' : 'Generation Encountered an Error'}
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">{error}</p>

          {isKeyError && (
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 text-xs text-slate-400 space-y-2 mt-3">
              <p className="text-slate-300 font-medium flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-purple-400" />
                How to activate real AI generation:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>
                  Add <code className="text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded">OPENAI_API_KEY</code> to your{' '}
                  <span className="text-slate-200 font-mono">.env</span> file.
                </li>
                <li>Or go directly to the Settings page in CreatorOS to enter and save your OpenAI key securely.</li>
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Generation</span>
              </button>
            )}

            {isKeyError && onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 transition-all cursor-pointer"
              >
                <span>Open Settings & Enter Key</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
