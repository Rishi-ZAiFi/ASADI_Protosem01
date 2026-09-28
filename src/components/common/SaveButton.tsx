import React, { useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'

interface SaveButtonProps {
  onSave: () => Promise<void> | void
  isSaved?: boolean
  label?: string
  savedLabel?: string
  className?: string
  variant?: 'ghost' | 'solid'
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onSave,
  isSaved = false,
  label = 'Save to Vault',
  savedLabel = 'Saved',
  className = '',
  variant = 'ghost',
}) => {
  const [localSaved, setLocalSaved] = useState(isSaved)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (localSaved || saving) return
    try {
      setSaving(true)
      await onSave()
      setLocalSaved(true)
    } catch (err) {
      console.error('Failed to save: ', err)
    } finally {
      setSaving(false)
    }
  }

  const baseStyle =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none active:scale-95'

  const variantStyle =
    variant === 'solid'
      ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30'
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent hover:border-slate-700'

  const active = isSaved || localSaved

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={active || saving}
      title={active ? 'Saved' : 'Save to Vault'}
      className={`${baseStyle} ${variantStyle} ${
        active
          ? '!text-purple-400 !border-purple-500/40 !bg-purple-500/10 cursor-default'
          : 'cursor-pointer'
      } ${className}`}
    >
      {active ? (
        <BookmarkCheck className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
      ) : (
        <Bookmark className="w-3.5 h-3.5" />
      )}
      <span>{active ? savedLabel : saving ? 'Saving...' : label}</span>
    </button>
  )
}
