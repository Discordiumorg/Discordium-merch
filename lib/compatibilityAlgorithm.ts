export interface CompatUser {
  interests: string[];
  relationshipGoal: string;
  age: number;
  location: string;
  personalityType?: string;
}

// Compatible goal pairs (bidirectional)
const compatibleGoals: [string, string][] = [
  ['casual', 'open relationship'],
  ['serious', 'friends+'],
  ['friends+', 'not sure yet'],
  ['casual', 'not sure yet'],
  ['open relationship', 'not sure yet'],
];

function isGoalsCompatible(goal1: string, goal2: string): boolean {
  return compatibleGoals.some(
    ([a, b]) => (a === goal1 && b === goal2) || (a === goal2 && b === goal1)
  );
}

// Personality compatibility matrix (ids → bonus points 0-10)
const personalityCompatibilityBonus: Record<string, Record<string, number>> = {
  adventurer: { dreamer: 8, explorer: 10, leader: 6, artist: 7, adventurer: 4 },
  dreamer: { adventurer: 8, artist: 10, connector: 9, builder: 5, dreamer: 3 },
  builder: { connector: 9, guardian: 10, leader: 8, builder: 4, explorer: 6 },
  connector: { builder: 9, dreamer: 9, guardian: 8, connector: 3, leader: 7 },
  artist: { dreamer: 10, adventurer: 7, explorer: 8, artist: 5, connector: 6 },
  guardian: { builder: 10, connector: 8, leader: 7, guardian: 3, dreamer: 5 },
  explorer: { adventurer: 10, artist: 8, leader: 7, explorer: 4, dreamer: 6 },
  leader: { builder: 8, guardian: 7, explorer: 7, adventurer: 6, leader: 2 },
};

export function calculateCompatibility(user1: CompatUser, user2: CompatUser): number {
  let score = 0;

  // ── 1. Shared interests (up to 40 pts) ──────────────────────────────────────
  const maxInterests = Math.max(user1.interests.length, 5);
  const pointsPerInterest = 40 / maxInterests;
  const sharedCount = user1.interests.filter((i) =>
    user2.interests.map((x) => x.toLowerCase()).includes(i.toLowerCase())
  ).length;
  score += Math.min(40, sharedCount * pointsPerInterest);

  // ── 2. Relationship goal (up to 25 pts) ─────────────────────────────────────
  if (user1.relationshipGoal === user2.relationshipGoal) {
    score += 25;
  } else if (isGoalsCompatible(user1.relationshipGoal, user2.relationshipGoal)) {
    score += 10;
  }

  // ── 3. Age difference (up to 20 pts) ────────────────────────────────────────
  const ageDiff = Math.abs(user1.age - user2.age);
  score += Math.max(0, 20 - ageDiff * 2);

  // ── 4. Location (15 pts) ────────────────────────────────────────────────────
  if (user1.location.toLowerCase() === user2.location.toLowerCase()) {
    score += 15;
  }

  // ── 5. Personality compatibility bonus (0-10 pts) ───────────────────────────
  if (user1.personalityType && user2.personalityType) {
    const bonusMap = personalityCompatibilityBonus[user1.personalityType];
    if (bonusMap) {
      score += bonusMap[user2.personalityType] ?? 0;
    }
  }

  return Math.min(100, Math.round(score));
}

export function getCompatibilityLabel(score: number): string {
  if (score >= 85) return 'Perfect Match';
  if (score >= 70) return 'Great Match';
  if (score >= 50) return 'Good Match';
  return 'Maybe';
}

export function getCompatibilityColor(score: number): string {
  if (score >= 85) return '#f43f8e'; // pink – perfect
  if (score >= 70) return '#a855f7'; // purple – great
  if (score >= 50) return '#6366f1'; // indigo – good
  return '#64748b'; // slate – maybe
}
