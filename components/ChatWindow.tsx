'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Smile, Flag } from 'lucide-react';
import { Match, Message, formatRelativeTime } from '@/lib/mockData';
import ReportModal from '@/components/ReportModal';

interface ChatWindowProps {
  match: Match;
  onClose: () => void;
}

const quickReplies = ['Hey! 👋', 'That sounds fun!', 'Tell me more 😊', 'When are you free?'];

const emojiPicker = ['😊', '❤️', '🔥', '✨', '😂', '🥰', '👍', '🎉'];

export default function ChatWindow({ match, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(match.messages);
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: messageText,
      timestamp: new Date(),
      read: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setShowEmojis(false);

    // Simulate typing + reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "That's so interesting! Tell me more 😊",
        "Haha I love that! We should meet up sometime",
        "Totally agree with you on that!",
        "You seem really fun to hang out with 🙌",
        "I was just thinking the same thing!",
        "Aww, you're sweet ❤️",
        "What are you up to this weekend?",
      ];
      const reply: Message = {
        id: `msg-reply-${Date.now()}`,
        senderId: match.user.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date(),
        read: true,
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    msgs.forEach((msg) => {
      const dateStr = msg.timestamp.toDateString();
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.date === dateStr) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ date: dateStr, messages: [msg] });
      }
    });
    return groups;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 max-w-md mx-auto bg-brand-dark flex flex-col z-50"
      onClick={() => showMenu && setShowMenu(false)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-brand-card/80 backdrop-blur-xl">
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="relative">
          <img
            src={match.user.photos[0]}
            alt={match.user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50"
          />
          {match.user.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-brand-card" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-white font-semibold text-base leading-tight">{match.user.name}</h3>
          <p className="text-white/50 text-xs">
            {match.user.online ? (
              <span className="text-green-400">Active now</span>
            ) : (
              match.user.lastSeen ? `Last seen ${match.user.lastSeen}` : 'Offline'
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <Phone size={18} />
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <Video size={18} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <MoreVertical size={18} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -5 }}
                  className="absolute top-10 right-0 bg-brand-card border border-white/15 rounded-xl overflow-hidden shadow-xl z-30 min-w-[160px]"
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowReport(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                  >
                    <Flag size={14} />
                    Nutzer melden
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Match banner */}
      <div className="px-4 py-3 gradient-brand/20 border-b border-purple-500/20 flex items-center justify-center gap-2">
        <span className="text-2xl">🎉</span>
        <div className="text-center">
          <p className="text-white font-semibold text-sm">You matched with {match.user.name}!</p>
          <p className="text-white/50 text-xs">{formatRelativeTime(match.matchedAt)}</p>
        </div>
        <span className="text-2xl">🎉</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-[10px] uppercase tracking-wider">
                {group.date === new Date().toDateString() ? 'Today' : group.date}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Messages in group */}
            <div className="space-y-2">
              {group.messages.map((msg, i) => {
                const isMe = msg.senderId === 'me';
                const isLast = i === group.messages.length - 1 ||
                  group.messages[i + 1]?.senderId !== msg.senderId;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && isLast && (
                      <img
                        src={match.user.photos[0]}
                        alt={match.user.name}
                        className="w-7 h-7 rounded-full object-cover mb-1 flex-shrink-0"
                      />
                    )}
                    {!isMe && !isLast && <div className="w-7 flex-shrink-0" />}

                    <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? 'gradient-brand text-white rounded-br-sm'
                            : 'bg-brand-card border border-white/10 text-white/90 rounded-bl-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      {isLast && (
                        <span className="text-white/30 text-[10px] px-1">
                          {formatTime(msg.timestamp)}
                          {isMe && <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-end gap-2"
            >
              <img
                src={match.user.photos[0]}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="bg-brand-card border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-white/50 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => sendMessage(reply)}
            className="whitespace-nowrap bg-brand-surface border border-white/15 text-white/70 text-xs px-3 py-1.5 rounded-full hover:border-purple-500/50 hover:text-white transition-colors flex-shrink-0"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 border-t border-white/10 flex gap-3 justify-center overflow-hidden"
          >
            {emojiPicker.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setInput((prev) => prev + emoji)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        userName={match.user.name}
      />

      {/* Input area */}
      <div className="px-4 py-3 border-t border-white/10 bg-brand-card/80 backdrop-blur flex items-center gap-2 pb-safe-bottom">
        <button
          onClick={() => setShowEmojis(!showEmojis)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            showEmojis ? 'text-purple-400 bg-purple-500/20' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Smile size={20} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${match.user.name}...`}
          className="flex-1 bg-brand-surface border border-white/15 rounded-2xl px-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => sendMessage()}
          disabled={!input.trim()}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            input.trim()
              ? 'gradient-brand text-white glow-purple shadow-lg'
              : 'bg-white/10 text-white/30'
          }`}
        >
          <Send size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
