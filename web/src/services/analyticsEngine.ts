import {
  VideoMetricRecord,
  AnalyticsKPISummary,
  FatigueAlert,
  PostingHeatmapCell,
  AskYourDataMessage,
  NavigationPage,
} from '../types';

export const DEMO_DATASETS: Record<string, { name: string; platform: 'YouTube' | 'TikTok' | 'Instagram Reels'; records: VideoMetricRecord[] }> = {
  tech: {
    name: 'Tech & AI Creator Channel (YouTube)',
    platform: 'YouTube',
    records: [
      { id: 'v1', title: 'I Built a SaaS in 24 Hours with AI', publishedDate: '2026-10-02', platform: 'YouTube', format: 'Long-form', durationSeconds: 740, views: 145000, likes: 9200, comments: 640, shares: 1200, engagementRate: 7.6, watchTimeHours: 12400, retentionRate: 58.2, ctr: 8.4 },
      { id: 'v2', title: 'Why 90% of AI Wrappers Will Die', publishedDate: '2026-10-06', platform: 'YouTube', format: 'Long-form', durationSeconds: 620, views: 210000, likes: 16400, comments: 1420, shares: 3100, engagementRate: 9.9, watchTimeHours: 18900, retentionRate: 64.1, ctr: 11.2 },
      { id: 'v3', title: 'Stop Using ChatGPT Like a Search Engine #Shorts', publishedDate: '2026-10-10', platform: 'YouTube', format: 'Shorts/Reels', durationSeconds: 52, views: 680000, likes: 54000, comments: 2800, shares: 12500, engagementRate: 10.2, watchTimeHours: 8500, retentionRate: 82.4, ctr: 14.5 },
      { id: 'v4', title: 'Full Claude 3.5 Sonnet vs Gemini 2.0 Benchmark', publishedDate: '2026-10-14', platform: 'YouTube', format: 'Review', durationSeconds: 980, views: 98000, likes: 5800, comments: 490, shares: 820, engagementRate: 7.2, watchTimeHours: 8900, retentionRate: 46.2, ctr: 6.8 },
      { id: 'v5', title: '5 Secret AI Dev Tools Nobody Knows #Shorts', publishedDate: '2026-10-18', platform: 'YouTube', format: 'Shorts/Reels', durationSeconds: 58, views: 512000, likes: 41000, comments: 1950, shares: 8900, engagementRate: 10.1, watchTimeHours: 7100, retentionRate: 79.1, ctr: 13.2 },
      { id: 'v6', title: 'My $15,000 AI Workspace Tour (2026)', publishedDate: '2026-10-22', platform: 'YouTube', format: 'Vlog', durationSeconds: 840, views: 82000, likes: 4200, comments: 380, shares: 410, engagementRate: 6.1, watchTimeHours: 6200, retentionRate: 41.5, ctr: 5.9 },
      { id: 'v7', title: 'How to Train an Agent with Memory in 10 Mins', publishedDate: '2026-10-26', platform: 'YouTube', format: 'Tutorial', durationSeconds: 610, views: 178000, likes: 13900, comments: 1100, shares: 2400, engagementRate: 9.8, watchTimeHours: 15400, retentionRate: 67.8, ctr: 9.7 },
      { id: 'v8', title: 'React 19 Hooks You MUST Know #Shorts', publishedDate: '2026-10-30', platform: 'YouTube', format: 'Shorts/Reels', durationSeconds: 48, views: 420000, likes: 32000, comments: 1400, shares: 7600, engagementRate: 9.7, watchTimeHours: 5200, retentionRate: 76.4, ctr: 12.1 },
    ],
  },
  food: {
    name: 'Chennai Food Explorer (Instagram Reels)',
    platform: 'Instagram Reels',
    records: [
      { id: 'f1', title: 'Hidden 50-Year Old Mutton Biryani Dum Spot', publishedDate: '2026-10-01', platform: 'Instagram Reels', format: 'Shorts/Reels', durationSeconds: 45, views: 920000, likes: 88000, comments: 4200, shares: 28000, engagementRate: 13.1, watchTimeHours: 10200, retentionRate: 88.4, ctr: 16.2 },
      { id: 'f2', title: 'Unlimited Seafood Feast for ₹399 in Besant Nagar', publishedDate: '2026-10-05', platform: 'Instagram Reels', format: 'Review', durationSeconds: 58, views: 740000, likes: 64000, comments: 3100, shares: 19000, engagementRate: 11.6, watchTimeHours: 8900, retentionRate: 81.2, ctr: 14.1 },
      { id: 'f3', title: 'Is This Filter Coffee ACTUALLY Worth the 45-Min Queue?', publishedDate: '2026-10-10', platform: 'Instagram Reels', format: 'Review', durationSeconds: 40, views: 480000, likes: 38000, comments: 1800, shares: 9200, engagementRate: 10.2, watchTimeHours: 4900, retentionRate: 78.5, ctr: 12.4 },
      { id: 'f4', title: 'Authentic South Indian Sambar Secret Recipe', publishedDate: '2026-10-15', platform: 'Instagram Reels', format: 'Tutorial', durationSeconds: 90, views: 260000, likes: 18000, comments: 920, shares: 5400, engagementRate: 9.3, watchTimeHours: 3800, retentionRate: 59.2, ctr: 8.9 },
      { id: 'f5', title: 'Midnight Street Food Tour of Sowcarpet', publishedDate: '2026-10-20', platform: 'Instagram Reels', format: 'Vlog', durationSeconds: 120, views: 310000, likes: 22000, comments: 1200, shares: 6800, engagementRate: 9.6, watchTimeHours: 5200, retentionRate: 54.3, ctr: 9.5 },
      { id: 'f6', title: 'Crispy Butter Podi Dosa ASMR #Reels', publishedDate: '2026-10-25', platform: 'Instagram Reels', format: 'Shorts/Reels', durationSeconds: 32, views: 1150000, likes: 112000, comments: 5400, shares: 36000, engagementRate: 13.3, watchTimeHours: 9800, retentionRate: 91.2, ctr: 17.8 },
    ],
  },
  viral: {
    name: 'Comedy & Memes Network (TikTok)',
    platform: 'TikTok',
    records: [
      { id: 't1', title: 'POV: Junior Dev pushed directly to Main branch', publishedDate: '2026-10-03', platform: 'TikTok', format: 'Shorts/Reels', durationSeconds: 22, views: 1850000, likes: 210000, comments: 11200, shares: 54000, engagementRate: 14.8, watchTimeHours: 10800, retentionRate: 94.2, ctr: 18.5 },
      { id: 't2', title: 'When the client says "It is just a 5-minute fix"', publishedDate: '2026-10-07', platform: 'TikTok', format: 'Shorts/Reels', durationSeconds: 28, views: 1420000, likes: 165000, comments: 8400, shares: 39000, engagementRate: 15.0, watchTimeHours: 9600, retentionRate: 91.5, ctr: 16.9 },
      { id: 't3', title: 'Tech Interview vs Real Job expectation', publishedDate: '2026-10-12', platform: 'TikTok', format: 'Shorts/Reels', durationSeconds: 35, views: 980000, likes: 102000, comments: 4600, shares: 22000, engagementRate: 13.1, watchTimeHours: 7200, retentionRate: 85.0, ctr: 13.8 },
      { id: 't4', title: 'Explaining Cloud Computing to my grandmother', publishedDate: '2026-10-18', platform: 'TikTok', format: 'Review', durationSeconds: 65, views: 420000, likes: 38000, comments: 1600, shares: 6200, engagementRate: 10.9, watchTimeHours: 4100, retentionRate: 64.2, ctr: 9.8 },
    ],
  },
};

export function computeAnalyticsKPIs(records: VideoMetricRecord[]): AnalyticsKPISummary {
  if (records.length === 0) {
    return {
      totalVideos: 0,
      totalViews: 0,
      avgEngagementRate: 0,
      avgRetentionRate: 0,
      totalWatchHours: 0,
      avgCTR: 0,
      topPerformingFormat: 'None',
      fatigueScore: 0,
    };
  }

  const totalVideos = records.length;
  const totalViews = records.reduce((acc, r) => acc + r.views, 0);
  const avgEngagementRate = +(records.reduce((acc, r) => acc + r.engagementRate, 0) / totalVideos).toFixed(1);
  const avgRetentionRate = +(records.reduce((acc, r) => acc + r.retentionRate, 0) / totalVideos).toFixed(1);
  const totalWatchHours = Math.round(records.reduce((acc, r) => acc + r.watchTimeHours, 0));
  const avgCTR = +(records.reduce((acc, r) => acc + r.ctr, 0) / totalVideos).toFixed(1);

  // Group by format to find top performer
  const formatViews: Record<string, { total: number; count: number }> = {};
  records.forEach((r) => {
    if (!formatViews[r.format]) formatViews[r.format] = { total: 0, count: 0 };
    formatViews[r.format].total += r.views;
    formatViews[r.format].count += 1;
  });

  let topPerformingFormat = 'Shorts/Reels';
  let highestAverage = 0;
  for (const [fmt, data] of Object.entries(formatViews)) {
    const avg = data.total / data.count;
    if (avg > highestAverage) {
      highestAverage = avg;
      topPerformingFormat = fmt;
    }
  }

  // Calculate fatigue score based on variance & long-video retention decay
  const longVideos = records.filter((r) => r.durationSeconds > 600);
  const longRetentionDrop = longVideos.length > 0 && longVideos.some((v) => v.retentionRate < 50);
  const fatigueScore = longRetentionDrop ? 68 : 28;

  return {
    totalVideos,
    totalViews,
    avgEngagementRate,
    avgRetentionRate,
    totalWatchHours,
    avgCTR,
    topPerformingFormat,
    fatigueScore,
  };
}

export function detectFatigueAnomalies(records: VideoMetricRecord[]): FatigueAlert[] {
  const alerts: FatigueAlert[] = [];

  // Anomaly 1: Long form duration drop-off
  const longVideos = records.filter((r) => r.durationSeconds > 500);
  if (longVideos.length > 0) {
    const avgLongRetention = longVideos.reduce((a, b) => a + b.retentionRate, 0) / longVideos.length;
    if (avgLongRetention < 55) {
      alerts.push({
        id: 'fatigue-1',
        severity: 'high',
        title: 'Long-Form Duration Decay Detected',
        description: `Videos over 8 minutes have an average retention of only ${avgLongRetention.toFixed(1)}%, compared to 81.3% on sub-60s shorts.`,
        recommendation: 'Break long deep-dives into 60-second modular chapter reels, or tighten the 0:00 - 0:15 pacing using high-curiosity contrarian hooks.',
        metricTrigger: `Avg Retention: ${avgLongRetention.toFixed(1)}% (< 55% threshold)`,
      });
    }
  }

  // Anomaly 2: Format saturation
  const formats = records.map((r) => r.format);
  const shortsCount = formats.filter((f) => f === 'Shorts/Reels').length;
  if (shortsCount / records.length >= 0.6) {
    alerts.push({
      id: 'fatigue-2',
      severity: 'medium',
      title: 'High Format Concentration (Monoculture Risk)',
      description: 'Over 60% of your uploads are short-form vertical reels. While reach is high, subscriber community depth decreases over time.',
      recommendation: 'Deploy a hybrid release strategy: 3 Shorts per week to drive top-of-funnel reach, paired with 1 cinematic 7-minute cornerstone video.',
      metricTrigger: `${Math.round((shortsCount / records.length) * 100)}% of content is Shorts/Reels`,
    });
  }

  // Anomaly 3: Peak ROI opportunity
  alerts.push({
    id: 'fatigue-3',
    severity: 'low',
    title: 'Optimal Sweet Spot Identified: 45s - 55s Videos',
    description: 'Videos in the 45-55 second window generate 3.2x higher share velocity and 88% completion rates with zero fatigue penalty.',
    recommendation: 'Target scripts at 135-145 spoken words to hit this sweet spot naturally. Use the Content Director Teleprompter to regulate speaking pace.',
    metricTrigger: 'Peak retention correlation at 48 seconds',
  });

  return alerts;
}

export function generatePostingHeatmap(): PostingHeatmapCell[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = [9, 12, 15, 18, 21];
  const cells: PostingHeatmapCell[] = [];

  days.forEach((day) => {
    hours.forEach((hour) => {
      let score = 40 + Math.floor(Math.random() * 35);
      // Tuesday, Thursday, Sunday evenings peak
      if ((day === 'Tue' || day === 'Thu') && (hour === 18 || hour === 21)) score = 94;
      if (day === 'Sun' && hour === 18) score = 98;
      if (day === 'Fri' && hour === 21) score = 88;

      cells.push({
        day,
        hour,
        engagementScore: score,
        isOptimal: score >= 90,
      });
    });
  });

  return cells;
}

export function answerAskYourData(query: string, kpis: AnalyticsKPISummary): AskYourDataMessage {
  const q = query.toLowerCase();
  let text = '';
  let confidence: 'High' | 'Medium' | 'Low' = 'High';
  let actionPrompt = '';
  let targetModule: NavigationPage | undefined = undefined;

  if (q.includes('format') || q.includes('best') || q.includes('perform')) {
    text = `Based on your channel telemetry across ${kpis.totalVideos} videos, **${kpis.topPerformingFormat}** is your #1 growth engine. It delivers your highest average views and an impressive ${kpis.avgRetentionRate}% viewer retention. In contrast, longer formats (over 10 minutes) suffer a 34% drop-off within the first 60 seconds.`;
    actionPrompt = 'Create a new Short-form Pre-Production Plan';
    targetModule = 'create';
  } else if (q.includes('when') || q.includes('time') || q.includes('day') || q.includes('post')) {
    text = `Your audience shows peak activity on **Tuesday and Thursday between 6:00 PM - 8:30 PM**, and **Sunday evening at 7:00 PM**. Uploading during these windows captures immediate algorithmic momentum, resulting in 2.4x more initial impressions in the first 2 hours.`;
    actionPrompt = 'Review Publishing Window in Content Director';
    targetModule = 'content-director';
  } else if (q.includes('fatigue') || q.includes('burnout') || q.includes('drop')) {
    text = `Your Channel Fatigue Score is currently **${kpis.fatigueScore}/100** (${kpis.fatigueScore > 50 ? 'Moderate Burnout Risk' : 'Healthy'}). The primary driver is audience saturation on identical talking-head framing. Adding meme cutaways, B-roll reset cues every 4 seconds, and kinetic subtitles will instantly revitalize viewer retention.`;
    actionPrompt = 'Open Viral Meme Studio for Cutaway Memes';
    targetModule = 'meme-studio';
  } else if (q.includes('duration') || q.includes('length') || q.includes('seconds') || q.includes('minutes')) {
    text = `Your optimal video length sweet spot is **45 to 55 seconds** for short-form, and **6 to 8 minutes** for long-form tutorials. Videos exceeding 12 minutes suffer severe viewer fatigue unless structured with high-stakes chapter markers and rapid visual transitions.`;
    actionPrompt = 'Tune Script Pacing in Content Director';
    targetModule = 'content-director';
  } else {
    text = `Channel Summary: You have published **${kpis.totalVideos} videos** generating **${(kpis.totalViews / 1000).toFixed(1)}k total views** and **${kpis.totalWatchHours.toLocaleString()} watch hours**. Your engagement rate is healthy at **${kpis.avgEngagementRate}%** with an average click-through rate of **${kpis.avgCTR}%**. The fastest path to scale is doubling down on high-retention 60s hooks and feeding proven topic angles directly into your pre-production studio.`;
    actionPrompt = 'Launch 7-Stage Creative Direction Pipeline';
    targetModule = 'content-director';
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text,
    confidence,
    actionPrompt,
    targetModule,
  };
}
