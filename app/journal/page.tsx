'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Lock, X, Tag } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

type Mood = 'amazing' | 'good' | 'neutral' | 'complicated' | 'bad';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: Mood;
  matchName?: string;
  tags: string[];
}

const MOOD_CONFIG: Record<Mood, { emoji: string; label: string; color: string; border: string }> = {
  amazing:     { emoji: '😍', label: 'Wunderbar',    color: 'bg-pink-500/20',   border: 'border-l-pink-400' },
  good:        { emoji: '😊', label: 'Gut',          color: 'bg-green-500/20',  border: 'border-l-green-400' },
  neutral:     { emoji: '😐', label: 'Neutral',      color: 'bg-gray-500/20',   border: 'border-l-gray-400' },
  complicated: { emoji: '😕', label: 'Kompliziert',  color: 'bg-yellow-500/20', border: 'border-l-yellow-400' },
  bad:         { emoji: '😞', label: 'Schwierig',    color: 'bg-red-500/20',    border: 'border-l-red-400' },
};

const MOCK_ENTRIES: JournalEntry[] = [
  { id: '1', date: '2026-06-10', title: 'Zweites Date mit Sophie', content: 'Das Restaurant war wirklich perfekt. Wir haben fast 3 Stunden geredet, ohne es zu merken. Sie lacht so schön wenn sie von ihren Reisen erzählt. Ich bin gespannt was kommt.', mood: 'amazing', matchName: 'Sophie', tags: ['Zweites Date', 'Abendessen', 'Match'] },
  { id: '2', date: '2026-06-08', title: 'Online-Chat mit Leon', content: 'Wir haben stundenlang über Musik gesprochen. Er kennt so viele Bands die ich noch nie gehört habe. Hat mir eine ganze Playlist geschickt. Sehen uns nächste Woche.', mood: 'good', matchName: 'Leon', tags: ['Chat', 'Musik', 'Neugierig'] },
  { id: '3', date: '2026-06-05', title: 'Gedanken über mein Profil', content: 'Ich sollte wirklich neue Fotos hochladen. Die alten sind schon ein Jahr alt. Vielleicht auch die Bio überarbeiten — sie klingt ein bisschen langweilig. Mehr über meine echten Interessen schreiben.', mood: 'neutral', tags: ['Selbstreflexion', 'Profil', 'To-Do'] },
  { id: '4', date: '2026-06-02', title: 'Erstes Treffen mit Sophie', content: 'Kaffee im Prenzlauer Berg. Sie war noch sympathischer als ich erwartet hatte. Wir haben gequatscht bis das Café schloss. Gutes Zeichen? Ich denke schon.', mood: 'amazing', matchName: 'Sophie', tags: ['Erstes Date', 'Kaffee', 'Berlin'] },
];

const MOOD_FILTERS: Array<{ key: Mood | 'all'; label: string }> = [
  { key: 'all', label: '✦ Alle' },
  { key: 'amazing', label: '😍 Wunderbar' },
  { key: 'good', label: '😊 Gut' },
  { key: 'neutral', label: '😐 Neutral' },
  { key: 'complicated', label: '😕 Kompliziert' },
  { key: 'bad', label: '😞 Schwierig' },
];

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>(MOCK_ENTRIES);
  const [filter, setFilter] = useState<Mood | 'all'>('all');
  const [detail, setDetail] = useState<JournalEntry | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState<Mood>('good');
  const [newMatch, setNewMatch] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filtered = filter === 'all' ? entries : entries.filter(e => e.mood === filter);

  const saveEntry = () => {
    if (!newTitle.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(), date: new Date().toISOString().split('T')[0],
      title: newTitle, content: newContent, mood: newMood,
      matchName: newMatch || undefined, tags: newTags,
    };
    setEntries(prev => [entry, ...prev]);
    setShowNew(false);
    setNewTitle(''); setNewContent(''); setNewMood('good'); setNewMatch(''); setNewTags([]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    setDetail(null); setShowDeleteConfirm(false);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      setNewTags(prev => [...prev, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

  if (detail) return (
    <div className="min-h-screen bg-brand-dark flex flex-col pb-28">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-white/10">
        <button onClick={() => setDetail(null)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <p className="text-white/40 text-xs">{formatDate(detail.date)}</p>
        </div>
        <button onClick={() => setShowDeleteConfirm(true)} className="text-red-400/60 text-xs hover:text-red-400 transition-colors">Löschen</button>
      </div>
      <div className="px-5 py-5 flex-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{MOOD_CONFIG[detail.mood].emoji}</span>
          <div>
            <h1 className="text-white font-black text-xl">{detail.title}</h1>
            {detail.matchName && <p className="text-purple-400 text-sm">mit {detail.matchName}</p>}
          </div>
        </div>
        <p className="text-white/70 text-sm leading-relaxed mb-5">{detail.content}</p>
        <div className="flex flex-wrap gap-2">
          {detail.tags.map(t => <span key={t} className="bg-white/10 text-white/60 text-xs px-3 py-1 rounded-full border border-white/10">{t}</span>)}
        </div>
      </div>
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center p-4">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', stiffness: 340, damping: 28 }} className="bg-brand-card rounded-3xl p-6 w-full max-w-md">
              <p className="text-white font-bold text-center mb-2">Eintrag löschen?</p>
              <p className="text-white/50 text-sm text-center mb-5">Diese Aktion kann nicht rückgängig gemacht werden.</p>
              <button onClick={() => deleteEntry(detail.id)} className="w-full bg-red-500 text-white font-bold py-3 rounded-2xl mb-2">Löschen</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="w-full bg-white/10 text-white/70 py-3 rounded-2xl">Abbrechen</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
            <h1 className="text-white font-black text-xl">📖 Tagebuch</h1>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNew(true)} className="gradient-brand text-white text-xs font-bold px-4 py-2 rounded-xl glow-button flex items-center gap-1.5">
            <Plus size={14} /> Neuer Eintrag
          </motion.button>
        </div>
        {/* Privacy note */}
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 mb-2">
          <Lock size={12} className="text-green-400" />
          <span className="text-green-300 text-xs">Nur du kannst dieses Tagebuch sehen</span>
        </div>
        {/* Mood filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {MOOD_FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${filter === f.key ? 'gradient-brand text-white' : 'bg-white/8 text-white/50 border border-white/10'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Entry List */}
      <div className="px-5 py-4 space-y-3">
        <AnimatePresence>
          {filtered.map((entry, i) => {
            const cfg = MOOD_CONFIG[entry.mood];
            return (
              <motion.button
                key={entry.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 280, damping: 24 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDetail(entry)}
                className={`w-full text-left card-glass rounded-2xl p-4 border-l-4 ${cfg.border}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cfg.emoji}</span>
                    <div>
                      <p className="text-white font-bold text-sm">{entry.title}</p>
                      <p className="text-white/40 text-xs">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                  {entry.matchName && <span className="text-purple-400 text-xs bg-purple-500/15 px-2 py-0.5 rounded-full">{entry.matchName}</span>}
                </div>
                <p className="text-white/50 text-xs line-clamp-2 mb-2">{entry.content}</p>
                {entry.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {entry.tags.slice(0, 3).map(t => <span key={t} className="text-white/30 text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📖</p>
            <p className="text-white/50 text-sm">Noch keine Einträge.</p>
            <p className="text-white/30 text-xs mt-1">Schreibe über deine Dating-Erfahrungen!</p>
          </div>
        )}
      </div>

      {/* New Entry Sheet */}
      <AnimatePresence>
        {showNew && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNew(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-brand-card rounded-t-3xl z-50 px-5 pb-8 pt-5 max-h-[85vh] overflow-y-auto">
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-black">Neuer Eintrag</h2>
                <button onClick={() => setShowNew(false)}><X size={18} className="text-white/50" /></button>
              </div>
              <div className="space-y-4">
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Titel…" className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50" />
                {/* Mood */}
                <div>
                  <p className="text-white/40 text-xs mb-2">Stimmung</p>
                  <div className="flex gap-3">
                    {(Object.keys(MOOD_CONFIG) as Mood[]).map(m => (
                      <motion.button key={m} whileTap={{ scale: 0.85 }} animate={{ scale: newMood === m ? 1.2 : 1 }} onClick={() => setNewMood(m)} className={`text-2xl p-1.5 rounded-xl ${newMood === m ? 'bg-purple-500/30' : 'bg-white/5'}`}>{MOOD_CONFIG[m].emoji}</motion.button>
                    ))}
                  </div>
                </div>
                <input value={newMatch} onChange={e => setNewMatch(e.target.value)} placeholder="Über wen? (optional)" className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50" />
                <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Was möchtest du festhalten?" rows={5} className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 resize-none" />
                {/* Tags */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={12} className="text-white/40" />
                    <input value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyDown={addTag} placeholder="Tag hinzufügen (Enter)" className="flex-1 bg-transparent text-white/70 text-sm placeholder:text-white/25 focus:outline-none" />
                  </div>
                  {newTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {newTags.map(t => (
                        <span key={t} onClick={() => setNewTags(prev => prev.filter(x => x !== t))} className="text-white/60 text-xs bg-white/10 px-2.5 py-1 rounded-full cursor-pointer border border-white/10 flex items-center gap-1">
                          {t} <X size={9} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={saveEntry} disabled={!newTitle.trim()} className="w-full gradient-brand text-white font-bold py-3.5 rounded-2xl glow-button disabled:opacity-40">Speichern</motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
