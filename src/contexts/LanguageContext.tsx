
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import translator from '../utils/translator';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // side-effect: translate page when language changes
  useEffect(() => {
    if (language === 'en') {
  translator.restoreOriginals();
  translator.stopObserving();
      // clear runtime resource cache for non-en languages
      try { localStorage.removeItem('i18n_resources_hi'); } catch (_) {}
      try { localStorage.removeItem('i18n_resources_mr'); } catch (_) {}
    } else {
      // map our codes to translator target codes (hi/mr are supported)
  translator.translatePage(language).catch((e) => console.warn('translatePage failed', e));
  translator.startObserving(language);
      // also translate our resource bundle and store translations for runtime use
      import('../utils/translations').then(mod => {
        translator.translateResources((mod as any).translations.en, language).catch(() => {});
      }).catch(() => {});
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
