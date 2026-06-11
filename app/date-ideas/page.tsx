'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Heart, Share2, X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

type Weather = 'sunny' | 'rainy' | 'cloudy';
type Budget = 'cheap' | 'medium' | 'luxury';
type Mood = 'creative' | 'relaxed' | 'adventure' | 'food' | 'active';

interface DateIdea {
  emoji: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: number;
  duration: string;
}

const IDEAS: Record<string, DateIdea[]> = {
  sunny_cheap_adventure: [
    { emoji: '🚴', title: 'Fahrradtour entlang der Spree', description: 'Erkundet zusammen die Ufer der Spree — von Mitte bis Köpenick. Perfekt für Entdecker!', tags: ['Outdoor', 'Aktiv', 'Kostenlos'], difficulty: 2, duration: '3–4 Stunden' },
    { emoji: '🌿', title: 'Picknick im Tiergarten', description: 'Packt euren Lieblingssnack ein und findet ein ruhiges Plätzchen im Grünen. Genuss pur.', tags: ['Romantisch', 'Entspannt', 'Günstig'], difficulty: 1, duration: '2–3 Stunden' },
  ],
  sunny_medium_food: [
    { emoji: '🌮', title: 'Street Food Tour', description: 'Erkundet zusammen verschiedene Foodtrucks und Marktstände. Jeder zahlt abwechselnd.', tags: ['Genuss', 'Stadtentdeckung', 'Spaß'], difficulty: 1, duration: '2–3 Stunden' },
    { emoji: '🍷', title: 'Weinprobe im Park', description: 'Kauft eine gute Flasche Wein, schnappt euch Käse und Brot, und genießt den Abend draußen.', tags: ['Romantisch', 'Entspannt', 'Stil'], difficulty: 1, duration: '2–4 Stunden' },
  ],
  rainy_medium_creative: [
    { emoji: '🎨', title: 'Gemeinsam malen im Atelier', description: 'Bucht einen Kreativ-Workshop für Paare. Ihr malt beide dasselbe Motiv — wer macht es besser?', tags: ['Kreativ', 'Witzig', 'Einzigartig'], difficulty: 2, duration: '2–3 Stunden' },
    { emoji: '🍝', title: 'Pasta-Koch-Kurs', description: 'Lernt gemeinsam echte italienische Pasta von Grund auf zu machen. Danach gemeinsam essen!', tags: ['Lernen', 'Lecker', 'Teamwork'], difficulty: 3, duration: '3–4 Stunden' },
  ],
  rainy_cheap_relaxed: [
    { emoji: '🎮', title: 'Retro-Spieleabend im Café', description: 'Viele Cafés haben Gesellschaftsspiele — bestellt Tee und kämpft um die Meisterschaft.', tags: ['Entspannt', 'Witzig', 'Günstig'], difficulty: 1, duration: '2–4 Stunden' },
    { emoji: '📽️', title: 'Heimkino mit selbstgemachtem Popcorn', description: 'Wählt zusammen einen Film, macht selbst Popcorn und baut eine gemütliche Decken-Festung.', tags: ['Gemütlich', 'Romantisch', 'Zuhause'], difficulty: 1, duration: '3–4 Stunden' },
  ],
  cloudy_medium_adventure: [
    { emoji: '🧗', title: 'Klettern in der Boulderhalle', description: 'Helft euch gegenseitig beim Klettern — perfekter Vertrauensaufbau und Action pur!', tags: ['Sport', 'Spannend', 'Teamwork'], difficulty: 3, duration: '2–3 Stunden' },
    { emoji: '🎳', title: 'Bowling und Burger', description: 'Classic aber immer gut: Bowl gegeneinander und danach Burger essen. Locker und lustig.', tags: ['Spaß', 'Wettbewerb', 'Casual'], difficulty: 1, duration: '3–4 Stunden' },
  ],
  sunny_luxury_food: [
    { emoji: '🍽️', title: 'Fine Dining Überraschung', description: 'Bucht ein Restaurant mit Michelin-Stern und macht euch einen unvergesslichen Abend.', tags: ['Luxuriös', 'Romantisch', 'Besonders'], difficulty: 1, duration: '3–4 Stunden' },
    { emoji: '🚢', title: 'Abendfahrt auf der Spree', description: 'Eine romantische Bootstour mit Dinner bei Sonnenuntergang. Unvergessliche Kulisse.', tags: ['Romantisch', 'Luxus', 'Unvergesslich'], difficulty: 1, duration: '3–4 Stunden' },
  ],
};

const DEFAULT_IDEAS: DateIdea[] = [
  { emoji: '☕', title: 'Kaffee und Spaziergang', description: 'Der Klassiker: Ein guter Kaffee und ein langer Spaziergang durch eure Lieblingsstraßen.', tags: ['Entspannt', 'Klassisch', 'Günstig'], difficulty: 1, duration: '1–2 Stunden' },
  { emoji: '🏛️', title: 'Museum-Entdeckung', description: 'Wählt gemeinsam ein Museum das ihr beide noch nicht kennt. Macht euch gegenseitig zu Guide.', tags: ['Bildend', 'Interessant', 'Günstig'], difficulty: 1, duration: '2–3 Stunden' },
  { emoji: '🎵', title: 'Konzert oder Open-Air', description: 'Findet ein Live-Event in eurer Stadt. Musik verbindet!', tags: ['Energie', 'Musik', 'Erlebnis'], difficulty: 1, duration: '3–5 Stunden' },
  { emoji: '🌄', title: 'Sonnenaufgang-Abenteuer', description: 'Steht früh auf, holt Kaffee und seht gemeinsam den Sonnenaufgang. Unvergleichlich romantisch.', tags: ['Romantisch', 'Einmalig', 'Früh'], difficulty: 2, duration: '1–2 Stunden' },
];

export default function DateIdeasPage() {
  const router = useRouter();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [tags, setTags] = useState(['Reisen', 'Musik', 'Kochen']);
  const [tagInput, setTagInput] = useState('');
  const [ideas, setIdeas] = useState<DateIdea[]>([]);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const key = `${weather || 'sunny'}_${budget || 'medium'}_${mood || 'adventure'}`;
      const result = IDEAS[key] || DEFAULT_IDEAS;
      const shuffled = [...result, ...DEFAULT_IDEAS].slice(0, 4);
      setIdeas(shuffled);
      setGenerated(true);
      setLoading(false);
    }, 1200);
  };

  const toggleSave = (title: string) => {
    setSaved(prev => {
      const n = new Set(prev);
      n.has(title) ? n.delete(title) : n.add(title);
      return n;
    });
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
        <h1 className="text-white font-black text-xl">💡 Date-Ideen</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* Input card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-2xl p-5 space-y-5">
          {/* Weather */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Wetter heute</p>
            <div className="flex gap-2">
              {[{ k: 'sunny' as Weather, l: '☀️ Sonnig' }, { k: 'rainy' as Weather, l: '🌧️ Regnerisch' }, { k: 'cloudy' as Weather, l: '🌤️ Bewölkt' }].map(({ k, l }) => (
                <motion.button key={k} whileTap={{ scale: 0.92 }} onClick={() => setWeather(k)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${weather === k ? 'gradient-brand text-white' : 'bg-white/8 text-white/50 border border-white/10'}`}>{l}</motion.button>
              ))}
            </div>
          </div>
          {/* Budget */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Budget</p>
            <div className="flex gap-2">
              {[{ k: 'cheap' as Budget, l: '💸 Günstig' }, { k: 'medium' as Budget, l: '💰 Mittel' }, { k: 'luxury' as Budget, l: '💎 Luxus' }].map(({ k, l }) => (
                <motion.button key={k} whileTap={{ scale: 0.92 }} onClick={() => setBudget(k)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${budget === k ? 'gradient-brand text-white' : 'bg-white/8 text-white/50 border border-white/10'}`}>{l}</motion.button>
              ))}
            </div>
          </div>
          {/* Mood */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Stimmung</p>
            <div className="flex gap-2 flex-wrap">
              {[{ k: 'creative' as Mood, l: '🎭 Kreativ' }, { k: 'relaxed' as Mood, l: '🌿 Entspannt' }, { k: 'adventure' as Mood, l: '⚡ Abenteuer' }, { k: 'food' as Mood, l: '🍽️ Genuss' }, { k: 'active' as Mood, l: '🏃 Aktiv' }].map(({ k, l }) => (
                <motion.button key={k} whileTap={{ scale: 0.92 }} onClick={() => setMood(k)} className={`py-2 px-3 rounded-xl text-sm font-semibold transition-all ${mood === k ? 'gradient-brand text-white' : 'bg-white/8 text-white/50 border border-white/10'}`}>{l}</motion.button>
              ))}
            </div>
          </div>
          {/* Tags */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Gemeinsame Interessen</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(t => (
                <span key={t} onClick={() => setTags(prev => prev.filter(x => x !== t))} className="text-white/70 text-xs bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full cursor-pointer flex items-center gap-1">
                  {t} <X size={9} />
                </span>
              ))}
            </div>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Interesse hinzufügen (Enter)" className="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2.5 text-white/70 placeholder:text-white/25 text-sm focus:outline-none focus:border-purple-500/40" />
          </div>
          {/* Generate */}
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            onClick={generate}
            disabled={loading}
            className="w-full gradient-brand text-white font-bold py-4 rounded-2xl glow-button flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> Generiere Ideen…</>
            ) : (
              <><Sparkles size={18} /> Ideen generieren</>
            )}
          </motion.button>
        </motion.div>

        {/* Generated ideas */}
        <AnimatePresence>
          {generated && ideas.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <h2 className="text-white font-bold text-base">✨ Deine Ideen</h2>
              {ideas.map((idea, i) => (
                <motion.div
                  key={idea.title}
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 280, damping: 24 }}
                  className="card-glass rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{idea.emoji}</span>
                      <div>
                        <p className="text-white font-bold">{idea.title}</p>
                        <p className="text-white/50 text-xs">{idea.duration} · {'⭐'.repeat(idea.difficulty)}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleSave(idea.title)} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center">
                        <Heart size={15} className={saved.has(idea.title) ? 'text-pink-400 fill-pink-400' : 'text-white/40'} />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.85 }} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center">
                        <Share2 size={14} className="text-white/40" />
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mb-3">{idea.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {idea.tags.map(t => <span key={t} className="text-white/50 text-[10px] bg-white/8 px-2 py-0.5 rounded-full border border-white/8">{t}</span>)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved ideas */}
        <AnimatePresence>
          {saved.size > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <h2 className="text-white font-bold text-base mb-3">❤️ Gespeichert ({saved.size})</h2>
              <div className="space-y-2">
                {ideas.filter(i => saved.has(i.title)).map(idea => (
                  <div key={idea.title} className="flex items-center gap-3 card-glass rounded-xl px-4 py-3">
                    <span className="text-xl">{idea.emoji}</span>
                    <span className="text-white/80 text-sm flex-1">{idea.title}</span>
                    <button onClick={() => toggleSave(idea.title)}><X size={14} className="text-white/30" /></button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
