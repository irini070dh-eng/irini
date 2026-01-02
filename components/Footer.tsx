import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { FACEBOOK_URL, INSTAGRAM_URL } from '../constants';

const AnimatedFacebookButton: React.FC = () => {
    const FacebookLogo = () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d="M9.197 22v-9.197H6v-3.622h3.197V6.442c0-3.18 1.893-4.94 4.808-4.94 1.372 0 2.863.26 2.863.26v3.138h-1.85c-1.54 0-2.022.928-2.022 1.986v2.35h3.58l-.57 3.622h-3.01V22h-4.22z" />
        </svg>
    );

    return (
        <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center bg-[#1877F2] text-white rounded-full h-12 w-12 hover:scale-110 transition-all duration-300 ease-in-out"
            aria-label="Facebook"
        >
            <FacebookLogo />
        </a>
    );
}

const InstagramButton: React.FC = () => {
    return (
        <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center text-white rounded-full h-12 w-12 hover:scale-110 transition-all duration-300 ease-in-out relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"
            aria-label="Instagram"
        >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current relative z-10">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        </a>
    );
}

export const Footer: React.FC = () => {
    const { t } = useAppContext();
    const quickLinks = [
        { href: '#home', label: t('nav_home'), icon: '🏠' },
        { href: '#menu', label: t('nav_menu'), icon: '🍽️' },
        { href: '#reviews', label: t('nav_reviews'), icon: '⭐' },
        { href: '#reservation', label: t('nav_reservation'), icon: '📅' },
        { href: '#contact', label: t('nav_contact'), icon: '📞' },
    ];

    return (
        <footer className="bg-gradient-to-b from-slate-50 to-slate-100 text-text-dark-secondary relative overflow-hidden">
            {/* Decorative Wave */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-folk-red via-folk-pink to-folk-red"></div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left mb-12">
                    {/* Logo & About */}
                    <div className="md:col-span-2 lg:col-span-1 flex flex-col items-center md:items-start">
                        <a 
                            href="#home" 
                            className="text-3xl font-bold text-gradient-premium font-serif hover:scale-105 transition-transform duration-300 inline-block"
                        >
                            Leniwa Baba
                        </a>
                        <p className="mt-3 text-folk-red font-bold text-lg">{t('slogan')}</p>
                        <p className="mt-3 text-sm text-text-dark-secondary leading-relaxed max-w-xs">
                            Autentyczna polska kuchnia w sercu Hagi. Tradycyjne smaki, domowa atmosfera.
                        </p>
                        
                        {/* Social Media */}
                        <div className="mt-6 flex gap-4 justify-center md:justify-start">
                            <AnimatedFacebookButton />
                            <InstagramButton />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-text-dark mb-6 uppercase tracking-wider">
                            {t('quick_links')}
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map(link => (
                                <li key={link.href}>
                                    <a 
                                        href={link.href} 
                                        className="group flex items-center justify-center md:justify-start gap-3 hover:text-folk-red transition-all duration-300 p-2 rounded-lg hover:bg-white/5 hover:translate-x-1"
                                    >
                                        <span className="text-xl group-hover:scale-125 transition-transform duration-300">{link.icon}</span>
                                        <span>{link.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-text-dark mb-6 uppercase tracking-wider">
                            Kontakt
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <span className="text-xl">📍</span>
                                <div>
                                    <div className="font-semibold text-text-dark">Adres</div>
                                    <div>Gedempte Gracht 42</div>
                                    <div>2512 CA Den Haag</div>
                                </div>
                            </li>
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <span className="text-xl">📞</span>
                                <div>
                                    <div className="font-semibold text-text-dark">Telefon</div>
                                    <a href="tel:+31704272052" className="hover:text-folk-red transition-colors">
                                        +31 70 427 2052
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <span className="text-xl">✉️</span>
                                <div>
                                    <div className="font-semibold text-text-dark">Email</div>
                                    <a href="mailto:info@leniwababa.nl" className="hover:text-folk-red transition-colors">
                                        info@leniwababa.nl
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <span className="text-xl">🕐</span>
                                <div>
                                    <div className="font-semibold text-text-dark">Godziny otwarcia</div>
                                    <div>Wt-Nd: 12:00 - 22:00</div>
                                    <div className="text-folk-red font-semibold">Poniedziałek nieczynne</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Additional Info */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <h3 className="text-lg font-semibold text-text-dark mb-6 uppercase tracking-wider">
                            Informacje
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-folk-red transition-colors duration-300">
                                    Polityka prywatności
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-folk-red transition-colors duration-300">
                                    Regulamin
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-folk-red transition-colors duration-300">
                                    Polityka cookies
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-300 pt-8 text-center">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} <span className="font-bold text-text-dark">Leniwa Baba</span>. Wszystkie prawa zastrzeżone.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                        <span>Made with</span>
                        <span className="text-folk-red text-xl animate-pulse">❤️</span>
                        <span>in Poland & Netherlands</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

