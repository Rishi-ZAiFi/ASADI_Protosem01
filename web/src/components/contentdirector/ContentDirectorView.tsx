import React, { useState } from 'react';
import {
  Compass,
  Search,
  GitFork,
  FileText,
  Film,
  Camera,
  Share2,
  Sparkles,
  Play,
  Pause,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Clapperboard,
  Smile,
  Download,
  Flame,
  Clock,
  Eye,
  Sliders,
} from 'lucide-react';
import {
  ContentPipelineProject,
  ContentStageKey,
  Platform,
  Tone,
} from '../../types';
import {
  STAGES_CONFIG,
  generatePipelineForTopic,
} from '../../services/contentDirectorService';
import { Button } from '../common/Button';

interface ContentDirectorViewProps {
  onNavigateToPreProduction?: (topic: string, script: string) => void;
  onNavigateToMemeStudio?: () => void;
}

export const ContentDirectorView: React.FC<ContentDirectorViewProps> = ({
  onNavigateToPreProduction,
  onNavigateToMemeStudio,
}) => {
  const [topicInput, setTopicInput] = useState('Why 95% of AI Wrappers Will Die (And What Wins)');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('YouTube Shorts');
  const [selectedTone, setSelectedTone] = useState<Tone>('Cinematic');
  const [pipeline, setPipeline] = useState<ContentPipelineProject>(() =>
    generatePipelineForTopic('Why 95% of AI Wrappers Will Die (And What Wins)', 'YouTube Shorts', 'Cinematic')
  );
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isTeleprompterPlaying, setIsTeleprompterPlaying] = useState(false);

  const handleGenerate = () => {
    if (!topicInput.trim()) return;
    const newPipe = generatePipelineForTopic(topicInput, selectedPlatform, selectedTone);
    setPipeline(newPipe);
    setActiveStage(1);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const currentStageInfo = STAGES_CONFIG[activeStage - 1];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Creative Direction Engine • 7-Stage Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Content Director <span className="text-indigo-400">(CineSensei)</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Transform any high-level topic or analytical finding into a production-ready, psychology-backed 7-stage video blueprint with validated hooks, teleprompter scripts, and packaging.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToPreProduction && (
              <Button
                variant="primary"
                leftIcon={<Clapperboard className="w-4 h-4" />}
                onClick={() => {
                  const fullScript = pipeline.script?.sections.map((s) => s.spokenAudio).join('\n\n') || '';
                  onNavigateToPreProduction(pipeline.topic, fullScript);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow"
              >
                Send to Pre-Production
              </Button>
            )}
            {onNavigateToMemeStudio && (
              <Button
                variant="outline"
                leftIcon={<Smile className="w-4 h-4" />}
                onClick={onNavigateToMemeStudio}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                Launch Meme Studio
              </Button>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Video Topic or Angle</label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g. Traditional Dum Biryani Food Review or Why AI Agents Fail"
              className="w-full bg-slate-800/80 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
              className="w-full bg-slate-800/80 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube Long-form</option>
              <option value="LinkedIn">LinkedIn Video</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Regenerate Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7-Stage Horizontal Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 pb-1">
          {STAGES_CONFIG.map((stage) => {
            const isActive = activeStage === stage.number;
            const isCompleted = pipeline.completedStages.includes(stage.number);
            return (
              <button
                key={stage.number}
                onClick={() => setActiveStage(stage.number)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                    : isCompleted
                    ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50/60'
                    : 'bg-white text-slate-400 border-slate-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                    isActive ? 'bg-white text-indigo-600' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {stage.number}
                </span>
                <span>{stage.title}</span>
              </button>
            );
          })}
        </div>

        {/* Director Tip Alert */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50">
          <span className="font-bold text-amber-800 uppercase tracking-wider text-[10px] bg-amber-200/60 px-1.5 py-0.5 rounded">
            Director Tip
          </span>
          <span>{currentStageInfo.directorTip}</span>
        </div>
      </div>

      {/* Stage Content Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
        {/* STAGE 1: RESEARCH */}
        {activeStage === 1 && pipeline.research && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-600" />
                  <span>Stage 1: Verified Research & Facts</span>
                </h3>
                <p className="text-xs text-slate-500">Market intelligence and psychological pain points</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => handleCopyText(JSON.stringify(pipeline.research, null, 2), 'research')}
              >
                {isCopied === 'research' ? 'Copied!' : 'Copy Data'}
              </Button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-sm text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">Executive Overview:</span>
              {pipeline.research.topicOverview}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/70 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-indigo-600" />
                  <span>Surprising Key Facts</span>
                </h4>
                <ul className="space-y-2 text-xs text-indigo-950">
                  {pipeline.research.keyFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/70 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Audience Retention Metrics</span>
                </h4>
                <div className="space-y-3">
                  {pipeline.research.statistics.map((st, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-emerald-200/60">
                      <div className="font-extrabold text-sm text-emerald-700">{st.stat}</div>
                      <div className="text-xs text-slate-600">{st.context}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">Source: {st.source}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: ANGLES */}
        {activeStage === 2 && pipeline.angles && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                <span>Stage 2: Competitive Positioning Angles</span>
              </h3>
              <p className="text-xs text-slate-500">Select the angle with the highest emotional curiosity gap</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pipeline.angles.angles.map((ang) => (
                <div
                  key={ang.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    ang.id === pipeline.angles?.recommendedAngleId
                      ? 'border-indigo-500 bg-indigo-50/30 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{ang.title}</span>
                    {ang.id === pipeline.angles?.recommendedAngleId && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="p-3 bg-slate-900 text-white rounded-xl text-xs font-medium italic">
                    "{ang.hook}"
                  </div>
                  <p className="text-xs text-slate-600">{ang.description}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 border-t border-slate-100">
                    <span>Emotion: <strong className="text-slate-800">{ang.targetEmotion}</strong></span>
                    <span>Uniqueness: <strong className="text-indigo-600">{ang.uniquenessScore}/10</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 3: NARRATIVE */}
        {activeStage === 3 && pipeline.narrative && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GitFork className="w-5 h-5 text-indigo-600" />
                <span>Stage 3: Narrative Architecture (3-Act Storyboard)</span>
              </h3>
              <p className="text-xs text-slate-500">Pacing curve and emotional stakes breakdown</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Act 1: The Inciting Hook</span>
                <p className="text-xs text-slate-700">{pipeline.narrative.threeActStructure.act1.hook}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Act 2: The Escalation</span>
                <p className="text-xs text-slate-700">{pipeline.narrative.threeActStructure.act2.conflict}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Act 3: Payoff & Resolution</span>
                <p className="text-xs text-slate-700">{pipeline.narrative.threeActStructure.act3.climax}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Beat Outline (Timecoded Pacing)</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {pipeline.narrative.beats.map((beat) => (
                  <div key={beat.beatNumber} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
                        B{beat.beatNumber}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{beat.beatTitle}</div>
                        <div className="text-xs text-slate-600">{beat.action}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{beat.timecode}</span>
                      <span className="text-indigo-600 font-semibold">{beat.emotionalShift}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: SPOKEN SCRIPT (TELEPROMPTER) */}
        {activeStage === 4 && pipeline.script && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Stage 4: Dual-Column Teleprompter Script</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Spoken delivery words paired with on-screen visual & sound cues ({pipeline.script.totalWordCount} words, ~{pipeline.script.estimatedDuration})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTeleprompterPlaying(!isTeleprompterPlaying)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isTeleprompterPlaying ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isTeleprompterPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTeleprompterPlaying ? 'Stop Prompt' : 'Simulate Teleprompter'}</span>
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Copy className="w-3.5 h-3.5" />}
                  onClick={() =>
                    handleCopyText(
                      pipeline.script?.sections.map((s) => `${s.timecode}\nSPOKEN: ${s.spokenAudio}\nVISUAL: ${s.screenVisual}`).join('\n\n') || '',
                      'script'
                    )
                  }
                >
                  {isCopied === 'script' ? 'Copied Script!' : 'Copy Script'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {pipeline.script.sections.map((sec, idx) => (
                <div key={sec.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-slate-100 px-4 py-2 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="uppercase tracking-wider">Section {idx + 1}: {sec.type.toUpperCase()}</span>
                    <span className="font-mono text-slate-500">{sec.timecode} ({sec.wordCount} words)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="md:col-span-7 p-4 bg-white space-y-2">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Spoken Dialogue</span>
                      <p className="text-sm font-medium text-slate-900 leading-relaxed">
                        "{sec.spokenAudio}"
                      </p>
                      <div className="text-[11px] text-amber-700 italic">Tone cue: {sec.toneCue}</div>
                    </div>
                    <div className="md:col-span-5 p-4 bg-slate-50/70 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Screen Visual & Sound FX</span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {sec.screenVisual}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 5: VISUALS */}
        {activeStage === 5 && pipeline.visuals && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-600" />
                <span>Stage 5: Visuals, Lighting & Audio Design</span>
              </h3>
              <p className="text-xs text-slate-500">Color palette, B-roll queries, and sound cues</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Lighting & Atmosphere:</span>
                <p className="text-xs text-slate-700">{pipeline.visuals.lightingMood}</p>
                <div className="text-[11px] font-medium text-indigo-600 mt-2">Soundtrack: {pipeline.visuals.soundtrackSuggestion}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Color Palette Direction:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {pipeline.visuals.colorPalette.map((col, i) => (
                    <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Asset & B-Roll Cue Sheet</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {pipeline.visuals.assets.map((asset, i) => (
                  <div key={i} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 bg-white text-xs">
                    <div className="md:col-span-2 font-mono font-bold text-indigo-600">{asset.timestamp} ({asset.shotType})</div>
                    <div className="md:col-span-5 text-slate-800 font-medium">{asset.onScreenVisual}</div>
                    <div className="md:col-span-5 text-slate-500 italic bg-slate-50 p-2 rounded-lg">B-Roll: {asset.bRollQuery}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 6: SHOT LIST */}
        {activeStage === 6 && pipeline.shotList && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600" />
                <span>Stage 6: Camera Shot List</span>
              </h3>
              <p className="text-xs text-slate-500">Lens suggestions, framing, and camera movement</p>
            </div>

            <div className="space-y-3">
              {pipeline.shotList.shots.map((shot) => (
                <div key={shot.shotNumber} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      #{shot.shotNumber}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{shot.framing} ({shot.lensFocalLength})</div>
                      <div className="text-xs text-slate-600">{shot.talentAction}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2 py-1 rounded font-medium">{shot.cameraMovement}</span>
                    <span className="font-mono font-bold text-indigo-600">{shot.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 7: PUBLISHING */}
        {activeStage === 7 && pipeline.publishing && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-600" />
                <span>Stage 7: Publishing, Packaging & SEO Matrix</span>
              </h3>
              <p className="text-xs text-slate-500">High-CTR titles, thumbnail concepts, and posting windows</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">A/B Tested Viral Titles</h4>
              <div className="space-y-2">
                {pipeline.publishing.titles.map((t, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900">"{t.title}"</span>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Viral Score: {t.viralScore}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => handleCopyText(t.title, `t-${i}`)}>
                        {isCopied === `t-${i}` ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Thumbnail Concepts:</span>
                <div className="space-y-2 text-xs">
                  {pipeline.publishing.thumbnailConcepts.map((th) => (
                    <div key={th.conceptNumber} className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-800">Concept #{th.conceptNumber}</div>
                      <div className="text-slate-600 mt-1">{th.foregroundFocalPoint}</div>
                      <div className="text-[11px] font-mono text-indigo-600 mt-1">Badge: "{th.textBadgeOverlay}"</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Recommended Posting Windows:</span>
                <div className="space-y-2 text-xs">
                  {pipeline.publishing.optimalPostingTimes.map((win, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{win.day} @ {win.window}</div>
                        <div className="text-[11px] text-slate-500">{win.reason}</div>
                      </div>
                      <Clock className="w-4 h-4 text-indigo-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Navigation Footer */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            disabled={activeStage === 1}
            onClick={() => setActiveStage((prev) => Math.max(1, prev - 1))}
          >
            Previous Stage
          </Button>

          <span className="text-xs font-bold text-slate-400">
            Stage {activeStage} of {STAGES_CONFIG.length}
          </span>

          <Button
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            disabled={activeStage === STAGES_CONFIG.length}
            onClick={() => setActiveStage((prev) => Math.min(STAGES_CONFIG.length, prev + 1))}
          >
            Next Stage
          </Button>
        </div>
      </div>
    </div>
  );
};

