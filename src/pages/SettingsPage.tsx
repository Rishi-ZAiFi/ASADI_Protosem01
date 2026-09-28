import React, { useState } from 'react'
import {
  KeyRound,
  ShieldCheck,
  Server,
  Database,
  Download,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Lock,
  RefreshCw,
} from 'lucide-react'
import { SystemStatus } from '../types'
import { updateServerApiKey, getSavedIdeas, getSavedContent, getHistory } from '../services/api'

interface SettingsPageProps {
  systemStatus: SystemStatus | null
  onRefreshStatus: () => Promise<void>
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ systemStatus, onRefreshStatus }) => {
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKeyInput.trim()) {
      setSaveError('Please enter a valid API key.')
      return
    }

    setIsSaving(true)
    setSaveSuccess(null)
    setSaveError(null)

    try {
      await updateServerApiKey(apiKeyInput.trim())
      await onRefreshStatus()
      setSaveSuccess('API Key successfully saved and verified with backend AI service!')
      setApiKeyInput('')
      setTimeout(() => setSaveSuccess(null), 4000)
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update API key')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      const [ideas, content, history] = await Promise.all([
        getSavedIdeas(),
        getSavedContent(),
        getHistory(),
      ])

      const backup = {
        exportedAt: new Date().toISOString(),
        system: 'CreatorOS 22-in-1 Suite',
        stats: {
          ideasCount: ideas.length,
          savedContentCount: content.length,
          historyCount: history.length,
        },
        ideas,
        savedContent: content,
        history,
      }

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `creatoros_backup_${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export data:', err)
    }
  }

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn pb-12">
      {/* Settings Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <KeyRound className="w-7 h-7 text-purple-400" />
          Settings & AI Architecture
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure centralized AI API credentials, verify gateway status, and manage local storage.
        </p>
      </div>

      {/* Security Architecture Alert */}
      <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 bg-purple-950/10 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs md:text-sm">
          <h4 className="font-bold text-white">Centralized AI Service & Zero Frontend Key Exposure</h4>
          <p className="text-slate-300 leading-relaxed">
            All AI queries run strictly through the Node.js backend (<code className="text-purple-300 font-mono">/api/ai/generate</code>).
            Your API keys are stored securely on the server and are never bundled into client-side JavaScript or exposed to the browser.
          </p>
        </div>
      </div>

      {/* API Key Configuration Form */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Configure OpenAI API Key
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Powered by the official OpenAI Responses API. Configurable model via <span className="text-purple-300 font-mono">OPENAI_MODEL</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 ${
                systemStatus?.ai?.hasKey
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${systemStatus?.ai?.hasKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              {systemStatus?.ai?.hasKey ? 'OpenAI Connected' : 'No Key Configured'}
            </span>
          </div>
        </div>

        {systemStatus?.ai?.hasKey && (
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400">Active Provider:</span>
              <p className="text-slate-200 font-semibold uppercase">{systemStatus.ai.provider} ({systemStatus.ai.model})</p>
            </div>
            <div className="space-y-0.5 text-right font-mono">
              <span className="text-slate-400">Masked Key:</span>
              <p className="text-purple-300">{systemStatus.ai.maskedKey}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveKey} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Enter OpenAI API Key:
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="sk-proj-... or sk-..."
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm font-mono placeholder:text-slate-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {saveError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {saveError}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-300 underline flex items-center gap-1"
              >
                <span>Get free Gemini API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-300 underline flex items-center gap-1"
              >
                <span>OpenAI Keys</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <button
              type="submit"
              disabled={isSaving || !apiKeyInput.trim()}
              className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-purple-600/30"
            >
              {isSaving ? 'Verifying & Saving...' : 'Save & Verify Key'}
            </button>
          </div>
        </form>
      </div>

      {/* Database & Storage Architecture */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              Database-Ready Storage Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured database schema for Users, Projects, Ideas, Generated Content, and Studio History.
            </p>
          </div>

          <button
            type="button"
            onClick={onRefreshStatus}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            title="Refresh diagnostics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Ideas Store</span>
            <p className="text-xl font-bold text-white font-mono mt-1">
              {systemStatus?.stats?.totalIdeas ?? 0}
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Saved Vault</span>
            <p className="text-xl font-bold text-white font-mono mt-1">
              {systemStatus?.stats?.totalSaved ?? 0}
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Generations</span>
            <p className="text-xl font-bold text-white font-mono mt-1">
              {systemStatus?.stats?.totalGenerations ?? 0}
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Active Projects</span>
            <p className="text-xl font-bold text-white font-mono mt-1">
              {systemStatus?.stats?.totalProjects ?? 0}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between flex-wrap gap-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Export all generated content, scripts, and ideas as a single portable JSON file.
          </p>
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export Database JSON</span>
          </button>
        </div>
      </div>
    </div>
  )
}
