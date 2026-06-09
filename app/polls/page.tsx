'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';

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
    question: 'Coffee date or dinner date for a first meeting? ☕🍽️',
    options: [
      { text: '☕ Coffee date', votes: 142 },
      { text: '🍽️ Dinner date', votes: 98 },
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
    question: 'Would you rather: someone funny or someone successful? 😂💼',
    options: [
      { text: '😂 Funny', votes: 211 },
      { text: '💼 Successful', votes: 87 },
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
    question: 'Beach vacation or city trip? 🏖️🏙️',
    options: [
      { text: '🏖️ Beach', votes: 178 },
      { text: '🏙️ City', votes: 134 },
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
    question: 'Netflix at home or going out? 🍿🎉',
    options: [
      { text: '🍿 Netflix', votes: 204 },
      { text: '🎉 Going out', votes: 119 },
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
    question: 'Text or call? 📱📞',
    options: [
      { text: '📱 Text', votes: 287 },
      { text: '📞 Call', votes: 63 },
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
    question: 'Morning person or night owl? 🌅🦉',
    options: [
      { text: '🌅 Morning person', votes: 99 },
      { text: '🦉 Night owl', votes: 231 },
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
    question: 'Spontaneous or planned dates? ⚡📅',
    options: [
      { text: '⚡ Spontaneous', votes: 163 },
      { text: '📅 Planned', votes: 142 },
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
    question: 'Pets or no pets? 🐶🚫',
    options: [
      { text: '🐶 Pets please!', votes: 318 },
      { text: '🚫 No pets', votes: 44 },
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
    question: 'Hiking or cycling on a first adventure together?',
    options: [
      { text: '🥾 Hiking', votes: 27 },
      { text: '🚴 Cycling', votes: 18 },
    ],
    createdAt: '2 days ago',
  },
  {
    id: 'mp2',
    question: 'First date: cook at home or restaurant?',
    options: [
      { text: '🍳 Cook at home', votes: 34 },
      { text: '🍽️ Restaurant', votes: 41 },
    ],
    createdAt: '5 days ago',
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
      createdAt: 'Just now',
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
          <h1 className="text-white font-black text-xl flex-1">Polls &amp; Questions 🗳️</h1>
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
              {tab === 'foryou' ? '🗳️ For You' : '📋 My Polls'}
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
                return (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="card-glass rounded-2xl p-4 border border-white/10"
                  >
                    {/* Author */}
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={`https://picsum.photos/seed/${poll.askedBy.photoSeed}/100/100`}
                        alt={poll.askedBy.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white/60 text-xs">
                        From <span className="text-white/90 font-semibold">{poll.askedBy.name}</span>
                      </span>
                    </div>

                    {/* Question */}
                    <p className="text-white font-bold text-base mb-4 leading-snug">
                      {poll.question}
                    </p>

                    {/* Options */}
                    <div className="flex gap-3 mb-4">
                      {poll.options.map((opt, idx) => {
                        const pct = getPct(opt.votes, total);
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
                                {/* Result bar */}
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.6, ease: 'easeOut' }}
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
                                  <p className="text-white font-black text-lg">{pct}%</p>
                                  <p className="text-white/40 text-[10px]">{opt.votes} votes</p>
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
                Create Poll
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
                    <p className="text-white/40 text-xs mt-3">{total} total votes</p>
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
                  <h2 className="text-white font-bold text-lg">Create a Poll 🗳️</h2>
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
                      Your Question
                    </label>
                    <textarea
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Would you rather..."
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
                      placeholder="First option..."
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
                      placeholder="Second option..."
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
                    Post Poll 🗳️
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
            🗳️ Poll posted! Collecting votes...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
