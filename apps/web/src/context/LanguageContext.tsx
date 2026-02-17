'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '../lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Default to Finnish if requested by user, but let's stick to 'en' default first or user pref?
    // User requested "suomenna koko sovellus", so maybe default to 'fi'?
    // Let's default to 'en' but user can switch. Or 'fi' since they asked.
    // I will default to 'fi' as per user request intent "suomenna koko sovellus".
    const [language, setLanguage] = useState<Language>('fi');

    const t = (key: keyof typeof translations.en) => {
        return translations[language][key] || translations['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
