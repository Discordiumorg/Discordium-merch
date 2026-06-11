'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Sparkles, Crown, RotateCcw } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

interface Message {
  id: string;
  role: 'user' | 'coach';
  text: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  'Wie schreibe ich die erste Nachricht?',
  'Was tun bei Match, der nicht antwortet?',
  'Wie mache ich mein Profil attraktiver?',
  'Tipps fürs erste Date?',
  'Wie erkenne ich echtes Interesse?',
  'Wie starte ich schwierige Gespräche?',
];

const COACH_RESPONSES: Record<string, string> = {
  erste: 'Die erste Nachricht sollte persönlich und spielerisch sein! Beziehe dich auf etwas Konkretes aus dem Profil — ein Foto, einen Hobbyhinweis oder eine Aussage in der Bio. Frage etwas Offenes, das zum Erzählen einlädt. Beispiel: "Dein Foto aus Kyoto sieht unglaublich aus — warst du auf dem berühmten Bambus-Pfad? Ich wollte schon immer mal nach Japan!" 🌸',
  antwortet: 'Wenn ein Match nicht antwortet, warte 2–3 Tage und sende dann eine einzige lockere Follow-up-Nachricht. Etwas wie: "Hey, ich wollte mich nochmal melden — hast du dieses Wochenende was Spannendes erlebt?" Wenn dann immer noch keine Antwort kommt, lass es los. Nicht jede Verbindung klappt — und das ist okay! 💪',
  profil: 'Für ein Top-Profil brauchst du: 1. Ein lächelndes Hauptfoto mit gutem Licht 📸, 2. Mindestens 4 verschiedene Fotos (Solo, Hobby, Sozial, Natur), 3. Eine Bio die ZEIGT statt ERZÄHLT — also keine Liste von Eigenschaften, sondern eine kleine Geschichte oder einen Witz. Und füge konkrete Interessen ein, die Gesprächseinstieg bieten.',
  date: 'Beim ersten Date gilt: Halte es kurz (1-2h) und entspannt — Kaffee oder Spaziergang ist perfekt. Bereite 3 interessante Gesprächsthemen vor, aber erzwinge nichts. Höre mehr zu als du redest. Frage nach ihren/seinen Träumen, Erlebnissen, Leidenschaften. Sei pünktlich, aber entspannt. Und: Schreib danach innerhalb von 24h eine kurze nette Nachricht! ✨',
  interesse: 'Echtes Interesse erkennst du an: langen ausführlichen Antworten, Gegenfragen, das Aufgreifen von Details die du vorher genannt hast, Emojis die zu deiner Aussage passen, und dem Initiieren von Gesprächen. Wenn du dagegen nur kurze Ein-Wort-Antworten bekommst und du immer zuerst schreibst — dann fehlt der Funke leider. 🔍',
  schwierig: 'Schwierige Gespräche — z.B. über Erwartungen, Exes oder Interessen die sich unterscheiden — sollte man offen und ohne Vorwürfe führen. Nutze "Ich"-Aussagen: "Ich merke, dass mir X wichtig ist" statt "Du machst immer Y". Sei neugierig, nicht defensiv. Und: Das richtige Timing zählt — nie im Stress oder kurz vor dem Schlafengehen. 🤝',
  default: 'Das ist eine super Frage! Als dein persönlicher Dating-Coach empfehle ich dir: Sei authentisch und zeige echtes Interesse. Dating ist eine Mischung aus Mut, Geduld und Selbstbewusstsein. Was genau beschäftigt dich gerade am meisten? Ich helfe dir konkret! 💡',
};

const TOPIC_SUGGESTIONS = [
  { emoji: '💬', title: 'Nachrichtenspiele', desc: 'Wann & wie schreiben' },
  { emoji: '📸', title: 'Profil-Tipps', desc: 'Fotos & Bio optimieren' },
  { emoji: '❤️', title: 'Erstes Date', desc: 'Vorbereitung & Ideen' },
  { emoji: '🧠', title: 'Körpersprache', desc: 'Signale lesen & senden' },
  { emoji: '💔', title: 'Umgang mit Absagen', desc: 'Resilienz aufbauen' },
  { emoji: '✨', title: 'Authentizität', desc: 'Echte Verbindungen schaffen' },
];

function getCoachReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('erste') || lower.includes('nachricht') || lower.includes('schreib')) return COACH_RESPONSES.erste;
  if (lower.includes('antwortet') || lower.includes('antwort') || lower.includes('ghosting')) return COACH_RESPONSES.antwortet;
  if (lower.includes('profil') || lower.includes('foto') || lower.includes('bio')) return COACH_RESPONSES.profil;
  if (lower.includes('date') || lower.includes('treffen') || lower.includes('tipp')) return COACH_RESPONSES.date;
  if (lower.includes('interesse') || lower.includes('erkennen') || lower.includes('fühlt')) return COACH_RESPONSES.interesse;
  if (lower.includes('schwierig') || lower.includes('gespräch') || lower.includes('konflikt')) return COACH_RESPONSES.schwierig;
  return COACH_RESPONSES.default;
}

export default function CoachPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'coach',
      text: 'Hey! 👋 Ich bin Aura, dein persönlicher Dating-Coach. Ich helfe dir dabei, bessere Matches zu finden, interessante Gespräche zu führen und dein Profil zu optimieren. Was beschäftigt dich gerade?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setShowTopics(false);

    setTimeout(() => {
      setTyping(false);
      const reply = getCoachReply(text);
      const coachMsg: Message = { id: (Date.now() + 1).toString(), role: 'coach', text: reply, timestamp: new Date() };
      setMessages(prev => [...prev, coachMsg]);
    }, 1400);
  };

  const reset = () => {
    setMessages([{
      id: '0',
      role: 'coach',
      text: 'Hey! 👋 Ich bin Aura, dein persönlicher Dating-Coach. Ich helfe dir dabei, bessere Matches zu finden, interessante Gespräche zu führen und dein Profil zu optimieren. Was beschäftigt dich gerade?',
      timestamp: new Date(),
    }]);
    setShowTopics(true);
  };

  const formatTime = (d: Date) => d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <div className="w-10 h-10 gradient-brand rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-base">Aura Coach</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-white/40 text-xs">KI-Dating-Coach · Immer verfügbar</p>
            </div>
          </div>
          <button onClick={reset} className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
            <RotateCcw size={15} />
          </button>
        </div>
        {/* Premium hint */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-3 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2">
          <Crown size={12} className="text-yellow-400 flex-shrink-0" />
          <span className="text-yellow-300 text-xs">Unbegrenzte Nachrichten mit Premium Gold — <button className="underline" onClick={() => router.push('/premium')}>Upgraden</button></span>
        </motion.div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {msg.role === 'coach' && (
                <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center flex-shrink-0 self-end">
                  <Sparkles size={13} className="text-white" />
                </div>
              )}
              <div className={`max-w-[82%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'gradient-brand text-white rounded-br-sm'
                    : 'card-glass text-white/85 rounded-bl-sm border border-white/8'
                }`}>
                  {msg.text}
                </div>
                <span className="text-white/25 text-[10px] px-1">{formatTime(msg.timestamp)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
              <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={13} className="text-white" />
              </div>
              <div className="card-glass border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [-3, 3, -3] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Topic suggestions */}
        <AnimatePresence>
          {showTopics && messages.length <= 1 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <p className="text-white/40 text-xs text-center">Oder wähle ein Thema</p>
              <div className="grid grid-cols-2 gap-2">
                {TOPIC_SUGGESTIONS.map((topic, i) => (
                  <motion.button
                    key={topic.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage(topic.title)}
                    className="card-glass rounded-xl p-3 text-left border border-white/8 hover:border-purple-500/30 transition-colors"
                  >
                    <span className="text-xl">{topic.emoji}</span>
                    <p className="text-white font-semibold text-xs mt-1">{topic.title}</p>
                    <p className="text-white/40 text-[10px]">{topic.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {!typing && (
        <div className="px-5 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {QUICK_QUESTIONS.map(q => (
              <motion.button key={q} whileTap={{ scale: 0.95 }} onClick={() => sendMessage(q)} className="flex-shrink-0 text-xs bg-white/8 border border-white/10 text-white/60 px-3 py-2 rounded-full hover:border-purple-500/30 hover:text-white/80 transition-all">
                {q}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-5 pb-2">
        <div className="flex items-end gap-2 card-glass border border-white/10 rounded-2xl px-4 py-3 focus-within:border-purple-500/40 transition-colors">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Frage deinen Coach…"
            rows={1}
            className="flex-1 bg-transparent text-white text-sm placeholder:text-white/25 focus:outline-none resize-none leading-relaxed"
            style={{ maxHeight: '96px' }}
          />
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
          >
            <Send size={15} className="text-white" />
          </motion.button>
        </div>
        <p className="text-white/20 text-[10px] text-center mt-2">KI-generierte Ratschläge · Kein Ersatz für professionelle Beratung</p>
      </div>

      <BottomNav />
    </div>
  );
}
