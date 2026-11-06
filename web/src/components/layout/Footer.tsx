import React from 'react';
import { Film, Sparkles, GitBranch, Heart } from 'lucide-react';
import { NavigationPage } from '../../types';

export const Footer: React.FC<{ onNavigate: (page: NavigationPage) => void }> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200/80 bg-white/90 backdrop-blur-sm mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Film className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                CineCraft <span className="text-gradient">OS</span>
              </span>
              <span className="text-slate-400 text-[10px]">
                Autonomous AI Pre-Production, Creative Direction & Analytics Studio
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
            <button onClick={() => onNavigate('landing')} className="hover:text-indigo-600 transition-colors">
              Home
            </button>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 transition-colors">
              Dashboard
            </button>
            <button onClick={() => onNavigate('workspace')} className="hover:text-indigo-600 transition-colors">
              Pre-Production
            </button>
            <button onClick={() => onNavigate('content-director')} className="hover:text-indigo-600 transition-colors">
              Content Director
            </button>
            <button onClick={() => onNavigate('meme-studio')} className="hover:text-indigo-600 transition-colors">
              Meme Studio
            </button>
            <button onClick={() => onNavigate('analytics-copilot')} className="hover:text-indigo-600 transition-colors">
              Analytics Copilot
            </button>
            <button onClick={() => onNavigate('projects')} className="hover:text-indigo-600 transition-colors">
              Projects
            </button>
            <button onClick={() => onNavigate('settings')} className="hover:text-indigo-600 transition-colors">
              Settings & Billing
            </button>
          </div>
        </div>

        {/* Repositories Attribution Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-700">Repositories Synthesized:</span>
            <a
              href="https://github.com/bhuvanashreekr-del/ASADI_Protosem01.git"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 flex items-center gap-1 underline underline-offset-2"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Bhuvanashree (Analytics)</span>
            </a>
            <span>•</span>
            <a
              href="https://github.com/sriclickjananii-bot/18_AI-content-director.git"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600 flex items-center gap-1 underline underline-offset-2"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Sri Jananii (Content Director)</span>
            </a>
            <span>•</span>
            <a
              href="https://github.com/akshayam1207-oss/25_AI-Video-Pre-Production-Studio.git"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-600 flex items-center gap-1 underline underline-offset-2"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Akshaya (Pre-Production Studio)</span>
            </a>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for Protosem SaaS Hackathon</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
