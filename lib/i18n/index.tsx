'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import de from './de';
import en from './en';
import fr from './fr';
import es from './es';
import it from './it';
import pt from './pt';
import tr from './tr';
import type { Translations } from './de';

export type Language = 'de' | 'en' | 'fr' | 'es' | 'it' | 'pt' | 'tr';

export const languageLabels: Record<Language, { label: string; flag: string }> = {
  de: { label: 'Deutsch', flag: '🇩🇪' },
  en: { label: 'English', flag: '🇬🇧' },
  fr: { label: 'Français', flag: '🇫🇷' },
  es: { label: 'Español', flag: '🇪🇸' },
  it: { label: 'Italiano', flag: '🇮🇹' },
  pt: { label: 'Português', flag: '🇵🇹' },
  tr: { label: 'Türkçe', flag: '🇹🇷' },
};

const translationMap: Record<Language, Translations> = {
  de,
  en,
  fr,
  es,
  it,
  pt,
  tr,
};

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'de',
  setLang: () => {},
  t: de,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('de');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lang') as Language | null;
      if (stored && translationMap[stored]) {
        setLangState(stored);
      }
    } catch {
      // localStorage not available (SSR)
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('lang', newLang);
    } catch {
      // ignore
    }
  }, []);

  const t = translationMap[lang];

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
