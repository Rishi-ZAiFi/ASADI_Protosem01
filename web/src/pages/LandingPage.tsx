import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  ArrowRight,
  Layers,
  Camera,
  Package,
  Clapperboard,
  Clock,
  CheckCircle2,
  Play,
  Share2,
  Compass,
  Smile,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Star,
  Check,
  GitBranch,
} from 'lucide-react';
import { NavigationPage } from '../types';
import { Button } from '../components/common/Button';

export interface LandingPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenSampleDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenSampleDemo }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeEngineTab, setActiveEngineTab] = useState<'preproduction' | 'contentdirector' | 'memestudio' | 'analytics'>('preproduction');

  return (
    <div className="min-h-screen flex flex-col bg-studio-bg selection:bg-brand-500 selection:text-white">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-white via-indigo-50/30 to-studio-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[280px] bg-purple-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 shadow-sm animate-in fade-in duration-500">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span className="text-xs font-bold text-indigo-900 tracking-wide uppercase">
                All-in-One Autonomous AI Video Studio SaaS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              From Raw Idea to Viral Video <br className="hidden sm:inline" />
              <span className="text-gradient">With Autonomous AI Precision</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Uniting <strong>Autonomous Pre-Production</strong>, <strong>7-Stage Creative Direction</strong>, <strong>Viral Meme Marketing</strong>, and <strong>Creator Analytics Intelligence</strong> into a single seamless operating system.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto shadow-glow text-base px-8 py-3.5"
              >
                Launch Studio Free
              </Button>

              <Button
                size="lg"
                variant="outline"
                leftIcon={<Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />}
                onClick={onOpenSampleDemo}
                className="w-full sm:w-auto text-base bg-white/80 hover:bg-white"
              >
                Explore Live Demo Plan
              </Button>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>3 AI Engines Unified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Export PDF, CSV, Fountain Screenplay</span>
              </div>
            </div>
          </div>

          {/* Interactive Engine Switcher Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden">
            {/* Tabs Bar */}
            <div className="bg-slate-900 p-2 sm:p-3 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
              <div className="flex items-center gap-2">
                {[
                  { id: 'preproduction', label: '1. Pre-Production Studio', icon: <Clapperboard className="w-4 h-4" /> },
                  { id: 'contentdirector', label: '2. 7-Stage Content Director', icon: <Compass className="w-4 h-4" /> },
                  { id: 'memestudio', label: '3. Viral Meme Studio', icon: <Smile className="w-4 h-4" /> },
                  { id: 'analytics', label: '4. Creator Analytics Copilot', icon: <BarChart3 className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEngineTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeEngineTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  if (activeEngineTab === 'preproduction') onNavigate('workspace');
                  else if (activeEngineTab === 'contentdirector') onNavigate('content-director');
                  else if (activeEngineTab === 'memestudio') onNavigate('meme-studio');
                  else onNavigate('analytics-copilot');
                }}
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 pr-2"
              >
                <span>Open Full Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tab 1 Preview: Pre-Production Studio */}
            {activeEngineTab === 'preproduction' && (
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50">
                <div className="md:col-span-5 space-y-3">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Multi-Agent Engine (Repo 25)</span>
                  <h3 className="text-xl font-bold text-slate-900">Scene Breakdowns, Shot Lists & Budgets</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Autonomous director, screenwriter, and storyboarder agents generate full shot-by-shot visual framing, camera angles, lighting cues, dialogue, and props checklist in under 15 seconds.
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => onNavigate('workspace')}
                  >
                    Enter Pre-Production Workspace
                  </Button>
                </div>
                <div className="md:col-span-7 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-slate-500">
                    <span className="font-bold text-slate-800">Scene #1: The Awakening</span>
                    <span className="text-indigo-600 font-bold">00:00 - 00:08 (Close-up → Wide)</span>
                  </div>
                  <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <strong>Action:</strong> Subject opens eyes to the sound of alarm. Sunlight streams through Venetian blinds creating shadow stripes across bed.
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="bg-indigo-50/50 p-2 rounded border border-indigo-100">Camera: 35mm Prime, f/1.8 Slow Pan</div>
                    <div className="bg-amber-50/50 p-2 rounded border border-amber-100">Lighting: 45° Key Softbox + Warm Rim</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2 Preview: Content Director */}
            {activeEngineTab === 'contentdirector' && (
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50">
                <div className="md:col-span-5 space-y-3">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">CineSensei Pipeline (Repo 18)</span>
                  <h3 className="text-xl font-bold text-slate-900">7-Stage Creative Direction & Teleprompter</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Walk through research validation, emotional angle selection, 3-act narrative architecture, word-for-word spoken teleprompter scripts, and viral thumbnail packaging.
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => onNavigate('content-director')}
                    className="bg-purple-600 hover:bg-purple-500"
                  >
                    Launch 7-Stage Director
                  </Button>
                </div>
                <div className="md:col-span-7 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500 font-semibold pb-1.5 border-b border-slate-100">
                    <span>Teleprompter Split View (146 Words, 60s)</span>
                    <span className="text-purple-600 font-bold">146 WPM Cadence</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 text-purple-950 font-medium">
                      "If you are still doing this the traditional way... you are leaving half your results on the table."
                    </div>
                    <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600 italic">
                      [Visual]: Host looks into lens (35mm f/1.8). Quick camera snap zoom on "traditional". Glitch SFX.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3 Preview: Meme Studio */}
            {activeEngineTab === 'memestudio' && (
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50">
                <div className="md:col-span-5 space-y-3">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Viral Marketing (Repo 18)</span>
                  <h3 className="text-xl font-bold text-slate-900">Canvas Meme Studio & Cutaway Generator</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Create promo teasers, comedy cutaways, and relatable video hooks with legendary Tamil comedy icons (Vadivelu) and global meme templates with live canvas rendering.
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => onNavigate('meme-studio')}
                    className="bg-amber-600 hover:bg-amber-500"
                  >
                    Open Meme Studio Canvas
                  </Button>
                </div>
                <div className="md:col-span-7 bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white flex items-center justify-center gap-4">
                  <div className="w-36 aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative">
                    <img
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80"
                      alt="Meme Demo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 inset-x-1 text-[8px] font-black text-center text-white stroke-black drop-shadow uppercase">
                      FOOD BILL ARRIVES
                    </div>
                    <div className="absolute bottom-1 inset-x-1 text-[8px] font-black text-center text-white stroke-black drop-shadow uppercase">
                      VENAAM VALIKIDHU...
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-amber-400">Vadivelu - Kaipulla</div>
                    <div className="text-slate-300">Vibe: Emotional Damage & Despair</div>
                    <div className="text-[11px] text-slate-400">Download PNG, paste to Premiere or Reels.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4 Preview: Analytics Copilot */}
            {activeEngineTab === 'analytics' && (
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50">
                <div className="md:col-span-5 space-y-3">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Intelligence Engine (Repo 24)</span>
                  <h3 className="text-xl font-bold text-slate-900">Creator Analytics Copilot & Fatigue Auditor</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Analyze watch-time retention curves, pinpoint audience burnout thresholds, view day/hour posting heatmaps, and chat with your channel metrics using Gemini AI.
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => onNavigate('analytics-copilot')}
                    className="bg-blue-600 hover:bg-blue-500"
                  >
                    Open Analytics Copilot
                  </Button>
                </div>
                <div className="md:col-span-7 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold">
                    <span className="text-slate-900">Channel Fatigue Index: 28/100 (Optimal)</span>
                    <span className="text-emerald-600">+18.4% Views Lift</span>
                  </div>
                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-950 font-medium">
                    "45s - 55s shorts outperform longer videos by 3.2x with zero audience burnout."
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Peak window: Tue/Thu 6:00 PM • Sunday 7:00 PM
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. SaaS Pricing Section */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Transparent SaaS Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple Plans for Solo Creators & Full Studios
            </h2>
            <p className="text-slate-600 text-sm">
              Start with free compute credits or upgrade for unlimited multi-agent production runs and advanced channel analytics.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tier 1: Starter */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Starter Creator</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{billingCycle === 'annual' ? '$15' : '$19'}</span>
                  <span className="text-xs font-semibold text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600">Essential tools for independent creators launching short-form content.</p>

                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  {['10 Multi-Agent Pre-Production plans / mo', 'Full 7-Stage Content Direction Pipeline', 'Viral Meme Studio canvas editor', '1 Channel Analytics Ingestion', 'Export PDF & Markdown'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="outline" className="w-full" onClick={() => onNavigate('dashboard')}>
                Start Free Trial
              </Button>
            </div>

            {/* Tier 2: Pro Studio (Popular) */}
            <div className="p-8 rounded-3xl border-2 border-indigo-600 bg-white shadow-xl space-y-6 flex flex-col justify-between relative ring-4 ring-indigo-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Most Popular for Growth
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Pro Studio</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{billingCycle === 'annual' ? '$39' : '$49'}</span>
                  <span className="text-xs font-semibold text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600">For ambitious creators and editors scaling multi-platform distribution.</p>

                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  {[
                    'Unlimited Pre-Production Plans & Scenes',
                    '7-Stage Creative Direction with Teleprompter',
                    'Unlimited Viral Memes & High-Res PNG Exports',
                    'Full Audience Fatigue Anomaly Detector',
                    'Ask Your Data AI Copilot with Gemini',
                    'Fountain Screenplay & PDF Production Binders',
                    'Priority Multi-Agent Compute Speed',
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="primary" className="w-full shadow-glow" onClick={() => onNavigate('dashboard')}>
                Get Pro Studio
              </Button>
            </div>

            {/* Tier 3: Agency Enterprise */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Agency & Production House</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{billingCycle === 'annual' ? '$119' : '$149'}</span>
                  <span className="text-xs font-semibold text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600">Built for media companies, agencies, and studio teams.</p>

                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  {[
                    'All Pro features included',
                    'Multi-channel network telemetry',
                    'Team workspaces & role permissions',
                    'Custom AI tone matching for brand voice',
                    'Dedicated SLA & custom export templates',
                    'API access & webhook integration',
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="outline" className="w-full" onClick={() => onNavigate('dashboard')}>
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Open Source & Attribution Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold">Synthesized from 3 Groundbreaking GitHub Repositories</h2>
            <p className="text-xs text-slate-400">
              CineCraft OS unites the engineering work of three specialized creator AI research modules into one unified SaaS platform:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://github.com/bhuvanashreekr-del/ASADI_Protosem01.git"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500 transition-all space-y-2 block"
            >
              <div className="flex items-center justify-between text-indigo-400 text-xs font-bold">
                <span>Creator Analytics Copilot</span>
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">bhuvanashreekr-del / ASADI_Protosem01</div>
              <p className="text-xs text-slate-400">
                Audience retention analytics, content fatigue detection, Gemini AI queries, and PDF export engine.
              </p>
            </a>

            <a
              href="https://github.com/sriclickjananii-bot/18_AI-content-director.git"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-purple-500 transition-all space-y-2 block"
            >
              <div className="flex items-center justify-between text-purple-400 text-xs font-bold">
                <span>AI Content Director (CineSensei)</span>
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">sriclickjananii-bot / 18_AI-content-director</div>
              <p className="text-xs text-slate-400">
                7-Stage creative direction pipeline, dual-column teleprompter, and viral meme studio.
              </p>
            </a>

            <a
              href="https://github.com/akshayam1207-oss/25_AI-Video-Pre-Production-Studio.git"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-500 transition-all space-y-2 block"
            >
              <div className="flex items-center justify-between text-amber-400 text-xs font-bold">
                <span>AI Video Pre-Production Studio</span>
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">akshayam1207-oss / 25_AI-Video-Pre-Production-Studio</div>
              <p className="text-xs text-slate-400">
                Multi-agent pre-production planning, scene breakdowns, shot lists, crew and equipment budgeting.
              </p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
