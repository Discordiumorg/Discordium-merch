'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Heart, MessageCircle, Star, Eye, Zap, Crown, Shield, Check, type LucideIcon } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

interface NotifSetting {
  id: string;
  category: string;
  label: string;
  description: string;
  enabled: boolean;
  push: boolean;
  email: boolean;
  icon: LucideIcon;
  color: string;
}

const PillToggle = ({ value, onChange, small }: { value: boolean; onChange: () => void; small?: boolean }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={e => { e.stopPropagation(); onChange(); }}
    className={`${small ? 'w-10 h-5' : 'w-12 h-6'} rounded-full relative transition-colors flex-shrink-0 ${value ? 'bg-purple-500' : 'bg-white/15'}`}
  >
    <motion.div
      animate={{ x: value ? (small ? 18 : 24) : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`absolute top-1 ${small ? 'w-3 h-3' : 'w-4 h-4'} bg-white rounded-full shadow-sm`}
    />
  </motion.button>
);

const INITIAL_SETTINGS: NotifSetting[] = [
  { id: 'new_match', category: 'Matches & Likes', label: 'Neuer Match', description: 'Wenn du mit jemandem matchst', enabled: true, push: true, email: false, icon: Heart, color: 'text-pink-400' },
  { id: 'new_like', category: 'Matches & Likes', label: 'Neuer Like', description: 'Jemand hat dein Profil geliked', enabled: true, push: true, email: false, icon: Heart, color: 'text-pink-400' },
  { id: 'super_like', category: 'Matches & Likes', label: 'Super-Like erhalten', description: 'Jemand hat dir einen Super-Like geschickt', enabled: true, push: true, email: true, icon: Star, color: 'text-blue-400' },
  { id: 'new_message', category: 'Nachrichten', label: 'Neue Nachricht', description: 'Wenn du eine neue Nachricht erhältst', enabled: true, push: true, email: false, icon: MessageCircle, color: 'text-green-400' },
  { id: 'message_request', category: 'Nachrichten', label: 'Nachrichtenanfrage', description: 'Jemand möchte dir schreiben', enabled: true, push: true, email: false, icon: MessageCircle, color: 'text-green-400' },
  { id: 'profile_view', category: 'Profil & Aktivität', label: 'Profilbesuch', description: 'Jemand hat dein Profil besucht', enabled: false, push: false, email: false, icon: Eye, color: 'text-purple-400' },
  { id: 'boost_running', category: 'Profil & Aktivität', label: 'Boost aktiv', description: 'Erinnerung wenn dein Boost läuft', enabled: true, push: true, email: false, icon: Zap, color: 'text-yellow-400' },
  { id: 'boost_ended', category: 'Profil & Aktivität', label: 'Boost beendet', description: 'Wenn dein Boost ausgelaufen ist', enabled: true, push: true, email: false, icon: Zap, color: 'text-yellow-400' },
  { id: 'live_started', category: 'Live & Events', label: 'Match geht live', description: 'Wenn ein Match einen Stream startet', enabled: true, push: true, email: false, icon: Bell, color: 'text-red-400' },
  { id: 'event_reminder', category: 'Live & Events', label: 'Event-Erinnerung', description: '1 Stunde vor einem Event', enabled: true, push: true, email: true, icon: Bell, color: 'text-red-400' },
  { id: 'premium_offer', category: 'Angebote', label: 'Premium-Angebote', description: 'Exklusive Rabatte und Aktionen', enabled: false, push: false, email: true, icon: Crown, color: 'text-yellow-400' },
  { id: 'security_alert', category: 'Sicherheit', label: 'Sicherheitsalert', description: 'Neuer Login oder verdächtige Aktivität', enabled: true, push: true, email: true, icon: Shield, color: 'text-green-400' },
];

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotifSetting[]>(INITIAL_SETTINGS);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string, field: 'enabled' | 'push' | 'email') => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, [field]: !s[field as keyof NotifSetting] } : s));
  };

  const toggleAllCategory = (category: string, value: boolean) => {
    setSettings(prev => prev.map(s => s.category === category ? { ...s, enabled: value, push: value } : s));
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const categories = [...new Set(settings.map(s => s.category))];

  const categoryIcons: Record<string, string> = {
    'Matches & Likes': '❤️',
    'Nachrichten': '💬',
    'Profil & Aktivität': '👁️',
    'Live & Events': '🎥',
    'Angebote': '🎁',
    'Sicherheit': '🔐',
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-purple-400" />
            <h1 className="text-white font-black text-xl">Benachrichtigungen</h1>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Global toggle */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-2xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0"><Bell size={18} className="text-white" /></div>
            <div className="flex-1">
              <p className="text-white font-bold">Alle Benachrichtigungen</p>
              <p className="text-white/40 text-xs">Push-Benachrichtigungen global an/aus</p>
            </div>
            <PillToggle value={settings.some(s => s.enabled)} onChange={() => { const anyOn = settings.some(s => s.enabled); setSettings(prev => prev.map(s => ({ ...s, enabled: !anyOn, push: !anyOn }))); }} />
          </div>
        </motion.div>

        {/* Category sections */}
        {categories.map((category, ci) => {
          const items = settings.filter(s => s.category === category);
          const allOn = items.every(s => s.enabled);
          return (
            <motion.div key={category} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.07 }} className="card-glass rounded-2xl overflow-hidden border border-white/8">
              {/* Category header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/3">
                <div className="flex items-center gap-2">
                  <span>{categoryIcons[category] || '🔔'}</span>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{category}</p>
                </div>
                <button onClick={() => toggleAllCategory(category, !allOn)} className="text-purple-400 text-xs font-semibold">{allOn ? 'Alle aus' : 'Alle an'}</button>
              </div>

              {/* Items */}
              <div className="divide-y divide-white/5">
                {items.map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="px-4 py-3">
                      <div className="flex items-start gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon size={14} className={item.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-white font-semibold text-sm">{item.label}</p>
                            <PillToggle value={item.enabled} onChange={() => toggle(item.id, 'enabled')} />
                          </div>
                          <p className="text-white/40 text-xs mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      {item.enabled && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-11 flex items-center gap-4 overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <PillToggle value={item.push} onChange={() => toggle(item.id, 'push')} small />
                            <span className="text-white/40 text-xs">Push</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <PillToggle value={item.email} onChange={() => toggle(item.id, 'email')} small />
                            <span className="text-white/40 text-xs">E-Mail</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Quiet hours */}
        <div className="card-glass rounded-2xl p-4 border border-white/8">
          <p className="text-white font-bold text-sm mb-3">🌙 Ruhige Stunden</p>
          <p className="text-white/50 text-xs mb-3">Keine Benachrichtigungen während dieser Zeit</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-brand-surface border border-white/10 rounded-xl px-3 py-2.5 text-white/60 text-sm text-center">22:00</div>
            <span className="text-white/30 text-sm">bis</span>
            <div className="flex-1 bg-brand-surface border border-white/10 rounded-xl px-3 py-2.5 text-white/60 text-sm text-center">08:00</div>
            <PillToggle value={true} onChange={() => {}} />
          </div>
        </div>

        {/* Save button */}
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} onClick={save} className="w-full gradient-brand text-white font-bold py-4 rounded-2xl glow-button flex items-center justify-center gap-2">
          {saved ? <><Check size={18} /> Gespeichert!</> : <><Bell size={18} /> Einstellungen speichern</>}
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
