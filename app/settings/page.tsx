'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Bell,
  Shield,
  Globe,
  Eye,
  Moon,
  Type,
  Link as LinkIcon,
  FileText,
  HelpCircle,
  LogOut,
  Trash2,
  Download,
  MessageSquare,
  Star,
  MapPin,
  User,
  Mail,
  Lock,
  UserX,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useI18n, languageLabels, Language } from '@/lib/i18n';

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
        on ? 'bg-purple-600' : 'bg-white/20'
      }`}
    >
      <motion.div
        animate={{ x: on ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { t, lang, setLang } = useI18n();

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');

  // Load real user data on mount
  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name ?? '');
          setAge(data.user.age ? String(data.user.age) : '');
          setLocation(data.user.location ?? '');
        }
      })
      .catch(() => {});
  }, []);

  // Discovery
  const [distance, setDistance] = useState(50);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(45);
  const [showMe, setShowMe] = useState('everyone');
  const [incognito, setIncognito] = useState(false);
  const [globalMode, setGlobalMode] = useState(false);

  // Notifications
  const [notifNewMatch, setNotifNewMatch] = useState(true);
  const [notifMessage, setNotifMessage] = useState(true);
  const [notifLike, setNotifLike] = useState(true);
  const [notifSuperLike, setNotifSuperLike] = useState(true);
  const [notifVisitor, setNotifVisitor] = useState(false);
  const [notifPromo, setNotifPromo] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);

  // Privacy
  const [readReceipts, setReadReceipts] = useState(true);
  const [showOnline, setShowOnline] = useState(true);
  const [showDistance, setShowDistance] = useState(true);

  // Appearance
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Social links
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [spotify, setSpotify] = useState('');
  const [snapchat, setSnapchat] = useState('');
  const [xHandle, setXHandle] = useState('');

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), age: parseInt(age) || undefined, location: location.trim() }),
      });
      showSaved();
    } catch { /* silent */ } finally { setSaving(false); }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* cookie cleared server-side */ }
    router.push('/');
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="px-4 py-3 border-b border-white/10">
      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-dark pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <h1 className="text-white font-black text-xl">{t.settings.title}</h1>
          </div>
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-green-400 text-xs font-medium"
              >
                <Check size={14} />
                {t.settings.saved}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="pb-28 space-y-5 px-5 py-5">
        {/* ── Account ── */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <SectionTitle title={t.settings.account} />
          <div className="p-4 space-y-3">
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-1">Name</label>
              <div className="flex items-center gap-2">
                <User size={14} className="text-white/40 flex-shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-1">Alter</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={18}
                max={99}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-1">Standort</label>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-white/40 flex-shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
            <div className="pt-1 border-t border-white/10">
              <button className="w-full flex items-center gap-3 py-3 text-left hover:opacity-80 transition-opacity">
                <Mail size={16} className="text-white/40" />
                <span className="text-white/70 text-sm flex-1">E-Mail ändern</span>
                <ChevronRight size={14} className="text-white/30" />
              </button>
              <button className="w-full flex items-center gap-3 py-3 text-left hover:opacity-80 transition-opacity">
                <Lock size={16} className="text-white/40" />
                <span className="text-white/70 text-sm flex-1">Passwort ändern</span>
                <ChevronRight size={14} className="text-white/30" />
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={saveProfile}
              disabled={saving}
              className="w-full gradient-brand text-white font-bold py-3 rounded-xl text-sm disabled:opacity-60"
            >
              {saving ? '⏳ Speichern…' : t.settings.save}
            </motion.button>
          </div>
        </div>

        {/* ── Discovery ── */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <SectionTitle title={t.settings.discovery} />
          <div className="p-4 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-medium">Maximale Entfernung</p>
                <span className="text-purple-400 text-sm font-bold">{distance} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-medium">Altersbereich</p>
                <span className="text-purple-400 text-sm font-bold">{minAge}–{maxAge}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-white/40 text-xs">Minimum ({minAge})</label>
                  <input
                    type="range"
                    min={18}
                    max={maxAge - 1}
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs">Maximum ({maxAge})</label>
                  <input
                    type="range"
                    min={minAge + 1}
                    max={65}
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-white text-sm font-medium mb-2">Zeige mir</p>
              <div className="relative">
                <select
                  value={showMe}
                  onChange={(e) => setShowMe(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 pr-8"
                >
                  <option value="everyone" className="bg-brand-card">Alle</option>
                  <option value="women" className="bg-brand-card">Frauen</option>
                  <option value="men" className="bg-brand-card">Männer</option>
                  <option value="non-binary" className="bg-brand-card">Non-binary</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Inkognito-Modus</p>
                  <p className="text-white/40 text-xs mt-0.5">Nur sichtbar für Personen, die du geliked hast</p>
                </div>
                <ToggleSwitch on={incognito} onChange={() => setIncognito(!incognito)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Globaler Modus</p>
                  <p className="text-white/40 text-xs mt-0.5">Profile aus aller Welt entdecken</p>
                </div>
                <ToggleSwitch on={globalMode} onChange={() => setGlobalMode(!globalMode)} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Notifications ── */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <SectionTitle title={t.settings.notifications} />
          <div className="p-4 space-y-4">
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Push</p>
            {[
              { label: 'Neues Match', on: notifNewMatch, toggle: () => setNotifNewMatch(!notifNewMatch) },
              { label: 'Neue Nachricht', on: notifMessage, toggle: () => setNotifMessage(!notifMessage) },
              { label: 'Profillike', on: notifLike, toggle: () => setNotifLike(!notifLike) },
              { label: 'Super Like', on: notifSuperLike, toggle: () => setNotifSuperLike(!notifSuperLike) },
              { label: 'Profilbesucher', on: notifVisitor, toggle: () => setNotifVisitor(!notifVisitor) },
              { label: 'Angebote & News', on: notifPromo, toggle: () => setNotifPromo(!notifPromo) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-white/70 text-sm">{item.label}</span>
                <ToggleSwitch on={item.on} onChange={item.toggle} />
              </div>
            ))}
            <div className="pt-3 border-t border-white/10">
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">E-Mail</p>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">E-Mail Benachrichtigungen</span>
                <ToggleSwitch on={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
              </div>
            </div>
            <button
              onClick={() => router.push('/settings/notifications')}
              className="w-full flex items-center gap-2 pt-3 border-t border-white/10 text-purple-400 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              <Bell size={14} />
              <span className="flex-1 text-left">Detaillierte Benachrichtigungseinstellungen</span>
              <ChevronRight size={14} className="text-white/30" />
            </button>
          </div>
        </div>

        {/* ── Privacy ── */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <SectionTitle title={t.settings.privacy} />
          <div className="p-4 space-y-4">
            {[
              { label: 'Lesebestätigungen', desc: 'Zeige anderen wann du Nachrichten gelesen hast', on: readReceipts, toggle: () => setReadReceipts(!readReceipts) },
              { label: 'Online-Status zeigen', desc: 'Zeige anderen wann du aktiv bist', on: showOnline, toggle: () => setShowOnline(!showOnline) },
              { label: 'Entfernung zeigen', desc: 'Zeige deinen ungefähren Standort', on: showDistance, toggle: () => setShowDistance(!showDistance) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                </div>
                <ToggleSwitch on={item.on} onChange={item.toggle} />
              </div>
            ))}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <button
                onClick={() => router.push('/security')}
                className="w-full flex items-center gap-3 py-2.5 text-left hover:opacity-80 transition-opacity"
              >
                <Lock size={16} className="text-purple-400" />
                <span className="text-white/70 text-sm flex-1">Sicherheit &amp; Datenschutz</span>
                <ChevronRight size={14} className="text-white/30" />
              </button>
              <button
                onClick={() => router.push('/blocked')}
                className="w-full flex items-center gap-3 py-2.5 text-left hover:opacity-80 transition-opacity"
              >
                <UserX size={16} className="text-red-400/70" />
                <span className="text-white/70 text-sm flex-1">Blockierte Nutzer</span>
                <ChevronRight size={14} className="text-white/30" />
              </button>
              <button className="w-full flex items-center gap-3 py-2.5 text-left hover:opacity-80 transition-opacity">
                <Download size={16} className="text-white/50" />
                <span className="text-white/70 text-sm flex-1">Meine Daten exportieren</span>
                <ChevronRight size={14} className="text-white/30" />
              </button>
              <button className="w-full flex items-center gap-3 py-2.5 text-left hover:opacity-80 transition-opacity">
                <Trash2 size={16} className="text-red-400" />
                <span className="text-red-400 text-sm flex-1">Konto löschen</span>
                <ChevronRight size={14} className="text-red-400/40" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Appearance ── */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <SectionTitle title={t.settings.appearance} />
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium flex items-center gap-2">
                  <Moon size={14} className="text-purple-400" />
                  Dark Mode
                </p>
                <p className="text-white/40 text-xs mt-0.5">Immer aktiv in Aura</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-purple-600 relative opacity-60">
                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>

            <div>
              <p className="text-white text-sm font-medium flex items-center gap-2 mb-3">
                <Type size={14} className="text-purple-400" />
                Schriftgröße
              </p>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      textSize === size
                        ? 'gradient-brand text-white border-transparent'
                        : 'bg-white/5 border-white/15 text-white/60 hover:text-white/80'
                    }`}
                  >
                    {size === 'small' ? 'Klein' : size === 'medium' ? 'Mittel' : 'Groß'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Language ── */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <SectionTitle title={t.settings.language} />
          <div className="p-4">
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(languageLabels) as Language[]).map((code) => {
                const { label, flag } = languageLabels[code];
                const isSelected = lang === code;
                return (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{flag}</span>
                    <span className="text-sm font-medium flex-1">{label}</span>
                    {isSelected && (
                      <Check size={16} className="text-purple-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Social Links ── */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <SectionTitle title={t.settings.socialLinks} />
          <div className="p-4 space-y-3">
            {[
              { label: 'Instagram', emoji: '📸', value: instagram, setter: setInstagram, placeholder: '@dein.handle' },
              { label: 'TikTok', emoji: '🎵', value: tiktok, setter: setTiktok, placeholder: '@dein.tiktok' },
              { label: 'Spotify', emoji: '🎧', value: spotify, setter: setSpotify, placeholder: 'Dein Spotify-Name' },
              { label: 'Snapchat', emoji: '👻', value: snapchat, setter: setSnapchat, placeholder: 'snapchat-nutzername' },
              { label: 'X / Twitter', emoji: '🐦', value: xHandle, setter: setXHandle, placeholder: '@deintwitter' },
            ].map((item) => (
              <div key={item.label}>
                <label className="text-white/40 text-xs mb-1 block">
                  {item.emoji} {item.label}
                </label>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => item.setter(e.target.value)}
                  placeholder={item.placeholder}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            ))}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={showSaved}
              className="w-full gradient-brand text-white font-bold py-3 rounded-xl text-sm mt-2"
            >
              {t.settings.save}
            </motion.button>
          </div>
        </div>

        {/* ── Legal ── */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <SectionTitle title={t.settings.legal} />
          {[
            { label: t.legal.terms, icon: FileText, path: '/legal/terms' },
            { label: t.legal.privacy, icon: Shield, path: '/legal/privacy' },
            { label: t.legal.imprint, icon: Globe, path: '/legal/notice' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors ${
                i < 2 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center">
                <item.icon size={15} className="text-white/50" />
              </div>
              <span className="flex-1 text-sm font-medium text-white/80 text-left">{item.label}</span>
              <ChevronRight size={16} className="text-white/30" />
            </button>
          ))}
        </div>

        {/* ── Support ── */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <SectionTitle title={t.settings.support} />
          {[
            { label: 'Hilfe & FAQ', icon: HelpCircle, path: '/help' },
            { label: 'Kontakt', icon: MessageSquare, path: null },
            { label: 'App bewerten', icon: Star, path: null },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => item.path && router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors ${
                i < 2 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center">
                <item.icon size={15} className="text-white/50" />
              </div>
              <span className="flex-1 text-sm font-medium text-white/80 text-left">{item.label}</span>
              <ChevronRight size={16} className="text-white/30" />
            </button>
          ))}
        </div>

        {/* ── Sign Out ── */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-red-500/5 transition-colors disabled:opacity-60"
          >
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
              <LogOut size={15} className="text-red-400" />
            </div>
            <span className="flex-1 text-sm font-medium text-red-400 text-left">
              {loggingOut ? 'Abmelden…' : t.settings.signOut}
            </span>
          </button>
        </div>

        {/* ── Staff Access ── */}
        <div className="card-glass rounded-2xl overflow-hidden border border-purple-500/15">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-purple-400/60 text-xs font-semibold uppercase tracking-wider">Staff Access</p>
          </div>
          {[
            { label: 'Admin Panel', icon: Shield, path: '/admin', badge: 'Admin' },
            { label: 'Mod Panel', icon: Lock, path: '/mod', badge: 'Mod' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors ${i < 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className="w-8 h-8 bg-purple-500/15 rounded-lg flex items-center justify-center">
                <item.icon size={15} className="text-purple-400" />
              </div>
              <span className="flex-1 text-sm font-medium text-white/80 text-left">{item.label}</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-400 font-bold px-2 py-0.5 rounded-full mr-2">{item.badge}</span>
              <ChevronRight size={16} className="text-white/30" />
            </button>
          ))}
        </div>

        {/* Version */}
        <div className="text-center py-2">
          <p className="text-white/20 text-xs">Aura v1.0.0</p>
          <p className="text-white/15 text-[10px] mt-1">Made with ❤️ for real connections</p>
        </div>
      </div>

      <BottomNav matchCount={0} visitorCount={0} />
    </div>
  );
}
