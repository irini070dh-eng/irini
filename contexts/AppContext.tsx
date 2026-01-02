
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { AppContextType, Language } from '../types';
import { translations } from '../i18n/translations';

export const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    // Initialize language from localStorage or default to NL, but only on client
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('language') as Language;
            if (stored && Object.values(Language).includes(stored)) {
                return stored;
            }
        }
        return Language.NL;
    });

    const theme = 'light'; // Stały jasny motyw

    // Save language to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', language);
        }
    }, [language]);

    const changeLanguage = useCallback((newLanguage: Language) => {
        setLanguage(newLanguage);
    }, []);

    const toggleTheme = useCallback(() => {
        // Funkcja wyłączona - motyw zawsze jasny
    }, []);

    const t = useCallback((key: string): string => {
        console.log(`[DEBUG] t called with key: "${key}", language: ${language}`);
        console.log(`[DEBUG] translations[${key}]:`, translations[key]);
        console.log(`[DEBUG] translations[${key}]?.[${language}]:`, translations[key]?.[language]);
        const result = translations[key]?.[language] || key;
        console.log(`[DEBUG] result: "${result}"`);
        return result;
    }, [language]);

    const contextValue: AppContextType = {
        language,
        theme,
        setLanguage: changeLanguage,
        toggleTheme,
        t,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};