'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, TrendingUp } from 'lucide-react';

interface PollOption {
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: [PollOption, PollOption];
  askedBy: { name: string; photoSeed: string };
  reactions: { emoji: string; count: number }[];
  commentCount: number;
  votedIndex: number | null;
}

interface MyPoll {
  id: string;
  question: string;
  options: [PollOption, PollOption];
  createdAt: string;
}

const initialForYouPolls: Poll[] = [
  {
    id: 'p1',
    question: 'Kaffee-Date oder Dinner-Date beim ersten Treffen? ☕🍽️',
    options: [
      { text: '☕ Kaffee-Date', votes: 142 },
      { text: '🍽️ Dinner-Date', votes: 98 },
    ],
    askedBy: { name: 'Sophie', photoSeed: 'sophie1' },
    reactions: [
      { emoji: '❤️', count: 34 },
      { emoji: '😂', count: 8 },
      { emoji: '🔥', count: 21 },
      { emoji: '🤔', count: 5 },
    ],
    commentCount: 12,
    votedIndex: null,
  },
  {
    id: 'p2',
    question: 'Lieber: jemand Lustiges oder jemand Erfolgreiches? 😂💼',
    options: [
      { text: '😂 Lustig', votes: 211 },
      { text: '💼 Erfolgreich', votes: 87 },
    ],
    askedBy: { name: 'Marcus', photoSeed: 'marcus1' },
    reactions: [
      { emoji: '❤️', count: 19 },
      { emoji: '😂', count: 45 },
      { emoji: '🔥', count: 12 },
      { emoji: '🤔', count: 28 },
    ],
    commentCount: 31,
    votedIndex: null,
  },
  {
    id: 'p3',
    question: 'Strandurlaub oder Städtetrip? 🏖️🏙️',
    options: [
      { text: '🏖️ Strand', votes: 178 },
      { text: '🏙️ Stadt', votes: 134 },
    ],
    askedBy: { name: 'Julia', photoSeed: 'julia1' },
    reactions: [
      { emoji: '❤️', count: 27 },
      { emoji: '😂', count: 4 },
      { emoji: '🔥', count: 38 },
      { emoji: '🤔', count: 9 },
    ],
    commentCount: 8,
    votedIndex: null,
  },
  {
    id: 'p4',
    question: 'Netflix zuhause oder ausgehen? 🍿🎉',
    options: [
      { text: '🍿 Netflix', votes: 204 },
      { text: '🎉 Ausgehen', votes: 119 },
    ],
    askedBy: { name: 'Elena', photoSeed: 'elena1' },
    reactions: [
      { emoji: '❤️', count: 41 },
      { emoji: '😂', count: 15 },
      { emoji: '🔥', count: 9 },
      { emoji: '🤔', count: 7 },
    ],
    commentCount: 22,
    votedIndex: null,
  },
  {
    id: 'p5',
    question: 'Schreiben oder Anrufen? 📱📞',
    options: [
      { text: '📱 Schreiben', votes: 287 },
      { text: '📞 Anrufen', votes: 63 },
    ],
    askedBy: { name: 'Kai', photoSeed: 'kai1' },
    reactions: [
      { emoji: '❤️', count: 11 },
      { emoji: '😂', count: 22 },
      { emoji: '🔥', count: 6 },
      { emoji: '🤔', count: 33 },
    ],
    commentCount: 47,
    votedIndex: null,
  },
  {
    id: 'p6',
    question: 'Frühaufsteher oder Nachteule? 🌅🦉',
    options: [
      { text: '🌅 Frühaufsteher', votes: 99 },
      { text: '🦉 Nachteule', votes: 231 },
    ],
    askedBy: { name: 'Lena', photoSeed: 'lena1' },
    reactions: [
      { emoji: '❤️', count: 18 },
      { emoji: '😂', count: 29 },
      { emoji: '🔥', count: 14 },
      { emoji: '🤔', count: 3 },
    ],
    commentCount: 17,
    votedIndex: null,
  },
  {
    id: 'p7',
    question: 'Spontane oder geplante Dates? ⚡📅',
    options: [
      { text: '⚡ Spontan', votes: 163 },
      { text: '📅 Geplant', votes: 142 },
    ],
    askedBy: { name: 'Tom', photoSeed: 'tom1' },
    reactions: [
      { emoji: '❤️', count: 36 },
      { emoji: '😂', count: 7 },
      { emoji: '🔥', count: 41 },
      { emoji: '🤔', count: 11 },
    ],
    commentCount: 9,
    votedIndex: null,
  },
  {
    id: 'p8',
    question: 'Haustiere oder lieber nicht? 🐶🚫',
    options: [
      { text: '🐶 Ja, Haustiere!', votes: 318 },
      { text: '🚫 Keine Haustiere', votes: 44 },
    ],
    askedBy: { name: 'Mia', photoSeed: 'mia1' },
    reactions: [
      { emoji: '❤️', count: 88 },
      { emoji: '😂', count: 12 },
      { emoji: '🔥', count: 24 },
      { emoji: '🤔', count: 2 },
    ],
    commentCount: 55,
    votedIndex: null,
  },
];

const initialMyPolls: MyPoll[] = [
  {
    id: 'mp1',
    question: 'Wandern oder Radfahren beim ersten Abenteuer zu zweit?',
    options: [
      { text: '🥾 Wandern', votes: 27 },
      { text: '🚴 Radfahren', votes: 18 },
    ],
    createdAt: 'vor 2 Tagen',
  },
  {
    id: 'mp2',
    question: 'Erstes Date: zuhause kochen oder Restaurant?',
    options: [
      { text: '🍳 Zuhause kochen', votes: 34 },
      { text: '🍽️ Restaurant', votes: 41 },
    ],
    createdAt: 'vor 5 Tagen',
  },
];

export default function PollsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'foryou' | 'mypolls'>('foryou');
  const [polls, setPolls] = useState<Poll[]>(initialForYouPolls);
  const [myPolls, setMyPolls] = useState<MyPoll[]>(initialMyPolls);
  const [reactedPolls, setReactedPolls] = useState<Record<string, string>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');
  const [createToast, setCreateToast] = useState(false);
  const [springVoteMap, setSpringVoteMap] = useState<Record<string, number>>({});

  const handleVote = (pollId: string, optionIndex: number) => {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId || p.votedIndex !== null) return p;
        const newOptions = p.options.map((o, i) =>
          i === optionIndex ? { ...o, votes: o.votes + 1 } : o
        ) as [PollOption, PollOption];
        return { ...p, options: newOptions, votedIndex: optionIndex };
      })
    );
    // trigger spring animation for vote count
    setSpringVoteMap((prev) => ({ ...prev, [`${pollId}-${optionIndex}`]: Date.now() }));
  };

  const handleReact = (pollId: string, emoji: string) => {
    if (reactedPolls[pollId]) return;
    setReactedPolls((prev) => ({ ...prev, [pollId]: emoji }));
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId) return p;
        const newReactions = p.reactions.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r
        );
        return { ...p, reactions: newReactions };
      })
    );
  };

  const handleCreatePoll = () => {
    if (!newQuestion.trim() || !newOpt1.trim() || !newOpt2.trim()) return;
    const newPoll: MyPoll = {
      id: `mp${Date.now()}`,
      question: newQuestion.trim(),
      options: [
        { text: newOpt1.trim(), votes: 0 },
        { text: newOpt2.trim(), votes: 0 },
      ],
      createdAt: 'Gerade eben',
    };
    setMyPolls((prev) => [newPoll, ...prev]);
    setNewQuestion('');
    setNewOpt1('');
    setNewOpt2('');
    setShowCreateModal(false);
    setCreateToast(true);
    setTimeout(() => setCreateToast(false), 2500);
  };

  const getTotalVotes = (p: Poll | MyPoll) => p.options[0].votes + p.options[1].votes;

  const getPct = (votes: number, total: number) =>
    total === 0 ? 0 : Math.round((votes / total) * 100);

  // Find the poll with most total votes — that one gets the "trending" badge
  const trendingId = polls.reduce((best, p) =>
    getTotalVotes(p) > getTotalVotes(polls.find((x) => x.id === best) || polls[0])
      ? p.id
      : best
  , polls[0]?.id ?? '');

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-white font-black text-xl flex-1">Umfragen &amp; Fragen 🗳️</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {(['foryou', 'mypolls'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'gradient-brand text-white shadow-lg'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab === 'foryou' ? '🗳️ Für dich' : '📋 Meine Umfragen'}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-8 px-4 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'foryou' ? (
            <motion.div
              key="foryou"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {polls.map((poll, i) => {
                const total = getTotalVotes(poll);
                const hasVoted = poll.votedIndex !== null;
                const isTrending = poll.id === trendingId;
                return (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="card-glass rounded-2xl p-4 border border-white/10 relative overflow-hidden"
                  >
                    {/* Trending badge */}
                    {isTrending && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 + 0.2 }}
                        className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(234,179,8,0.3))',
                          border: '1px solid rgba(249,115,22,0.5)',
                          color: '#fb923c',
                        }}
                      >
                        <TrendingUp size={9} />
                        Trending
                      </motion.div>
                    )}

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={`https://picsum.photos/seed/${poll.askedBy.photoSeed}/100/100`}
                        alt={poll.askedBy.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white/60 text-xs">
                        Von <span className="text-white/90 font-semibold">{poll.askedBy.name}</span>
                      </span>
                    </div>

                    {/* Question */}
                    <p className="text-white font-bold text-base mb-4 leading-snug pr-16">
                      {poll.question}
                    </p>

                    {/* Options */}
                    <div className="flex gap-3 mb-4">
                      {poll.options.map((opt, idx) => {
                        const pct = getPct(opt.votes, total);
                        const springKey = springVoteMap[`${poll.id}-${idx}`];
                        return (
                          <button
                            key={idx}
                            onClick={() => handleVote(poll.id, idx)}
                            disabled={hasVoted}
                            className={`flex-1 rounded-xl overflow-hidden transition-all ${
                              hasVoted ? 'cursor-default' : 'hover:opacity-90 active:scale-95'
                            }`}
                          >
                            {hasVoted ? (
                              <div className="relative p-3 bg-white/5 border border-white/10 rounded-xl">
                                {/* Animated result bar */}
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.05 * idx }}
                                  className={`absolute inset-0 rounded-xl ${
                                    poll.votedIndex === idx
                                      ? 'bg-gradient-to-r from-purple-600/40 to-pink-500/40'
                                      : 'bg-white/5'
                                  }`}
                                />
                                <div className="relative z-10">
                                  <p className="text-white text-xs font-semibold leading-tight mb-1">
                                    {opt.text}
                                  </p>
                                  <motion.p
                                    key={springKey}
                                    initial={springKey ? { scale: 1.4, color: '#c084fc' } : { scale: 1 }}
                                    animate={{ scale: 1, color: '#ffffff' }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                                    className="font-black text-lg"
                                  >
                                    {pct}%
                                  </motion.p>
                                  <p className="text-white/40 text-[10px]">{opt.votes} Stimmen</p>
                                </div>
                                {poll.votedIndex === idx && (
                                  <span className="absolute top-2 right-2 text-purple-400 text-xs font-bold">✓</span>
                                )}
                              </div>
                            ) : (
                              <div className="p-3 border-2 border-white/20 rounded-xl bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all">
                                <p className="text-white text-sm font-semibold leading-tight">{opt.text}</p>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Reactions + comments */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex gap-2">
                        {poll.reactions.map((r) => {
                          const reacted = reactedPolls[poll.id] === r.emoji;
                          return (
                            <button
                              key={r.emoji}
                              onClick={() => handleReact(poll.id, r.emoji)}
                              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all ${
                                reacted
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                              }`}
                            >
                              <span>{r.emoji}</span>
                              <span className="font-semibold">{r.count}</span>
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-white/40 text-xs flex items-center gap-1">
                        💬 {poll.commentCount}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="mypolls"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Create button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
                className="w-full gradient-brand text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
                style={{ boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}
              >
                <Plus size={18} />
                Umfrage erstellen
              </motion.button>

              {myPolls.map((poll, i) => {
                const total = poll.options[0].votes + poll.options[1].votes;
                return (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card-glass rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-white font-bold text-base leading-snug flex-1 pr-4">
                        {poll.question}
                      </p>
                      <span className="text-white/30 text-xs flex-shrink-0">{poll.createdAt}</span>
                    </div>
                    <div className="space-y-2">
                      {poll.options.map((opt, idx) => {
                        const pct = getPct(opt.votes, total);
                        return (
                          <div key={idx} className="relative">
                            <div className="h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ delay: 0.3 + idx * 0.1, duration: 0.7, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-purple-600/50 to-pink-500/50 rounded-xl"
                              />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-between px-3">
                              <span className="text-white text-xs font-semibold">{opt.text}</span>
                              <span className="text-white font-bold text-sm">{pct}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-white/40 text-xs mt-3">{total} Stimmen insgesamt</p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Poll Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowCreateModal(false)}
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
                  <h2 className="text-white font-bold text-lg">Umfrage erstellen 🗳️</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-white/40 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                      Deine Frage
                    </label>
                    <textarea
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Was würdest du lieber..."
                      maxLength={150}
                      rows={2}
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                    <p className="text-white/30 text-xs text-right mt-1">{newQuestion.length}/150</p>
                  </div>

                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                      Option 1
                    </label>
                    <input
                      type="text"
                      value={newOpt1}
                      onChange={(e) => setNewOpt1(e.target.value)}
                      placeholder="Erste Option..."
                      maxLength={60}
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                      Option 2
                    </label>
                    <input
                      type="text"
                      value={newOpt2}
                      onChange={(e) => setNewOpt2(e.target.value)}
                      placeholder="Zweite Option..."
                      maxLength={60}
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <button
                    onClick={handleCreatePoll}
                    disabled={!newQuestion.trim() || !newOpt1.trim() || !newOpt2.trim()}
                    className={`w-full font-bold py-4 rounded-2xl transition-all ${
                      newQuestion.trim() && newOpt1.trim() && newOpt2.trim()
                        ? 'gradient-brand text-white hover:opacity-90'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    Umfrage veröffentlichen 🗳️
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create toast */}
      <AnimatePresence>
        {createToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-purple-600 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 pointer-events-none"
          >
            🗳️ Umfrage veröffentlicht! Stimmen werden gesammelt...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
