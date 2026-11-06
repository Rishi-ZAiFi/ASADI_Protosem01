import React, { useState, useRef } from 'react';
import {
  Smile,
  Search,
  Download,
  Copy,
  Sparkles,
  Shuffle,
  Check,
  Clapperboard,
  Type,
  Palette,
  Layers,
  Flame,
} from 'lucide-react';
import { MemeTemplate } from '../../types';
import { MEME_TEMPLATES, findMemesForQuery } from '../../services/memeRegistry';
import { Button } from '../common/Button';

interface MemeStudioViewProps {
  onAttachMemeToProject?: (meme: { name: string; topText: string; bottomText: string }) => void;
}

export const MemeStudioView: React.FC<MemeStudioViewProps> = ({ onAttachMemeToProject }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeme, setSelectedMeme] = useState<MemeTemplate>(MEME_TEMPLATES[0]);
  const [topText, setTopText] = useState(MEME_TEMPLATES[0].defaultTopText);
  const [bottomText, setBottomText] = useState(MEME_TEMPLATES[0].defaultBottomText);
  const [fontSize, setFontSize] = useState<number>(28);
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [isCopied, setIsCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredMemes = findMemesForQuery(searchQuery).filter((m) =>
    activeCategory === 'all' ? true : m.category === activeCategory
  );

  const handleSelectTemplate = (template: MemeTemplate) => {
    setSelectedMeme(template);
    setTopText(template.defaultTopText);
    setBottomText(template.defaultBottomText);
  };

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * MEME_TEMPLATES.length);
    handleSelectTemplate(MEME_TEMPLATES[randomIndex]);
  };

  const handleDownloadMeme = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedMeme.imageUrl;

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;

      // Draw background
      ctx.drawImage(img, 0, 0, 600, 600);

      // Vignette overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
      gradient.addColorStop(0.3, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.7, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 600);

      // Text styling
      ctx.fillStyle = textColor;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
      ctx.font = `900 ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';

      // Top text
      if (topText.trim()) {
        ctx.strokeText(topText.toUpperCase(), 300, 50);
        ctx.fillText(topText.toUpperCase(), 300, 50);
      }

      // Bottom text
      if (bottomText.trim()) {
        ctx.strokeText(bottomText.toUpperCase(), 300, 560);
        ctx.fillText(bottomText.toUpperCase(), 300, 560);
      }

      const link = document.createElement('a');
      link.download = `cinecraft-meme-${selectedMeme.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  const handleCopyText = () => {
    const fullText = `[TOP]: ${topText}\n[BOTTOM]: ${bottomText}\n— Iconic Ref: ${selectedMeme.iconicDialogue}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-black/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
            <Smile className="w-3.5 h-3.5" />
            <span>Viral Marketing & Humor Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Viral Meme Studio & Teaser Generator
          </h1>
          <p className="text-amber-100 text-sm leading-relaxed">
            Generate high-velocity promo memes, social teasers, and thumbnail hooks using legendary meme templates and custom punchlines.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-sm transition-all"
          >
            <Shuffle className="w-4 h-4" />
            <span>Random Template</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace Grid: Gallery on Left + Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Template Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by comedy star, dialogue, or emotion..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['all', 'tamil', 'global', 'tech', 'creator'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    activeCategory === cat
                      ? 'bg-amber-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredMemes.map((template) => {
              const isSelected = selectedMeme.id === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all bg-white flex flex-col ${
                    isSelected
                      ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20 scale-[0.99]'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {template.character}
                    </div>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <div className="font-bold text-xs text-slate-900 line-clamp-1">{template.name}</div>
                    <div className="text-[10px] text-amber-700 font-medium line-clamp-1">{template.iconicDialogue}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Interactive Canvas & Editor (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-5 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Smile className="w-4 h-4 text-amber-500" />
                <span>Live Meme Creator Canvas</span>
              </h3>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                {selectedMeme.character}
              </span>
            </div>

            {/* LIVE PREVIEW CANVAS CONTAINER */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-xl flex flex-col justify-between p-4 select-none">
              <img
                src={selectedMeme.imageUrl}
                alt={selectedMeme.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

              {/* Top Text Overlay */}
              <div
                style={{ fontSize: `${fontSize * 0.75}px`, color: textColor }}
                className="relative z-10 text-center font-black uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] stroke-black px-2 leading-tight"
              >
                {topText || 'TOP TEXT HERE'}
              </div>

              {/* Bottom Text Overlay */}
              <div
                style={{ fontSize: `${fontSize * 0.75}px`, color: textColor }}
                className="relative z-10 text-center font-black uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] stroke-black px-2 leading-tight"
              >
                {bottomText || 'BOTTOM TEXT HERE'}
              </div>
            </div>

            {/* Text Inputs & Styling Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Top Caption
                </label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top text..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Bottom Punchline
                </label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom punchline..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Font Size ({fontSize}px)</label>
                  <input
                    type="range"
                    min="18"
                    max="42"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                    <span className="text-xs font-mono text-slate-600">{textColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDownloadMeme}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res Meme PNG</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" leftIcon={<Copy className="w-3.5 h-3.5" />} onClick={handleCopyText}>
                  {isCopied ? 'Copied!' : 'Copy Text'}
                </Button>
                {onAttachMemeToProject && (
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<Clapperboard className="w-3.5 h-3.5" />}
                    onClick={() =>
                      onAttachMemeToProject({
                        name: selectedMeme.name,
                        topText,
                        bottomText,
                      })
                    }
                  >
                    Attach to Project
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
