'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Phone, MapPin, Clock, Plus, ChevronRight, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  emoji: string;
}

interface DatePlan {
  who: string;
  where: string;
  when: string;
  checkInMins: number;
}

const DEFAULT_CONTACTS: TrustedContact[] = [
  { id: 'c1', name: 'Sarah (Sister)', phone: '+49 151 1234 5678', emoji: '👩' },
  { id: 'c2', name: 'Mike (Friend)', phone: '+49 170 9876 5432', emoji: '👨' },
];

export default function SafeDatePage() {
  const router = useRouter();
  const [step, setStep] = useState<'plan' | 'active' | 'done'>('plan');
  const [plan, setPlan] = useState<DatePlan>({ who: '', where: '', when: '', checkInMins: 60 });
  const [contacts] = useState<TrustedContact[]>(DEFAULT_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<string>('c1');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSOS, setShowSOS] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startCheckIn = () => {
    setStep('active');
    const secs = plan.checkInMins * 60;
    setTimeLeft(secs);
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleCheckIn = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStep('done');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = step === 'active' ? (timeLeft / (plan.checkInMins * 60)) : 1;
  const contact = contacts.find((c) => c.id === selectedContact);

  return (
    <div className="min-h-screen bg-brand-dark pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-9 h-9 card-glass rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-green-400" />
          <h1 className="text-white font-black text-xl">Safe Date</h1>
        </div>
      </div>

      <div className="px-5 pb-32 pt-6">
        <AnimatePresence mode="wait">
          {step === 'plan' && (
            <motion.div key="plan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Intro */}
              <div className="card-glass rounded-3xl p-5 mb-6 border border-green-500/20">
                <div className="flex gap-3 items-start">
                  <div className="text-3xl">🛡️</div>
                  <div>
                    <p className="text-white font-bold mb-1">Stay safe on your date</p>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Share your date details with a trusted contact. They'll receive an automatic alert if you don't check in on time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">Who are you meeting?</label>
                  <input
                    value={plan.who}
                    onChange={(e) => setPlan({ ...plan, who: e.target.value })}
                    placeholder="e.g. Emma from Aura"
                    className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                    <MapPin size={11} /> Location
                  </label>
                  <input
                    value={plan.where}
                    onChange={(e) => setPlan({ ...plan, where: e.target.value })}
                    placeholder="e.g. Café Mitte, Rosenthaler Str. 40"
                    className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                    <Clock size={11} /> When?
                  </label>
                  <input
                    type="datetime-local"
                    value={plan.when}
                    onChange={(e) => setPlan({ ...plan, when: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">Check-in reminder</label>
                  <div className="flex gap-2">
                    {[30, 60, 90, 120].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setPlan({ ...plan, checkInMins: mins })}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          plan.checkInMins === mins ? 'gradient-brand text-white' : 'card-glass text-white/50'
                        }`}
                      >
                        {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trusted contact */}
              <div className="mb-8">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3 block">Alert contact if I don't check in</label>
                <div className="space-y-2">
                  {contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedContact(c.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                        selectedContact === c.id ? 'border-green-500/50 bg-green-500/10' : 'border-white/10 card-glass'
                      }`}
                    >
                      <span className="text-2xl">{c.emoji}</span>
                      <div className="flex-1 text-left">
                        <p className="text-white font-semibold text-sm">{c.name}</p>
                        <p className="text-white/40 text-xs">{c.phone}</p>
                      </div>
                      {selectedContact === c.id && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}

                  <button
                    onClick={() => setShowAddContact(true)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-dashed border-white/15 text-white/40 hover:border-white/30 transition-colors"
                  >
                    <Plus size={18} />
                    <span className="text-sm">Add trusted contact</span>
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={startCheckIn}
                disabled={!plan.who || !plan.where}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 ${
                  plan.who && plan.where
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                <Shield size={20} />
                Start Safe Date Mode
              </motion.button>
            </motion.div>
          )}

          {step === 'active' && (
            <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-32 h-32 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-6"
              >
                <Shield size={48} className="text-green-400" />
              </motion.div>

              <h2 className="text-white font-black text-2xl mb-2">Safe Date Active</h2>
              <p className="text-white/50 text-sm mb-6">
                {contact?.name} will be notified if you don't check in
              </p>

              <div className="card-glass rounded-3xl p-6 mb-6 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Meeting</p>
                    <p className="text-white text-sm font-semibold">{plan.who}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <MapPin size={14} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Location</p>
                    <p className="text-white text-sm font-semibold">{plan.where}</p>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="card-glass rounded-3xl p-6 mb-8">
                <p className="text-white/40 text-xs mb-3">Check-in required in</p>
                <p className="text-5xl font-black text-white mb-2 font-mono">{formatTime(timeLeft)}</p>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSOS(true)}
                  className="flex-1 py-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  SOS
                </button>
                <button
                  onClick={handleCheckIn}
                  className="flex-2 flex-grow py-4 rounded-2xl bg-green-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                >
                  <Check size={20} />
                  I'm Safe — Check In
                </button>
              </div>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-16">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: 2, duration: 0.4 }}
                className="text-7xl mb-6"
              >
                ✅
              </motion.div>
              <h2 className="text-white font-black text-3xl mb-2">Checked In!</h2>
              <p className="text-white/50 text-base mb-2">
                {contact?.name} has been notified you're safe.
              </p>
              <p className="text-white/30 text-sm mb-10">Stay safe out there! 💚</p>
              <button
                onClick={() => { setStep('plan'); setPlan({ who: '', where: '', when: '', checkInMins: 60 }); }}
                className="gradient-brand text-white font-bold px-10 py-4 rounded-2xl flex items-center gap-2 mx-auto"
              >
                <ChevronRight size={18} />
                Plan Another Date
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SOS overlay */}
      <AnimatePresence>
        {showSOS && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setShowSOS(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-red-950 border border-red-500/30 rounded-t-3xl px-5 pt-5 pb-10">
              <div className="w-10 h-1 bg-red-500/40 rounded-full mx-auto mb-5" />
              <h3 className="text-red-400 font-black text-xl text-center mb-2">Emergency</h3>
              <p className="text-red-300/60 text-sm text-center mb-6">This will immediately alert your contact and share your location.</p>
              <button className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-lg flex items-center justify-center gap-3 mb-3">
                <Phone size={22} fill="white" />
                Send SOS Alert Now
              </button>
              <button onClick={() => setShowSOS(false)} className="w-full py-3 text-red-400/60 text-sm font-semibold">
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add contact sheet */}
      <AnimatePresence>
        {showAddContact && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddContact(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-brand-card border border-white/10 rounded-t-3xl px-5 pt-5 pb-10">
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <h3 className="text-white font-black text-lg mb-5">Add Trusted Contact</h3>
              <div className="space-y-3 mb-5">
                <input placeholder="Name" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none" />
                <input placeholder="Phone number" type="tel" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none" />
              </div>
              <button onClick={() => setShowAddContact(false)} className="w-full py-3.5 rounded-2xl gradient-brand text-white font-bold">
                Add Contact
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
