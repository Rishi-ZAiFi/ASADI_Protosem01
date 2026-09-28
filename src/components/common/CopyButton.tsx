import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  textToCopy: string
  label?: string
  copiedLabel?: string
  className?: string
  variant?: 'ghost' | 'solid'
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
  variant = 'ghost',
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const baseStyle =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none active:scale-95'

  const variantStyle =
    variant === 'solid'
      ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30'
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent hover:border-slate-700'

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy to clipboard"
      className={`${baseStyle} ${variantStyle} ${copied ? '!text-emerald-400 !border-emerald-500/30 !bg-emerald-500/10' : ''} ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  )
}
