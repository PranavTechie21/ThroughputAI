import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  return { t, language };
};
