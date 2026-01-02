import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useAppContext();

    const SunIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-folk-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    const MoonIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-folk-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    );

    const WoodIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );

    const FlowerIcon = () => (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-folk-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.485 14.828a8 8 0 01-1.414 1.414M5.929 7.515a8 8 0 011.414-1.414M14.828 5.929a8 8 0 011.414 1.414M7.515 18.071a8 8 0 01-1.414-1.414" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4V2m0 20v-2m8-10h2M2 12h2" />
        </svg>
    );

    let iconToShow;
    if (theme === 'light') {
        iconToShow = <MoonIcon />;
    } else if (theme === 'dark') {
        iconToShow = <WoodIcon />;
    } else if (theme === 'wood') {
        iconToShow = <FlowerIcon />;
    } else { // theme === 'flower'
        iconToShow = <SunIcon />;
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/10 transition-all duration-300 hover:ring-2 hover:ring-folk-yellow/60"
            aria-label="Toggle theme"
        >
            {iconToShow}
        </button>
    );
};
