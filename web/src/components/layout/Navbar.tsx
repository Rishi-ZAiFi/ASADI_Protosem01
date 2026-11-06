import React from 'react';
import {
  Film,
  Plus,
  LayoutDashboard,
  Clapperboard,
  Compass,
  Smile,
  BarChart3,
  FolderKanban,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { Button } from '../common/Button';
import { storage } from '../../services/storage';

export interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const prefs = storage.getUserPreferences();

  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'workspace', label: 'Pre-Production', icon: <Clapperboard className="w-4 h-4" /> },
    { id: 'content-director', label: 'Content Director', icon: <Compass className="w-4 h-4" />, badge: '7-Stage' },
    { id: 'meme-studio', label: 'Meme Studio', icon: <Smile className="w-4 h-4" />, badge: 'Viral' },
    { id: 'analytics-copilot', label: 'Analytics Copilot', icon: <BarChart3 className="w-4 h-4" />, badge: 'AI' },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Workspace Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-soft group-hover:shadow-glow transition-all">
                <Film className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  CineCraft <span className="text-gradient">OS</span>
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-indigo-200 uppercase tracking-wider">
                    SaaS Suite
                  </span>
                </span>
                <span className="text-[10px] -mt-1 font-semibold text-slate-400 tracking-wider">
                  Pre-Production • Creative Direction • Analytics
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Actions & User Profile */}
          <div className="flex items-center gap-3">
            {/* Compute Credits Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/60 px-2.5 py-1 rounded-full text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>2,450 credits</span>
            </div>

            {/* Quick Action Button */}
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('create')}
              className="text-xs py-1.5 px-3"
            >
              New Project
            </Button>

            {/* User Profile Avatar */}
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none border border-slate-200/80"
              title="Creator Settings & Billing"
            >
              <div className="relative">
                <img
                  src={prefs.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={prefs.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="hidden xl:flex flex-col text-left pr-2">
                <span className="text-xs font-bold text-slate-800 leading-tight">{prefs.name || 'Bhuvanashree'}</span>
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Pro Creator Tier</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-nav on Tablet/Mobile */}
      <div className="lg:hidden border-t border-slate-100 bg-white/95 px-2 py-1.5 flex items-center justify-between overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 py-1 px-2.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
