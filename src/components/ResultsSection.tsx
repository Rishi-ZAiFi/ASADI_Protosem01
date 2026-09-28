'use client';

import React, { useState } from 'react';
import { Copy, Check, RotateCw, Sparkles, Layers } from 'lucide-react';
import { HookItem, Platform, Tone } from '@/types';
import { HookCard } from './HookCard';

interface ResultsSectionProps {
  hooks: HookItem[];
  topic: string;
  platform: Platform;
  tone: Tone;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  hooks,
  topic,
  platform,
  tone,
  onRegenerate,
  isRegenerating,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    const formatted = hooks
      .map((h, i) => `${String(i + 1).padStart(2, '0')}. [${h.style.toUpperCase()}]\n"${h.hook}"`)
      .join('\n\n');

    const header = `=== HOOKFORGE GENERATED HOOKS ===\nTopic: ${topic}\nPlatform: ${platform} | Tone: ${tone}\n\n`;
    const fullText = header + formatted;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2200);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = fullText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2200);
    }
  };

  return (
    <section
      id="results-section"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        marginTop: '40px',
      }}
    >
      {/* Top Header / Actions Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          borderLeft: '4px solid var(--accent-primary)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--accent-primary)',
              }}
            >
              Ready For Publishing
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              10 / 10 Styles
            </span>
          </div>

          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            Generated Hooks for: &ldquo;{topic.length > 55 ? `${topic.slice(0, 55)}...` : topic}&rdquo;
          </h2>

          <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              Platform: <strong style={{ color: '#ffffff' }}>{platform}</strong>
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              Tone: <strong style={{ color: '#ffffff' }}>{tone}</strong>
            </span>
          </div>
        </div>

        {/* Global Actions: Copy All & Regenerate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            id="copy-all-button"
            onClick={handleCopyAll}
            className="btn-secondary"
            style={{
              color: copiedAll ? '#34d399' : 'var(--text-primary)',
              borderColor: copiedAll ? 'rgba(52, 211, 153, 0.4)' : 'var(--border-subtle)',
            }}
          >
            {copiedAll ? (
              <>
                <Check size={16} color="#34d399" />
                <span>All 10 Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy All</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="regenerate-button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="btn-secondary"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
            }}
          >
            <RotateCw size={16} className={isRegenerating ? 'animate-spin' : ''} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* Grid of 10 Hook Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
        }}
        id="hooks-grid"
      >
        {hooks.map((hook, index) => (
          <HookCard key={`${hook.style}-${index}`} hook={hook} index={index} />
        ))}
      </div>
    </section>
  );
};
