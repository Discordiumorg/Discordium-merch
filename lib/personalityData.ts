export interface PersonalityType {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  strengths: string[];
  compatibleWith: string[]; // ids of compatible types
  color: string; // hex
  gradient: string[]; // two hex colors for gradient
}

export const personalityTypes: PersonalityType[] = [
  {
    id: 'adventurer',
    name: 'The Adventurer',
    emoji: '🏔️',
    tagline: 'Life is too short for the ordinary',
    description:
      'You thrive on new experiences and spontaneous decisions. Every day is a chance to discover something extraordinary. You bring energy and excitement to every relationship, always pushing for the next great adventure.',
    strengths: ['Spontaneous & energetic', 'Brave and bold', 'Inspires others to step outside comfort zones'],
    compatibleWith: ['explorer', 'dreamer', 'artist'],
    color: '#f97316',
    gradient: ['#f97316', '#ef4444'],
  },
  {
    id: 'dreamer',
    name: 'The Dreamer',
    emoji: '🌙',
    tagline: 'Imagination is the only limit',
    description:
      'Deeply creative and introspective, you see the world through a poetic lens. You build rich inner worlds and share them through art, writing, or deep conversations. Your depth and sensitivity make you a profound partner.',
    strengths: ['Deeply empathetic', 'Creative and imaginative', 'Sees beauty in everyday moments'],
    compatibleWith: ['artist', 'connector', 'adventurer'],
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#6d28d9'],
  },
  {
    id: 'builder',
    name: 'The Builder',
    emoji: '🏗️',
    tagline: 'Creating something lasting',
    description:
      'Practical, determined, and reliable — you turn dreams into reality. You approach relationships with intention and long-term vision. Your steadiness is a rock for those around you, and you take pride in everything you construct.',
    strengths: ['Reliable and dependable', 'Long-term focused', 'Turns plans into reality'],
    compatibleWith: ['connector', 'guardian', 'leader'],
    color: '#10b981',
    gradient: ['#10b981', '#059669'],
  },
  {
    id: 'connector',
    name: 'The Connector',
    emoji: '🤝',
    tagline: 'People are my superpower',
    description:
      'You light up any room you walk into. Warm, empathetic, and genuinely interested in others, you build bridges between people effortlessly. In relationships you are attentive, giving, and deeply loyal.',
    strengths: ['Warm and charismatic', 'Exceptional listener', 'Makes everyone feel seen'],
    compatibleWith: ['builder', 'dreamer', 'guardian'],
    color: '#f59e0b',
    gradient: ['#f59e0b', '#f97316'],
  },
  {
    id: 'artist',
    name: 'The Artist',
    emoji: '🎨',
    tagline: 'Express everything, filter nothing',
    description:
      'Your soul speaks through creativity. Whether through music, design, writing, or movement, you bring beauty into every corner of life. You seek authentic connections that inspire your creative spirit.',
    strengths: ['Deeply expressive', 'Unique perspective on the world', 'Brings beauty into everyday life'],
    compatibleWith: ['dreamer', 'adventurer', 'explorer'],
    color: '#ec4899',
    gradient: ['#ec4899', '#f43f8e'],
  },
  {
    id: 'guardian',
    name: 'The Guardian',
    emoji: '🛡️',
    tagline: 'Loyalty above all else',
    description:
      'You are the steady, protective force in any relationship. Deeply loyal and caring, you prioritise the wellbeing of those you love above your own. Your quiet strength creates a safe space for others to be themselves.',
    strengths: ['Unconditionally loyal', 'Protective and caring', 'Creates security and trust'],
    compatibleWith: ['builder', 'connector', 'leader'],
    color: '#3b82f6',
    gradient: ['#3b82f6', '#1d4ed8'],
  },
  {
    id: 'explorer',
    name: 'The Explorer',
    emoji: '🧭',
    tagline: 'The map is not the territory',
    description:
      'Intellectually curious and endlessly open-minded, you treat life as a grand investigation. You love learning, questioning assumptions, and seeking out diverse perspectives. Your curiosity makes every conversation an adventure.',
    strengths: ['Intellectually curious', 'Open-minded and adaptable', 'Always learning and growing'],
    compatibleWith: ['adventurer', 'artist', 'leader'],
    color: '#06b6d4',
    gradient: ['#06b6d4', '#0891b2'],
  },
  {
    id: 'leader',
    name: 'The Leader',
    emoji: '⚡',
    tagline: 'Clarity, vision, and courage',
    description:
      'Natural-born motivators, you inspire confidence in everyone around you. Clear-headed and decisive, you take charge when it matters. In relationships you are direct, honest, and committed to growth — for yourself and your partner.',
    strengths: ['Decisive and confident', 'Inspires and motivates others', 'Clear communicator'],
    compatibleWith: ['builder', 'guardian', 'explorer'],
    color: '#f43f8e',
    gradient: ['#f43f8e', '#9333ea'],
  },
];

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  question: string;
  options: { text: string; types: string[]; emoji: string }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'It\'s Saturday morning. What are you most likely doing?',
    options: [
      { text: 'Heading out for a spontaneous hike or road trip', types: ['adventurer', 'explorer'], emoji: '🏕️' },
      { text: 'Journaling, painting, or making music', types: ['dreamer', 'artist'], emoji: '🎨' },
      { text: 'Catching up with friends over brunch', types: ['connector', 'guardian'], emoji: '☕' },
      { text: 'Working on a personal project or side hustle', types: ['builder', 'leader'], emoji: '🔨' },
    ],
  },
  {
    id: 'q2',
    question: 'What does your ideal first date look like?',
    options: [
      { text: 'Something adventurous — rock climbing, surfing, escape room', types: ['adventurer', 'leader'], emoji: '🧗' },
      { text: 'An art gallery, museum, or live music show', types: ['artist', 'dreamer'], emoji: '🎭' },
      { text: 'A cosy dinner where we really talk and connect', types: ['connector', 'guardian'], emoji: '🍷' },
      { text: 'Exploring a new neighbourhood or hidden café', types: ['explorer', 'adventurer'], emoji: '🗺️' },
    ],
  },
  {
    id: 'q3',
    question: 'When you\'re in a relationship, you\'re most likely to...',
    options: [
      { text: 'Plan surprise experiences and adventures', types: ['adventurer', 'connector'], emoji: '🎁' },
      { text: 'Write love notes and create meaningful gifts', types: ['dreamer', 'artist'], emoji: '💌' },
      { text: 'Be the steady, dependable rock they can count on', types: ['guardian', 'builder'], emoji: '🛡️' },
      { text: 'Encourage your partner\'s personal growth', types: ['leader', 'explorer'], emoji: '🌱' },
    ],
  },
  {
    id: 'q4',
    question: 'Your friends would describe you as...',
    options: [
      { text: 'Wild card — always up for anything', types: ['adventurer', 'explorer'], emoji: '🎲' },
      { text: 'The creative one with big ideas', types: ['dreamer', 'artist'], emoji: '💡' },
      { text: 'The glue that holds the group together', types: ['connector', 'guardian'], emoji: '🤝' },
      { text: 'Natural leader, always gets things done', types: ['leader', 'builder'], emoji: '⚡' },
    ],
  },
  {
    id: 'q5',
    question: 'What stresses you out the most?',
    options: [
      { text: 'Being stuck in the same routine day after day', types: ['adventurer', 'explorer'], emoji: '🔄' },
      { text: 'Not being able to express yourself authentically', types: ['artist', 'dreamer'], emoji: '🎭' },
      { text: 'Conflict or disconnection in close relationships', types: ['connector', 'guardian'], emoji: '💔' },
      { text: 'Lack of progress or wasted potential', types: ['leader', 'builder'], emoji: '📉' },
    ],
  },
  {
    id: 'q6',
    question: 'You\'ve just moved to a new city. What\'s your first priority?',
    options: [
      { text: 'Exploring every hidden gem and neighbourhood', types: ['adventurer', 'explorer'], emoji: '🗺️' },
      { text: 'Finding art studios, galleries, and creative spaces', types: ['artist', 'dreamer'], emoji: '🎨' },
      { text: 'Meeting people and building a new social circle', types: ['connector', 'guardian'], emoji: '👥' },
      { text: 'Setting up your space and establishing new routines', types: ['builder', 'leader'], emoji: '🏠' },
    ],
  },
  {
    id: 'q7',
    question: 'When you disagree with someone you care about, you...',
    options: [
      { text: 'Address it head-on — honesty is everything', types: ['leader', 'adventurer'], emoji: '💬' },
      { text: 'Write your feelings down before talking', types: ['dreamer', 'artist'], emoji: '✍️' },
      { text: 'Listen carefully before sharing your perspective', types: ['connector', 'guardian'], emoji: '👂' },
      { text: 'Look for practical solutions and compromises', types: ['builder', 'explorer'], emoji: '🔧' },
    ],
  },
  {
    id: 'q8',
    question: 'What matters most in a long-term partner?',
    options: [
      { text: 'They keep life exciting and surprising', types: ['adventurer', 'explorer'], emoji: '🎉' },
      { text: 'They truly understand my inner world', types: ['dreamer', 'artist'], emoji: '🌙' },
      { text: 'They are loyal, warm, and deeply caring', types: ['guardian', 'connector'], emoji: '❤️' },
      { text: 'They are ambitious and push me to grow', types: ['leader', 'builder'], emoji: '🚀' },
    ],
  },
  {
    id: 'q9',
    question: 'How do you recharge after a draining week?',
    options: [
      { text: 'Solo trip somewhere completely new', types: ['adventurer', 'explorer'], emoji: '✈️' },
      { text: 'Immersing yourself in a creative project', types: ['artist', 'dreamer'], emoji: '🎵' },
      { text: 'Spending quality time with your closest people', types: ['connector', 'guardian'], emoji: '🏡' },
      { text: 'Working out, organising, and planning ahead', types: ['builder', 'leader'], emoji: '💪' },
    ],
  },
  {
    id: 'q10',
    question: 'Which phrase resonates with you most?',
    options: [
      { text: '"Not all who wander are lost."', types: ['adventurer', 'explorer', 'dreamer'], emoji: '🧭' },
      { text: '"Art is not what you see, but what you make others see."', types: ['artist', 'dreamer', 'connector'], emoji: '🖼️' },
      { text: '"We rise by lifting others."', types: ['connector', 'guardian', 'builder'], emoji: '🤝' },
      { text: '"The future belongs to those who prepare for it."', types: ['builder', 'leader', 'guardian'], emoji: '🔮' },
    ],
  },
];
