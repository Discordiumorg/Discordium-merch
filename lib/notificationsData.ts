export type NotifType =
  | 'like'
  | 'superlike'
  | 'match'
  | 'message'
  | 'visitor'
  | 'boost_expiry'
  | 'rose'
  | 'gift'
  | 'story_view'
  | 'promo';

export interface AppNotification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  photoSeed?: string;
  actionPath?: string;
}

const now = Date.now();
const mins = (n: number) => new Date(now - n * 60 * 1000);
const hours = (n: number) => new Date(now - n * 60 * 60 * 1000);
const days = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'match',
    title: 'New Match! 🎉',
    body: 'You and Sophie both liked each other. Start the conversation!',
    timestamp: mins(8),
    read: false,
    photoSeed: 'sophie1',
    actionPath: '/matches',
  },
  {
    id: 'n2',
    type: 'message',
    title: 'Sophie sent you a message',
    body: '"That was in Lisbon! Just got back actually. Do you travel much?"',
    timestamp: mins(15),
    read: false,
    photoSeed: 'sophie1',
    actionPath: '/matches',
  },
  {
    id: 'n3',
    type: 'superlike',
    title: 'Elena Super Liked you ⭐',
    body: 'Elena thinks you\'re extra special. Don\'t keep her waiting!',
    timestamp: mins(42),
    read: false,
    photoSeed: 'elena1',
    actionPath: '/dashboard',
  },
  {
    id: 'n4',
    type: 'like',
    title: 'Someone liked your profile ❤️',
    body: 'A new admirer is waiting in your likes. Upgrade to see who!',
    timestamp: hours(1),
    read: false,
    photoSeed: 'kai1',
    actionPath: '/premium',
  },
  {
    id: 'n5',
    type: 'visitor',
    title: 'Lena visited your profile 👀',
    body: 'Lena checked out your profile. Maybe say hi?',
    timestamp: hours(2),
    read: true,
    photoSeed: 'lena1',
    actionPath: '/visitors',
  },
  {
    id: 'n6',
    type: 'rose',
    title: 'You received a Rose 🌹',
    body: 'Marcus sent you a rose. He\'s really into you!',
    timestamp: hours(3),
    read: false,
    photoSeed: 'marcus1',
    actionPath: '/dashboard',
  },
  {
    id: 'n7',
    type: 'gift',
    title: 'You received a gift! 🎁',
    body: 'Julia sent you a Sparkling Heart. Open it to see!',
    timestamp: hours(5),
    read: true,
    photoSeed: 'julia1',
    actionPath: '/matches',
  },
  {
    id: 'n8',
    type: 'story_view',
    title: 'Your story got 12 views 📖',
    body: 'People are loving your latest story. Post another one!',
    timestamp: hours(6),
    read: true,
    actionPath: '/stories',
  },
  {
    id: 'n9',
    type: 'match',
    title: 'It\'s a Match! 🎉',
    body: 'You and Lena matched! Break the ice and say hello.',
    timestamp: hours(10),
    read: true,
    photoSeed: 'lena1',
    actionPath: '/matches',
  },
  {
    id: 'n10',
    type: 'boost_expiry',
    title: 'Your Boost is expiring ⚡',
    body: 'Your profile boost ends in 15 minutes. You\'re in the spotlight!',
    timestamp: hours(11),
    read: true,
    actionPath: '/premium',
  },
  {
    id: 'n11',
    type: 'like',
    title: '5 new likes today ❤️',
    body: '5 people liked your profile while you were away. Check them out!',
    timestamp: days(1),
    read: true,
    actionPath: '/dashboard',
  },
  {
    id: 'n12',
    type: 'message',
    title: 'Tom sent a message',
    body: '"Fellow Berliner! Any good coffee spots you\'d recommend?"',
    timestamp: days(1),
    read: true,
    photoSeed: 'tom1',
    actionPath: '/matches',
  },
  {
    id: 'n13',
    type: 'promo',
    title: 'Weekend Special 🛍️',
    body: 'Get Aura Gold at 40% off this weekend only. Unlock unlimited likes!',
    timestamp: days(2),
    read: true,
    actionPath: '/premium',
  },
  {
    id: 'n14',
    type: 'visitor',
    title: 'Mia visited your profile 👀',
    body: 'Mia peeked at your photos. She might be interested!',
    timestamp: days(3),
    read: true,
    photoSeed: 'mia1',
    actionPath: '/visitors',
  },
  {
    id: 'n15',
    type: 'superlike',
    title: 'Kai Super Liked you ⭐',
    body: 'Kai sent you a Super Like! They really want to connect.',
    timestamp: days(5),
    read: true,
    photoSeed: 'kai1',
    actionPath: '/dashboard',
  },
  {
    id: 'n16',
    type: 'story_view',
    title: 'Sophie viewed your story ✨',
    body: 'Sophie watched your story. Maybe send a message?',
    timestamp: days(6),
    read: true,
    photoSeed: 'sophie2',
    actionPath: '/stories',
  },
  {
    id: 'n17',
    type: 'promo',
    title: 'Your profile is gaining traction 🚀',
    body: 'You\'ve had 89 profile views this week — up 34% from last week!',
    timestamp: days(7),
    read: true,
    actionPath: '/profile',
  },
];
