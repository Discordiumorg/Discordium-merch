'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Heart, Zap, ChevronRight, RefreshCw } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

type Dimension = 'openness' | 'extraversion' | 'agreeableness' | 'conscientiousness' | 'neuroticism';

interface PersonalityResult {
  dimension: Dimension;
  score: number;
  label: string;
  description: string;
  color: string;
  lowLabel: string;
  highLabel: string;
}

const PERSONALITY_DATA: PersonalityResult[] = [
  { dimension: 'openness', score: 82, label: 'Offenheit', description: 'Du bist sehr offen für neue Erfahrungen, kreativ und neugierig. Du liebst es, neue Ideen zu erkunden und schätzt Kunst und Kreativität.', color: '#a855f7', lowLabel: 'Konventionell', highLabel: 'Kreativ & Offen' },
  { dimension: 'extraversion', score: 65, label: 'Extraversion', description: 'Du bist gesellig und energetisch, genießt soziale Interaktionen aber schätzt auch Zeit für dich allein. Eine gute Balance!', color: '#ec4899', lowLabel: 'Introvertiert', highLabel: 'Extravertiert' },
  { dimension: 'agreeableness', score: 74, label: 'Verträglichkeit', description: 'Du bist kooperativ, mitfühlend und harmonieorientiert. Menschen schätzen deine Wärme und Hilfsbereitschaft.', color: '#22c55e', lowLabel: 'Direkt', highLabel: 'Kooperativ' },
  { dimension: 'conscientiousness', score: 58, label: 'Gewissenhaftigkeit', description: 'Du bist organisiert und zuverlässig, lässt aber auch Raum für Spontaneität. Eine flexible Persönlichkeit!', color: '#f59e0b', lowLabel: 'Spontan', highLabel: 'Strukturiert' },
  { dimension: 'neuroticism', score: 35, label: 'Emotionale Stabilität', description: 'Du bist emotional ausgeglichen und resistent gegenüber Stress. Du bleibst in schwierigen Situationen ruhig und gefasst.', color: '#3b82f6', lowLabel: 'Gelassen', highLabel: 'Sensibel' },
];

const LOVE_LANGUAGES = [
  { id: 'words', emoji: '💬', label: 'Worte der Bestätigung', score: 85, description: 'Du liebst aufmunternde Worte und verbale Zuneigung' },
  { id: 'quality', emoji: '⏰', label: 'Gemeinsame Zeit', score: 72, description: 'Ungeteilte Aufmerksamkeit und echte Präsenz' },
  { id: 'touch', emoji: '🤝', label: 'Körperliche Berührung', score: 60, description: 'Umarmungen, Berühren und körperliche Nähe' },
  { id: 'acts', emoji: '🛠️', label: 'Hilfreiche Handlungen', score: 45, description: 'Wenn jemand durch Taten zeigt, dass er/sie fürsorgt' },
  { id: 'gifts', emoji: '🎁', label: 'Geschenke', score: 30, description: 'Durchdachte Gesten und symbolische Geschenke' },
];

const ATTACHMENT_STYLES = [
  { id: 'secure', emoji: '🌱', label: 'Sicher', pct: 70, color: '#22c55e', desc: 'Komfortabel mit Nähe und Unabhängigkeit' },
  { id: 'anxious', emoji: '🌊', label: 'Ängstlich', pct: 15, color: '#f59e0b', desc: 'Braucht Bestätigung und sucht Nähe' },
  { id: 'avoidant', emoji: '🏔️', label: 'Vermeidend', pct: 10, color: '#3b82f6', desc: 'Schätzt Unabhängigkeit, vermeidet Nähe' },
  { id: 'disorganized', emoji: '🌪️', label: 'Desorganisiert', pct: 5, color: '#ef4444', desc: 'Gemischte Gefühle über Nähe' },
];

const DATING_STYLE_TRAITS = [
  { label: 'Romantisch vs. Pragmatisch', value: 72, leftLabel: 'Pragmatiker', rightLabel: 'Romantiker', color: '#ec4899' },
  { label: 'Langsam vs. Schnell', value: 40, leftLabel: 'Langsam & bedächtig', rightLabel: 'Schnell & direkt', color: '#a855f7' },
  { label: 'Gesprächig vs. Zuhörer', value: 55, leftLabel: 'Zuhörer', rightLabel: 'Gesprächig', color: '#3b82f6' },
  { label: 'Homebody vs. Abenteurer', value: 65, leftLabel: 'Homebody', rightLabel: 'Abenteurer', color: '#22c55e' },
];

const COMPATIBILITY_TYPES = [
  { type: 'Gleichgesinnte', emoji: '🧠', match: 'Hohe Offenheit, ähnliche Werte', pct: 94 },
  { type: 'Ergänzende Gegensätze', emoji: '⚡', match: 'Extraversion + Introversion', pct: 78 },
  { type: 'Emotionale Verbindung', emoji: '💜', match: 'Hohe Verträglichkeit beiderseits', pct: 85 },
];

export default function PersonalityPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'personality' | 'love' | 'attachment' | 'dating' | 'compatibility'>('personality');
  const [expandedTrait, setExpandedTrait] = useState<Dimension | null>(null);

  const dominantPersonality = PERSONALITY_DATA.reduce((a, b) => a.score > b.score ? a : b);
  const primaryLoveLanguage = LOVE_LANGUAGES[0];
  const dominantAttachment = ATTACHMENT_STYLES[0];

  const SECTIONS = [
    { key: 'personality' as const, label: '🧠 Big Five' },
    { key: 'love' as const, label: '❤️ Liebessprachen' },
    { key: 'attachment' as const, label: '🔗 Bindungsstil' },
    { key: 'dating' as const, label: '💘 Dating-Stil' },
    { key: 'compatibility' as const, label: '✨ Kompatibilität' },
  ];

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <h1 className="text-white font-black text-xl">🧠 Persönlichkeitsprofil</h1>
          <button className="ml-auto text-white/40 hover:text-white/60 transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
        {/* Section tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)} className={`flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all ${activeSection === s.key ? 'gradient-brand text-white' : 'bg-white/8 text-white/50 border border-white/10'}`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Hero summary card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-2xl p-5 border border-purple-500/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center flex-shrink-0">
              <Brain size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Dein Persönlichkeitstyp</p>
              <p className="text-white font-black text-lg">Der Kreative Empath</p>
              <p className="text-white/50 text-xs mt-1">Offen · Fürsorglich · Ausgeglichen</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-purple-500/10 rounded-xl p-2 border border-purple-500/20">
              <p className="text-purple-300 font-black text-sm">{dominantPersonality.label}</p>
              <p className="text-white/40 text-[10px]">Stärkstes Merkmal</p>
            </div>
            <div className="bg-pink-500/10 rounded-xl p-2 border border-pink-500/20">
              <p className="text-pink-300 font-black text-sm">{primaryLoveLanguage.emoji}</p>
              <p className="text-white/40 text-[10px]">Liebessprache</p>
            </div>
            <div className="bg-green-500/10 rounded-xl p-2 border border-green-500/20">
              <p className="text-green-300 font-black text-sm">{dominantAttachment.emoji}</p>
              <p className="text-white/40 text-[10px]">{dominantAttachment.label}</p>
            </div>
          </div>
        </motion.div>

        {/* Section content */}
        <AnimatePresence mode="wait">
          {activeSection === 'personality' && (
            <motion.div key="personality" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="space-y-3">
              <p className="text-white/50 text-xs">Das Big-Five-Modell misst 5 grundlegende Persönlichkeitsdimensionen</p>
              {PERSONALITY_DATA.map((trait, i) => (
                <motion.div
                  key={trait.dimension}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 24 }}
                  onClick={() => setExpandedTrait(expandedTrait === trait.dimension ? null : trait.dimension)}
                  className="card-glass rounded-2xl p-4 cursor-pointer border border-white/8 hover:border-purple-500/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-bold text-sm">{trait.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-white/40 text-xs">{trait.lowLabel}</span>
                        <span className="text-white/25 text-xs">→</span>
                        <span className="text-white/40 text-xs">{trait.highLabel}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xl" style={{ color: trait.color }}>{trait.score}%</span>
                      <motion.div animate={{ rotate: expandedTrait === trait.dimension ? 90 : 0 }}>
                        <ChevronRight size={14} className="text-white/30" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trait.score}%` }}
                      transition={{ delay: i * 0.07 + 0.3, type: 'spring', stiffness: 200, damping: 24 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: trait.color }}
                    />
                  </div>
                  <AnimatePresence>
                    {expandedTrait === trait.dimension && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="text-white/60 text-xs mt-3 leading-relaxed overflow-hidden">
                        {trait.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeSection === 'love' && (
            <motion.div key="love" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="space-y-3">
              <div className="card-glass rounded-2xl p-4 border border-pink-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{primaryLoveLanguage.emoji}</span>
                  <div>
                    <p className="text-white font-black text-base">{primaryLoveLanguage.label}</p>
                    <p className="text-white/50 text-xs">Deine primäre Liebessprache</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm">{primaryLoveLanguage.description}</p>
              </div>

              <p className="text-white/40 text-xs uppercase tracking-wider">Alle Liebessprachen</p>
              {LOVE_LANGUAGES.map((lang, i) => (
                <motion.div key={lang.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card-glass rounded-xl p-3.5 border border-white/8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{lang.emoji}</span>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{lang.label}</p>
                      <p className="text-white/40 text-xs">{lang.description}</p>
                    </div>
                    <span className="text-white/70 font-bold text-sm">{lang.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${lang.score}%` }} transition={{ delay: i * 0.07 + 0.3, duration: 0.7 }} className="h-full rounded-full bg-pink-500" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeSection === 'attachment' && (
            <motion.div key="attachment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="space-y-4">
              <div className="card-glass rounded-2xl p-4 border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{dominantAttachment.emoji}</span>
                  <div>
                    <p className="text-white font-black text-lg">Sicherer Bindungsstil</p>
                    <p className="text-white/50 text-xs">{dominantAttachment.pct}% deiner Bindungsmuster</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm">{dominantAttachment.desc}</p>
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-green-300 text-xs">💡 Menschen mit sicherem Bindungsstil haben die stabilsten und erfüllendsten Beziehungen.</p>
                </div>
              </div>

              <div className="space-y-3">
                {ATTACHMENT_STYLES.map((style, i) => (
                  <motion.div key={style.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card-glass rounded-xl p-3.5 border border-white/8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{style.emoji}</span>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{style.label}</p>
                        <p className="text-white/40 text-xs">{style.desc}</p>
                      </div>
                      <span className="font-bold text-sm" style={{ color: style.color }}>{style.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${style.pct}%` }} transition={{ delay: i * 0.08 + 0.3, duration: 0.7 }} className="h-full rounded-full" style={{ backgroundColor: style.color }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'dating' && (
            <motion.div key="dating" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="space-y-4">
              <p className="text-white/50 text-xs">Dein Dating-Verhalten auf einem Spektrum</p>
              {DATING_STYLE_TRAITS.map((trait, i) => (
                <motion.div key={trait.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-glass rounded-2xl p-4 border border-white/8">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-3">{trait.label}</p>
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trait.value}%` }}
                      transition={{ delay: i * 0.08 + 0.3, type: 'spring', stiffness: 200, damping: 24 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: trait.color }}
                    />
                    <motion.div
                      initial={{ left: 0 }}
                      animate={{ left: `${trait.value - 2}%` }}
                      transition={{ delay: i * 0.08 + 0.3, type: 'spring', stiffness: 200, damping: 24 }}
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">{trait.leftLabel}</span>
                    <span className="text-white/40">{trait.rightLabel}</span>
                  </div>
                </motion.div>
              ))}

              <div className="card-glass rounded-2xl p-4 border border-purple-500/15">
                <div className="flex items-center gap-2 mb-3">
                  <Heart size={14} className="text-pink-400" />
                  <p className="text-white font-bold text-sm">Dein optimaler Partner</p>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">Du passt am besten zu jemandem der deinen Abenteuersinn teilt, emotional reif ist, tiefe Gespräche schätzt und Raum für Individualität lässt. Jemand der romantisch aber auch bodenständig ist — wie du!</p>
              </div>
            </motion.div>
          )}

          {activeSection === 'compatibility' && (
            <motion.div key="compatibility" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="space-y-4">
              <p className="text-white/50 text-xs">Basierend auf deinem Profil — Partnertypen mit höchster Kompatibilität</p>

              {COMPATIBILITY_TYPES.map((type, i) => (
                <motion.div key={type.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-glass rounded-2xl p-4 border border-white/8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{type.emoji}</span>
                      <div>
                        <p className="text-white font-bold text-sm">{type.type}</p>
                        <p className="text-white/40 text-xs">{type.match}</p>
                      </div>
                    </div>
                    <span className="font-black text-xl" style={{ color: type.pct >= 90 ? '#22c55e' : type.pct >= 75 ? '#a855f7' : '#f59e0b' }}>{type.pct}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${type.pct}%` }} transition={{ delay: i * 0.1 + 0.4, type: 'spring', stiffness: 200, damping: 24 }} className="h-full rounded-full" style={{ backgroundColor: type.pct >= 90 ? '#22c55e' : type.pct >= 75 ? '#a855f7' : '#f59e0b' }} />
                  </div>
                </motion.div>
              ))}

              <div className="card-glass rounded-2xl p-4 border border-yellow-500/15">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={14} className="text-yellow-400" />
                  <p className="text-white font-bold text-sm">Premium-Insight</p>
                </div>
                <p className="text-white/60 text-xs leading-relaxed mb-3">Mit Premium Gold siehst du die Kompatibilitätsanalyse für jeden deiner Matches — inkl. Liebessprachen-Vergleich und Bindungsstil-Abgleich.</p>
                <button onClick={() => router.push('/premium')} className="w-full gradient-brand text-white text-xs font-bold py-2.5 rounded-xl glow-button">Premium freischalten</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
