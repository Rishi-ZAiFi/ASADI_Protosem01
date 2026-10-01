import React from 'react'
import { ResultCard } from './ResultCard'

export const humanizeKey = (key: string): string => {
  const overrides: Record<string, string> = {
    research: 'Research',
    angles: 'Content Angles',
    narrative: 'Narrative',
    script: 'Script',
    hook: 'Hook',
    body: 'Body',
    cta: 'Call to Action',
    ideas: 'Content Ideas',
    audience: 'Target Audience',
    content_pillars: 'Content Pillars',
    contentPillars: 'Content Pillars',
    shot_list: 'Shot List',
    shotList: 'Shot List',
    b_roll: 'B-Roll',
    bRoll: 'B-Roll',
    publishing_copy: 'Publishing Copy',
    publishingCopy: 'Publishing Copy',
    recommendations: 'Recommendations',
    analysis: 'Analysis',
    summary: 'Summary',
    highlights: 'Highlights',
    chapters: 'Chapters',
    sentiment: 'Sentiment',
    questions: 'Questions',
    opportunities: 'Opportunities',
  }

  if (overrides[key]) return overrides[key]

  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_]/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

interface AIResultRendererProps {
  data: any
}

export const AIResultRenderer: React.FC<AIResultRendererProps> = ({ data }) => {
  if (data === null || data === undefined) return null

  // If it's a primitive, just render it inside a div or p
  if (typeof data === 'string') {
    return <div className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">{data}</div>
  }
  if (typeof data === 'number' || typeof data === 'boolean') {
    return <div className="text-slate-300 font-medium">{String(data)}</div>
  }

  // If it's an array
  if (Array.isArray(data)) {
    return (
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <span className="text-purple-400 font-mono text-sm font-bold mt-0.5 shrink-0">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div className="flex-1">
              <AIResultRenderer data={item} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // If it's an object
  if (typeof data === 'object') {
    // Determine if it has success: false, error: ...
    if (data.success === false && data.error) {
       return (
         <div className="glass-panel rounded-2xl p-6 border border-red-500/30 bg-red-500/5">
           <h4 className="text-red-400 font-bold mb-2">Generation Failed</h4>
           <p className="text-red-200/80 text-sm">{typeof data.error === 'string' ? data.error : (data.error.message || 'Unknown error occurred.')}</p>
         </div>
       )
    }

    return (
      <div className="space-y-6">
        {Object.entries(data).map(([key, val], idx) => {
          if (val === null || val === undefined) return null
          
          return (
            <div key={idx} className="space-y-2">
              <h4 className="text-sm font-bold text-slate-200 tracking-tight uppercase border-b border-slate-800/60 pb-1.5 mb-2">
                {humanizeKey(key)}
              </h4>
              <div className="pl-1">
                <AIResultRenderer data={val} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return null
}
