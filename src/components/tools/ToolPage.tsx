import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  BookmarkCheck,
  Flame,
  CheckCircle2,
  Workflow,
  Copy,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { ToolDefinition, IdeaItem } from '../../types'
import { ToolInput } from '../common/ToolInput'
import { GenerateButton } from '../common/GenerateButton'
import { LoadingState } from '../common/LoadingState'
import { ErrorState } from '../common/ErrorState'
import { ResultCard } from '../common/ResultCard'
import { CopyButton } from '../common/CopyButton'
import { SaveButton } from '../common/SaveButton'
import { generateAI, saveIdeaToDb, saveContentToDb } from '../../services/api'
import { getToolIcon } from '../layout/Sidebar'

interface ToolPageProps {
  tool: ToolDefinition
  onOpenSettings: () => void
  onRefreshStats?: () => void
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool, onOpenSettings, onRefreshStats }) => {
  // Initialize input values from preset or defaults
  const getInitialValues = () => {
    const initial: Record<string, any> = {}
    tool.inputs.forEach((f) => {
      initial[f.name] = tool.samplePreset?.[f.name] ?? f.defaultValue ?? ''
    })
    return initial
  }

  const [formValues, setFormValues] = useState<Record<string, any>>(getInitialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    raw: string
    parsed?: any
    modelUsed: string
    durationMs?: number
  } | null>(null)
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null)
  const [activeStepTab, setActiveStepTab] = useState<number>(0)

  // Reset inputs when tool changes
  useEffect(() => {
    setFormValues(getInitialValues())
    setResult(null)
    setError(null)
    setActiveStepTab(0)
  }, [tool.id])

  const handleInputChange = (field: string, val: any) => {
    setFormValues((prev) => ({ ...prev, [field]: val }))
  }

  const handleFillSample = () => {
    if (tool.samplePreset) {
      setFormValues({ ...tool.samplePreset })
    }
  }

  const handleReset = () => {
    const fresh: Record<string, any> = {}
    tool.inputs.forEach((f) => {
      fresh[f.name] = f.defaultValue ?? ''
    })
    setFormValues(fresh)
  }

  const handleGenerate = async () => {
    // Basic validation
    const missing = tool.inputs.find((f) => f.required && !formValues[f.name]?.toString().trim())
    if (missing) {
      setError(`Please provide "${missing.label}" to generate content.`)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const resp = await generateAI(tool.id, formValues)
      setResult({
        raw: resp.data.raw,
        parsed: resp.data.parsed,
        modelUsed: resp.data.modelUsed,
        durationMs: resp.durationMs,
      })
      if (onRefreshStats) onRefreshStats()
    } catch (err: any) {
      setError(err?.message || 'AI generation encountered an unexpected error.')
    } finally {
      setLoading(false)
    }
  }

  // Save single idea from Content Idea Generator
  const handleSaveIdea = async (idea: IdeaItem) => {
    try {
      await saveIdeaToDb({
        title: idea.title,
        angle: idea.angle,
        format: idea.format,
        hook: idea.hook,
        description: idea.description,
        toolId: tool.id,
      })
      showSavedToast(`"${idea.title.slice(0, 30)}..." saved to Idea Vault!`)
      if (onRefreshStats) onRefreshStats()
    } catch (e: any) {
      console.error(e)
    }
  }

  // Save entire output to content vault
  const handleSaveEntireOutput = async () => {
    if (!result) return
    try {
      await saveContentToDb({
        toolId: tool.id,
        toolName: tool.name,
        inputs: formValues,
        output: result.parsed || result.raw,
        summary: formValues.topic || formValues.concept || formValues.title || `${tool.name} Output`,
      })
      showSavedToast(`Full ${tool.name} output saved to Vault!`)
      if (onRefreshStats) onRefreshStats()
    } catch (e: any) {
      console.error(e)
    }
  }

  const showSavedToast = (msg: string) => {
    setSavedSuccessMsg(msg)
    setTimeout(() => setSavedSuccessMsg(null), 3000)
  }

  // Helper to split multi-step output if applicable
  const renderMultiStepSections = (rawText: string, steps: string[]) => {
    // Try splitting by Markdown headers ### or ##
    const sections = rawText.split(/(?=###?\s+)/gi).filter(Boolean)

    return (
      <div className="space-y-6">
        {/* Step Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveStepTab(-1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              activeStepTab === -1
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            All Stages ({steps.length})
          </button>
          {steps.map((step, idx) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStepTab(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                activeStepTab === idx
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-900/60 text-[10px] flex items-center justify-center font-mono">
                {idx + 1}
              </span>
              <span>{step}</span>
            </button>
          ))}
        </div>

        {/* Display selected stage or all */}
        {activeStepTab === -1 ? (
          <div className="space-y-6">
            {sections.map((sec, idx) => (
              <ResultCard
                key={idx}
                badge={`Stage ${idx + 1}`}
                content={sec.trim()}
                rawTextToCopy={sec.trim()}
              />
            ))}
          </div>
        ) : (
          <div>
            {sections[activeStepTab] ? (
              <ResultCard
                badge={`Stage ${activeStepTab + 1}: ${steps[activeStepTab] || 'Phase'}`}
                content={sections[activeStepTab].trim()}
                rawTextToCopy={sections[activeStepTab].trim()}
              />
            ) : (
              <ResultCard
                badge={`Stage ${activeStepTab + 1}: ${steps[activeStepTab] || 'Phase'}`}
                content={rawText}
                rawTextToCopy={rawText}
              />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {savedSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-2xl shadow-emerald-900/50 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Tool Header Banner */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-600/30 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-600/20 shrink-0">
              {getToolIcon(tool.iconName, 'w-7 h-7')}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {tool.name}
                </h1>
                {tool.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {tool.badge}
                  </span>
                )}
                {tool.isMultiStep && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                    <Workflow className="w-3 h-3" />
                    Multi-Step Pipeline
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm md:text-base mt-1.5 max-w-2xl leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Quick presets buttons */}
          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            {tool.samplePreset && (
              <button
                type="button"
                onClick={handleFillSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-purple-300 hover:text-purple-200 border border-purple-500/30 transition-all cursor-pointer select-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill Sample</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              title="Reset fields"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Indicator if MultiStep */}
        {tool.isMultiStep && tool.steps && (
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              Automated Pipeline Stages:
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {tool.steps.map((st, i) => (
                <React.Fragment key={st}>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 shrink-0">
                    <span className="w-4 h-4 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-[10px] font-mono">
                      {i + 1}
                    </span>
                    <span>{st}</span>
                  </div>
                  {i < tool.steps!.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two-Column Grid: Form Inputs & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Configuration Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                Input Parameters
              </h3>
              <span className="text-xs text-slate-400">{tool.inputs.length} parameters</span>
            </div>

            <div className="space-y-4">
              {tool.inputs.map((field) => (
                <ToolInput
                  key={field.name}
                  field={field}
                  value={formValues[field.name]}
                  onChange={(val) => handleInputChange(field.name, val)}
                  disabled={loading}
                />
              ))}
            </div>

            <div className="pt-2">
              <GenerateButton
                onClick={handleGenerate}
                loading={loading}
                label={`Generate with ${tool.name.split(' ')[0]}`}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Output / Result Stream */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loading Indicator */}
          {loading && <LoadingState toolName={tool.name} />}

          {/* Error Message */}
          {error && (
            <ErrorState
              error={error}
              onRetry={handleGenerate}
              onOpenSettings={onOpenSettings}
            />
          )}

          {/* Result Display */}
          {result && !loading && (
            <div className="space-y-6 animate-fadeIn">
              {/* Output Actions Bar */}
              <div className="glass-panel rounded-2xl px-5 py-3.5 border border-slate-800/80 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-200">
                    Generated via {result.modelUsed}
                  </span>
                  {result.durationMs && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      ({(result.durationMs / 1000).toFixed(1)}s)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <CopyButton
                    textToCopy={
                      typeof result.parsed === 'object'
                        ? JSON.stringify(result.parsed, null, 2)
                        : result.raw
                    }
                    label="Copy All"
                    variant="solid"
                  />
                  <SaveButton onSave={handleSaveEntireOutput} label="Save Output" variant="solid" />
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>

              {/* SPECIFIC RENDERER 1: Content Idea Generator (Structured Idea Cards) */}
              {(() => {
                const ideasList: IdeaItem[] | null = Array.isArray(result.parsed)
                  ? result.parsed
                  : Array.isArray(result.parsed?.ideas)
                  ? result.parsed.ideas
                  : null

                if (tool.id !== 'content-idea-generator' || !ideasList) return null

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                      <span>Generated {ideasList.length} High-Virality Concepts</span>
                      <span>Click Save to store individual cards in your Idea Vault</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {ideasList.map((idea: IdeaItem, idx: number) => (
                        <div
                          key={idx}
                          className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-purple-500/40 transition-all duration-200 space-y-4 group relative"
                        >
                          {/* Idea Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                                0{idx + 1}
                              </span>
                              <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                                {idea.title}
                              </h3>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <CopyButton
                                textToCopy={`Title: ${idea.title}\nAngle: ${idea.angle}\nFormat: ${idea.format}\nHook: ${idea.hook}\nDescription: ${idea.description}`}
                              />
                              <SaveButton onSave={() => handleSaveIdea(idea)} />
                            </div>
                          </div>

                          {/* Angle & Format Badges */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 flex items-center gap-1.5">
                              <Flame className="w-3 h-3 text-indigo-400" />
                              <strong>Angle:</strong> {idea.angle}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/25 flex items-center gap-1.5">
                              <Layers className="w-3 h-3 text-purple-400" />
                              <strong>Format:</strong> {idea.format}
                            </span>
                          </div>

                          {/* Hook Quote Box */}
                          <div className="bg-[#0b0d14] rounded-xl p-3.5 border border-slate-800/90 text-sm relative">
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                              3-Second Verbal & On-Screen Hook
                            </span>
                            <p className="text-slate-200 italic font-medium">"{idea.hook}"</p>
                          </div>

                          {/* Description */}
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                            {idea.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {tool.id !== 'content-idea-generator' && tool.isMultiStep && tool.steps ? (
                /* SPECIFIC RENDERER 2: Advanced Multi-Step Workflows */
                renderMultiStepSections(result.raw, tool.steps)
              ) : (
                /* SPECIFIC RENDERER 3: Standard Markdown / Structured Content */
                <ResultCard
                  title={`${tool.name} Results`}
                  content={result.raw}
                  rawTextToCopy={result.raw}
                  onSave={handleSaveEntireOutput}
                />
              )}
            </div>
          )}

          {/* Empty Initial Placeholder State */}
          {!result && !loading && !error && (
            <div className="glass-panel rounded-2xl p-8 md:p-12 border border-dashed border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <Sparkles className="w-7 h-7 text-purple-500/40" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h4 className="text-base font-semibold text-slate-200">
                  Ready to generate {tool.name}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fill in the input parameters or click{' '}
                  <span className="text-purple-300 font-medium">"Fill Sample"</span> to preview a
                  complete test run in seconds.
                </p>
              </div>

              {tool.samplePreset && (
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Load Sample Preset</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
