export type RelationshipGoal = 'casual' | 'serious' | 'friends+' | 'open relationship' | 'not sure yet';

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  spotify?: string;
  snapchat?: string;
  x?: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  location: string;
  distance: number; // km
  bio: string;
  photos: string[];
  interests: string[];
  relationshipGoal: RelationshipGoal;
  verified: boolean;
  online: boolean;
  lastSeen?: string;
  height?: string;
  job?: string;
  education?: string;
  profileViews: number;
  socialLinks?: SocialLinks;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Match {
  id: string;
  user: User;
  matchedAt: Date;
  messages: Message[];
  unreadCount: number;
}

export interface Visitor {
  user: User;
  visitedAt: Date;
}

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Sophie',
    age: 26,
    gender: 'female',
    location: 'Berlin',
    distance: 3,
    bio: 'Coffee addict ☕ | Photographer | Adventure seeker. Looking for someone to explore hidden gems of the city with. I love rooftop bars and spontaneous road trips.',
    photos: [
      'https://picsum.photos/seed/sophie1/400/500',
      'https://picsum.photos/seed/sophie2/400/500',
      'https://picsum.photos/seed/sophie3/400/500',
    ],
    interests: ['Photography', 'Travel', 'Coffee', 'Yoga', 'Music'],
    relationshipGoal: 'serious',
    verified: true,
    online: true,
    height: '5\'7"',
    job: 'Photographer',
    education: 'Berlin Art Academy',
    profileViews: 342,
    socialLinks: {
      instagram: '@sophie.photo',
      tiktok: '@sophiedances',
      spotify: 'Sophie M.',
    },
  },
  {
    id: 'u2',
    name: 'Elena',
    age: 24,
    gender: 'female',
    location: 'Munich',
    distance: 12,
    bio: 'Musician by night, UX designer by day 🎵 I play guitar and love indie concerts. Let\'s grab drinks and talk about everything under the stars.',
    photos: [
      'https://picsum.photos/seed/elena1/400/500',
      'https://picsum.photos/seed/elena2/400/500',
    ],
    interests: ['Music', 'Design', 'Concerts', 'Cooking', 'Hiking'],
    relationshipGoal: 'casual',
    verified: false,
    online: false,
    lastSeen: '2 hours ago',
    height: '5\'5"',
    job: 'UX Designer',
    education: 'TU Munich',
    profileViews: 218,
    socialLinks: {
      instagram: '@elena.ux',
      spotify: 'Elena K.',
    },
  },
  {
    id: 'u3',
    name: 'Marcus',
    age: 29,
    gender: 'male',
    location: 'Hamburg',
    distance: 8,
    bio: 'Fitness enthusiast & amateur chef 🏋️‍♂️ I\'ll cook for you if you can keep up with my morning runs. Looking for someone real in a world of filters.',
    photos: [
      'https://picsum.photos/seed/marcus1/400/500',
      'https://picsum.photos/seed/marcus2/400/500',
      'https://picsum.photos/seed/marcus3/400/500',
    ],
    interests: ['Fitness', 'Cooking', 'Running', 'Movies', 'Travel'],
    relationshipGoal: 'serious',
    verified: true,
    online: true,
    height: '6\'1"',
    job: 'Personal Trainer',
    education: 'Sports Science',
    profileViews: 189,
  },
  {
    id: 'u4',
    name: 'Lena',
    age: 27,
    gender: 'female',
    location: 'Cologne',
    distance: 5,
    bio: 'Artist & free spirit 🎨 My apartment looks like a gallery and I wouldn\'t have it any other way. Open to connections of all kinds — let\'s see where it goes.',
    photos: [
      'https://picsum.photos/seed/lena1/400/500',
      'https://picsum.photos/seed/lena2/400/500',
    ],
    interests: ['Art', 'Painting', 'Wine', 'Festivals', 'Philosophy'],
    relationshipGoal: 'open relationship',
    verified: true,
    online: false,
    lastSeen: '30 minutes ago',
    height: '5\'6"',
    job: 'Artist',
    profileViews: 456,
  },
  {
    id: 'u5',
    name: 'Kai',
    age: 25,
    gender: 'non-binary',
    location: 'Frankfurt',
    distance: 15,
    bio: 'They/them 🌈 Software dev by day, DJ by night. I make playlists for every mood and I\'d love to make one for you. Friends first, see where it goes.',
    photos: [
      'https://picsum.photos/seed/kai1/400/500',
      'https://picsum.photos/seed/kai2/400/500',
    ],
    interests: ['DJing', 'Tech', 'Gaming', 'Electronic Music', 'Coffee'],
    relationshipGoal: 'friends+',
    verified: false,
    online: true,
    height: '5\'9"',
    job: 'Software Developer',
    education: 'Goethe University',
    profileViews: 127,
    socialLinks: {
      tiktok: '@kai.dj',
      x: '@kai_dev',
      spotify: 'Kai Beats',
    },
  },
  {
    id: 'u6',
    name: 'Julia',
    age: 31,
    gender: 'female',
    location: 'Berlin',
    distance: 2,
    bio: 'Wine sommelier & travel junkie 🍷✈️ Been to 47 countries and counting. Looking for a partner in crime for adventures big and small. No drama, good vibes only.',
    photos: [
      'https://picsum.photos/seed/julia1/400/500',
      'https://picsum.photos/seed/julia2/400/500',
      'https://picsum.photos/seed/julia3/400/500',
    ],
    interests: ['Wine', 'Travel', 'Food', 'Languages', 'Yoga'],
    relationshipGoal: 'casual',
    verified: true,
    online: false,
    lastSeen: '1 hour ago',
    height: '5\'8"',
    job: 'Sommelier',
    profileViews: 521,
    socialLinks: {
      instagram: '@julia.wines',
      snapchat: 'juliawines',
      x: '@juliawines',
    },
  },
  {
    id: 'u7',
    name: 'Tom',
    age: 28,
    gender: 'male',
    location: 'Berlin',
    distance: 4,
    bio: 'Architect who sketches cities and dreams of building them 🏛️ Passionate about sustainable design, specialty coffee, and finding the best hidden spots in Berlin.',
    photos: [
      'https://picsum.photos/seed/tom1/400/500',
      'https://picsum.photos/seed/tom2/400/500',
    ],
    interests: ['Architecture', 'Design', 'Coffee', 'Cycling', 'Art'],
    relationshipGoal: 'serious',
    verified: true,
    online: true,
    height: '6\'0"',
    job: 'Architect',
    education: 'TU Berlin',
    profileViews: 203,
  },
  {
    id: 'u8',
    name: 'Mia',
    age: 23,
    gender: 'female',
    location: 'Dresden',
    distance: 20,
    bio: 'Dance teacher & bookworm 📚💃 Contradiction? Maybe. But I can teach you to salsa and recommend your next favorite novel. INFJ if that matters to you.',
    photos: [
      'https://picsum.photos/seed/mia1/400/500',
      'https://picsum.photos/seed/mia2/400/500',
    ],
    interests: ['Dancing', 'Reading', 'Music', 'Coffee', 'Hiking'],
    relationshipGoal: 'not sure yet',
    verified: false,
    online: false,
    lastSeen: '5 hours ago',
    height: '5\'4"',
    job: 'Dance Teacher',
    education: 'University of Dresden',
    profileViews: 167,
  },
];

export const currentUser: User = {
  id: 'me',
  name: 'Alex',
  age: 27,
  gender: 'male',
  location: 'Berlin',
  distance: 0,
  bio: 'Tech enthusiast & weekend hiker 🏔️ I build apps by day and explore trails by weekend. Looking for someone to share good food, better conversations, and maybe an adventure or two.',
  photos: [
    'https://picsum.photos/seed/alex1/400/500',
    'https://picsum.photos/seed/alex2/400/500',
  ],
  interests: ['Tech', 'Hiking', 'Coffee', 'Photography', 'Travel'],
  relationshipGoal: 'serious',
  verified: true,
  online: true,
  height: '5\'11"',
  job: 'Software Engineer',
  education: 'TU Berlin',
  profileViews: 89,
};

export const mockMatches: Match[] = [
  {
    id: 'm1',
    user: mockUsers[0], // Sophie
    matchedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    unreadCount: 2,
    messages: [
      {
        id: 'msg1',
        senderId: 'u1',
        text: 'Hey! Looks like we matched 😊 Your profile caught my eye!',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        read: false,
      },
      {
        id: 'msg2',
        senderId: 'me',
        text: 'Hi Sophie! Yeah, your photography work looks amazing. Where was that last photo taken?',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        read: true,
      },
      {
        id: 'msg3',
        senderId: 'u1',
        text: 'That was in Lisbon! Just got back actually. Do you travel much?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        read: false,
      },
    ],
  },
  {
    id: 'm2',
    user: mockUsers[3], // Lena
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    unreadCount: 0,
    messages: [
      {
        id: 'msg4',
        senderId: 'me',
        text: 'Your art style is incredible! What medium do you work in mostly?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        read: true,
      },
      {
        id: 'msg5',
        senderId: 'u4',
        text: 'Thank you! Mostly oil on canvas but lately I\'ve been experimenting with digital art too.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
      },
      {
        id: 'msg6',
        senderId: 'me',
        text: 'That\'s so cool. Would love to see your studio someday!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        read: true,
      },
      {
        id: 'msg7',
        senderId: 'u4',
        text: 'Haha maybe! I\'m having a small exhibition next weekend if you\'re interested 🎨',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
      },
    ],
  },
  {
    id: 'm3',
    user: mockUsers[5], // Julia
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 1,
    messages: [
      {
        id: 'msg8',
        senderId: 'u6',
        text: 'We matched! 47 countries and you\'re in Berlin — small world 🌍',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
        read: true,
      },
      {
        id: 'msg9',
        senderId: 'me',
        text: '47 countries is insane! Which was your favorite?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
        read: true,
      },
      {
        id: 'msg10',
        senderId: 'u6',
        text: 'Impossible to choose just one! But Japan has a special place in my heart. You should go if you haven\'t!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false,
      },
    ],
  },
  {
    id: 'm4',
    user: mockUsers[6], // Tom
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    unreadCount: 0,
    messages: [
      {
        id: 'msg11',
        senderId: 'u7',
        text: 'Fellow Berliner! Any good coffee spots you\'d recommend?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
        read: true,
      },
      {
        id: 'msg12',
        senderId: 'me',
        text: 'Oh definitely! Have you tried Five Elephant in Kreuzberg? Game changer.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46),
        read: true,
      },
    ],
  },
];

export const mockVisitors: Visitor[] = [
  {
    user: mockUsers[1], // Elena
    visitedAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    user: mockUsers[4], // Kai
    visitedAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    user: mockUsers[2], // Marcus
    visitedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    user: mockUsers[7], // Mia
    visitedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    user: mockUsers[0], // Sophie
    visitedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    user: mockUsers[5], // Julia
    visitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export const goalColors: Record<RelationshipGoal, string> = {
  'casual': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'serious': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'friends+': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'open relationship': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'not sure yet': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

export const goalEmojis: Record<RelationshipGoal, string> = {
  'casual': '🔥',
  'serious': '💍',
  'friends+': '✨',
  'open relationship': '🌈',
  'not sure yet': '🤔',
};
