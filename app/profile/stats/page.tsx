'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Heart, TrendingUp, MessageCircle, Lock } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

type TimeRange = '7d' | '30d' | 'all';

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const VIEW_DATA: Record<TimeRange, number[]> = {
  '7d':  [45, 72, 38, 91, 65, 110, 88],
  '30d': [30, 55, 70, 45, 80, 95, 60, 75, 40, 65, 90, 50, 85, 70, 55, 100, 45, 75, 60, 80, 95, 65, 50, 85, 70, 45, 90, 75, 60, 80],
  'all': [20, 35, 50, 65, 80, 95, 110],
};

const INTEREST_DATA = [
  { label: 'Reisen', likes: 42, color: '#a855f7' },
  { label: 'Fotografie', likes: 38, color: '#ec4899' },
  { label: 'Kochen', likes: 31, color: '#f59e0b' },
  { label: 'Musik', likes: 28, color: '#3b82f6' },
  { label: 'Sport', likes: 19, color: '#22c55e' },
];

const BLURRED_VISITORS = [1, 2, 3, 4, 5, 6].map(i => `https://picsum.photos/seed/visitor${i}/80/80`);

const PROFILE_SCORES = [
  { label: 'Fotos', pct: 85, color: '#a855f7' },
  { label: 'Bio', pct: 70, color: '#ec4899' },
  { label: 'Interessen', pct: 90, color: '#3b82f6' },
  { label: 'Verifizierung', pct: 60, color: '#f59e0b' },
];

const METRICS = [
  { label: 'Profilaufrufe', value: 847, change: '+12%', up: true, icon: Eye, color: '#a855f7' },
  { label: 'Erhaltene Likes', value: 134, change: '+8%', up: true, icon: Heart, color: '#ec4899' },
  { label: 'Match-Rate', value: '18.4%', change: '+2.1%', up: true, icon: TrendingUp, color: '#22c55e' },
  { label: 'Gestartete Chats', value: 67, change: '-3%', up: false, icon: MessageCircle, color: '#3b82f6' },
];

export default function ProfileStatsPage() {
  const router = useRouter();
  const [range, setRange] = useState<TimeRange>('7d');
  const bars = VIEW_DATA[range].slice(0, 7);
  const maxBar = Math.max(...bars);

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <h1 className="text-white font-black text-xl">📊 Deine Statistiken</h1>
        </div>
        <div className="flex gap-1">
          {(['7d', '30d', 'all'] as TimeRange[]).map(r => (
            <button key={r} onClick={() => setRange(r)} className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${range === r ? 'gradient-brand text-white' : 'bg-white/5 text-white/40'}`}>
              {r === '7d' ? '7 Tage' : r === '30d' ? '30 Tage' : 'Gesamt'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 24 }} className="card-glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <m.icon size={16} style={{ color: m.color }} />
                <span className={`text-xs font-semibold ${m.up ? 'text-green-400' : 'text-red-400'}`}>{m.change}</span>
              </div>
              <div className="text-white font-black text-2xl">{m.value}</div>
              <div className="text-white/40 text-xs mt-0.5">{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Views Chart */}
        <div className="card-glass rounded-2xl p-4">
          <p className="text-white font-bold mb-4">Profilaufrufe</p>
          <div className="flex items-end gap-2 h-28">
            {bars.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / maxBar) * 96}px` }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 260, damping: 22 }}
                  className="w-full rounded-t-lg gradient-brand min-h-[4px]"
                />
                <span className="text-white/30 text-[9px]">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Score */}
        <div className="card-glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-bold">Profil-Score</p>
            <span className="text-2xl font-black gradient-text">78/100</span>
          </div>
          <div className="space-y-3">
            {PROFILE_SCORES.map((s, i) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{s.label}</span>
                  <span className="text-white/80 font-semibold">{s.pct}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ delay: i * 0.1 + 0.3, type: 'spring', stiffness: 220, damping: 24 }} className="h-full rounded-full" style={{ backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-purple-300 text-xs">💡 Tipp: Füge ein Selfie zur Verifizierung hinzu um +8 Punkte zu erhalten</p>
          </div>
        </div>

        {/* Who viewed you */}
        <div className="card-glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-bold">Wer hat dich angesehen</p>
            <button onClick={() => router.push('/visitors')} className="text-purple-400 text-xs font-semibold">Alle →</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {BLURRED_VISITORS.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={url} alt="" className={`w-full h-full object-cover ${i > 1 ? 'blur-sm' : ''}`} />
                {i > 1 && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <Lock size={14} className="text-white/70 mb-1" />
                    <span className="text-white/70 text-[9px] font-bold text-center px-1">Premium</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/premium')} className="w-full mt-3 gradient-brand text-white text-xs font-bold py-2.5 rounded-xl glow-button">Premium — Alle Besucher sehen</button>
        </div>

        {/* Interest Insights */}
        <div className="card-glass rounded-2xl p-4">
          <p className="text-white font-bold mb-4">Beliebteste Interessen</p>
          <div className="space-y-3">
            {INTEREST_DATA.map((d, i) => (
              <div key={d.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/70">{d.label}</span>
                  <span className="text-white/60">{d.likes} Likes</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(d.likes / 42) * 100}%` }} transition={{ delay: i * 0.08 + 0.5, type: 'spring', stiffness: 220, damping: 24 }} className="h-full rounded-full" style={{ backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <p className="text-green-300 text-xs">📸 Dein erstes Foto bekommt 3× mehr Views als die anderen</p>
          </div>
        </div>

        {/* Peak times */}
        <div className="card-glass rounded-2xl p-4">
          <p className="text-white font-bold mb-1">Beste Zeiten</p>
          <p className="text-white/40 text-xs mb-4">Wann sind die meisten aktiv</p>
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 24 }, (_, h) => {
              const active = [18, 19, 20, 21, 22].includes(h);
              const medium = [14, 15, 16, 17, 23].includes(h);
              return (
                <div key={h} title={`${h}:00`} className={`aspect-square rounded-sm ${active ? 'bg-purple-500' : medium ? 'bg-purple-500/40' : 'bg-white/10'}`} />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-3 h-3 rounded-sm bg-purple-500" /><span className="text-white/50 text-xs">Beste Zeit: 20:00–22:00 Uhr</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
