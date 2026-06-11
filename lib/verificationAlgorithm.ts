export type VerificationTier = 'unverified' | 'basic' | 'verified' | 'aura_verified';

export interface VerificationItem {
  label: string;
  done: boolean;
  points: number;
}

export interface VerificationCategory {
  id: string;
  name: string;
  icon: string;
  score: number;
  maxScore: number;
  items: VerificationItem[];
}

export interface VerificationResult {
  score: number;
  maxScore: number;
  tier: VerificationTier;
  categories: VerificationCategory[];
  nextTier: VerificationTier | null;
  nextTierThreshold: number | null;
  pointsToNextTier: number | null;
}

export interface ProfileFactors {
  hasPhoto: boolean;
  photoCount: number;
  bioLength: number;
  interestCount: number;
  hasPhone: boolean;
  hasEmail: boolean;
  socialLinkCount: number;
  hasRelationshipGoal: boolean;
  reportCount: number;
  daysActive: number;
  responseRate: number;
  ageVerified: boolean;
  idUploaded: boolean;
  selfieVerified: boolean;
}

const TIER_THRESHOLDS: Record<VerificationTier, number> = {
  unverified: 0,
  basic: 40,
  verified: 65,
  aura_verified: 85,
};

const TIER_ORDER: VerificationTier[] = ['unverified', 'basic', 'verified', 'aura_verified'];

export function calculateVerification(factors: ProfileFactors): VerificationResult {
  // ── Identity (max 32) ────────────────────────────────────
  const identity: VerificationCategory = {
    id: 'identity',
    name: 'Identity',
    icon: '🛡️',
    score: 0,
    maxScore: 32,
    items: [
      { label: 'Email address verified', done: factors.hasEmail, points: 8 },
      { label: 'Phone number linked', done: factors.hasPhone, points: 12 },
      { label: 'Age confirmed (18+)', done: factors.ageVerified, points: 6 },
      { label: 'ID document uploaded', done: factors.idUploaded, points: 4 },
      { label: 'Selfie verification', done: factors.selfieVerified, points: 2 },
    ],
  };
  identity.items.forEach((item) => { if (item.done) identity.score += item.points; });
  identity.score = Math.max(0, identity.score - factors.reportCount * 4);

  // ── Profile (max 33) ─────────────────────────────────────
  const profile: VerificationCategory = {
    id: 'profile',
    name: 'Profile',
    icon: '✨',
    score: 0,
    maxScore: 33,
    items: [
      { label: 'Profile photo added', done: factors.hasPhoto, points: 7 },
      { label: '3+ photos uploaded', done: factors.photoCount >= 3, points: 6 },
      { label: '5+ photos uploaded', done: factors.photoCount >= 5, points: 4 },
      { label: 'Bio written (50+ chars)', done: factors.bioLength >= 50, points: 5 },
      { label: 'Detailed bio (150+ chars)', done: factors.bioLength >= 150, points: 4 },
      { label: '5+ interests selected', done: factors.interestCount >= 5, points: 4 },
      { label: 'Relationship goal set', done: factors.hasRelationshipGoal, points: 3 },
    ],
  };
  profile.items.forEach((item) => { if (item.done) profile.score += item.points; });

  // ── Social (max 15) ──────────────────────────────────────
  const social: VerificationCategory = {
    id: 'social',
    name: 'Social Links',
    icon: '🔗',
    score: 0,
    maxScore: 15,
    items: [
      { label: '1 social account linked', done: factors.socialLinkCount >= 1, points: 5 },
      { label: '2 social accounts linked', done: factors.socialLinkCount >= 2, points: 5 },
      { label: '3+ social accounts linked', done: factors.socialLinkCount >= 3, points: 5 },
    ],
  };
  social.items.forEach((item) => { if (item.done) social.score += item.points; });

  // ── Activity (max 20) ────────────────────────────────────
  const activity: VerificationCategory = {
    id: 'activity',
    name: 'Activity',
    icon: '⚡',
    score: 0,
    maxScore: 20,
    items: [
      { label: 'Active for 7+ days', done: factors.daysActive >= 7, points: 5 },
      { label: 'Active for 30+ days', done: factors.daysActive >= 30, points: 5 },
      { label: 'Response rate 50%+', done: factors.responseRate >= 50, points: 5 },
      { label: 'Response rate 80%+', done: factors.responseRate >= 80, points: 5 },
    ],
  };
  activity.items.forEach((item) => { if (item.done) activity.score += item.points; });

  const totalScore = Math.min(
    100,
    identity.score + profile.score + social.score + activity.score
  );

  const tier: VerificationTier =
    totalScore >= 85 ? 'aura_verified' :
    totalScore >= 65 ? 'verified' :
    totalScore >= 40 ? 'basic' :
    'unverified';

  const tierIndex = TIER_ORDER.indexOf(tier);
  const nextTier = tierIndex < TIER_ORDER.length - 1 ? TIER_ORDER[tierIndex + 1] : null;
  const nextTierThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : null;
  const pointsToNextTier = nextTierThreshold ? Math.max(0, nextTierThreshold - totalScore) : null;

  return {
    score: totalScore,
    maxScore: 100,
    tier,
    categories: [identity, profile, social, activity],
    nextTier,
    nextTierThreshold,
    pointsToNextTier,
  };
}

export const TIER_CONFIG: Record<VerificationTier, {
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  badge: string;
}> = {
  unverified: {
    label: 'Unverified',
    color: 'text-white/40',
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    glow: 'none',
    badge: '○',
  },
  basic: {
    label: 'Basic ✓',
    color: 'text-slate-300',
    bg: 'rgba(148,163,184,0.12)',
    border: 'rgba(148,163,184,0.3)',
    glow: '0 0 12px rgba(148,163,184,0.3)',
    badge: '✓',
  },
  verified: {
    label: 'Verified ✓',
    color: 'text-sky-400',
    bg: 'rgba(56,189,248,0.12)',
    border: 'rgba(56,189,248,0.35)',
    glow: '0 0 16px rgba(56,189,248,0.35)',
    badge: '✓',
  },
  aura_verified: {
    label: 'Aura Verified 💜',
    color: 'text-purple-300',
    bg: 'rgba(168,85,247,0.15)',
    border: 'rgba(196,132,252,0.45)',
    glow: '0 0 24px rgba(168,85,247,0.45)',
    badge: '💜',
  },
};
