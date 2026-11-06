import { MemeTemplate } from '../types';

export const MEME_TEMPLATES: MemeTemplate[] = [
  // --- TAMIL CINEMA MEME LEGENDS ---
  {
    id: 'vadivelu-kaipulla-valikudhu',
    name: 'Kaipulla - Venaam Valikidhu',
    character: 'Vadivelu',
    category: 'tamil',
    movieOrOrigin: 'Winner (2003)',
    defaultTopText: 'WHEN THE CAMERA GEAR BILL ARRIVES',
    defaultBottomText: 'VENAAM... VALIKIDHU... AZHUDHUDUVEN!',
    iconicDialogue: 'Venaam... Valikidhu... Azhudhuduven!',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    situations: ['bill', 'expensive', 'spicy', 'pain', 'crying', 'burn', 'hurt', 'loss', 'price', 'fail', 'budget'],
    vibe: 'Emotional Damage & Hilarious Despair 😭🎭',
  },
  {
    id: 'vadivelu-naai-sekar-building-strong',
    name: 'Naai Sekar - Building Strong-u',
    character: 'Vadivelu',
    category: 'tamil',
    movieOrOrigin: 'Thalainagaram (2006)',
    defaultTopText: 'BOUGHT $3000 CAMERA & RGB LIGHTS',
    defaultBottomText: 'BUILDING STRONG-U... BASEMENT ROMBA WEAK-U!',
    iconicDialogue: 'Building strong-u, basement romba weak-u!',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    situations: ['gear', 'camera', 'fake', 'show off', 'weak', 'foundation', 'looks good but bad', 'overrated'],
    vibe: 'Sarcastic Reality Check 🧱🔨',
  },
  {
    id: 'vadivelu-chandramukhi-saravanan',
    name: 'Murugesan - Enna Koduma Saravanan',
    character: 'Vadivelu',
    category: 'tamil',
    movieOrOrigin: 'Chandramukhi (2005)',
    defaultTopText: 'WHEN RETENTION DROPS 80% AT 0:03',
    defaultBottomText: 'ENNA KODUMA SARAVANAN IDHU!',
    iconicDialogue: 'Enna koduma Saravanan idhu!',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    situations: ['shock', 'scam', 'disaster', 'unexpected', 'nightmare', 'cheated', 'terrible', 'unfair', 'crazy'],
    vibe: 'Pure Horror & Melodrama 😱⚡',
  },
  {
    id: 'vadivelu-friends-nesamani-aani',
    name: 'Contractor Nesamani - Aani Pudunga Venam',
    character: 'Vadivelu',
    category: 'tamil',
    movieOrOrigin: 'Friends (2001)',
    defaultTopText: 'WHEN CLIENT ASKS TO CHANGE THE INTRO HOOK AGAIN',
    defaultBottomText: 'NEEYUM VARAVENAM... AANIYUM PUDUNGA VENAM!',
    iconicDialogue: 'Neeyum vara venam, andha aaniyum pudunga venam!',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    situations: ['mess up', 'destroy', 'stop helping', 'ruined', 'colleague', 'helper', 'accident', 'cancel', 'client'],
    vibe: 'Peak Frustration with Helpers 🔨🤦‍♂️',
  },
  {
    id: 'vadivelu-pulikesi-varalaru',
    name: '23am Pulikesi - Varalaaru Mukkiyam',
    character: 'Vadivelu',
    category: 'tamil',
    movieOrOrigin: 'Imsai Arasan 23am Pulikesi (2006)',
    defaultTopText: 'EXPLAINING LORE IN A 15-SECOND REEL',
    defaultBottomText: 'KAADHU KELVI PADADHADHAI VIDA... VARALAARU MUKKIYAM!',
    iconicDialogue: 'Varalaaru mukkiyam amaichare!',
    imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
    situations: ['history', 'context', 'royalty', 'arrogance', 'backstory', 'rules', 'importance'],
    vibe: 'Royal Pomposity & Epic Irony 👑📜',
  },
  // --- GLOBAL CREATOR & TECH MEMES ---
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Creator',
    character: 'Distracted Guy',
    category: 'global',
    movieOrOrigin: 'Stock Photography Meme',
    defaultTopText: 'MY SCHEDULED EDITING TIME',
    defaultBottomText: 'STARTING A NEW VIDEO SCRIPT AT 2 AM',
    iconicDialogue: 'Ooh shiny new content idea!',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    situations: ['distracted', 'new project', 'temptation', 'procrastination', 'focus', 'creativity'],
    vibe: 'Relatable Creator ADHD 💡👀',
  },
  {
    id: 'drake-hotline',
    name: 'Drake Approves / Rejects',
    character: 'Drake',
    category: 'global',
    movieOrOrigin: 'Hotline Bling',
    defaultTopText: 'RECORDING A 40-MINUTE PODCAST',
    defaultBottomText: 'TURNING 1 HOOK INTO 10 VIRAL REELS',
    iconicDialogue: 'Nah that vs Yeah that!',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    situations: ['reject', 'approve', 'better way', 'hack', 'strategy', 'workflow', 'smart'],
    vibe: 'Strategic Taste & Approval ✋👉',
  },
  {
    id: 'expanding-brain',
    name: 'Galaxy Brain Creator',
    character: 'Expanding Brain',
    category: 'tech',
    movieOrOrigin: 'Cosmic Brain Series',
    defaultTopText: 'GUESSING WHAT GOES VIRAL',
    defaultBottomText: 'USING DATA & MULTI-AGENT PRE-PRODUCTION',
    iconicDialogue: 'Ascended intelligence unlocked.',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80',
    situations: ['brain', 'galaxy', 'smart', 'evolution', 'ai', 'level up', 'advanced', 'future'],
    vibe: 'Cosmic Genius & Evolution 🧠✨',
  },
  {
    id: 'two-buttons',
    name: 'Daily Creator Dilemma',
    character: 'Sweating Guy',
    category: 'creator',
    movieOrOrigin: 'Daily Struggle Meme',
    defaultTopText: 'PERFECTIONIST 4K COLOR GRADE',
    defaultBottomText: 'JUST HIT PUBLISH BEFORE MIDNIGHT',
    iconicDialogue: 'Which button do I press?!',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    situations: ['dilemma', 'choice', 'sweat', 'panic', 'deadline', 'quality vs speed', 'publish'],
    vibe: 'High Tension Decision Paralysis 😰🔴',
  },
];

export function findMemesForQuery(query: string): MemeTemplate[] {
  if (!query.trim()) return MEME_TEMPLATES;
  const q = query.toLowerCase();
  return MEME_TEMPLATES.filter((m) =>
    m.name.toLowerCase().includes(q) ||
    m.character.toLowerCase().includes(q) ||
    m.vibe.toLowerCase().includes(q) ||
    m.defaultTopText.toLowerCase().includes(q) ||
    m.defaultBottomText.toLowerCase().includes(q) ||
    m.situations.some((s) => s.toLowerCase().includes(q))
  );
}
