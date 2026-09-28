'use client';

import React from 'react';
import { Loader2, Sparkles, Hash } from 'lucide-react';
import { Platform, Tone } from '@/types';

interface HookFormProps {
  topic: string;
  setTopic: (val: string) => void;
  audience: string;
  setAudience: (val: string) => void;
  platform: Platform;
  setPlatform: (val: Platform) => void;
  tone: Tone;
  setTone: (val: Tone) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const PLATFORMS: { id: Platform; label: string; badge: string; color: string }[] = [
  { id: 'LinkedIn', label: 'LinkedIn', badge: 'Professional & B2B', color: '#0a66c2' },
  { id: 'X/Twitter', label: 'X / Twitter', badge: 'Punchy & Viral', color: '#1da1f2' },
  { id: 'Instagram', label: 'Instagram', badge: 'Reels & Carousels', color: '#e1306c' },
  { id: 'TikTok', label: 'TikTok', badge: 'First 2-Sec Spikes', color: '#00f2fe' },
  { id: 'YouTube', label: 'YouTube', badge: 'Shorts & Long-form', color: '#ff0000' },
];

const TONES: { id: Tone; label: string; desc: string }[] = [
  { id: 'Bold', label: 'Bold', desc: 'Direct, provocative, punchy' },
  { id: 'Professional', label: 'Professional', desc: 'Authoritative, credible, polished' },
  { id: 'Funny', label: 'Funny', desc: 'Witty, sarcastic, relatable' },
  { id: 'Educational', label: 'Educational', desc: 'Insightful, actionable, teardowns' },
  { id: 'Emotional', label: 'Emotional', desc: 'Empathetic, vulnerable, moving' },
];

const TOPIC_SUGGESTIONS = [
  'Why 90% of SaaS founders fail at customer retention',
  'How learning to code with AI changed my life in 6 months',
  'The hidden cost of multitasking for high performers',
  'Stop using ChatGPT like a search engine',
];

const AUDIENCE_SUGGESTIONS = [
  'B2B SaaS Founders',
  'Content Creators',
  'Junior Developers',
  'College Students',
  'Freelancers & Solopreneurs',
];

export const HookForm: React.FC<HookFormProps> = ({
  topic,
  setTopic,
  audience,
  setAudience,
  platform,
  setPlatform,
  tone,
  setTone,
  onSubmit,
  isLoading,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="glass-panel"
      style={{
        padding: '36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        position: 'relative',
      }}
      id="hook-generator-form"
    >
      {/* 1. TOPIC INPUT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label
            htmlFor="topic-input"
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>1. What is your topic or core message?</span>
            <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem' }}>*</span>
          </label>
          <span
            style={{
              fontSize: '0.8rem',
              color: topic.length > 250 ? '#f43f5e' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {topic.length}/300
          </span>
        </div>

        <textarea
          id="topic-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value.slice(0, 300))}
          placeholder="e.g. Why most junior developers struggle to get hired in 2026..."
          className="input-field"
          style={{ height: '90px', fontSize: '1rem' }}
          required
          disabled={isLoading}
        />

        {/* Quick topic inspiration tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginRight: '2px',
            }}
          >
            <Hash size={12} /> Try an example:
          </span>
          {TOPIC_SUGGESTIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTopic(preset)}
              disabled={isLoading}
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '3px 8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {preset.length > 36 ? `${preset.slice(0, 36)}...` : preset}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TARGET AUDIENCE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label
            htmlFor="audience-input"
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
            }}
          >
            2. Who is your target audience?{' '}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>
              (Optional)
            </span>
          </label>
        </div>

        <input
          id="audience-input"
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. Early-stage startup founders, solo content creators..."
          className="input-field"
          disabled={isLoading}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {AUDIENCE_SUGGESTIONS.map((aud, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setAudience(aud)}
              disabled={isLoading}
              style={{
                fontSize: '0.72rem',
                color: audience === aud ? '#a5b4fc' : 'var(--text-muted)',
                background:
                  audience === aud ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border:
                  audience === aud
                    ? '1px solid rgba(99, 102, 241, 0.5)'
                    : '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '2px 8px',
                cursor: 'pointer',
              }}
            >
              +{aud}
            </button>
          ))}
        </div>
      </div>

      {/* 3. PLATFORM & TONE (2-Column Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {/* PLATFORM SELECTOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
            }}
          >
            3. Target Platform
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '10px',
            }}
          >
            {PLATFORMS.map((item) => {
              const isSelected = platform === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`platform-btn-${item.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setPlatform(item.id)}
                  disabled={isLoading}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected
                      ? '1px solid var(--accent-primary)'
                      : '1px solid var(--border-subtle)',
                    background: isSelected
                      ? 'rgba(99, 102, 241, 0.15)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.label}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TONE SELECTOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
            }}
          >
            4. Desired Tone
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '10px',
            }}
          >
            {TONES.map((item) => {
              const isSelected = tone === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`tone-btn-${item.id.toLowerCase()}`}
                  onClick={() => setTone(item.id)}
                  disabled={isLoading}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected
                      ? '1px solid #8b5cf6'
                      : '1px solid var(--border-subtle)',
                    background: isSelected
                      ? 'rgba(139, 92, 246, 0.15)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 16px rgba(139, 92, 246, 0.25)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.label}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PRIMARY CTA BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <button
          type="submit"
          id="generate-hooks-button"
          disabled={isLoading || !topic.trim()}
          className="btn-primary"
          style={{
            width: '100%',
            maxWidth: '380px',
            padding: '16px 32px',
            fontSize: '1.1rem',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Generating 10 Hooks...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate 10 Hooks</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
