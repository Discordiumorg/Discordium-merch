export type LiveCategory = 'dating' | 'chat' | 'music' | 'dance' | 'cooking' | 'gaming' | 'travel' | 'advice';

export interface LiveStream {
  id: string;
  hostId: string;
  hostName: string;
  hostAge: number;
  hostVerified: boolean;
  hostPhoto: string;
  title: string;
  category: LiveCategory;
  viewerCount: number;
  likeCount: number;
  startedAt: Date;
  isFollowing: boolean;
  tags: string[];
  gifts: number;
  color: string;
  badge?: 'hot' | 'new' | 'featured';
}

export interface LiveMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  type: 'chat' | 'gift' | 'join' | 'like' | 'system';
  giftEmoji?: string;
  giftName?: string;
  timestamp: Date;
  color: string;
  isMod?: boolean;
  isSubscriber?: boolean;
  deleted?: boolean;
  flagged?: boolean;
  pinned?: boolean;
  reportCount?: number;
  timedOut?: boolean;
}

export type ModActionType =
  | 'delete'
  | 'timeout_5m'
  | 'timeout_1h'
  | 'ban'
  | 'unban'
  | 'pin'
  | 'unpin'
  | 'clear_chat'
  | 'slow_mode'
  | 'sub_only'
  | 'word_filter';

export interface ModAction {
  id: string;
  type: ModActionType;
  actorName: string;
  targetUser?: string;
  detail: string;
  timestamp: Date;
}

export interface LiveGift {
  id: string;
  emoji: string;
  name: string;
  coinCost: number;
  animation: 'float' | 'explode' | 'rain';
  color: string;
}

// ─── Live Gifts ────────────────────────────────────────────────────────────────

export const liveGifts: LiveGift[] = [
  { id: 'lg-rose',       emoji: '🌹', name: 'Rose',         coinCost: 10,  animation: 'float',   color: 'from-red-400 to-pink-500' },
  { id: 'lg-firecracker',emoji: '🧨', name: 'Firecracker',  coinCost: 25,  animation: 'explode', color: 'from-orange-400 to-red-500' },
  { id: 'lg-star',       emoji: '⭐', name: 'Star Shower',  coinCost: 50,  animation: 'rain',    color: 'from-yellow-300 to-amber-500' },
  { id: 'lg-diamond',    emoji: '💎', name: 'Diamond',      coinCost: 100, animation: 'explode', color: 'from-cyan-300 to-blue-500' },
  { id: 'lg-crown',      emoji: '👑', name: 'Crown',        coinCost: 200, animation: 'float',   color: 'from-yellow-400 to-yellow-600' },
  { id: 'lg-unicorn',    emoji: '🦄', name: 'Unicorn',      coinCost: 500, animation: 'rain',    color: 'from-pink-400 via-purple-400 to-indigo-400' },
];

// ─── Live Streams ──────────────────────────────────────────────────────────────

const now = Date.now();
const ago = (minutes: number) => new Date(now - minutes * 60 * 1000);

export const liveStreams: LiveStream[] = [
  {
    id: 'ls-1',
    hostId: 'host-1',
    hostName: 'Sophie',
    hostAge: 26,
    hostVerified: true,
    hostPhoto: 'https://picsum.photos/seed/sophie26/400/600',
    title: "Let's chat & vibe 💜",
    category: 'dating',
    viewerCount: 1247,
    likeCount: 8431,
    startedAt: ago(42),
    isFollowing: false,
    tags: ['chill', 'vibes', 'Berlin'],
    gifts: 3200,
    color: 'from-violet-600 to-purple-900',
    badge: undefined,
  },
  {
    id: 'ls-2',
    hostId: 'host-2',
    hostName: 'Elena',
    hostAge: 24,
    hostVerified: false,
    hostPhoto: 'https://picsum.photos/seed/elena24/400/600',
    title: 'Rate my outfit 🔥',
    category: 'chat',
    viewerCount: 847,
    likeCount: 5102,
    startedAt: ago(18),
    isFollowing: true,
    tags: ['fashion', 'Munich', 'outfit'],
    gifts: 1850,
    color: 'from-pink-600 to-rose-900',
    badge: 'hot',
  },
  {
    id: 'ls-3',
    hostId: 'host-3',
    hostName: 'Julia',
    hostAge: 31,
    hostVerified: true,
    hostPhoto: 'https://picsum.photos/seed/julia31/400/600',
    title: 'Speed dating Q&A ❤️',
    category: 'dating',
    viewerCount: 2134,
    likeCount: 14820,
    startedAt: ago(67),
    isFollowing: false,
    tags: ['speed-dating', 'Berlin', 'Q&A'],
    gifts: 7600,
    color: 'from-red-600 to-pink-900',
    badge: 'featured',
  },
  {
    id: 'ls-4',
    hostId: 'host-4',
    hostName: 'Marcus',
    hostAge: 29,
    hostVerified: false,
    hostPhoto: 'https://picsum.photos/seed/marcus29/400/600',
    title: 'Cooking pasta for my match 🍝',
    category: 'cooking',
    viewerCount: 523,
    likeCount: 2940,
    startedAt: ago(31),
    isFollowing: false,
    tags: ['cooking', 'Hamburg', 'pasta'],
    gifts: 980,
    color: 'from-orange-600 to-amber-900',
    badge: undefined,
  },
  {
    id: 'ls-5',
    hostId: 'host-5',
    hostName: 'Kai',
    hostAge: 25,
    hostVerified: false,
    hostPhoto: 'https://picsum.photos/seed/kai25/400/600',
    title: 'Travel stories - ask me anything ✈️',
    category: 'travel',
    viewerCount: 312,
    likeCount: 1760,
    startedAt: ago(12),
    isFollowing: false,
    tags: ['travel', 'Frankfurt', 'stories'],
    gifts: 540,
    color: 'from-sky-600 to-blue-900',
    badge: 'new',
  },
  {
    id: 'ls-6',
    hostId: 'host-6',
    hostName: 'Mia',
    hostAge: 23,
    hostVerified: true,
    hostPhoto: 'https://picsum.photos/seed/mia23/400/600',
    title: 'Late night music vibes 🎵',
    category: 'music',
    viewerCount: 689,
    likeCount: 4230,
    startedAt: ago(55),
    isFollowing: true,
    tags: ['music', 'Cologne', 'lofi'],
    gifts: 2100,
    color: 'from-indigo-600 to-purple-900',
    badge: undefined,
  },
  {
    id: 'ls-7',
    hostId: 'host-7',
    hostName: 'Lukas',
    hostAge: 27,
    hostVerified: false,
    hostPhoto: 'https://picsum.photos/seed/lukas27/400/600',
    title: 'Gaming & dating advice 🎮',
    category: 'gaming',
    viewerCount: 441,
    likeCount: 2310,
    startedAt: ago(89),
    isFollowing: false,
    tags: ['gaming', 'Stuttgart', 'tips'],
    gifts: 870,
    color: 'from-emerald-600 to-green-900',
    badge: undefined,
  },
  {
    id: 'ls-8',
    hostId: 'host-8',
    hostName: 'Zara',
    hostAge: 28,
    hostVerified: true,
    hostPhoto: 'https://picsum.photos/seed/zara28/400/600',
    title: 'Dance with me 💃✨',
    category: 'dance',
    viewerCount: 1031,
    likeCount: 7890,
    startedAt: ago(24),
    isFollowing: false,
    tags: ['dance', 'Düsseldorf', 'fun'],
    gifts: 4200,
    color: 'from-fuchsia-600 to-pink-900',
    badge: 'hot',
  },
  {
    id: 'ls-9',
    hostId: 'host-9',
    hostName: 'Finn',
    hostAge: 32,
    hostVerified: true,
    hostPhoto: 'https://picsum.photos/seed/finn32/400/600',
    title: 'Relationship advice AMA 💡',
    category: 'advice',
    viewerCount: 773,
    likeCount: 5670,
    startedAt: ago(103),
    isFollowing: false,
    tags: ['advice', 'Munich', 'relationships'],
    gifts: 3100,
    color: 'from-teal-600 to-cyan-900',
    badge: undefined,
  },
  {
    id: 'ls-10',
    hostId: 'host-10',
    hostName: 'Nina',
    hostAge: 22,
    hostVerified: false,
    hostPhoto: 'https://picsum.photos/seed/nina22/400/600',
    title: 'First time live! Say hi 👋',
    category: 'chat',
    viewerCount: 198,
    likeCount: 920,
    startedAt: ago(5),
    isFollowing: false,
    tags: ['firstlive', 'Berlin', 'hello'],
    gifts: 210,
    color: 'from-rose-500 to-red-900',
    badge: 'new',
  },
];

// ─── Mock Chat Messages ────────────────────────────────────────────────────────

const userColors = [
  '#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24',
  '#fb923c', '#e879f9', '#38bdf8', '#4ade80', '#f87171',
  '#c084fc', '#818cf8', '#2dd4bf', '#facc15', '#fb7185',
];

const randomColor = (seed: number) => userColors[seed % userColors.length];

const chatUsers = [
  'LoveHunter99', 'SparkleQueen', 'DatingPro', 'HeartEyes', 'RomanceSeeker',
  'NightOwl22', 'StargazerX', 'DreamChaser', 'MoonlitSoul', 'VibingRn',
  'FlirtyFox', 'CasualVibes', 'MelodyMaker', 'TravelBug', 'SunshineGirl',
  'HarbourKing', 'RainbowHope', 'CosmicDancer', 'SilverFox33', 'WildHeart',
];

const chatTexts = [
  'omg this is so cute 😍',
  'hey! just joined from Berlin 👋',
  'you are literally glowing rn',
  'first time watching you live ❤️',
  'this is my fav stream today',
  'can we be friends lol',
  'so relatable honestly',
  'you should do this every day!',
  'the vibe is immaculate',
  'lowkey obsessed with your energy',
  'same here!! exactly how I feel',
  'this is everything I needed tonight',
  'omg YES finally someone gets it',
  'sending love from Munich 💜',
  'your laugh is contagious lol',
  'can you do a Q&A??',
  'been watching for 20 mins now',
  'stream more plz 🙏',
  'this made my night honestly',
  'we need more streams like this',
];

let msgCounter = 0;

function makeMsg(
  userId: string,
  userName: string,
  type: LiveMessage['type'],
  text: string,
  giftEmoji?: string,
  giftName?: string,
  extra?: Partial<LiveMessage>,
): LiveMessage {
  msgCounter++;
  return {
    id: `msg-${msgCounter}-${Date.now()}`,
    userId,
    userName,
    text,
    type,
    giftEmoji,
    giftName,
    timestamp: new Date(),
    color: randomColor(parseInt(userId.replace(/\D/g, ''), 10) || msgCounter),
    reportCount: 0,
    ...extra,
  };
}

export function generateLiveMessages(): LiveMessage[] {
  const msgs: LiveMessage[] = [];

  for (let i = 0; i < 40; i++) {
    const userIdx = i % chatUsers.length;
    const userId = `u${userIdx + 1}`;
    const userName = chatUsers[userIdx];
    const roll = i % 12;

    if (roll === 0) {
      // Mod message
      msgs.push(makeMsg(userId, userName, 'chat', chatTexts[i % chatTexts.length], undefined, undefined, { isMod: true }));
    } else if (roll < 6) {
      // Regular chat — some with subscriber flag
      msgs.push(makeMsg(userId, userName, 'chat', chatTexts[i % chatTexts.length], undefined, undefined, { isSubscriber: i % 3 === 0 }));
    } else if (roll === 6) {
      // Flagged message (word filter would catch this)
      msgs.push(makeMsg(userId, userName, 'chat', chatTexts[i % chatTexts.length], undefined, undefined, { flagged: true, reportCount: 2 }));
    } else if (roll < 9) {
      // Gift
      const gift = liveGifts[i % liveGifts.length];
      msgs.push(makeMsg(userId, userName, 'gift', `${userName} sent ${gift.name} ${gift.emoji}`, gift.emoji, gift.name, { isSubscriber: true }));
    } else if (roll === 9) {
      // Join
      msgs.push(makeMsg(userId, userName, 'join', `${userName} joined`));
    } else {
      // Regular chat
      msgs.push(makeMsg(userId, userName, 'chat', chatTexts[(i + 5) % chatTexts.length]));
    }
  }

  return msgs;
}

// ─── Category metadata ─────────────────────────────────────────────────────────

export const categoryMeta: Record<LiveCategory, { emoji: string; label: string }> = {
  dating:  { emoji: '💕', label: 'Dating' },
  chat:    { emoji: '💬', label: 'Chat' },
  music:   { emoji: '🎵', label: 'Music' },
  dance:   { emoji: '💃', label: 'Dance' },
  cooking: { emoji: '🍳', label: 'Cooking' },
  gaming:  { emoji: '🎮', label: 'Gaming' },
  travel:  { emoji: '✈️', label: 'Travel' },
  advice:  { emoji: '💡', label: 'Advice' },
};

export function formatViewerCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function formatStreamDuration(startedAt: Date): string {
  const mins = Math.floor((Date.now() - startedAt.getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}
