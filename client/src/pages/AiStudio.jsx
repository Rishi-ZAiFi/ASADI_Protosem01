import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sparkles,
  Copy,
  BookmarkPlus,
  RefreshCw,
  AlertCircle,
  Video,
  Layers,
  FileText,
  Smartphone,
  Check,
  Zap,
} from 'lucide-react';
import { generateContent } from '../services/api';
import FormatBadge from '../components/FormatBadge';

export default function AiStudio({
  preferences,
  onSaveContent,
  onCopyContent,
  addToast,
}) {
  const location = useLocation();

  // State
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('Instagram Reel');
  const [audience, setAudience] = useState('Content Creators');
  const [tone, setTone] = useState('Educational');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [errorState, setErrorState] = useState(null);
  const [hasSavedCurrent, setHasSavedCurrent] = useState(false);

  // Initialize from preferences or location state (from Trend Radar or Dashboard)
  useEffect(() => {
    if (preferences) {
      if (preferences.defaultFormat) setFormat(preferences.defaultFormat);
      if (preferences.preferredAudience) setAudience(preferences.preferredAudience);
      if (preferences.preferredTone) setTone(preferences.preferredTone);
    }

    if (location.state?.preselectedFormat) {
      setFormat(location.state.preselectedFormat);
    }
    if (location.state?.preselectedTopic) {
      setTopic(location.state.preselectedTopic);
    }
  }, [location.state, preferences]);

  // Options
  const formatOptions = [
    { id: 'Instagram Reel', label: 'Instagram Reel', icon: Video, desc: 'Hook, 15-60s script, visual b-roll & caption' },
    { id: 'Carousel', label: 'Carousel', icon: Layers, desc: '5-8 slides with visual cues & actionable takeaways' },
    { id: 'Caption', label: 'Caption', icon: FileText, desc: 'Compelling opener, narrative copy & hashtags' },
    { id: 'Story', label: 'Story', icon: Smartphone, desc: 'Interactive 3-5 frame sequence with sticker triggers' },
  ];

  const audiencePresets = [
    'Content Creators',
    'Beginners',
    'Students',
    'Entrepreneurs',
    'Technology enthusiasts',
    'General audience',
  ];

  const tonePresets = [
    'Educational',
    'Conversational',
    'Professional',
    'Creative',
    'Friendly',
    'Humorous',
  ];

  // Handler for content generation
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setErrorState({
        title: 'Missing Topic',
        message: 'Please enter a topic or click one of the quick inspiration suggestions below.',
      });
      addToast('Please enter a topic or idea first!', 'error');
      return;
    }

    setIsGenerating(true);
    setErrorState(null);
    setHasSavedCurrent(false);

    try {
      const responseData = await generateContent({
        topic: topic.trim(),
        format,
        audience,
        tone,
      });

      setGeneratedResult(responseData);
      addToast(`Generated ${format} successfully!`, 'success');
    } catch (err) {
      console.error('Generation Error:', err);
      setErrorState({
        title: err.code === 'MISSING_API_KEY'
          ? 'Gemini API Key Required'
          : 'Generation Failed',
        message: err.message,
      });
      addToast(err.message || 'Generation failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedResult) return;
    onSaveContent({
      topic: generatedResult.topic,
      format: generatedResult.format,
      audience: generatedResult.audience,
      tone: generatedResult.tone,
      content: generatedResult.content,
      provider: 'gemini',
      model: generatedResult.model || 'gemini-3.5-flash-lite',
    });
    setHasSavedCurrent(true);
    addToast('Content saved to your library!', 'success');
  };

  return (
    <div className="studio-page">
      {/* Studio Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          AI Content Studio
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
          Craft platform-specific copy engineered for high engagement and conversions, powered by Google Gemini AI.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 460px) 1fr',
          gap: '1.75rem',
          alignItems: 'start',
        }}
        className="studio-grid"
      >
        {/* Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card: Configuration Inputs */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Topic Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="topic-input">
                <span>Topic / Content Idea *</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Be as specific as you like</span>
              </label>
              <textarea
                id="topic-input"
                className="input-textarea"
                placeholder="e.g. 5 habits of top creators, or How to use AI tools for growth..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.45rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Try an example:</span>
                {[
                  '5 habits of top creators',
                  'How to automate content with AI',
                  '3 mistakes beginners make',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTopic(s)}
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      color: '#a5b4fc',
                      cursor: 'pointer',
                    }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Format Selector */}
            <div className="form-group">
              <label className="form-label">Content Format</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.6rem',
                }}
              >
                {formatOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = format === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormat(opt.id)}
                      style={{
                        padding: '0.75rem 0.65rem',
                        borderRadius: '10px',
                        border: isSelected
                          ? '2px solid var(--primary)'
                          : '1px solid var(--border-subtle)',
                        backgroundColor: isSelected
                          ? 'var(--primary-light)'
                          : 'var(--bg-input)',
                        color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.3rem',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Icon size={16} color={isSelected ? 'var(--primary)' : 'var(--text-dim)'} />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{opt.label}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-dim)',
                          lineHeight: 1.25,
                        }}
                      >
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Audience */}
            <div className="form-group">
              <label className="form-label" htmlFor="audience-input">
                <span>Target Audience</span>
              </label>
              <input
                id="audience-input"
                type="text"
                className="input-text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Beginners, Entrepreneurs..."
                style={{ marginBottom: '0.5rem' }}
              />
              {/* Quick Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {audiencePresets.map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setAudience(aud)}
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.25rem 0.55rem',
                      borderRadius: '999px',
                      border: '1px solid',
                      borderColor: audience === aud ? 'var(--primary)' : 'var(--border-subtle)',
                      backgroundColor: audience === aud ? 'var(--primary-light)' : 'rgba(255,255,255,0.03)',
                      color: audience === aud ? '#a5b4fc' : 'var(--text-dim)',
                      cursor: 'pointer',
                    }}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="form-group">
              <label className="form-label" htmlFor="tone-input">
                <span>Writing Tone</span>
              </label>
              <input
                id="tone-input"
                type="text"
                className="input-text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g. Educational, Friendly..."
                style={{ marginBottom: '0.5rem' }}
              />
              {/* Quick Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {tonePresets.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.25rem 0.55rem',
                      borderRadius: '999px',
                      border: '1px solid',
                      borderColor: tone === t ? 'var(--primary)' : 'var(--border-subtle)',
                      backgroundColor: tone === t ? 'var(--primary-light)' : 'rgba(255,255,255,0.03)',
                      color: tone === t ? '#a5b4fc' : 'var(--text-dim)',
                      cursor: 'pointer',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Engine Status Card */}
            <div
              style={{
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <label className="form-label">
                <span>AI Generation Engine</span>
              </label>

              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(99, 102, 241, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    <Sparkles size={17} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      Google Gemini 3.5 Flash
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Ultra-fast cloud generation with auto-failover
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--accent-emerald)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)' }} />
                  <span>Ready</span>
                </div>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.98rem',
                marginTop: '0.5rem',
              }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Generating {format}...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Error Banner */}
          {errorState && (
            <div
              className="card"
              style={{
                borderColor: 'rgba(244, 63, 94, 0.4)',
                backgroundColor: 'rgba(244, 63, 94, 0.08)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
              }}
            >
              <AlertCircle size={20} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: 'var(--accent-rose)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  {errorState.title}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.5 }}>
                  {errorState.message}
                </p>
              </div>
            </div>
          )}

          {/* Loading State Skeleton */}
          {isGenerating && (
            <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <RefreshCw size={26} style={{ animation: 'spin 1.2s linear infinite' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Formulating Your {format}...
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto' }}>
                Synthesizing creative content with Google Gemini AI...
              </p>
            </div>
          )}

          {/* Generated Result Card */}
          {!isGenerating && generatedResult && (
            <div className="card" style={{ padding: '1.75rem', borderColor: 'rgba(99, 102, 241, 0.35)' }}>
              {/* Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FormatBadge format={generatedResult.format} />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {generatedResult.topic}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      <span>Model: Google Gemini ({generatedResult.model})</span>
                      <span>•</span>
                      <span>Audience: {generatedResult.audience}</span>
                    </div>
                  </div>
                </div>

                {/* Result Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => onCopyContent(generatedResult.content)}
                    className="btn btn-secondary btn-sm"
                    title="Copy formatted content to clipboard"
                  >
                    <Copy size={14} />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={hasSavedCurrent}
                    className="btn btn-secondary btn-sm"
                    style={hasSavedCurrent ? { borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' } : {}}
                    title="Save to your Saved Content library"
                  >
                    {hasSavedCurrent ? <Check size={14} /> : <BookmarkPlus size={14} />}
                    <span>{hasSavedCurrent ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    className="btn btn-ghost btn-sm"
                    title="Regenerate with current settings"
                  >
                    <RefreshCw size={14} />
                    <span>Generate Again</span>
                  </button>
                </div>
              </div>

              {/* Formatted Content Body */}
              <div
                style={{
                  backgroundColor: 'var(--bg-input)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  maxHeight: '650px',
                  overflowY: 'auto',
                }}
              >
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.94rem',
                    lineHeight: 1.7,
                    color: 'var(--text-main)',
                  }}
                >
                  {generatedResult.content}
                </pre>
              </div>
            </div>
          )}

          {/* Empty Prompt Placeholder */}
          {!isGenerating && !generatedResult && !errorState && (
            <div className="card empty-state" style={{ minHeight: '380px' }}>
              <div className="empty-state-icon">
                <Sparkles size={26} />
              </div>
              <h3>Ready to Create</h3>
              <p>
                Enter your topic or idea on the left, pick your preferred format and tone, and click <strong>Generate Content</strong>.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-dim)',
                }}
              >
                <span>💡 Tip: Check <strong>Trend Radar</strong> to grab trending topics with 1 click!</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .studio-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
