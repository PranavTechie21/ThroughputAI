import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const { setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" onClick={() => setLanguage('en')}>EN</Button>
      <Button variant="outline" onClick={() => setLanguage('hi')}>HI</Button>
      <Button variant="outline" onClick={() => setLanguage('mr')}>MR</Button>
    </div>
  );
}
