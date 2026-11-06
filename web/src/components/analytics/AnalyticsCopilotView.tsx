import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  Send,
  Download,
  Calendar,
  Layers,
  Flame,
  ArrowRight,
  Clapperboard,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import {
  VideoMetricRecord,
  AnalyticsKPISummary,
  FatigueAlert,
  PostingHeatmapCell,
  AskYourDataMessage,
  NavigationPage,
} from '../../types';
import {
  DEMO_DATASETS,
  computeAnalyticsKPIs,
  detectFatigueAnomalies,
  generatePostingHeatmap,
  answerAskYourData,
} from '../../services/analyticsEngine';
import { Button } from '../common/Button';

interface AnalyticsCopilotViewProps {
  onNavigateToPreProduction?: (topic: string, brief: string) => void;
  onNavigateToContentDirector?: (topic: string) => void;
  onNavigate?: (page: NavigationPage) => void;
}

export const AnalyticsCopilotView: React.FC<AnalyticsCopilotViewProps> = ({
  onNavigateToPreProduction,
  onNavigateToContentDirector,
  onNavigate,
}) => {
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<string>('tech');
  const [records, setRecords] = useState<VideoMetricRecord[]>(DEMO_DATASETS['tech'].records);
  const [userQuery, setUserQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<AskYourDataMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      timestamp: '12:00 PM',
      text: 'Hello! I am your Creator Analytics Copilot. I have analyzed your video metrics, watch retention curves, and format burnout levels. Ask me anything about your audience patterns or pick a query below!',
      confidence: 'High',
    },
  ]);

  const kpis: AnalyticsKPISummary = computeAnalyticsKPIs(records);
  const fatigueAlerts: FatigueAlert[] = detectFatigueAnomalies(records);
  const heatmap: PostingHeatmapCell[] = generatePostingHeatmap();

  const handleDatasetSwitch = (key: string) => {
    setSelectedDatasetKey(key);
    setRecords(DEMO_DATASETS[key].records);
  };

  const handleSendQuery = (textToSend?: string) => {
    const q = textToSend || userQuery;
    if (!q.trim()) return;

    const userMsg: AskYourDataMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: q,
    };

    const aiMsg = answerAskYourData(q, kpis);
    setChatHistory((prev) => [...prev, userMsg, aiMsg]);
    if (!textToSend) setUserQuery('');
  };

  const handleExportCSV = () => {
    const headers = 'Title,Platform,Format,Duration(s),Views,Likes,Comments,Shares,EngagementRate(%),RetentionRate(%)\n';
    const rows = records
      .map(
        (r) =>
          `"${r.title}","${r.platform}","${r.format}",${r.durationSeconds},${r.views},${r.likes},${r.comments},${r.shares},${r.engagementRate},${r.retentionRate}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `creator-analytics-export-${selectedDatasetKey}.csv`;
    link.href = url;
    link.click();
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Performance Intelligence • Creator Analytics Copilot</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Creator Analytics Copilot & Audience Fatigue Auditor
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Detect audience saturation, diagnose duration drop-offs, benchmark platform algorithms, and chat directly with your channel telemetry to plan your next viral release.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportCSV}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Export Metrics CSV
            </Button>
            {onNavigateToContentDirector && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Compass className="w-4 h-4" />}
                onClick={() => onNavigateToContentDirector('High-Retention Strategy Based on Analytics')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow"
              >
                Plan Content from Insights
              </Button>
            )}
          </div>
        </div>

        {/* Dataset Switcher Pills */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Active Channel Telemetry:</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(DEMO_DATASETS).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => handleDatasetSwitch(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedDatasetKey === key
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {records.length} videos ingested • Real-time norm engine active
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Views</span>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {(kpis.totalViews / 1000).toLocaleString()}k
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last cycle</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Avg Engagement Rate</span>
          <div className="text-2xl font-black text-indigo-600 tracking-tight">
            {kpis.avgEngagementRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Industry Benchmark: 6.2%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Avg Watch Retention</span>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">
            {kpis.avgRetentionRate}%
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">High completion hold</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Audience Fatigue Risk</span>
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl font-black tracking-tight ${
                kpis.fatigueScore > 50 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {kpis.fatigueScore}/100
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                kpis.fatigueScore > 50 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {kpis.fatigueScore > 50 ? 'Elevated' : 'Optimal'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Top Format: {kpis.topPerformingFormat}</div>
        </div>
      </div>

      {/* Audience Fatigue & Anomaly Detector Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Audience Fatigue & Algorithm Anomaly Alerts</span>
            </h3>
            <p className="text-xs text-slate-500">
              Deterministic rule engine identifying format burnout, duration degradation, and peak ROI windows
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {fatigueAlerts.length} Active Diagnostics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fatigueAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${
                alert.severity === 'high'
                  ? 'bg-rose-50/50 border-rose-200/80 text-rose-950'
                  : alert.severity === 'medium'
                  ? 'bg-amber-50/50 border-amber-200/80 text-amber-950'
                  : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider">{alert.title}</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      alert.severity === 'high'
                        ? 'bg-rose-200 text-rose-900'
                        : alert.severity === 'medium'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{alert.description}</p>
              </div>

              <div className="pt-3 border-t border-black/10 space-y-2">
                <div className="text-[11px] font-bold opacity-80">💡 Action Recommendation:</div>
                <p className="text-xs font-medium leading-relaxed">{alert.recommendation}</p>
                <div className="text-[10px] font-mono opacity-60">Metric: {alert.metricTrigger}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Analytics & Posting Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Posting Day & Hour Heatmap (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Optimal Posting Day & Hour Heatmap</span>
              </h3>
              <p className="text-xs text-slate-500">Audience active consumption window</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-200" />
              <span>Low</span>
              <span className="w-3 h-3 rounded bg-indigo-600" />
              <span>Optimal Window (90+)</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 text-center text-xs">
            <div className="font-bold text-slate-400 text-[11px]">Time</div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'].map((d) => (
              <div key={d} className="font-bold text-slate-700">{d}</div>
            ))}

            {[
              { label: '9 AM', h: 9 },
              { label: '12 PM', h: 12 },
              { label: '3 PM', h: 15 },
              { label: '6 PM', h: 18 },
              { label: '9 PM', h: 21 },
            ].map((slot) => (
              <React.Fragment key={slot.h}>
                <div className="font-mono text-slate-400 text-[10px] flex items-center justify-center">
                  {slot.label}
                </div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'].map((day) => {
                  const cell = heatmap.find((c) => c.day === day && c.hour === slot.h);
                  const isTop = cell?.isOptimal;
                  return (
                    <div
                      key={day + slot.h}
                      className={`p-2 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center ${
                        isTop
                          ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/40 scale-[1.05]'
                          : cell && cell.engagementScore > 65
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'bg-slate-50 text-slate-600 border border-slate-100'
                      }`}
                    >
                      <span>{cell?.engagementScore || 50}%</span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Prime Window:</strong> Tuesday & Thursday 6:00 PM – 9:00 PM, and Sunday 7:00 PM deliver highest first-hour viral velocity.
            </span>
          </div>
        </div>

        {/* Video Duration vs Retention Sweet Spot (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Format Performance Distribution</span>
            </h3>
            <p className="text-xs text-slate-500">Average retention by duration category</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Shorts & Vertical Reels (15s - 60s)', views: '680k avg', retention: 84.5, color: 'bg-emerald-500' },
              { name: 'Tutorials & Actionable Guides (5m - 8m)', views: '185k avg', retention: 67.2, color: 'bg-indigo-500' },
              { name: 'Product Breakdowns & Reviews (8m - 12m)', views: '110k avg', retention: 48.0, color: 'bg-amber-500' },
              { name: 'Casual Studio Vlogs (12m+)', views: '65k avg', retention: 39.4, color: 'bg-rose-500' },
            ].map((fmt, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{fmt.name}</span>
                  <span className="text-slate-500 font-mono">{fmt.views}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${fmt.color}`}
                    style={{ width: `${fmt.retention}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Retention: <strong>{fmt.retention}%</strong></span>
                  <span className={fmt.retention > 60 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                    {fmt.retention > 60 ? 'High ROI' : 'Audience Decay'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* "Ask Your Data" AI Copilot Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Ask Your Data — Conversational AI Copilot</span>
            </h3>
            <p className="text-xs text-slate-500">
              Query your audience numbers in plain English to discover growth insights and strategic directives
            </p>
          </div>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Powered by Gemini Insights
          </span>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2">
          {[
            'Which content format drives the highest retention?',
            'When is the optimal posting window for my audience?',
            'Why are my 10+ minute videos dropping views?',
            'How can I lower my audience fatigue score?',
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(chip)}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 font-medium transition-all"
            >
              "{chip}"
            </button>
          ))}
        </div>

        {/* Chat History Box */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-3 max-h-96 overflow-y-auto">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.actionPrompt && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Recommended Next Step</span>
                    </span>
                    <button
                      onClick={() => {
                        if (msg.targetModule && onNavigate) {
                          onNavigate(msg.targetModule);
                        } else if (onNavigateToPreProduction) {
                          onNavigateToPreProduction('Next Video From Analytics', 'Targeting high-retention format');
                        }
                      }}
                      className="text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-200 flex items-center gap-1 transition-all"
                    >
                      <span>{msg.actionPrompt}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            placeholder="Ask anything about your video performance, burnout, or posting schedules..."
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            variant="primary"
            leftIcon={<Send className="w-4 h-4" />}
            onClick={() => handleSendQuery()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Ask AI
          </Button>
        </div>
      </div>
    </div>
  );
};

