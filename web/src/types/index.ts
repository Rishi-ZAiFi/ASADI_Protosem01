export type Platform =
  | 'YouTube'
  | 'YouTube Shorts'
  | 'Instagram Reels'
  | 'TikTok'
  | 'LinkedIn'
  | 'Other';

export type VideoType =
  | 'Short-form video'
  | 'Long-form video'
  | 'Tutorial'
  | 'Product video'
  | 'Vlog'
  | 'Educational'
  | 'Promotional'
  | 'Storytelling'
  | 'Interview';

export type Tone =
  | 'Professional'
  | 'Energetic'
  | 'Cinematic'
  | 'Educational'
  | 'Casual'
  | 'Emotional'
  | 'Funny'
  | 'Inspirational';

export type ProjectStatus = 'Completed' | 'Draft' | 'In Progress';

export interface CameraDirectionDetails {
  shotType: string;
  cameraMovement: string;
  cameraAngle: string;
  framing: string;
  lensSuggestion: string;
  movementSpeed: string;
  composition: string;
}

export interface Shot {
  id: string;
  shotNumber: number;
  sceneNumber: number;
  shotType: string;
  cameraMovement: string;
  cameraAngle?: string;
  framing?: string;
  lensSuggestion?: string;
  movementSpeed?: string;
  composition?: string;
  subject: string;
  duration: string;
  durationSeconds: number;
  audio: string;
  description?: string;
}

export type PropCategory = 'Props' | 'Camera Equipment' | 'Lighting' | 'Audio';

export interface PropItem {
  id: string;
  name: string;
  category: PropCategory;
  prepared: boolean;
  notes?: string;
}

export interface BRollItem {
  id: string;
  clipNumber: number;
  visual: string;
  purpose: string;
  suggestedDuration: string;
  suggestedDurationSeconds: number;
  sceneNumber: number;
  camera: string;
  audio: string;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  location: string;
  purpose: string;
  dialogue: string;
  visualDescription: string;
  cameraDirectionSummary: string;
  cameraDetails: CameraDirectionDetails;
  shotType: string;
  lighting: string;
  props: string[];
  broll: string[];
  audio: string;
  shots: Shot[];
}

export interface ProductionPlanSummary {
  totalDuration: string;
  totalDurationSeconds: number;
  sceneCount: number;
  shotCount: number;
  propCount: number;
  brollCount: number;
}

export interface ProductionPlan {
  id: string;
  projectId: string;
  summary: ProductionPlanSummary;
  scenes: Scene[];
  propsAndEquipment: PropItem[];
  brollClips: BRollItem[];
  timeline: {
    timestamp: string;
    sceneNumber: number;
    title: string;
    duration: string;
  }[];
}

export interface Project {
  id: string;
  title: string;
  platform: Platform;
  videoType: VideoType;
  targetDuration: string;
  tones: Tone[];
  script: string;
  creativeDirection?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  plan?: ProductionPlan;
}

export interface UserPreferences {
  name: string;
  email: string;
  profileImage?: string;
  defaultPlatform: Platform;
  defaultVideoStyle: VideoType;
  defaultDuration: string;
  theme: 'light' | 'dark' | 'system';
  preferredTone: Tone;
  productionComplexity: 'Simple / Solo' | 'Standard' | 'Cinematic / Advanced';
}

export interface GenerationInput {
  title: string;
  platform: Platform;
  videoType: VideoType;
  targetDuration: string;
  tones: Tone[];
  script: string;
  creativeDirection?: string;
}

// -------------------------------------------------------------
// Engine 2: 7-Stage Creative Direction Types (Repo 18)
// -------------------------------------------------------------
export type ContentStageKey =
  | 'research'
  | 'angles'
  | 'narrative'
  | 'script'
  | 'visuals'
  | 'shotList'
  | 'publishing';

export interface StageInfo {
  number: number;
  key: ContentStageKey;
  title: string;
  shortDesc: string;
  icon: string;
  directorTip: string;
}

export interface SourceItem {
  title: string;
  url: string;
  snippet: string;
}

export interface ResearchData {
  topicOverview: string;
  keyFacts: string[];
  statistics: {
    stat: string;
    context: string;
    source?: string;
  }[];
  trends: string[];
  commonQuestions: string[];
  audiencePainPoints: string[];
  sources: SourceItem[];
}

export interface AngleItem {
  id: string;
  title: string;
  hook: string;
  targetEmotion: string;
  difficultyScore: number;
  uniquenessScore: number;
  description: string;
  targetAudienceFit: string;
}

export interface AnglesData {
  primaryConcept: string;
  angles: AngleItem[];
  recommendedAngleId: string;
}

export interface BeatOutlineItem {
  beatNumber: number;
  timecode: string;
  beatTitle: string;
  action: string;
  emotionalShift: string;
}

export interface NarrativeData {
  corePremise: string;
  theme: string;
  pacingSummary: string;
  threeActStructure: {
    act1: { hook: string; setup: string; incitingIncident: string };
    act2: { conflict: string; escalation: string; turningPoint: string };
    act3: { climax: string; resolution: string; finalPunchline: string };
  };
  beats: BeatOutlineItem[];
}

export interface ScriptSection {
  id: string;
  type: 'hook' | 'intro' | 'body' | 'cta';
  timecode: string;
  spokenAudio: string;
  screenVisual: string;
  toneCue: string;
  wordCount: number;
}

export interface ScriptData {
  estimatedDuration: string;
  totalWordCount: number;
  wpmCadence: number;
  sections: ScriptSection[];
}

export interface VisualAssetItem {
  timestamp: string;
  shotType: string;
  onScreenVisual: string;
  bRollQuery: string;
  graphicOverlay: string;
}

export interface VisualsData {
  visualTheme: string;
  colorPalette: string[];
  lightingMood: string;
  soundtrackSuggestion: string;
  sfxCues: string[];
  assets: VisualAssetItem[];
}

export interface DirectorShotItem {
  shotNumber: number;
  duration: string;
  cameraMovement: string;
  lensFocalLength: string;
  framing: string;
  lightingSetup: string;
  talentAction: string;
}

export interface ShotListData {
  estimatedShootHours: number;
  locationSetup: string;
  equipmentList: string[];
  shots: DirectorShotItem[];
}

export interface TitleOption {
  title: string;
  viralScore: number;
  targetVibe: string;
}

export interface ThumbnailConcept {
  conceptNumber: number;
  foregroundFocalPoint: string;
  backgroundElement: string;
  textBadgeOverlay: string;
  colorContrastRatio: string;
}

export interface PublishingData {
  titles: TitleOption[];
  recommendedTitle: string;
  seoDescription: string;
  primaryHashtags: string[];
  optimalPostingTimes: {
    day: string;
    window: string;
    reason: string;
  }[];
  thumbnailConcepts: ThumbnailConcept[];
}

export interface ContentPipelineProject {
  id: string;
  title: string;
  topic: string;
  platform: Platform;
  targetDuration: string;
  targetAudience: string;
  tone: Tone;
  createdAt: string;
  updatedAt: string;
  currentStage: number;
  completedStages: number[];
  research?: ResearchData;
  angles?: AnglesData;
  narrative?: NarrativeData;
  script?: ScriptData;
  visuals?: VisualsData;
  shotList?: ShotListData;
  publishing?: PublishingData;
}

// -------------------------------------------------------------
// Engine 3: Viral Meme Studio Types (Repo 18)
// -------------------------------------------------------------
export interface MemeTemplate {
  id: string;
  name: string;
  character: string;
  category: 'tamil' | 'global' | 'tech' | 'creator';
  movieOrOrigin: string;
  defaultTopText: string;
  defaultBottomText: string;
  iconicDialogue: string;
  imageUrl: string;
  situations: string[];
  vibe: string;
}

// -------------------------------------------------------------
// Engine 4: Creator Analytics Copilot Types (Repo 24)
// -------------------------------------------------------------
export interface VideoMetricRecord {
  id: string;
  title: string;
  publishedDate: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram Reels';
  format: 'Shorts/Reels' | 'Long-form' | 'Tutorial' | 'Vlog' | 'Review';
  durationSeconds: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number; // percentage
  watchTimeHours: number;
  retentionRate: number; // percentage
  ctr: number; // percentage
}

export interface AnalyticsKPISummary {
  totalVideos: number;
  totalViews: number;
  avgEngagementRate: number;
  avgRetentionRate: number;
  totalWatchHours: number;
  avgCTR: number;
  topPerformingFormat: string;
  fatigueScore: number; // 0-100 (higher = more audience burnout)
}

export interface FatigueAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  metricTrigger: string;
}

export interface PostingHeatmapCell {
  day: string;
  hour: number;
  engagementScore: number; // 0-100
  isOptimal: boolean;
}

export interface AskYourDataMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  confidence?: 'High' | 'Medium' | 'Low';
  actionPrompt?: string;
  targetModule?: NavigationPage;
}

// -------------------------------------------------------------
// Navigation Router
// -------------------------------------------------------------
export type NavigationPage =
  | 'landing'
  | 'dashboard'
  | 'create'
  | 'processing'
  | 'workspace'
  | 'content-director'
  | 'meme-studio'
  | 'analytics-copilot'
  | 'projects'
  | 'settings';
