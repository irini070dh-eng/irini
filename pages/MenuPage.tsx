import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { MENU_DATA, FACEBOOK_URL } from '../constants';
import { MenuItem } from '../types';
import { SoupIcon, MainCourseIcon, AppetizerIcon, DessertIcon, DrinkIcon } from '../components/icons/MenuIcons';
import { FacebookIcon } from '../components/icons/SocialIcons';
import { AnimatedSection } from '../components/AnimatedSection';
import { FolkArtCorner, FolkArtFlourish, FlowerArtCorner } from '../components/icons/FolkArtIcons';

interface PageProps {
  id: string;
}

const IngredientsModal: React.FC<{ item: MenuItem; onClose: () => void }> = ({ item, onClose }) => {
    const { t } = useAppContext();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] animate-fadeIn p-4"
            onClick={onClose}
        >
            <div 
                className="relative bg-secondary-light w-full max-w-lg rounded-lg shadow-2xl border-2 border-folk-blue/30 overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 md:p-8 text-center border-b border-slate-200">
                    <h2 className="text-2xl font-bold font-serif text-folk-red">{t(item.name)}</h2>
                    <p className="text-sm text-text-dark-secondary">{t('allergens_and_ingredients')}</p>
                </div>
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 overflow-y-auto max-h-[60vh]">
                    <div>
                        <h3 className="text-lg font-semibold text-text-dark mb-2 border-b border-slate-300 pb-1">{t('ingredients')}</h3>
                        <ul className="space-y-1 text-sm text-text-dark-secondary list-disc list-inside">
                            {item.ingredientKeys?.map((key, index) => (
                                <li key={index}>{t(key)}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-text-dark mb-2 border-b border-slate-300 pb-1">{t('allergens')}</h3>
                        {(item.allergenKeys && item.allergenKeys.length > 0) ? (
                            <ul className="space-y-1 text-sm text-folk-red font-semibold list-disc list-inside">
                                {item.allergenKeys.map((key, index) => (
                                    <li key={index}>{t(key)}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-text-dark-secondary italic">{t('no_allergens_listed')}</p>
                        )}
                    </div>
                </div>
                <div className="mt-auto p-4 bg-slate-100 text-center border-t border-slate-200">
                     <button
                        onClick={onClose}
                        className="bg-folk-red text-white font-bold py-2.5 px-8 rounded-lg hover:bg-folk-pink transform active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-folk-red/40"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LightboxModal: React.FC<{ item: MenuItem; onClose: () => void }> = ({ item, onClose }) => {
    const { t } = useAppContext();
    const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % item.imageIds.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + item.imageIds.length) % item.imageIds.length);
    };
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isIngredientsModalOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, isIngredientsModalOpen]);

    return (
        <>
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-[100] animate-fadeIn p-4"
            onClick={onClose}
        >
            <div 
                className="relative bg-secondary-light w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row border-2 border-folk-red/30"
                onClick={e => e.stopPropagation()}
            >
                <FlowerArtCorner className="absolute top-0 left-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none" />
                <FlowerArtCorner className="absolute top-0 right-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none transform rotate-90" />
                <FlowerArtCorner className="absolute bottom-0 left-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none transform -rotate-90" />
                <FlowerArtCorner className="absolute bottom-0 right-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none transform rotate-180" />

                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 z-20 bg-black/40 text-white rounded-full p-2 hover:scale-110 hover:bg-black/60 transition-all duration-300"
                    title="Zamknij"
                    aria-label="Zamknij szczegóły dania"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="w-full md:w-1/2 h-64 md:h-auto flex-shrink-0 relative group">
                    <img 
                        src="/images/logo.linku.jpeg" 
                        alt={t(item.name)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            console.error('Failed to load logo image');
                            e.currentTarget.src = '/images/logo.linku.jpeg';
                        }}
                    />
                    {item.imageIds.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage} 
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all duration-300"
                                title="Poprzednie zdjęcie"
                                aria-label="Poprzednie zdjęcie dania"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button 
                                onClick={nextImage} 
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all duration-300"
                                title="Następne zdjęcie"
                                aria-label="Następne zdjęcie dania"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                {item.imageIds.map((_, index) => (
                                    <button 
                                        key={index} 
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }} 
                                        className={`w-2.5 h-2.5 rounded-full ring-1 ring-white/50 transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                        aria-label={`View image ${index + 1}`}
                                    ></button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col">
                    <div className="flex-grow">
                        <h2 className="text-3xl lg:text-4xl font-bold font-serif text-folk-red">{t(item.name)}</h2>
                        <p className="mt-4 text-text-dark-secondary leading-relaxed">{t(item.description)}</p>
                    </div>
                     <div className="mt-8 pt-6 border-t border-slate-300">
                        <button
                            onClick={() => setIsIngredientsModalOpen(true)}
                            className="w-full bg-transparent border-2 border-slate-300 text-text-dark-secondary font-semibold py-2.5 px-6 rounded-lg hover:bg-slate-200/50 transition-colors hover:ring-2 hover:ring-folk-blue/50"
                        >
                            {t('allergens_and_ingredients')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {isIngredientsModalOpen && <IngredientsModal item={item} onClose={() => setIsIngredientsModalOpen(false)} />}
        </>
    );
};

const categoryIcons: { [key: string]: React.FC<{ className?: string }> } = {
  category_soups: SoupIcon,
  category_main_courses: MainCourseIcon,
  category_appetizers: AppetizerIcon,
  category_desserts: DessertIcon,
  category_drinks: DrinkIcon,
};

export const MenuPage: React.FC<PageProps> = ({ id }) => {
    const { t } = useAppContext();
    const [activeTab, setActiveTab] = useState(MENU_DATA[0].category);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    const activeCategoryItems = MENU_DATA.find(cat => cat.category === activeTab)?.items || [];

    return (
        <>
        <div 
            id={id}
            className="py-24 bg-primary-light text-text-dark relative" 
            style={{
                backgroundImage: "url('/images/logo.linku.jpeg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedSection className="text-center mb-16">
                    <div className="flex justify-center items-center gap-4">
                        <FolkArtFlourish className="text-folk-red/50 hidden md:block" />
                        <h1 className="text-5xl md:text-7xl font-bold text-folk-red font-serif tracking-wider drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">{t('menu_title')}</h1>
                        <FolkArtFlourish className="text-folk-red/50 transform scale-x-[-1] hidden md:block" />
                    </div>
                    <p className="mt-4 text-xl text-text-dark font-medium max-w-2xl mx-auto drop-shadow-lg">{t('menu_subtitle')}</p>
                </AnimatedSection>

                {/* Tabs */}
                <AnimatedSection delay="duration-700">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
                        {MENU_DATA.map(category => {
                            const Icon = categoryIcons[category.category];
                            const isActive = activeTab === category.category;
                            return (
                                <button
                                    key={category.category}
                                    onClick={() => setActiveTab(category.category)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 border-2 ${
                                        isActive 
                                        ? 'bg-folk-red border-folk-red text-white shadow-lg shadow-folk-red/30' 
                                        : 'bg-transparent border-slate-300 text-text-dark-secondary hover:bg-folk-red/5 hover:border-folk-red/50 hover:text-folk-red'
                                    }`}
                                >
                                    {Icon && <Icon className="w-5 h-5" />}
                                    <span>{t(category.category)}</span>
                                </button>
                            );
                        })}
                    </div>
                </AnimatedSection>
                
                <AnimatedSection delay="duration-1000">
                    <div className="p-4 sm:p-6 md:p-8 rounded-lg shadow-inner bg-secondary-light/80 backdrop-blur-md">
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {activeCategoryItems.map((item) => {
                                const isHighlighted = item.name === 'piers_kurczaka_schabowy';
                                return (
                                    <div
                                        key={item.name}
                                        className={`relative bg-secondary-dark/60 p-4 rounded-lg shadow-lg border transition-all duration-300 flex items-center gap-4 md:gap-6 cursor-pointer group hover:bg-secondary-dark/90 hover:border-folk-red/50 hover:shadow-folk-red/20 hover:shadow-lg ${isHighlighted ? 'border-folk-red ring-1 ring-folk-red/50' : 'border-black/20'}`}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-folk-red/20 group-hover:border-folk-red/60 transition-colors duration-300">
                                            <img
                                                loading="lazy"
                                                src="/images/logo.linku.jpeg"
                                                alt={t(item.name)}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    console.error('Failed to load logo image');
                                                    e.currentTarget.src = '/images/logo.linku.jpeg';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className={`text-xl md:text-2xl font-bold font-serif ${isHighlighted ? 'text-folk-red' : 'text-text-light'}`}>
                                                {t(item.name)}
                                            </h3>
                                            <p className="mt-2 text-sm text-text-light-secondary">
                                                {t(item.description)}
                                            </p>
                                        </div>
                                         <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-folk-red">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection className="mt-20">
                    <div 
                        className="relative overflow-hidden text-center p-8 rounded-lg shadow-lg border border-slate-200 backdrop-blur-md"
                        style={{
                            backgroundImage: "url('/images/TŁO FACEBOOK .jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/60 rounded-lg"></div>
                        
                        <div className="relative z-10">
                            <FolkArtCorner className="absolute -top-1 -left-1 text-folk-red/20 w-16 h-16" />
                            <FolkArtCorner className="absolute -top-1 -right-1 text-folk-red/20 w-16 h-16 transform rotate-90" />
                            <FolkArtCorner className="absolute -bottom-1 -left-1 text-folk-red/20 w-16 h-16 transform -rotate-90" />
                            <FolkArtCorner className="absolute -bottom-1 -right-1 text-folk-red/20 w-16 h-16 transform rotate-180" />
                            <h2 className="text-3xl font-bold text-white drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">{t('daily_menu_facebook')}</h2>
                            <a
                                href={FACEBOOK_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-3 mt-6 text-lg font-semibold text-black bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-md shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-out"
                            >
                                <FacebookIcon className="w-6 h-6" />
                                {t('view_daily_menu_facebook')}
                            </a>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
        {selectedItem && <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
        </>
    );
};
