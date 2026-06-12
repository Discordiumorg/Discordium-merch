'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, SlidersHorizontal, MapPin, Users, Sparkles } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

type Gender = 'all' | 'women' | 'men' | 'nonbinary';
type RelationshipGoal = 'relationship' | 'casual' | 'friendship' | 'undecided';

const INTERESTS = [
  'Reisen', 'Musik', 'Kochen', 'Sport', 'Kunst', 'Fotografie',
  'Gaming', 'Kino', 'Lesen', 'Yoga', 'Wandern', 'Tanzen',
  'Foodie', 'Konzerte', 'Fitness', 'Natur', 'Technik', 'Mode',
];

const RELATIONSHIP_GOALS: Array<{ key: RelationshipGoal; label: string; emoji: string }> = [
  { key: 'relationship', label: 'Feste Beziehung', emoji: '💍' },
  { key: 'casual', label: 'Etwas Lockeres', emoji: '🌊' },
  { key: 'friendship', label: 'Freundschaft', emoji: '🤝' },
  { key: 'undecided', label: 'Mal sehen', emoji: '🌱' },
];

function RangeSlider({ min, max, value, onChange, label, unit, step = 1 }: { min: number; max: number; value: [number, number]; onChange: (v: [number, number]) => void; label: string; unit: string; step?: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-white/60">{label}</span>
        <span className="text-white/80 font-semibold">{value[0]}{unit} – {value[1]}{unit}</span>
      </div>
      <div className="relative h-2 bg-white/10 rounded-full">
        <div
          className="absolute h-full gradient-brand rounded-full"
          style={{ left: `${((value[0] - min) / (max - min)) * 100}%`, right: `${100 - ((value[1] - min) / (max - min)) * 100}%` }}
        />
        <input type="range" min={min} max={max} step={step} value={value[0]} onChange={e => onChange([Math.min(Number(e.target.value), value[1] - step), value[1]])} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
        <input type="range" min={min} max={max} step={step} value={value[1]} onChange={e => onChange([value[0], Math.max(Number(e.target.value), value[0] + step)])} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-purple-500 cursor-pointer" style={{ left: `calc(${((value[0] - min) / (max - min)) * 100}% - 10px)` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-purple-500 cursor-pointer" style={{ left: `calc(${((value[1] - min) / (max - min)) * 100}% - 10px)` }} />
      </div>
    </div>
  );
}

export default function FiltersPage() {
  const router = useRouter();
  const [gender, setGender] = useState<Gender>('women');
  const [ageRange, setAgeRange] = useState<[number, number]>([22, 35]);
  const [distanceKm, setDistanceKm] = useState<[number, number]>([1, 50]);
  const [goals, setGoals] = useState<Set<RelationshipGoal>>(new Set(['relationship']));
  const [interests, setInterests] = useState<Set<string>>(new Set(['Reisen', 'Musik', 'Kochen']));
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [withPhotoOnly, setWithPhotoOnly] = useState(true);
  const [activeNow, setActiveNow] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleGoal = (g: RelationshipGoal) => {
    setGoals(prev => {
      const n = new Set(prev);
      n.has(g) ? n.delete(g) : n.add(g);
      return n;
    });
  };

  const toggleInterest = (i: string) => {
    setInterests(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  const saveFilters = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.back();
    }, 1200);
  };

  const GENDER_OPTIONS: Array<{ key: Gender; label: string; emoji: string }> = [
    { key: 'women', label: 'Frauen', emoji: '♀️' },
    { key: 'men', label: 'Männer', emoji: '♂️' },
    { key: 'nonbinary', label: 'Non-Binary', emoji: '⚧️' },
    { key: 'all', label: 'Alle', emoji: '✨' },
  ];

  const PillToggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <motion.button whileTap={{ scale: 0.9 }} onClick={onChange} className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-purple-500' : 'bg-white/15'}`}>
      <motion.div animate={{ x: value ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-purple-400" />
            <h1 className="text-white font-black text-xl">Suchfilter</h1>
          </div>
          <button onClick={() => { setGender('all'); setAgeRange([18, 50]); setDistanceKm([1, 100]); setGoals(new Set()); setInterests(new Set()); setVerifiedOnly(false); setWithPhotoOnly(true); setActiveNow(false); }} className="ml-auto text-purple-400 text-xs font-semibold">Zurücksetzen</button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Gender */}
        <div className="card-glass rounded-2xl p-4 border border-white/8">
          <div className="flex items-center gap-2 mb-3">
            <Users size={15} className="text-purple-400" />
            <p className="text-white font-bold text-sm">Ich suche</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {GENDER_OPTIONS.map(({ key, label, emoji }) => (
              <motion.button key={key} whileTap={{ scale: 0.95 }} onClick={() => setGender(key)} className={`py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${gender === key ? 'gradient-brand text-white' : 'bg-white/8 text-white/50 border border-white/10'}`}>
                <span>{emoji}</span>
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Age range */}
        <div className="card-glass rounded-2xl p-4 border border-white/8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">🎂</span>
            <p className="text-white font-bold text-sm">Altersbereich</p>
          </div>
          <RangeSlider min={18} max={70} value={ageRange} onChange={setAgeRange} label="Alter" unit=" Jahre" />
        </div>

        {/* Distance */}
        <div className="card-glass rounded-2xl p-4 border border-white/8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={15} className="text-purple-400" />
            <p className="text-white font-bold text-sm">Entfernung</p>
          </div>
          <RangeSlider min={1} max={200} value={distanceKm} onChange={setDistanceKm} label="Radius" unit=" km" step={5} />
        </div>

        {/* Relationship goals */}
        <div className="card-glass rounded-2xl p-4 border border-white/8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">💭</span>
            <p className="text-white font-bold text-sm">Beziehungsziel</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {RELATIONSHIP_GOALS.map(({ key, label, emoji }) => (
              <motion.button key={key} whileTap={{ scale: 0.95 }} onClick={() => toggleGoal(key)} className={`py-3 px-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${goals.has(key) ? 'gradient-brand text-white' : 'bg-white/8 text-white/50 border border-white/10'}`}>
                <span>{emoji}</span>
                <span className="text-xs leading-tight">{label}</span>
                {goals.has(key) && <Check size={12} className="ml-auto" />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Interests filter */}
        <div className="card-glass rounded-2xl p-4 border border-white/8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} className="text-purple-400" />
            <p className="text-white font-bold text-sm">Gemeinsame Interessen</p>
            <span className="ml-auto text-white/40 text-xs">{interests.size} gewählt</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <motion.button key={interest} whileTap={{ scale: 0.9 }} onClick={() => toggleInterest(interest)} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${interests.has(interest) ? 'gradient-brand text-white' : 'bg-white/8 text-white/50 border border-white/10'}`}>
                {interest}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick filters */}
        <div className="card-glass rounded-2xl p-4 border border-white/8 space-y-4">
          <p className="text-white font-bold text-sm">Weitere Filter</p>
          {[
            { label: 'Nur verifizierte Profile', desc: 'Bestätigte echte Personen', value: verifiedOnly, onChange: () => setVerifiedOnly(v => !v) },
            { label: 'Mit Profilfotos', desc: 'Nur Profile mit Foto anzeigen', value: withPhotoOnly, onChange: () => setWithPhotoOnly(v => !v) },
            { label: 'Gerade aktiv', desc: 'Nur online-seiende Nutzer', value: activeNow, onChange: () => setActiveNow(v => !v) },
          ].map(({ label, desc, value, onChange }) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-white text-sm font-semibold">{label}</p>
                <p className="text-white/40 text-xs">{desc}</p>
              </div>
              <PillToggle value={value} onChange={onChange} />
            </div>
          ))}
        </div>

        {/* Save button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={saveFilters}
          className="w-full gradient-brand text-white font-bold py-4 rounded-2xl glow-button flex items-center justify-center gap-2"
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                <Check size={18} /> Filter gespeichert!
              </motion.div>
            ) : (
              <motion.div key="save" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                <SlidersHorizontal size={18} /> Filter anwenden
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
