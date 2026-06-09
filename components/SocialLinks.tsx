'use client';

import { SocialLinks as SocialLinksType } from '@/lib/mockData';

interface SocialLinksProps {
  links?: SocialLinksType;
  size?: 'sm' | 'md';
}

const platformConfig: {
  key: keyof SocialLinksType;
  emoji: string;
  label: string;
  color: string;
}[] = [
  { key: 'instagram', emoji: '📸', label: 'Instagram', color: 'bg-pink-500/20 border-pink-500/30 text-pink-300' },
  { key: 'tiktok', emoji: '🎵', label: 'TikTok', color: 'bg-white/10 border-white/20 text-white/80' },
  { key: 'spotify', emoji: '🎧', label: 'Spotify', color: 'bg-green-500/20 border-green-500/30 text-green-300' },
  { key: 'snapchat', emoji: '👻', label: 'Snapchat', color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' },
  { key: 'x', emoji: '🐦', label: 'X', color: 'bg-blue-500/20 border-blue-500/30 text-blue-300' },
];

export default function SocialLinks({ links, size = 'md' }: SocialLinksProps) {
  if (!links) return null;

  const presentLinks = platformConfig.filter((p) => links[p.key]);
  if (presentLinks.length === 0) return null;

  const pillClass = size === 'sm'
    ? 'flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-medium'
    : 'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium';

  return (
    <div className="flex flex-wrap gap-1.5">
      {presentLinks.map((platform) => (
        <div
          key={platform.key}
          className={`${pillClass} ${platform.color} cursor-default select-none`}
          title={`${platform.label}: ${links[platform.key]}`}
        >
          <span>{platform.emoji}</span>
          <span className="truncate max-w-[80px]">{links[platform.key]}</span>
        </div>
      ))}
    </div>
  );
}
