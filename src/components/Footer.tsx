'use client';

import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: '80px',
        borderTop: '1px solid var(--border-subtle)',
        padding: '36px 0',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--accent-primary)" />
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            HookForge
          </span>
          <span>— Stop wasting hours on hooks. Turn any topic into scroll-stopping hooks.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#34d399" />
          <span>Statistically safe: No fabricated data or hallucinated statistics.</span>
        </div>
      </div>
    </footer>
  );
};
