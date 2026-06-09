'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const sections = [
  {
    title: '1. Akzeptanz der Nutzungsbedingungen',
    content: `Durch die Nutzung von Aura akzeptieren Sie diese Nutzungsbedingungen in vollem Umfang. Wenn Sie mit diesen Bedingungen nicht einverstanden sind, dürfen Sie unsere Dienste nicht nutzen. Aura behält sich das Recht vor, diese Bedingungen jederzeit zu ändern. Die weitere Nutzung der App nach solchen Änderungen gilt als Zustimmung zu den aktualisierten Bedingungen.`,
  },
  {
    title: '2. Nutzerverhalten',
    content: `Sie verpflichten sich, Aura nur für legale Zwecke zu nutzen und keine Inhalte zu teilen, die beleidigend, diskriminierend, bedrohend oder anderweitig unangemessen sind. Sie sind allein verantwortlich für alle Aktivitäten, die unter Ihrem Konto stattfinden. Belästigungen, Stalking oder jegliche Form von Missbrauch gegenüber anderen Nutzern sind strengstens untersagt.`,
  },
  {
    title: '3. Verbotene Inhalte',
    content: `Folgende Inhalte sind auf Aura ausdrücklich verboten: sexuell explizites Material mit Minderjährigen, Hass-Sprache jeglicher Art, Drohungen oder Einschüchterungen, Spam oder kommerzielle Werbung ohne ausdrückliche Genehmigung, Inhalte die geistige Eigentumsrechte Dritter verletzen, sowie jede Form von illegalen Inhalten oder Aktivitäten.`,
  },
  {
    title: '4. Kontosperrung',
    content: `Aura behält sich das Recht vor, Konten jederzeit ohne Vorankündigung zu sperren oder zu löschen, wenn Verstöße gegen diese Nutzungsbedingungen festgestellt werden. Bei einer Sperrung haben Sie keinen Anspruch auf Rückerstattung bereits geleisteter Zahlungen. Sie können gegen eine Sperrung Widerspruch einlegen, indem Sie unseren Support kontaktieren.`,
  },
  {
    title: '5. Haftungsbeschränkung',
    content: `Aura übernimmt keine Haftung für Schäden, die durch die Nutzung unserer Dienste entstehen, sofern diese nicht auf grober Fahrlässigkeit oder vorsätzlichem Handeln unsererseits beruhen. Wir garantieren nicht die ununterbrochene Verfügbarkeit unserer Dienste und haften nicht für technische Ausfälle oder Datenverluste. Die Nutzung der App erfolgt auf eigenes Risiko.`,
  },
  {
    title: '6. Anwendbares Recht',
    content: `Diese Nutzungsbedingungen unterliegen dem Recht der Bundesrepublik Deutschland. Gerichtsstand für alle Streitigkeiten ist Berlin, Deutschland. Sollte eine Bestimmung dieser Nutzungsbedingungen unwirksam sein, so bleibt die Gültigkeit der übrigen Bestimmungen davon unberührt. Im Falle von Streitigkeiten bemühen wir uns zunächst um eine außergerichtliche Einigung.`,
  },
];

export default function TermsPage() {
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
          <h1 className="text-white font-black text-lg">{t.legal.terms}</h1>
        </div>
      </div>

      <div className="px-5 py-5 pb-16 space-y-5">
        <div className="card-glass rounded-2xl p-4">
          <p className="text-white/50 text-xs">
            Zuletzt aktualisiert: 1. Januar 2025 · Aura Dating GmbH
          </p>
        </div>

        {sections.map((section, i) => (
          <div key={i} className="card-glass rounded-2xl p-5">
            <h2 className="text-white font-bold text-sm mb-3">{section.title}</h2>
            <p className="text-white/60 text-sm leading-relaxed">{section.content}</p>
          </div>
        ))}

        <div className="card-glass rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-3">7. Kontakt</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Bei Fragen zu diesen Nutzungsbedingungen wenden Sie sich bitte an:
          </p>
          <div className="mt-3 space-y-1">
            <p className="text-white/70 text-sm">Aura Dating GmbH</p>
            <p className="text-white/50 text-xs">Musterstraße 1, 10115 Berlin</p>
            <p className="text-white/50 text-xs">legal@aura.de</p>
          </div>
        </div>
      </div>
    </div>
  );
}
