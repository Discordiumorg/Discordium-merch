'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Search, Sparkles } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ChatWindow from '@/components/ChatWindow';
import { mockMatches, mockVisitors, Match, formatRelativeTime } from '@/lib/mockData';

export default function MatchesPage() {
  const [activeChat, setActiveChat] = useState<Match | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'matches' | 'new'>('matches');
  const [matches, setMatches] = useState(mockMatches);

  const unreadMatches = matches.filter((m) => m.unreadCount > 0).length;
  const newVisitors = mockVisitors.filter((v) => Date.now() - v.visitedAt.getTime() < 86400000).length;

  // New matches (no messages yet - simulate some)
  const newMatchUsers = [
    {
      id: 'nm1',
      photoSeed: 'newmatch1',
      name: 'Anna',
      age: 24,
      matchedAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: 'nm2',
      photoSeed: 'newmatch2',
      name: 'David',
      age: 29,
      matchedAt: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: 'nm3',
      photoSeed: 'newmatch3',
      name: 'Zoe',
      age: 26,
      matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
  ];

  const filteredMatches = matches.filter((m) =>
    m.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenChat = (match: Match) => {
    // Mark as read
    setMatches((prev) =>
      prev.map((m) => (m.id === match.id ? { ...m, unreadCount: 0 } : m))
    );
    setActiveChat(match);
  };

  const lastMessage = (match: Match) => {
    if (match.messages.length === 0) return null;
    return match.messages[match.messages.length - 1];
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10">
        <div className="px-5 pt-12 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white font-black text-xl">Messages</h1>
            {unreadMatches > 0 && (
              <span className="gradient-brand text-white text-xs font-bold px-3 py-1 rounded-full">
                {unreadMatches} new
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-3">
            {(['matches', 'new'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? 'gradient-brand text-white shadow-lg'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab === 'matches' ? `💬 Chats (${matches.length})` : `✨ New (${newMatchUsers.length})`}
              </button>
            ))}
          </div>

          {/* Search - only show for chats tab */}
          {activeTab === 'matches' && (
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      <div className="pb-28">
        <AnimatePresence mode="wait">
          {activeTab === 'new' ? (
            <motion.div
              key="new"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-5 py-4"
            >
              <p className="text-white/50 text-xs mb-4">People who liked you back — say hi!</p>
              <div className="space-y-3">
                {newMatchUsers.map((nm, i) => (
                  <motion.div
                    key={nm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-4 p-4 card-glass rounded-2xl"
                  >
                    <div className="relative">
                      <img
                        src={`https://picsum.photos/seed/${nm.photoSeed}/200/200`}
                        alt={nm.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 gradient-brand rounded-full flex items-center justify-center">
                        <Heart size={12} className="text-white" fill="white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{nm.name}, {nm.age}</p>
                      <p className="text-white/50 text-xs mt-0.5">
                        Matched {formatRelativeTime(nm.matchedAt)}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Sparkles size={10} className="text-yellow-400" />
                        <span className="text-yellow-400/80 text-[10px]">New match! Break the ice 👋</span>
                      </div>
                    </div>
                    <button className="gradient-brand text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                      Say Hi
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {filteredMatches.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {filteredMatches.map((match, i) => {
                    const last = lastMessage(match);
                    return (
                      <motion.button
                        key={match.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => handleOpenChat(match)}
                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left"
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={match.user.photos[0]}
                            alt={match.user.name}
                            className={`w-14 h-14 rounded-2xl object-cover ${
                              match.unreadCount > 0 ? 'ring-2 ring-purple-500' : ''
                            }`}
                          />
                          {match.user.online && (
                            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-brand-dark" />
                          )}
                          {match.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 gradient-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                              {match.unreadCount}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className={`font-semibold text-base ${match.unreadCount > 0 ? 'text-white' : 'text-white/80'}`}>
                              {match.user.name}
                            </span>
                            <span className="text-white/30 text-xs flex-shrink-0">
                              {last ? formatRelativeTime(last.timestamp) : formatRelativeTime(match.matchedAt)}
                            </span>
                          </div>

                          <p className={`text-sm truncate ${
                            match.unreadCount > 0 ? 'text-white/80 font-medium' : 'text-white/40'
                          }`}>
                            {last ? (
                              <>
                                {last.senderId === 'me' && (
                                  <span className="text-white/30">You: </span>
                                )}
                                {last.text}
                              </>
                            ) : (
                              <span className="text-purple-400/80 italic">New match! Say hello 👋</span>
                            )}
                          </p>
                        </div>

                        {/* Unread dot */}
                        {match.unreadCount > 0 && (
                          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full flex-shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  {searchQuery ? (
                    <>
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-white/60">No matches found for &quot;{searchQuery}&quot;</p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 gradient-brand/20 border border-purple-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <MessageCircle size={36} className="text-purple-400" />
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">No matches yet</h3>
                      <p className="text-white/50 text-sm leading-relaxed">
                        Keep swiping to find your match! When you both like each other, you&apos;ll appear here.
                      </p>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav matchCount={unreadMatches} visitorCount={newVisitors} />

      {/* Chat Window */}
      <AnimatePresence>
        {activeChat && (
          <ChatWindow
            match={activeChat}
            onClose={() => setActiveChat(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
