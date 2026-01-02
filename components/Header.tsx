import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC = () => {
  const { t } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t('nav_home') },
    { href: '#menu', label: t('nav_menu') },
    { href: '#reviews', label: t('nav_reviews') },
    { href: '#reservation', label: t('nav_reservation') },
    { href: '#contact', label: t('nav_contact') },
  ];
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu on click
  };


  const linkClasses = "px-4 py-2 rounded-md transition-all duration-300 hover:text-folk-red hover:bg-black/10 hover:ring-2 hover:ring-folk-red/30";

  const headerBg = 'bg-primary-light/80';
  const mobileMenuBg = 'bg-primary-light/90';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? `${headerBg} backdrop-blur-lg shadow-lg` : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-2xl font-bold text-folk-red font-serif">
            Leniwa Baba
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className={linkClasses}>{link.label}</a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button 
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-white drop-shadow-lg"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              title={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className={`${mobileMenuBg} backdrop-blur-lg px-4 pt-2 pb-4`}>
            <nav className="flex flex-col items-center space-y-4 text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
            {navLinks.map(link => (
                <a key={link.href} href={link.href} className={linkClasses} onClick={(e) => handleNavClick(e, link.href)}>{link.label}</a>
            ))}
             <div className="flex items-center space-x-4 pt-4">
                <LanguageSwitcher direction="up" />
            </div>
            </nav>
        </div>
      </div>
    </header>
  );
};