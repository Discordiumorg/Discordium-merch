'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Flag, MessageCircle, ThumbsUp, SkipForward, Settings2 } from 'lucide-react';

type MeetState = 'idle' | 'searching' | 'connected';

interface ConnectedUser {
  name: string;
  age: number;
  city: string;
  distance: string;
  photoSeed: string;
  interests: string[];
}

const interestFilters = ['Chatten', 'Dating', 'Freundschaft', '18+'];

const mockConnectedUser: ConnectedUser = {
  name: 'Laura',
  age: 25,
  city: 'Berlin',
  distance: '4 km entfernt',
  photoSeed: 'laura_meet1',
  interests: ['Musik', 'Kaffee', 'Reisen', 'Wandern', 'Fotografie'],
};

const myInterests = ['Kaffee', 'Reisen', 'Fotografie', 'Technik', 'Wandern'];

export default function MeetPage() {
  const router = useRouter();
  const [state, setState] = useState<MeetState>('idle');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Chatten', 'Dating']);
  const [onlineCount, setOnlineCount] = useState(2847);
  const [showPrefs, setShowPrefs] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(40);
  const [maxDist, setMaxDist] = useState(50);
  const [connectedUser, setConnectedUser] = useState<ConnectedUser | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [matchGameCount] = useState(3);

  // Langsam die Online-Anzahl erhöhen
  useEffect(() => {
    const t = setInterval(() => {
      setOnlineCount((c) => c + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Nach 3 Sekunden automatisch verbinden
  useEffect(() => {
    if (state === 'searching') {
      const t = setTimeout(() => {
        setConnectedUser(mockConnectedUser);
        setState('connected');
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [state]);

  const toggleFilter = (f: string) => {
    setSelectedFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const sharedInterests = connectedUser
    ? connectedUser.interests.filter((i) => myInterests.includes(i))
    : [];

  return (
    <div className="fixed inset-0 bg-brand-dark flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 z-10">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-white font-black text-lg">Jemanden kennenlernen</h1>
        <button
          onClick={() => setShowPrefs(true)}
          className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <Settings2 size={16} />
        </button>
      </div>

      {/* Online counter */}
      <div className="flex justify-center mb-2">
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-2 bg-green-500/15 border border-green-500/30 px-4 py-1.5 rounded-full"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-green-300 text-xs font-semibold">
            {onlineCount.toLocaleString('de-DE')} Personen gerade online
          </span>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {/* ── IDLE ── */}
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center"
            >
              {/* Pulsierender Hauptbutton */}
              <div className="relative mb-8">
                {/* Äußere Wellenringe */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-purple-500/30"
                    animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.4,
                      delay: i * 0.8,
                      ease: 'easeOut',
                    }}
                    style={{ margin: '-20px' }}
                  />
                ))}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setState('searching')}
                  className="relative w-44 h-44 rounded-full flex flex-col items-center justify-center shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                    boxShadow: '0 0 60px rgba(124,58,237,0.5)',
                  }}
                >
                  <span className="text-4xl mb-1">✨</span>
                  <span className="text-white font-black text-base leading-tight text-center px-4">
                    Jetzt kennenlernen
                  </span>
                </motion.button>
              </div>

              <p className="text-white/50 text-sm text-center mb-8">
                Verbinde dich mit einer zufälligen Person in deiner Nähe
              </p>

              {/* Interessenfilter */}
              <div className="flex gap-2 flex-wrap justify-center mb-8">
                {interestFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      selectedFilters.includes(f)
                        ? 'gradient-brand text-white border-transparent'
                        : 'bg-white/10 border-white/20 text-white/60 hover:border-white/40'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setState('searching')}
                className="w-full gradient-brand text-white font-black py-4 rounded-2xl text-lg shadow-lg"
                style={{ boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
              >
                Kennenlernen starten ⚡
              </motion.button>
            </motion.div>
          )}

          {/* ── SUCHE ── */}
          {state === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex flex-col items-center"
            >
              {/* Radar-Animation */}
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                {/* Wellenringe */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border border-purple-400/40"
                    style={{ width: `${(i + 1) * 50}px`, height: `${(i + 1) * 50}px` }}
                    animate={{ scale: [0.8, 1.2], opacity: [0.6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: i * 0.5,
                      ease: 'easeOut',
                    }}
                  />
                ))}
                {/* Radar-Sweep */}
                <motion.div
                  className="absolute w-24 h-24"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  style={{ transformOrigin: 'bottom center' }}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 270deg, rgba(124,58,237,0.8) 360deg)',
                    }}
                  />
                </motion.div>
                {/* Mittelpunkt */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="w-8 h-8 rounded-full gradient-brand z-10 flex items-center justify-center shadow-lg"
                >
                  <span className="text-white text-xs font-bold">ICH</span>
                </motion.div>
              </div>

              <h2 className="text-white font-black text-2xl mb-2">Suche nach jemandem...</h2>
              <p className="text-white/50 text-sm mb-10">Ein Match in deiner Nähe wird gesucht</p>

              <button
                onClick={() => setState('idle')}
                className="flex items-center gap-2 text-white/60 bg-white/10 border border-white/20 px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-white/15 transition-colors"
              >
                <X size={16} /> Abbrechen
              </button>
            </motion.div>
          )}

          {/* ── VERBUNDEN ── */}
          {state === 'connected' && connectedUser && (
            <motion.div
              key="connected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              {/* Match-Enthüllung */}
              <motion.h2
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-3xl font-black gradient-text mb-6"
              >
                Ein Match! 🎉
              </motion.h2>

              {/* Geteilte Avatare */}
              <div className="flex items-center gap-4 mb-6 w-full justify-center">
                {/* Du */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
                    <img
                      src="https://picsum.photos/seed/alex1/200/200"
                      alt="Du"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white/70 text-xs font-semibold">Du</span>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-4xl"
                >
                  ❤️
                </motion.div>

                {/* Gematchte Person */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-500 shadow-lg">
                    <img
                      src={`https://picsum.photos/seed/${connectedUser.photoSeed}/200/200`}
                      alt={connectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white/70 text-xs font-semibold">{connectedUser.name}</span>
                </motion.div>
              </div>

              {/* Nutzerinfo */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full card-glass rounded-2xl p-4 mb-5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-bold text-lg">
                      {connectedUser.name}, {connectedUser.age}
                    </p>
                    <p className="text-white/50 text-sm">
                      {connectedUser.city} · {connectedUser.distance}
                    </p>
                  </div>
                  <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30">
                    Gerade online
                  </span>
                </div>

                {sharedInterests.length > 0 && (
                  <div>
                    <p className="text-white/50 text-xs mb-2">
                      {sharedInterests.length} gemeinsame Interessen 🎯
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {connectedUser.interests.map((interest) => (
                        <span
                          key={interest}
                          className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                            sharedInterests.includes(interest)
                              ? 'bg-purple-500/30 border-purple-500/50 text-purple-200'
                              : 'bg-white/10 border-white/15 text-white/50'
                          }`}
                        >
                          {interest}
                          {sharedInterests.includes(interest) && ' ✓'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Aktionen */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full space-y-3"
              >
                <button
                  onClick={() => router.push('/matches')}
                  className="w-full gradient-brand text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
                  style={{ boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
                >
                  <MessageCircle size={20} />
                  Chat starten
                </button>

                <div className="flex gap-3">
                  <button className="flex-1 bg-green-500/20 border border-green-500/30 text-green-300 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500/30 transition-colors">
                    <ThumbsUp size={18} />
                    Profil liken
                  </button>
                  <button
                    onClick={() => {
                      setConnectedUser(null);
                      setState('searching');
                    }}
                    className="flex-1 bg-white/10 border border-white/20 text-white/70 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/15 transition-colors"
                  >
                    <SkipForward size={18} />
                    Überspringen
                  </button>
                </div>

                <button
                  onClick={() => setShowReport(true)}
                  className="w-full text-red-400/70 text-sm font-medium flex items-center justify-center gap-1.5 hover:text-red-400 transition-colors py-1"
                >
                  <Flag size={14} /> Melden
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Einstellungen Modal */}
      <AnimatePresence>
        {showPrefs && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowPrefs(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-brand-card rounded-t-3xl z-50"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>
              <div className="px-5 pb-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-bold text-lg">Einstellungen</h2>
                  <button
                    onClick={() => setShowPrefs(false)}
                    className="text-white/40 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-semibold text-sm">Altersbereich</span>
                      <span className="text-purple-400 text-sm font-medium">{minAge} – {maxAge}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-white/40 text-xs">Mindestalter</label>
                        <input
                          type="range"
                          min="18"
                          max={maxAge - 1}
                          value={minAge}
                          onChange={(e) => setMinAge(parseInt(e.target.value))}
                          className="w-full accent-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs">Höchstalter</label>
                        <input
                          type="range"
                          min={minAge + 1}
                          max="80"
                          value={maxAge}
                          onChange={(e) => setMaxAge(parseInt(e.target.value))}
                          className="w-full accent-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-semibold text-sm">Max. Entfernung</span>
                      <span className="text-purple-400 text-sm font-medium">{maxDist} km</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={maxDist}
                      onChange={(e) => setMaxDist(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <span className="text-white font-semibold text-sm block mb-3">Ich bin hier für</span>
                    <div className="flex flex-wrap gap-2">
                      {interestFilters.map((f) => (
                        <button
                          key={f}
                          onClick={() => toggleFilter(f)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                            selectedFilters.includes(f)
                              ? 'gradient-brand text-white border-transparent'
                              : 'bg-white/10 border-white/20 text-white/60'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowPrefs(false)}
                  className="w-full gradient-brand text-white font-bold py-4 rounded-2xl mt-6"
                >
                  Einstellungen speichern
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Melden Toast */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2"
            onClick={() => setShowReport(false)}
          >
            🚩 Meldung eingereicht. Danke!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match-Spielstand */}
      {matchGameCount > 0 && (
        <div className="px-5 pb-6">
          <div className="card-glass rounded-2xl px-4 py-2.5 flex items-center justify-between border border-purple-500/20">
            <span className="text-white/60 text-xs">Aus dem Match-Spiel</span>
            <span className="text-purple-300 text-xs font-bold">{matchGameCount} neue Matches 🎉</span>
          </div>
        </div>
      )}
    </div>
  );
}
