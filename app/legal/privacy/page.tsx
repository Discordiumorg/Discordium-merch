'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const sections = [
  {
    title: 'Daten, die wir erheben',
    content: `Wir erheben folgende Daten: Profildaten (Name, Alter, Fotos, Bio, Interessen), Standortdaten (ungefährer Standort für die Entfernungsberechnung), Nutzungsdaten (Swipe-Aktivität, Nachrichten, App-Nutzungszeit) sowie Gerätedaten (Gerätetyp, Betriebssystem, IP-Adresse). Zahlungsdaten werden ausschließlich über unsere zertifizierten Zahlungsdienstleister verarbeitet und von uns nicht gespeichert.`,
  },
  {
    title: 'Verwendung Ihrer Daten',
    content: `Ihre Daten verwenden wir ausschließlich zur: Bereitstellung und Verbesserung unserer Dating-Dienste, Personalisierung Ihres Erlebnisses (z.B. Profilvorschläge), Sicherstellung der Plattformsicherheit und Missbrauchsprävention, Kommunikation über wichtige Updates, sowie der Erfüllung gesetzlicher Pflichten. Wir verkaufen Ihre persönlichen Daten nicht an Dritte.`,
  },
  {
    title: 'Datenspeicherung',
    content: `Ihre Daten werden für die Dauer Ihrer Mitgliedschaft gespeichert. Nach Kontolöschung werden Ihre persönlichen Daten innerhalb von 30 Tagen gelöscht, mit Ausnahme von Daten, die wir aus rechtlichen Gründen länger aufbewahren müssen (z.B. Transaktionsdaten für 7 Jahre gemäß Steuerrecht). Anonymisierte, nicht personenbezogene Daten können länger gespeichert werden.`,
  },
  {
    title: 'Ihre Rechte (DSGVO)',
    content: `Gemäß der DSGVO haben Sie folgende Rechte: Auskunftsrecht (Art. 15 DSGVO) — Sie können eine Kopie Ihrer gespeicherten Daten anfordern. Recht auf Berichtigung (Art. 16 DSGVO) — Sie können unrichtige Daten korrigieren lassen. Recht auf Löschung (Art. 17 DSGVO) — Sie können die Löschung Ihrer Daten verlangen. Recht auf Datenübertragbarkeit (Art. 20 DSGVO) — Sie können Ihre Daten in maschinenlesbarem Format erhalten. Widerspruchsrecht (Art. 21 DSGVO) — Sie können der Verarbeitung widersprechen.`,
  },
  {
    title: 'Cookies & Tracking',
    content: `Wir verwenden technisch notwendige Cookies für die Grundfunktionalität der App sowie optionale Analytics-Cookies zur Verbesserung unserer Dienste. Sie können die Verwendung optionaler Cookies jederzeit in den App-Einstellungen deaktivieren. Wir nutzen keine Third-Party-Tracking-Dienste für Werbezwecke ohne Ihre ausdrückliche Zustimmung.`,
  },
  {
    title: 'Datenschutzbeauftragter (DPO)',
    content: `Bei datenschutzbezogenen Anfragen, der Ausübung Ihrer Rechte oder Beschwerden wenden Sie sich bitte an unseren Datenschutzbeauftragten. Sie haben außerdem das Recht, Beschwerde bei der zuständigen Aufsichtsbehörde einzulegen (in Berlin: Berliner Beauftragte für Datenschutz und Informationsfreiheit).`,
  },
];

export default function PrivacyPage() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-white font-black text-lg">{t.legal.privacy}</h1>
        </div>
      </div>

      <div className="px-5 py-5 pb-16 space-y-5">
        {/* GDPR badge */}
        <div className="card-glass rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">DSGVO-konform</p>
            <p className="text-white/50 text-xs">Zuletzt aktualisiert: 1. Januar 2025</p>
          </div>
        </div>

        {sections.map((section, i) => (
          <div key={i} className="card-glass rounded-2xl p-5">
            <h2 className="text-white font-bold text-sm mb-3">{section.title}</h2>
            <p className="text-white/60 text-sm leading-relaxed">{section.content}</p>
          </div>
        ))}

        {/* DPO Contact */}
        <div className="card-glass rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-3">Kontakt Datenschutzbeauftragter</h2>
          <div className="space-y-1">
            <p className="text-white/70 text-sm">Discordium Dating GmbH</p>
            <p className="text-white/50 text-xs">z.H. Datenschutzbeauftragter</p>
            <p className="text-white/50 text-xs">Musterstraße 1, 10115 Berlin</p>
            <p className="text-purple-400 text-xs mt-2">datenschutz@discordium.de</p>
          </div>
        </div>
      </div>
    </div>
  );
}
