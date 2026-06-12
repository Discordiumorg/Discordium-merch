'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Clock, Heart, ChevronRight, X, Star, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

type Screen = 'lobby' | 'waiting' | 'session' | 'between' | 'results';

interface Room {
  id: number;
  theme: string;
  emoji: string;
  participants: number;
  maxSlots: number;
  timeLeft: string;
  host: string;
  category: string;
  color: string;
}

interface DatePerson {
  id: number;
  name: string;
  age: number;
  job: string;
  city: string;
  seed: string;
  funFact: string;
}

interface SessionResult {
  person: DatePerson;
  liked: boolean;
  mutualMatch: boolean;
  rating: string;
}

const ROOMS: Room[] = [
  { id: 1, theme: 'Startup Founders', emoji: '🚀', participants: 8, maxSlots: 10, timeLeft: '2:34', host: 'Leon', category: 'professional', color: 'from-blue-600/30 to-indigo-700/30' },
  { id: 2, theme: 'Bookworm Night', emoji: '📚', participants: 5, maxSlots: 8, timeLeft: '1:12', host: 'Sophie', category: 'intellectual', color: 'from-violet-600/30 to-purple-700/30' },
  { id: 3, theme: 'Fitness Freaks', emoji: '💪', participants: 12, maxSlots: 12, timeLeft: '0:45', host: 'Max', category: 'active', color: 'from-green-600/30 to-emerald-700/30' },
  { id: 4, theme: 'Travel Lovers', emoji: '✈️', participants: 6, maxSlots: 10, timeLeft: '4:20', host: 'Mia', category: 'lifestyle', color: 'from-sky-600/30 to-cyan-700/30' },
];

const PEOPLE: DatePerson[] = [
  { id: 1, name: 'Sophie', age: 26, job: 'Fotografin', city: 'Berlin', seed: 'sophie1', funFact: 'Reist am liebsten alleine' },
  { id: 2, name: 'Elena', age: 24, job: 'UX Designerin', city: 'München', seed: 'elena1', funFact: 'Spielt Gitarre seit 10 Jahren' },
  { id: 3, name: 'Lena', age: 27, job: 'Künstlerin', city: 'Köln', seed: 'lena2', funFact: 'Hat 3 Katzen' },
  { id: 4, name: 'Julia', age: 31, job: 'Sommelière', city: 'Berlin', seed: 'julia1', funFact: 'Hat mal einen Marathon gelaufen' },
  { id: 5, name: 'Mia', age: 23, job: 'Tanzlehrerin', city: 'Dresden', seed: 'mia1', funFact: 'Spricht 4 Sprachen' },
];

const ICE_BREAKERS = [
  'Was ist deine spontanste Erinnerung?',
  'Strand oder Berge?',
  'Welche Fähigkeit würdest du gern lernen?',
  'Was ist dein liebstes Soulfood?',
  'Wenn du ein Jahr irgendwo leben könntest, wo?',
  'Worin bist du heimlich gut?',
  'Morgenmensch oder Nachtmensch?',
  'Was hat dich zuletzt zum Lachen gebracht?',
  'Was steht auf deiner Bucket List?',
  'Wie verbringst du am liebsten einen Sonntag?',
  'Was ist deine Love Language?',
  'Das beste Konzert deines Lebens?',
];

const SESSION_DURATION = 120;

export default function SpeedDatingPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('lobby');
  const [currentPersonIdx, setCurrentPersonIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [showMatch, setShowMatch] = useState(false);
  const [iceIdx, setIceIdx] = useState(0);
  const [rating, setRating] = useState('');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [waitTimer, setWaitTimer] = useState(5);

  const currentPerson = PEOPLE[currentPersonIdx];
  const totalSessions = PEOPLE.length;

  const goNext = useCallback((liked: boolean) => {
    const person = PEOPLE[currentPersonIdx];
    const mutualMatch = liked && Math.random() > 0.5;
    setResults(prev => [...prev, { person, liked, mutualMatch, rating }]);
    if (mutualMatch) {
      setShowMatch(true);
      setTimeout(() => {
        setShowMatch(false);
        if (currentPersonIdx + 1 < PEOPLE.length) {
          setScreen('between');
          setCurrentPersonIdx(i => i + 1);
        } else {
          setScreen('results');
        }
      }, 2500);
    } else {
      if (currentPersonIdx + 1 < PEOPLE.length) {
        setScreen('between');
        setCurrentPersonIdx(i => i + 1);
      } else {
        setScreen('results');
      }
    }
    setRating('');
    setTimeLeft(SESSION_DURATION);
  }, [currentPersonIdx, rating]);

  useEffect(() => {
    if (screen !== 'session') return;
    if (timeLeft <= 0) { goNext(false); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, timeLeft, goNext]);

  useEffect(() => {
    if (screen !== 'waiting') return;
    if (waitTimer <= 0) { setScreen('session'); return; }
    const t = setTimeout(() => setWaitTimer(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, waitTimer]);

  const timerPct = (timeLeft / SESSION_DURATION) * 100;
  const timerColor = timeLeft > 60 ? '#22c55e' : timeLeft > 30 ? '#f59e0b' : '#ef4444';
  const matchCount = results.filter(r => r.mutualMatch).length;

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <AnimatePresence mode="wait">
        {screen === 'lobby' && (
          <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 pb-28">
            <div className="px-5 pt-12 pb-4 flex items-center justify-between">
              <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
              <h1 className="text-white font-black text-lg">⚡ Speed Dating</h1>
              <div className="w-9" />
            </div>

            {/* Next session countdown */}
            <div className="mx-5 mb-4 p-4 card-glass rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-white/50 text-xs">Nächste Session startet in</p>
                <p className="text-white font-black text-2xl gradient-text">4:32</p>
              </div>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-4xl">⚡</motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 mb-4">
              {['Live Räume', 'Geplant', 'Meine Sessions'].map((t, i) => (
                <button key={t} className={`flex-1 py-2 rounded-xl text-xs font-semibold ${i === 0 ? 'gradient-brand text-white' : 'bg-white/5 text-white/40'}`}>{t}</button>
              ))}
            </div>

            {/* Rooms */}
            <div className="px-5 space-y-3">
              {ROOMS.map((room, i) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 280, damping: 24 }}
                  className={`card-glass rounded-2xl p-4 bg-gradient-to-r ${room.color} border border-white/10`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{room.emoji}</span>
                      <div>
                        <p className="text-white font-bold">{room.theme}</p>
                        <p className="text-white/50 text-xs">Host: {room.host}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-white/60 text-xs"><Clock size={10} />{room.timeLeft}</div>
                      <div className="flex items-center gap-1 text-white/60 text-xs mt-0.5"><Users size={10} />{room.participants}/{room.maxSlots}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(room.participants / room.maxSlots) * 100}%` }} transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }} className="h-full gradient-brand rounded-full" />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      onClick={() => { setWaitTimer(5); setScreen('waiting'); }}
                      disabled={room.participants >= room.maxSlots}
                      className="gradient-brand text-white text-xs font-bold px-4 py-2 rounded-xl glow-button disabled:opacity-40 flex items-center gap-1"
                    >
                      Beitreten <ChevronRight size={12} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {screen === 'waiting' && (
          <motion.div key="waiting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 rounded-full border-4 border-purple-500/30 border-t-purple-500 mb-6" />
            <h2 className="text-white text-2xl font-black mb-2">Warte auf andere…</h2>
            <p className="text-white/50 text-sm mb-4">Session startet in</p>
            <motion.div key={waitTimer} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl font-black gradient-text">{waitTimer}</motion.div>
            <p className="text-white/40 text-xs mt-4">24 Personen warten</p>
          </motion.div>
        )}

        {screen === 'session' && currentPerson && (
          <motion.div key="session" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="flex-1 flex flex-col">
            {/* Timer bar */}
            <div className="h-1.5 bg-white/10 w-full">
              <motion.div animate={{ width: `${timerPct}%` }} transition={{ duration: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: timerColor }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-white/50 text-sm">{currentPersonIdx + 1} / {totalSessions}</div>
              <motion.div key={timeLeft} animate={timeLeft <= 10 ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }} className="font-mono font-bold text-lg" style={{ color: timerColor }}>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</motion.div>
              <div className="flex gap-2">
                <button onClick={() => setMicOn(p => !p)} className={`w-8 h-8 rounded-full flex items-center justify-center ${micOn ? 'bg-white/10' : 'bg-red-500/30'}`}>{micOn ? <Mic size={14} className="text-white/60" /> : <MicOff size={14} className="text-red-400" />}</button>
                <button onClick={() => setCamOn(p => !p)} className={`w-8 h-8 rounded-full flex items-center justify-center ${camOn ? 'bg-white/10' : 'bg-red-500/30'}`}>{camOn ? <Video size={14} className="text-white/60" /> : <VideoOff size={14} className="text-red-400" />}</button>
              </div>
            </div>

            {/* Video area */}
            <div className="relative mx-4 rounded-3xl overflow-hidden" style={{ height: 320 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-brand-dark" />
              <img src={`https://picsum.photos/seed/${currentPerson.seed}/400/500`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-xl">{currentPerson.name}, {currentPerson.age}</p>
                <p className="text-white/70 text-sm">{currentPerson.job} · {currentPerson.city}</p>
                <p className="text-white/50 text-xs mt-1">💡 {currentPerson.funFact}</p>
              </div>
              {/* Self preview */}
              <div className="absolute top-3 right-3 w-24 h-16 rounded-xl overflow-hidden border-2 border-white/20 bg-brand-dark">
                <div className="w-full h-full bg-gradient-to-br from-purple-800 to-brand-card flex items-center justify-center">
                  <span className="text-2xl">😊</span>
                </div>
              </div>
            </div>

            {/* Ice breaker */}
            <motion.div key={iceIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mt-3 p-3 card-glass rounded-2xl flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💬</span>
              <div className="flex-1">
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Gesprächsstarter</p>
                <p className="text-white/90 text-sm">{ICE_BREAKERS[iceIdx % ICE_BREAKERS.length]}</p>
              </div>
              <button onClick={() => setIceIdx(p => p + 1)} className="text-purple-400 text-xs font-semibold flex-shrink-0">Neu</button>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-6 mt-4 px-4">
              <motion.button whileTap={{ scale: 0.86 }} onClick={() => goNext(false)} className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-red-400">
                <X size={28} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.86 }} onClick={() => {}} className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-blue-400">
                <Star size={20} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.86 }} onClick={() => goNext(true)} className="w-16 h-16 rounded-full gradient-brand glow-button flex items-center justify-center text-white">
                <Heart size={28} />
              </motion.button>
            </div>

            {/* Match overlay */}
            <AnimatePresence>
              {showMatch && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
                  <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-black gradient-text">Match!</h2>
                    <p className="text-white/60 mt-2">Du und {currentPerson?.name} habt euch gemocht!</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {screen === 'between' && currentPerson && (
          <motion.div key="between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
            <div className="text-5xl">⭐</div>
            <h2 className="text-white font-black text-xl">Wie war das Date?</h2>
            <div className="flex gap-4">
              {['😐', '😊', '😄', '🔥', '❤️'].map(e => (
                <motion.button key={e} whileTap={{ scale: 0.85 }} onClick={() => { setRating(e); setTimeout(() => { setScreen('session'); setTimeLeft(SESSION_DURATION); }, 300); }}
                  animate={{ scale: rating === e ? 1.2 : 1 }}
                  className={`text-3xl p-2 rounded-2xl transition-colors ${rating === e ? 'bg-purple-500/30' : 'bg-white/5'}`}
                >{e}</motion.button>
              ))}
            </div>
            <p className="text-white/40 text-xs">Weiter zu {currentPerson.name}</p>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { setScreen('session'); setTimeLeft(SESSION_DURATION); }} className="gradient-brand text-white font-bold px-8 py-3 rounded-2xl glow-button">Nächstes Date →</motion.button>
          </motion.div>
        )}

        {screen === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 pb-28 overflow-y-auto">
            <div className="px-5 pt-12 text-center mb-6">
              <div className="text-5xl mb-3">🎊</div>
              <h1 className="text-white font-black text-2xl gradient-text mb-1">Session beendet!</h1>
              <p className="text-white/50 text-sm">{totalSessions} Dates · {matchCount} Matches · {results.filter(r => r.liked).length} Likes</p>
            </div>

            {matchCount > 0 && (
              <div className="px-5 mb-6">
                <h2 className="text-white font-bold mb-3">💘 Deine Matches heute</h2>
                <div className="space-y-3">
                  {results.filter(r => r.mutualMatch).map(r => (
                    <motion.div key={r.person.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 card-glass rounded-2xl p-4">
                      <img src={`https://picsum.photos/seed/${r.person.seed}/100/100`} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <p className="text-white font-bold">{r.person.name}, {r.person.age}</p>
                        <p className="text-white/50 text-sm">{r.person.job} · {r.person.city}</p>
                      </div>
                      <button onClick={() => router.push('/matches')} className="gradient-brand text-white text-xs font-bold px-3 py-2 rounded-xl">Hallo sagen</button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-5 grid grid-cols-3 gap-3 mb-6">
              {[{ label: 'Dates', value: totalSessions, emoji: '💬' }, { label: 'Likes', value: results.filter(r => r.liked).length, emoji: '❤️' }, { label: 'Matches', value: matchCount, emoji: '🎉' }].map(s => (
                <div key={s.label} className="card-glass rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-white font-black text-2xl">{s.value}</div>
                  <div className="text-white/40 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="px-5 space-y-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setScreen('lobby'); setResults([]); setCurrentPersonIdx(0); }} className="w-full gradient-brand text-white font-bold py-4 rounded-2xl glow-button">Neue Session starten</motion.button>
              <button onClick={() => router.push('/matches')} className="w-full bg-white/10 border border-white/15 text-white/70 font-medium py-3 rounded-2xl">Zu meinen Matches</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
