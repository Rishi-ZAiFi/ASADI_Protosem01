'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, HelpCircle, ShieldAlert, BarChart3, BookOpen, Flame, Compass, Eye, AlertCircle } from 'lucide-react';
import { HookItem } from '@/types';

interface HookCardProps {
  hook: HookItem;
  index: number;
}

const STYLE_META: Record<
  string,
  {
    icon: React.ReactNode;
    color: string;
    bg: string;
    border: string;
    tagline: string;
  }
> = {
  Curiosity: {
    icon: <Eye size={14} />,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.25)',
    tagline: 'Stirs deep intrigue & knowledge gaps',
  },
  Question: {
    icon: <HelpCircle size={14} />,
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.1)',
    border: 'rgba(251, 191, 36, 0.25)',
    tagline: 'Provokes instant mental engagement',
  },
  Contrarian: {
    icon: <Flame size={14} />,
    color: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.1)',
    border: 'rgba(244, 63, 94, 0.25)',
    tagline: 'Flips common wisdom upside down',
  },
  'Bold Claim': {
    icon: <Sparkles size={14} />,
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.25)',
    tagline: 'High-confidence statement that demands attention',
  },
  'Statistic/Data': {
    icon: <BarChart3 size={14} />,
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.1)',
    border: 'rgba(96, 165, 250, 0.25)',
    tagline: 'Data-driven angle (100% verified & safe)',
  },
  Story: {
    icon: <BookOpen size={14} />,
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.1)',
    border: 'rgba(52, 211, 153, 0.25)',
    tagline: 'Opening hook of an irresistible narrative',
  },
  'Problem/Pain Point': {
    icon: <AlertCircle size={14} />,
    color: '#fb923c',
    bg: 'rgba(251, 146, 60, 0.1)',
    border: 'rgba(251, 146, 60, 0.25)',
    tagline: 'Directly strikes a raw audience nerve',
  },
  'Fear/Urgency': {
    icon: <ShieldAlert size={14} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.25)',
    tagline: 'Highlights costly mistakes and FOMO',
  },
  'Future/Possibility': {
    icon: <Compass size={14} />,
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.1)',
    border: 'rgba(236, 72, 153, 0.25)',
    tagline: 'Paints an inspiring transformative vision',
  },
  'Surprise/Twist': {
    icon: <Sparkles size={14} />,
    color: '#2dd4bf',
    bg: 'rgba(45, 212, 191, 0.1)',
    border: 'rgba(45, 212, 191, 0.25)',
    tagline: 'Subverts standard expectations',
  },
};

export const HookCard: React.FC<HookCardProps> = ({ hook, index }) => {
  const [copied, setCopied] = useState(false);

  const formattedNumber = String(index + 1).padStart(2, '0');
  const meta = STYLE_META[hook.style] || {
    icon: <Sparkles size={14} />,
    color: '#818cf8',
    bg: 'rgba(129, 140, 248, 0.1)',
    border: 'rgba(129, 140, 248, 0.25)',
    tagline: 'Psychological viral framework',
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hook.hook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = hook.hook;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="glass-panel fade-in-card"
      id={`hook-card-${index + 1}`}
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '20px',
        position: 'relative',
        animationDelay: `${index * 50}ms`,
        transition: 'all 0.25s ease',
        background: 'linear-gradient(180deg, rgba(22, 29, 46, 0.7) 0%, rgba(14, 18, 29, 0.7) 100%)',
      }}
    >
      {/* Top Bar: Number + Style Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {formattedNumber}
          </span>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: meta.color,
              background: meta.bg,
              border: `1px solid ${meta.border}`,
            }}
          >
            {meta.icon}
            <span>{hook.style}</span>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'none',
          }}
        >
          {meta.tagline}
        </span>
      </div>

      {/* Main Hook Copy */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            fontWeight: 500,
            color: '#ffffff',
            letterSpacing: '-0.01em',
            position: 'relative',
          }}
        >
          &ldquo;{hook.hook}&rdquo;
        </p>
      </div>

      {/* Bottom Bar: Tagline & Copy Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}
        >
          {meta.tagline}
        </span>

        <button
          type="button"
          id={`copy-btn-${index + 1}`}
          onClick={handleCopy}
          aria-label={`Copy hook ${formattedNumber}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: copied ? '#34d399' : 'var(--text-secondary)',
            background: copied ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255, 255, 255, 0.05)',
            border: copied
              ? '1px solid rgba(52, 211, 153, 0.35)'
              : '1px solid var(--border-subtle)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? (
            <>
              <Check size={14} color="#34d399" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
