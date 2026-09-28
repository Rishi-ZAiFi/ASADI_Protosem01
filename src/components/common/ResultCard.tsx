import React from 'react'
import { CopyButton } from './CopyButton'
import { SaveButton } from './SaveButton'

interface ResultCardProps {
  title?: string
  badge?: string
  content?: string
  children?: React.ReactNode
  onSave?: () => Promise<void> | void
  isSaved?: boolean
  className?: string
  footer?: React.ReactNode
  rawTextToCopy?: string
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  badge,
  content,
  children,
  onSave,
  isSaved,
  className = '',
  footer,
  rawTextToCopy,
}) => {
  const textForCopy = rawTextToCopy || content || ''

  return (
    <div
      className={`glass-card rounded-2xl p-5 md:p-6 border border-slate-800/80 hover:border-purple-500/30 transition-all duration-200 relative group ${className}`}
    >
      {/* Header bar */}
      {(title || badge || onSave || textForCopy) && (
        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/60 flex-wrap">
          <div className="flex items-center gap-2.5">
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {badge}
              </span>
            )}
            {title && <h4 className="text-base font-semibold text-slate-100 tracking-tight">{title}</h4>}
          </div>

          <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            {textForCopy && <CopyButton textToCopy={textForCopy} />}
            {onSave && <SaveButton onSave={onSave} isSaved={isSaved} />}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="text-slate-300 text-sm leading-relaxed space-y-2">
        {content && <div className="whitespace-pre-wrap font-sans">{content}</div>}
        {children}
      </div>

      {/* Optional Card Footer */}
      {footer && <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-400">{footer}</div>}
    </div>
  )
}
