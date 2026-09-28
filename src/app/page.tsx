'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HookForm } from '@/components/HookForm';
import { ResultsSection } from '@/components/ResultsSection';
import { Footer } from '@/components/Footer';
import { Platform, Tone, HookItem } from '@/types';
import { AlertCircle, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState<Platform>('LinkedIn');
  const [tone, setTone] = useState<Tone>('Bold');

  const [hooks, setHooks] = useState<HookItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent, isRegen = false) => {
    if (e) {
      e.preventDefault();
    }

    if (!topic.trim()) {
      setErrorMessage('Please enter a topic to generate hooks.');
      return;
    }

    if (isRegen) {
      setIsRegenerating(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          audience: audience.trim() || undefined,
          platform,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate hooks. Please try again.');
      }

      if (!data.hooks || !Array.isArray(data.hooks) || data.hooks.length === 0) {
        throw new Error('Received invalid hooks data from server. Please try again.');
      }

      setHooks(data.hooks);

      // Smooth scroll to results on initial generation
      if (!isRegen) {
        setTimeout(() => {
          const resultsEl = document.getElementById('results-section');
          if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected network error occurred. Please verify your connection.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1, paddingTop: '48px', paddingBottom: '40px' }}>
        {/* HERO SECTION */}
        <section
          style={{
            textAlign: 'center',
            maxWidth: '820px',
            margin: '0 auto 40px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#c7d2fe',
            }}
          >
            <Sparkles size={14} color="#818cf8" />
            <span>10 Psychological Angles • Instant Conversion</span>
          </div>

          {/* Single H1 */}
          <h1
            id="main-heading"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(180deg, #ffffff 30%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Turn Any Topic Into a Scroll-Stopping Hook
          </h1>

          {/* Subtitle */}
          <p
            id="main-subtitle"
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '620px',
            }}
          >
            Generate 10 hooks in different styles in seconds.
          </p>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '6px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#34d399" /> 10 Distinct Psychological Styles
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#34d399" /> Platform-Native Phrasing
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#34d399" /> 0% Hallucinated Stats
            </span>
          </div>
        </section>

        {/* ERROR NOTIFICATION BANNER */}
        {errorMessage && (
          <div
            role="alert"
            id="error-banner"
            style={{
              maxWidth: '820px',
              margin: '0 auto 28px auto',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertCircle size={20} color="var(--error)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '0.92rem', color: '#fca5a5', fontWeight: 600 }}>
                  {errorMessage}
                </p>
                {errorMessage.includes('GEMINI_API_KEY') && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Tip: Add your Gemini API key to the <code>.env</code> file in the project root:
                    <br />
                    <code>GEMINI_API_KEY=your_key_here</code>
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Dismiss error"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* INPUT FORM CONTAINER */}
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <HookForm
            topic={topic}
            setTopic={setTopic}
            audience={audience}
            setAudience={setAudience}
            platform={platform}
            setPlatform={setPlatform}
            tone={tone}
            setTone={setTone}
            onSubmit={(e) => handleGenerate(e, false)}
            isLoading={isLoading}
          />
        </div>

        {/* RESULTS SECTION (10 HOOKS) */}
        {hooks.length > 0 && (
          <ResultsSection
            hooks={hooks}
            topic={topic}
            platform={platform}
            tone={tone}
            onRegenerate={() => handleGenerate(undefined, true)}
            isRegenerating={isRegenerating}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
