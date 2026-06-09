'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function LegalNoticePage() {
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
          <h1 className="text-white font-black text-lg">{t.legal.imprint}</h1>
        </div>
      </div>

      <div className="px-5 py-5 pb-16 space-y-5">
        {/* Angaben gemäß §5 TMG */}
        <div className="card-glass rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wider text-white/50">
            Angaben gemäß §5 TMG
          </h2>
          <div className="space-y-1">
            <p className="text-white font-semibold text-base">Discordium Dating GmbH</p>
            <p className="text-white/70 text-sm">Musterstraße 1</p>
            <p className="text-white/70 text-sm">10115 Berlin</p>
            <p className="text-white/50 text-sm">Deutschland</p>
          </div>
        </div>

        {/* Vertreten durch */}
        <div className="card-glass rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-3 uppercase tracking-wider text-white/50">
            Vertreten durch
          </h2>
          <p className="text-white/70 text-sm">Max Mustermann (Geschäftsführer)</p>
        </div>

        {/* Kontakt */}
        <div className="card-glass rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wider text-white/50">
            Kontakt
          </h2>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-white/40 text-xs w-20 flex-shrink-0">Telefon</span>
              <span className="text-white/70 text-sm">+49 30 1234567</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white/40 text-xs w-20 flex-shrink-0">E-Mail</span>
              <span className="text-white/70 text-sm">kontakt@discordium.de</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white/40 text-xs w-20 flex-shrink-0">Website</span>
              <span className="text-white/70 text-sm">www.discordium.de</span>
            </div>
          </div>
        </div>

        {/* Registereintrag */}
        <div className="card-glass rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wider text-white/50">
            Registereintrag
          </h2>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-white/40 text-xs w-32 flex-shrink-0">Registergericht</span>
              <span className="text-white/70 text-sm">Amtsgericht Berlin-Charlottenburg</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-white/40 text-xs w-32 flex-shrink-0">Registernummer</span>
              <span className="text-white/70 text-sm">HRB 123456 B</span>
            </div>
          </div>
        </div>

        {/* Umsatzsteuer-ID */}
        <div className="card-glass rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-3 uppercase tracking-wider text-white/50">
            Umsatzsteuer-Identifikationsnummer
          </h2>
          <p className="text-white/70 text-sm">
            Gemäß §27a Umsatzsteuergesetz: DE123456789
          </p>
        </div>

        {/* Verantwortlicher */}
        <div className="card-glass rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-3 uppercase tracking-wider text-white/50">
            Verantwortlicher für den Inhalt (§55 Abs. 2 RStV)
          </h2>
          <div className="space-y-1">
            <p className="text-white/70 text-sm">Max Mustermann</p>
            <p className="text-white/50 text-sm">Musterstraße 1, 10115 Berlin</p>
          </div>
        </div>

        {/* Streitschlichtung */}
        <div className="card-glass rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-3 uppercase tracking-wider text-white/50">
            Streitschlichtung
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <span className="text-purple-400">https://ec.europa.eu/consumers/odr</span>
          </p>
          <p className="text-white/60 text-sm leading-relaxed mt-3">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>

        {/* Haftungsausschluss */}
        <div className="card-glass rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-3 uppercase tracking-wider text-white/50">
            Haftungsausschluss
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
        </div>
      </div>
    </div>
  );
}
