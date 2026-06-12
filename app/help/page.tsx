'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, HelpCircle, ChevronDown, MessageCircle, Mail, Shield, CreditCard, Heart, Settings, Zap, type LucideIcon } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useI18n } from '@/lib/i18n';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

type Category = 'all' | 'account' | 'matching' | 'payments' | 'safety' | 'technical';

const FAQ: FAQItem[] = [
  { category: 'matching', q: 'Wie funktioniert das Matching?', a: 'Wenn du jemanden nach rechts swipest (oder "Liken" tippst) und diese Person dich auch liked, entsteht ein Match. Dann könnt ihr euch gegenseitig Nachrichten schreiben. Der Algorithmus zeigt dir Profile basierend auf deinen Suchfiltern, deinem Standort und deiner Aktivität.' },
  { category: 'matching', q: 'Warum sehe ich wenig Profile?', a: 'Das kann an deinen Suchfiltern liegen — prüfe ob dein Altersbereich oder dein Radius zu eng gesetzt ist. Außerdem zeigen wir dir in deiner Nähe aktive Nutzer priorisiert. Mit einem Boost kannst du deine Sichtbarkeit erhöhen und mehr Profile sehen.' },
  { category: 'matching', q: 'Was ist ein Super-Like?', a: 'Ein Super-Like zeigt der anderen Person, dass du besonders interessiert bist — noch bevor sie entschieden hat ob sie dich mag. Profile die du superlikst werden mit einem blauen Stern markiert. Free-Nutzer erhalten 1 Super-Like pro Woche, Premium-Mitglieder bis zu 5 pro Tag.' },
  { category: 'account', q: 'Wie kann ich mein Profil verifizieren?', a: 'Gehe zu Profil → Verifizieren und folge den Anweisungen. Du machst ein kurzes Selfie-Video, das automatisch mit deinen Profilfotos abgeglichen wird. Die Verifizierung dauert meist 1-2 Minuten und erhöht dein Matching-Potenzial deutlich.' },
  { category: 'account', q: 'Kann ich mein Konto vorübergehend pausieren?', a: 'Ja! Gehe zu Sicherheit → Konto deaktivieren. Dein Profil wird unsichtbar, aber alle Matches und Nachrichten bleiben erhalten. Du kannst jederzeit wieder aktivieren.' },
  { category: 'account', q: 'Wie ändere ich mein Passwort?', a: 'Gehe zu Sicherheit → Passwort ändern. Du benötigst dein aktuelles Passwort und musst das neue Passwort zweimal eingeben. Aus Sicherheitsgründen wirst du auf allen anderen Geräten abgemeldet.' },
  { category: 'payments', q: 'Wie kündige ich Premium?', a: 'Du kannst Premium jederzeit kündigen — gehe zu Einstellungen → Abonnement → Kündigen. Die Premium-Vorteile bleiben bis zum Ende des bezahlten Zeitraums aktiv. Es gibt keine versteckten Gebühren.' },
  { category: 'payments', q: 'Wie kaufe ich Münzen?', a: 'Gehe zu Shop und wähle das gewünschte Münzpaket. Wir akzeptieren Kreditkarte, PayPal und Apple/Google Pay. Münzen verfallen nicht und können für Boosts, Super-Likes und Geschenke im Livestream verwendet werden.' },
  { category: 'payments', q: 'Kann ich eine Rückerstattung erhalten?', a: 'Digitale Produkte (Münzen, Super-Likes, Boosts) können nach dem Kauf nicht zurückerstattet werden, sofern sie bereits genutzt wurden. Für ungenutzte Produkte kontaktiere uns innerhalb von 14 Tagen nach dem Kauf.' },
  { category: 'safety', q: 'Wie melde ich einen unangemessenen Nutzer?', a: 'Öffne das Profil der Person und tippe auf die drei Punkte (···) → "Melden". Wähle den Grund aus und beschreibe optional den Vorfall. Unser Moderationsteam prüft jeden Bericht innerhalb von 24 Stunden. Gemeldete Nutzer werden nicht informiert.' },
  { category: 'safety', q: 'Wie blockiere ich jemanden?', a: 'Öffne das Profil oder den Chat → tippe auf "Blockieren". Blockierte Personen können dein Profil nicht sehen und dir nicht schreiben. Du kannst Blockierungen unter Sicherheit → Blockierte Nutzer verwalten.' },
  { category: 'safety', q: 'Wie schütze ich meine Daten?', a: 'Wir verwenden Ende-zu-Ende-Verschlüsselung für alle Nachrichten. Deine Standortdaten werden nur als ungefähre Distanz angezeigt, nie als genaue Koordinaten. Du kannst alle gespeicherten Daten unter Datenschutz → Daten herunterladen exportieren oder löschen.' },
  { category: 'technical', q: 'Die App lädt langsam — was tun?', a: 'Schließe und öffne die App neu. Stelle sicher, dass du eine stabile Internetverbindung hast. Falls das Problem anhält, lösche den App-Cache unter Systemeinstellungen → App → Cache leeren. Bei weiteren Problemen kontaktiere unseren Support.' },
  { category: 'technical', q: 'Benachrichtigungen kommen nicht an?', a: 'Stelle sicher, dass Benachrichtigungen für die App in deinen Systemeinstellungen aktiviert sind. In der App kannst du unter Einstellungen → Benachrichtigungen granular einstellen welche Benachrichtigungen du erhalten möchtest.' },
];

const CATEGORY_ICONS: Array<{ key: Category; icon: LucideIcon }> = [
  { key: 'all', icon: HelpCircle },
  { key: 'matching', icon: Heart },
  { key: 'account', icon: Settings },
  { key: 'payments', icon: CreditCard },
  { key: 'safety', icon: Shield },
  { key: 'technical', icon: Zap },
];

export default function HelpPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [category, setCategory] = useState<Category>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const categories = CATEGORY_ICONS.map(({ key, icon }) => ({
    key,
    icon,
    label: t.help.categories[key],
  }));

  const filtered = FAQ.filter(f => {
    if (category !== 'all' && f.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <h1 className="text-white font-black text-xl">❓ {t.help.title}</h1>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.help.searchPlaceholder}
          className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-white/70 placeholder:text-white/25 text-sm focus:outline-none focus:border-purple-500/40 mb-3"
        />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setCategory(key)} className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${category === key ? 'gradient-brand text-white' : 'bg-white/8 text-white/50 border border-white/10'}`}>
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-2xl p-5 text-center border border-purple-500/15">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-white font-black text-lg">{t.help.heroTitle}</p>
          <p className="text-white/50 text-sm mt-1">{t.help.heroSubtitle}</p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="space-y-2">
          <p className="text-white/40 text-xs uppercase tracking-wider">{t.help.resultsCount(filtered.length)}</p>
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={`${item.category}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card-glass rounded-2xl overflow-hidden border border-white/8"
              >
                <button
                  onClick={() => setExpanded(expanded === `${i}` ? null : `${i}`)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{item.q}</p>
                  </div>
                  <motion.div animate={{ rotate: expanded === `${i}` ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>
                    <ChevronDown size={16} className="text-white/30 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {expanded === `${i}` && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-white/8 pt-3">
                        <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-white/50 text-sm">{t.help.noResults(search)}</p>
              <p className="text-white/30 text-xs mt-1">{t.help.tryOther}</p>
            </div>
          )}
        </div>

        {/* Contact support */}
        <div className="space-y-3">
          <p className="text-white/40 text-xs uppercase tracking-wider">{t.help.directHelp}</p>
          <motion.button whileTap={{ scale: 0.97 }} className="w-full card-glass rounded-2xl p-4 flex items-center gap-4 border border-white/8 hover:border-purple-500/25 transition-colors">
            <div className="w-11 h-11 bg-purple-500/15 rounded-xl flex items-center justify-center flex-shrink-0"><MessageCircle size={20} className="text-purple-400" /></div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-sm">{t.help.liveChat}</p>
              <p className="text-white/40 text-xs">{t.help.liveChatDesc}</p>
            </div>
            <span className="text-green-400 text-xs font-semibold">{t.help.liveChatStatus}</span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.97 }} className="w-full card-glass rounded-2xl p-4 flex items-center gap-4 border border-white/8 hover:border-purple-500/25 transition-colors">
            <div className="w-11 h-11 bg-blue-500/15 rounded-xl flex items-center justify-center flex-shrink-0"><Mail size={20} className="text-blue-400" /></div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-sm">{t.help.emailSupport}</p>
              <p className="text-white/40 text-xs">{t.help.emailSupportDesc}</p>
            </div>
          </motion.button>
        </div>

        <div className="card-glass rounded-2xl p-4 border border-white/8">
          <p className="text-white/50 text-xs text-center leading-relaxed">
            {t.help.footer('aura.dating')}
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
