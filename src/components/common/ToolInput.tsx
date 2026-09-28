import React from 'react'
import { InputFieldDefinition } from '../../types'

interface ToolInputProps {
  field: InputFieldDefinition
  value: any
  onChange: (value: any) => void
  disabled?: boolean
}

export const ToolInput: React.FC<ToolInputProps> = ({ field, value, onChange, disabled }) => {
  const { name, label, type, placeholder, options, rows = 4, helpText, required } = field

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
          {label}
          {required && <span className="text-purple-400">*</span>}
        </label>
        {helpText && <span className="text-xs text-slate-400">{helpText}</span>}
      </div>

      {type === 'text' && (
        <input
          id={name}
          type="text"
          value={value ?? ''}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="glass-input w-full px-4 py-2.5 rounded-xl text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-500 disabled:opacity-50"
        />
      )}

      {type === 'textarea' && (
        <textarea
          id={name}
          rows={rows}
          value={value ?? ''}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="glass-input w-full px-4 py-3 rounded-xl text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-500 resize-y disabled:opacity-50 font-sans"
        />
      )}

      {type === 'select' && (
        <div className="relative">
          <select
            id={name}
            value={value ?? ''}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className="glass-input w-full px-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-[#0e101a] text-slate-200 disabled:opacity-50"
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#121522] text-slate-200 py-1">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {type === 'checkbox' && (
        <label className="flex items-center gap-3 cursor-pointer group pt-1">
          <input
            id={name}
            type="checkbox"
            checked={Boolean(value)}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-950 transition-colors"
          />
          <span className="text-sm text-slate-300 group-hover:text-purple-300 transition-colors select-none">
            {placeholder || label}
          </span>
        </label>
      )}

      {type === 'number' && (
        <input
          id={name}
          type="number"
          value={value ?? ''}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="glass-input w-full px-4 py-2.5 rounded-xl text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-500 disabled:opacity-50"
        />
      )}
    </div>
  )
}
