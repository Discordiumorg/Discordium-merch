'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Minus, List, MapPin, MessageCircle, Heart, Users } from 'lucide-react';
import { mockUsers, mockMatches, mockVisitors, goalColors, goalEmojis } from '@/lib/mockData';
import BottomNav from '@/components/BottomNav';

// Fixed positions for user avatars on the map (percentage-based)
const userPositions = [
  { userId: 'u1', x: 25, y: 30, distance: '0.8 km' },
  { userId: 'u2', x: 70, y: 20, distance: '1.2 km' },
  { userId: 'u3', x: 60, y: 55, distance: '2.1 km' },
  { userId: 'u4', x: 15, y: 65, distance: '3.5 km' },
  { userId: 'u5', x: 80, y: 70, distance: '4.2 km' },
  { userId: 'u6', x: 40, y: 15, distance: '5.0 km' },
  { userId: 'u7', x: 85, y: 40, distance: '6.3 km' },
  { userId: 'u8', x: 30, y: 80, distance: '8.1 km' },
];

export default function RadarPage() {
  const router = useRouter();
  const [radius, setRadius] = useState(10);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [goalFilter, setGoalFilter] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const unreadMatches = mockMatches.filter((m) => m.unreadCount > 0).length;

  const visiblePositions = userPositions.filter((pos) => {
    const user = mockUsers.find((u) => u.id === pos.userId);
    if (!user) return false;
    const distNum = parseFloat(pos.distance);
    if (distNum > radius) return false;
    if (onlineOnly && !user.online) return false;
    if (goalFilter && user.relationshipGoal !== goalFilter) return false;
    return true;
  });

  const onlineCount = visiblePositions.filter((pos) => {
    const user = mockUsers.find((u) => u.id === pos.userId);
    return user?.online;
  }).length;

  const selectedUserData = selectedUser
    ? mockUsers.find((u) => u.id === selectedUser)
    : null;
  const selectedPos = selectedUser
    ? userPositions.find((p) => p.userId === selectedUser)
    : null;

  const goals = ['serious', 'casual', 'friends+', 'open relationship'];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <h1 className="text-white font-black text-xl">Radar</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                viewMode === 'list' ? 'gradient-brand text-white' : 'card-glass text-white/60'
              }`}
            >
              <List size={14} />
              {viewMode === 'map' ? 'Liste' : 'Karte'}
            </button>
          </div>
        </div>

        {/* Info bar — total nearby users */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2 px-1"
        >
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-purple-400" />
            <span className="text-white/70 text-xs font-semibold">
              <span className="text-white font-bold">{visiblePositions.length}</span> Personen in der Nähe
            </span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-white/60 text-xs">
              <span className="text-green-400 font-bold">{onlineCount}</span> online
            </span>
          </div>
        </motion.div>

        {/* Radius Slider */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white/60 text-xs font-medium">Suchradius</span>
            <span className="text-purple-400 text-xs font-bold">{radius} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full accent-purple-500 h-1.5"
          />
          <div className="flex justify-between text-white/30 text-[9px] mt-0.5">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setOnlineOnly(!onlineOnly)}
            className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
              onlineOnly
                ? 'bg-green-500/30 text-green-300 border border-green-500/40'
                : 'card-glass text-white/50'
            }`}
          >
            🟢 Online
          </button>
          {goals.map((goal) => (
            <button
              key={goal}
              onClick={() => setGoalFilter(goalFilter === goal ? null : goal)}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors capitalize ${
                goalFilter === goal
                  ? goalColors[goal as keyof typeof goalColors] + ' border border-current'
                  : 'card-glass text-white/50'
              }`}
            >
              {goalEmojis[goal as keyof typeof goalEmojis]} {goal}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full"
              style={{ height: 'calc(100vh - 260px)' }}
              onClick={() => setSelectedUser(null)}
            >
              {/* Dark map background */}
              <div className="absolute inset-0 bg-[#0f172a]">
                {/* Grid lines simulating streets */}
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="bigGrid" width="120" height="120" patternUnits="userSpaceOnUse">
                      <rect width="120" height="120" fill="url(#grid)"/>
                      <path d="M 120 0 L 0 0 0 120" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#bigGrid)" />
                </svg>

                {/* Fake street highlights */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-[35%] left-0 right-0 h-px bg-white" />
                  <div className="absolute top-[60%] left-0 right-0 h-px bg-white" />
                  <div className="absolute left-[30%] top-0 bottom-0 w-px bg-white" />
                  <div className="absolute left-[65%] top-0 bottom-0 w-px bg-white" />
                </div>
              </div>

              {/* Radius ring */}
              <div
                className="absolute border-2 border-purple-500/20 rounded-full pointer-events-none"
                style={{
                  width: `${Math.min(radius * 8, 85)}%`,
                  aspectRatio: '1',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'width 0.3s ease',
                }}
              />

              {/* Your location — center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                {/* Animated pulse rings */}
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      inset: `-${i * 14}px`,
                      border: `${i <= 2 ? 2 : 1}px solid rgba(96, 165, 250, ${0.4 - i * 0.08})`,
                      background: i === 1 ? 'rgba(59,130,246,0.06)' : 'transparent',
                    }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5, ease: 'easeInOut' }}
                  />
                ))}
                <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg shadow-blue-500/50 flex items-center justify-center relative z-10">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <p className="text-white text-[9px] font-bold text-center mt-1 bg-blue-500/80 backdrop-blur-sm rounded-full px-2 py-0.5 relative z-10">
                  Du
                </p>
              </div>

              {/* User avatars */}
              {visiblePositions.map((pos, i) => {
                const user = mockUsers.find((u) => u.id === pos.userId);
                if (!user) return null;
                return (
                  <motion.button
                    key={pos.userId}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 350, damping: 22 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(selectedUser === pos.userId ? null : pos.userId);
                    }}
                    className="absolute z-20 flex flex-col items-center"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className={`relative w-11 h-11 rounded-full overflow-hidden border-2 shadow-lg ${
                      user.online ? 'border-green-400' : 'border-white/40'
                    } ${selectedUser === pos.userId ? 'border-purple-400 scale-110' : ''}`}>
                      <img src={user.photos[0]} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    {user.online && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0f172a]" />
                    )}
                    <p className="text-white text-[9px] font-bold mt-0.5 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 whitespace-nowrap">
                      {pos.distance}
                    </p>
                  </motion.button>
                );
              })}

              {/* Zoom buttons */}
              <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-20">
                <button
                  onClick={() => setRadius((r) => Math.min(50, r + 5))}
                  className="w-9 h-9 card-glass rounded-xl flex items-center justify-center text-white/80 hover:text-white border border-white/20"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => setRadius((r) => Math.max(1, r - 5))}
                  className="w-9 h-9 card-glass rounded-xl flex items-center justify-center text-white/80 hover:text-white border border-white/20"
                >
                  <Minus size={16} />
                </button>
              </div>

              {/* User count */}
              <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5">
                <p className="text-white text-xs font-semibold">
                  {visiblePositions.length} {visiblePositions.length === 1 ? 'Person' : 'Personen'} in der Nähe
                </p>
              </div>

              {/* User popup */}
              <AnimatePresence>
                {selectedUser && selectedUserData && selectedPos && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 10 }}
                    className="absolute z-30 bg-brand-card border border-white/20 rounded-2xl p-3 shadow-2xl min-w-[200px]"
                    style={{
                      left: `${Math.min(selectedPos.x, 65)}%`,
                      top: `${Math.max(selectedPos.y - 40, 5)}%`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <img
                          src={selectedUserData.photos[0]}
                          alt={selectedUserData.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        {selectedUserData.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-brand-card" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{selectedUserData.name}, {selectedUserData.age}</p>
                        <p className="text-white/50 text-xs flex items-center gap-1">
                          <MapPin size={10} />
                          {selectedPos.distance}
                        </p>
                        {selectedUserData.online ? (
                          <p className="text-green-400 text-[10px] font-semibold mt-0.5">● Jetzt online</p>
                        ) : selectedUserData.lastSeen ? (
                          <p className="text-white/40 text-[10px] mt-0.5">Zuletzt online: {selectedUserData.lastSeen}</p>
                        ) : null}
                        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border mt-1 ${goalColors[selectedUserData.relationshipGoal]}`}>
                          {goalEmojis[selectedUserData.relationshipGoal]}
                          {selectedUserData.relationshipGoal}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-pink-500/20 text-pink-400 text-xs font-bold border border-pink-500/30"
                      >
                        <Heart size={13} fill="currentColor" />
                        Mag ich
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.push('/matches')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl gradient-brand text-white text-xs font-bold"
                      >
                        <MessageCircle size={13} />
                        Nachricht
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 pb-28 pt-4 overflow-y-auto space-y-3"
              style={{ maxHeight: 'calc(100vh - 260px)' }}
            >
              {visiblePositions.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📡</div>
                  <p className="text-white/60 font-medium">Niemand in der Nähe</p>
                  <p className="text-white/30 text-sm mt-1">Versuche, deinen Suchradius zu vergrößern</p>
                </div>
              ) : (
                visiblePositions.map((pos, i) => {
                  const user = mockUsers.find((u) => u.id === pos.userId);
                  if (!user) return null;
                  return (
                    <motion.div
                      key={pos.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
                      className="flex items-center gap-4 p-4 card-glass rounded-2xl"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={user.photos[0]}
                          alt={user.name}
                          className="w-14 h-14 rounded-2xl object-cover"
                        />
                        {user.online && (
                          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-brand-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white font-semibold">{user.name}, {user.age}</span>
                          {user.verified && <span className="text-blue-400 text-xs">✓</span>}
                        </div>
                        <p className="text-white/50 text-xs flex items-center gap-1 mb-1">
                          <MapPin size={10} />
                          {pos.distance}
                        </p>
                        {/* Zuletzt online indicator */}
                        {user.online ? (
                          <p className="text-green-400 text-[10px] font-semibold mb-1">● Jetzt online</p>
                        ) : user.lastSeen ? (
                          <p className="text-white/35 text-[10px] mb-1">Zuletzt online: {user.lastSeen}</p>
                        ) : null}
                        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full border ${goalColors[user.relationshipGoal]}`}>
                          {goalEmojis[user.relationshipGoal]}
                          {user.relationshipGoal}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center"
                        >
                          <Heart size={15} className="text-pink-400" fill="currentColor" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => router.push('/matches')}
                          className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center"
                        >
                          <MessageCircle size={15} className="text-white" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav matchCount={mockMatches.filter((m) => m.unreadCount > 0).length} />
    </div>
  );
}
