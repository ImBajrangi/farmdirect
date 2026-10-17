import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { hi } from '../locales/hi';

type Language = 'en' | 'hi';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('farmdirect_lang') as Language;
    return saved === 'hi' ? 'hi' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('farmdirect_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = language === 'hi' ? (hi as unknown as typeof en) : en;

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
