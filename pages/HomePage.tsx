import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { FACEBOOK_URL, OCCASIONS_DATA, TEAM_DATA } from '../constants';
import { AnimatedSection } from '../components/AnimatedSection';
import { FolkArtCorner, FolkArtFlourish, FolkArtFlowerFrame, FlowerArtCorner } from '../components/icons/FolkArtIcons';
import { StarRating } from '../components/StarRating';

// Hero carousel images
const HERO_IMAGES = [
  'okładka strony.jpg',
  'okładka strony3.jpg', 
  'okładka strony4.jpg',
  'OKŁADKA STRONY 2.jpg',
  'okładka strony5.jpg',
  'okładka strony6.jpg',
  'okładka strony7.jpg',
  'okładka strony8.jpg',
  'okładka strony9.jpg',
  'okładka strony10.jpg',
  'okładka strony11.jpg',
  'TŁO O NAS .jpg',
  'o nas.png'
];

// Advertisements/promotional videos data
const ADVERTISEMENTS_DATA = [
  {
    id: 1,
    title: 'Weekendowa Promocja',
    description: 'Specjalne oferty na weekendy - zobacz naszą najnowszą reklamę!',
    videoUrl: '/videos/weekendowa-promocja.mp4',
    thumbnailUrl: '/videos/weekendowa-promocja-poster.jpg'
  },
  {
    id: 2,
    title: 'Smak Tradycji',
    description: 'Odkryj autentyczne smaki polskiej kuchni!',
    videoUrl: '/videos/smak-tradycji.mp4',
    thumbnailUrl: '/videos/smak-tradycji.jpg'
  },
  {
    id: 3,
    title: 'Konkurs',
    description: 'Weź udział w naszym konkursie!',
    videoUrl: '/videos/konkurs.mp4',
    thumbnailUrl: '/videos/konkurs.jpg'
  },
  {
    id: 4,
    title: 'Święta 2025',
    description: 'Świąteczne potrawy i specjalne menu na święta!',
    videoUrl: '/SWIETA2025.mp4',
    thumbnailUrl: '/SWIETA2025.png'
  }
];






interface PageProps {
  id: string;
}

const Typewriter: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(intervalId);
            }
        }, 100);
        return () => clearInterval(intervalId);
    }, [text]);
    return <span className="border-r-2 border-folk-yellow animate-pulse">{displayedText}</span>;
}

export const HomePage: React.FC<PageProps> = ({ id }) => {
    const { t, theme } = useAppContext();
    
    const [currentOccasionIndex, setCurrentOccasionIndex] = useState(0);
    const [currentHeroImage, setCurrentHeroImage] = useState(0);
    const [flippedCards, setFlippedCards] = useState(new Set<number>());
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [playingVideos, setPlayingVideos] = useState(new Set<number>());
    const heroRef = useRef<HTMLDivElement>(null);

    // Parallax scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleVideoClick = (videoId: number, videoElement: HTMLVideoElement) => {
        if (playingVideos.has(videoId)) {
            videoElement.pause();
            setPlayingVideos(prev => {
                const newSet = new Set(prev);
                newSet.delete(videoId);
                return newSet;
            });
        } else {
            videoElement.play();
            setPlayingVideos(prev => new Set(prev).add(videoId));
        }
    };
    

    // Hero image carousel effect
    useEffect(() => {
        const heroCarouselInterval = setInterval(() => {
            setCurrentHeroImage(prev => (prev + 1) % HERO_IMAGES.length);
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(heroCarouselInterval);
    }, []);

    useEffect(() => {
        const occasionCarouselInterval = setInterval(() => {
            setCurrentOccasionIndex(prev => (prev + 1) % OCCASIONS_DATA.length);
        }, 7000);

        return () => {
            clearInterval(occasionCarouselInterval);
        };
    }, []);

    // Team carousel effect
    useEffect(() => {
        const teamCarouselInterval = setInterval(() => {
            setCurrentTeamIndex(prev => (prev + 1) % TEAM_DATA.length);
        }, 5000); // Change team member every 5 seconds

        return () => clearInterval(teamCarouselInterval);
    }, []);

    // Advertisements carousel effect
    useEffect(() => {
        const adCarouselInterval = setInterval(() => {
            setCurrentAdIndex(prev => (prev + 1) % ADVERTISEMENTS_DATA.length);
        }, 6000); // Change ad every 6 seconds

        return () => clearInterval(adCarouselInterval);
    }, []);

    const nextOccasion = useCallback(() => {
        setCurrentOccasionIndex(prev => (prev + 1) % OCCASIONS_DATA.length);
    }, []);

    const prevOccasion = useCallback(() => {
        setCurrentOccasionIndex(prev => (prev - 1 + OCCASIONS_DATA.length) % OCCASIONS_DATA.length);
    }, []);

    const nextTeamMember = useCallback(() => {
        setCurrentTeamIndex(prev => (prev + 1) % TEAM_DATA.length);
    }, []);

    const prevTeamMember = useCallback(() => {
        setCurrentTeamIndex(prev => (prev - 1 + TEAM_DATA.length) % TEAM_DATA.length);
    }, []);
    
    const handleCardClick = (index: number) => {
        if (index !== currentOccasionIndex) return; // Only allow flipping the center card
        setFlippedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <div id={id} className="space-y-24 md:space-y-32 pb-24">
            {/* Hero Section with Parallax */}
            <section 
                ref={heroRef}
                className="relative min-h-screen flex items-center justify-center text-center -mt-20 overflow-hidden"
                style={{
                    transform: `translateY(${scrollY * 0.5}px)`
                }}
            >
                {/* Hero Images Carousel with Ken Burns Effect */}
                {HERO_IMAGES.map((image, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentHeroImage ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                            transform: `scale(${1 + scrollY * 0.0002})`,
                            transition: 'opacity 1000ms, transform 100ms'
                        }}
                    >
                        <div 
                            className="absolute inset-0 ken-burns"
                            style={{ 
                                backgroundImage: `url('/images/${image}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>
                ))}
                
                <FolkArtCorner className="absolute -bottom-10 -left-10 text-folk-red/10 w-48 h-48 opacity-50" />
                <FolkArtCorner className="absolute -bottom-10 -right-10 text-folk-blue/10 w-48 h-48 opacity-50 transform rotate-90" />
                
                {/* Content with parallax */}
                <div 
                    className="relative z-10 px-4"
                    style={{
                        transform: `translateY(${scrollY * -0.3}px)`
                    }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-gradient-premium font-serif mb-4 text-premium-glow reveal-up">
                        {t('restaurant_name')}
                    </h1>
                    <p className="text-xl md:text-2xl text-white mt-4 h-8 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] reveal-up delay-200">
                        <Typewriter text={t('slogan')} />
                    </p>
                    <a
                        href="#reservation"
                        className="inline-flex items-center gap-3 px-8 py-3 mt-12 text-lg font-semibold text-black bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-md shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-out reveal-up delay-300"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {t('nav_reservation')}
                    </a>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-64 md:w-96 z-20">
                    <div className="glass-card rounded-full p-1 backdrop-blur-md">
                        <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className="absolute inset-0 bg-gradient-to-r from-folk-red via-folk-pink to-folk-red shimmer"
                                style={{
                                    width: `${((currentHeroImage + 1) / HERO_IMAGES.length) * 100}%`,
                                    transition: 'width 400ms ease-out'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Enhanced Hero Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {HERO_IMAGES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentHeroImage(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                                index === currentHeroImage 
                                    ? 'bg-folk-red scale-125 ring-2 ring-white/50' 
                                    : 'bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>
            
            {/* About Us */}
            <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div 
                    className="relative p-4 sm:p-6 md:p-8"
                    style={{
                        backgroundImage: "url('/images/TŁO O NAS .jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: '1rem'
                    }}
                >
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
                    
                    <div className="relative z-10">
                        <FlowerArtCorner className="absolute top-0 left-0 w-24 h-24 text-folk-red opacity-10 pointer-events-none" />
                        <FlowerArtCorner className="absolute top-0 right-0 w-24 h-24 text-folk-red opacity-10 pointer-events-none transform rotate-90" />
                        <FlowerArtCorner className="absolute bottom-0 left-0 w-24 h-24 text-folk-red opacity-10 pointer-events-none transform -rotate-90" />
                        <FlowerArtCorner className="absolute bottom-0 right-0 w-24 h-24 text-folk-red opacity-10 pointer-events-none transform rotate-180" />
                        <FolkArtFlowerFrame className="absolute inset-0 w-full h-full text-folk-red/20" />
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-lg shadow-xl">
                            <div className="flex justify-center items-center">
                                <div 
                                    className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-folk-red/30 relative"
                                    style={{
                                        backgroundImage: "url('/images/TŁO MENU.png')",
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'repeat'
                                    }}
                                >
                                    {/* Logo overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img 
                                            loading="lazy" 
                                            src="/images/logo.linku.jpeg" 
                                            alt="Leniwa Baba Logo" 
                                            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-full drop-shadow-lg"
                                            onError={(e) => {
                                                console.error('Failed to load logo image');
                                                // Try fallback image
                                                e.currentTarget.src = '/images/logo.linku.jpeg';
                                                e.currentTarget.onerror = null;
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-serif mb-4 drop-shadow-lg">{t('about_us_title')}</h2>
                                <p className="text-base sm:text-lg text-white leading-relaxed drop-shadow-lg">{t('about_us_text')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Team Carousel Section */}
            <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-block glass-card px-6 py-2 rounded-full mb-6 backdrop-blur-md">
                        <span className="text-folk-red font-semibold text-sm uppercase tracking-wider">{t('our_team_label')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-premium font-serif mb-6 text-premium-glow">
                        {t('our_team_title')}
                    </h2>
                    <p className="text-base sm:text-lg text-text-dark-secondary max-w-2xl mx-auto">
                        {t('our_team_description')}
                    </p>
                </div>
                
                <div className="relative flex justify-center items-center h-[24rem] sm:h-[28rem] md:h-[32rem]">
                    {/* Navigation Buttons - Premium Style */}
                    <button 
                        onClick={prevTeamMember} 
                        className="absolute left-0 sm:left-2 md:-left-12 z-30 glass-card p-2 sm:p-3 rounded-full text-white hover:scale-110 transition-all duration-300 hover:ring-2 hover:ring-folk-red/50 backdrop-blur-md"
                        title="Poprzedni członek zespołu"
                        aria-label="Poprzedni członek zespołu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                        onClick={nextTeamMember} 
                        className="absolute right-0 sm:right-2 md:-right-12 z-30 glass-card p-2 sm:p-3 rounded-full text-white hover:scale-110 transition-all duration-300 hover:ring-2 hover:ring-folk-red/50 backdrop-blur-md"
                        title="Następny członek zespołu"
                        aria-label="Następny członek zespołu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <div className="relative w-full h-full [perspective:1500px]">
                        {TEAM_DATA.map((member, index) => {
                            const offset = (index - currentTeamIndex + TEAM_DATA.length) % TEAM_DATA.length;
                            const isCenter = offset === 0;
                            const isLeft = offset === TEAM_DATA.length - 1;
                            const isRight = offset === 1;
                            const isVisible = isCenter || isLeft || isRight;

                            let transform = '';
                            let zIndex = 0;
                            let scale = 0.75;
                            let opacity = 0.5;
                            
                            if (isCenter) {
                                transform = 'translateX(0) translateZ(250px)';
                                zIndex = 30;
                                scale = 1;
                                opacity = 1;
                            } else if (isLeft) {
                                transform = 'translateX(-130%) rotateY(50deg) translateZ(0px)';
                                zIndex = 10;
                            } else if (isRight) {
                                transform = 'translateX(130%) rotateY(-50deg) translateZ(0px)';
                                zIndex = 10;
                            }

                            return (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                        isVisible ? 'pointer-events-auto' : 'pointer-events-none opacity-0'
                                    }`}
                                    style={{
                                        transform,
                                        zIndex,
                                        opacity: isVisible ? opacity : 0,
                                    }}
                                >
                                    <div className="flex justify-center items-center h-full">
                                        <div 
                                            className="relative w-72 h-80 rounded-2xl shadow-2xl transition-all duration-700 bg-white border-2 border-folk-red/30 hover:border-folk-red/60 overflow-hidden"
                                            style={{ 
                                                transform: `scale(${scale})`,
                                                backgroundImage: "url('/images/TŁO MENU.png')",
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        >
                                            {/* Dark overlay for better text readability */}
                                            <div className="absolute inset-0 bg-black/30"></div>
                                            
                                            {/* Folklor decorative corners */}
                                            <FlowerArtCorner className="absolute top-2 left-2 w-12 h-12 text-folk-red/40 pointer-events-none z-20" />
                                            <FlowerArtCorner className="absolute top-2 right-2 w-12 h-12 text-folk-red/40 pointer-events-none transform rotate-90 z-20" />
                                            <FlowerArtCorner className="absolute bottom-2 left-2 w-12 h-12 text-folk-red/40 pointer-events-none transform -rotate-90 z-20" />
                                            <FlowerArtCorner className="absolute bottom-2 right-2 w-12 h-12 text-folk-red/40 pointer-events-none transform rotate-180 z-20" />

                                            {/* Member Photo - Circular Avatar */}
                                            <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center text-center">
                                                <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-folk-red/50 mb-4">
                                                    <img 
                                                        src={`/images/${member.imageId}`} 
                                                        alt={t(member.nameKey)} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            console.error(`Failed to load team member image: /images/${member.imageId}`);
                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t(member.nameKey))}&size=128&background=8B4513&color=fff&bold=true`;
                                                        }}
                                                    />
                                                </div>
                                                
                                                {/* Member Info */}
                                                <div className="text-text-dark">
                                                    <h3 className="text-xl font-bold font-serif mb-2 drop-shadow-lg">
                                                        {t(member.positionKey)}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Team member indicators - Premium Style */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 glass-card px-4 py-2 rounded-full backdrop-blur-md">
                        {TEAM_DATA.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentTeamIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentTeamIndex 
                                        ? 'bg-folk-red scale-125 ring-2 ring-white/50' 
                                        : 'bg-white/50 hover:bg-white/80 hover:scale-110'
                                }`}
                                aria-label={`Przejdź do członka zespołu ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </AnimatedSection>
            
            {/* Occasions Carousel Section */}
            <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center gap-4 mb-12">
                    <FolkArtFlourish className="text-folk-blue/50 hidden md:block" />
                    <h2 className="text-4xl font-bold text-folk-red font-serif text-center">{t('occasions_title')}</h2>
                    <FolkArtFlourish className="text-folk-blue/50 transform scale-x-[-1] hidden md:block" />
                </div>
                <div className="relative flex justify-center items-center h-[28rem]">
                    {/* Navigation Buttons */}
                    <button 
                        onClick={prevOccasion} 
                        className="absolute left-0 md:-left-8 z-30 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-all duration-300 hover:ring-2 hover:ring-white/50"
                        title="Poprzednia okazja"
                        aria-label="Poprzednia okazja"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                        onClick={nextOccasion} 
                        className="absolute right-0 md:-right-8 z-30 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-all duration-300 hover:ring-2 hover:ring-white/50"
                        title="Następna okazja"
                        aria-label="Następna okazja"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <div className="relative w-full h-full [perspective:1000px]">
                        {OCCASIONS_DATA.map((occasion, index) => {
                            const offset = (index - currentOccasionIndex + OCCASIONS_DATA.length) % OCCASIONS_DATA.length;
                            const isCenter = offset === 0;
                            const isLeft = offset === OCCASIONS_DATA.length - 1;
                            const isRight = offset === 1;

                            let transform = 'scale(0.6) translateZ(-400px)';
                            let zIndex = 0;
                            let opacity = 0.4;
                            
                            if (isCenter) {
                                transform = 'translateZ(0) scale(1)';
                                zIndex = 30;
                                opacity = 1;
                            } else if (isLeft) {
                                transform = 'translateX(-60%) translateZ(-200px) scale(0.8) rotateY(30deg)';
                                zIndex = 20;
                                opacity = 0.7;
                            } else if (isRight) {
                                transform = 'translateX(60%) translateZ(-200px) scale(0.8) rotateY(-30deg)';
                                zIndex = 20;
                                opacity = 0.7;
                            }

                            return (
                                <div
                                    key={occasion.key}
                                    className="absolute w-full h-full flex justify-center items-center transition-all duration-700 ease-in-out"
                                    style={{ transform, zIndex, opacity }}
                                >
                                    <div 
                                      className={`w-64 h-96 [transform-style:preserve-3d] rounded-lg ${isCenter ? 'cursor-pointer animate-glow' : ''}`}
                                      onClick={() => handleCardClick(index)}
                                    >
                                        <div className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${flippedCards.has(index) ? '[transform:rotateY(180deg)]' : ''}`}>
                                            {/* Front Face */}
                                            <div className="absolute w-full h-full [backface-visibility:hidden] rounded-lg overflow-hidden shadow-2xl">
                                                <img loading="lazy" src={`/images/${occasion.imageId}`} alt={t(occasion.key)} className="w-full h-full object-cover" onError={(e) => {
                                                  console.error(`Failed to load image: /images/${occasion.imageId}`);
                                                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                  e.currentTarget.style.display = 'flex';
                                                  e.currentTarget.style.alignItems = 'center';
                                                  e.currentTarget.style.justifyContent = 'center';
                                                  e.currentTarget.innerHTML = '<div style="color: #9ca3af; text-align: center; font-family: serif;">Brak obrazu</div>';
                                                }}/>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                                <h3 className="absolute bottom-4 left-4 text-2xl font-serif text-white [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">
                                                    {t(occasion.key)}
                                                </h3>
                                                {isCenter && !flippedCards.has(index) && (
                                                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 text-white text-xs rounded-full px-3 py-1 backdrop-blur-sm animate-gentle-bounce pointer-events-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.65-4.65l-2.12 2.12" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 15a9 9 0 01-14.65 4.65l2.12-2.12" />
                                                        </svg>
                                                        <span>{t('click_to_flip')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Back Face */}
                                            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg shadow-2xl overflow-hidden p-6 flex flex-col justify-center items-center text-center bg-white border-2 border-folk-red/30">
                                                <FlowerArtCorner className="absolute top-0 left-0 w-20 h-20 text-folk-red opacity-20 pointer-events-none" />
                                                <FlowerArtCorner className="absolute top-0 right-0 w-20 h-20 text-folk-red opacity-20 pointer-events-none transform rotate-90" />
                                                <FlowerArtCorner className="absolute bottom-0 left-0 w-20 h-20 text-folk-red opacity-20 pointer-events-none transform -rotate-90" />
                                                <FlowerArtCorner className="absolute bottom-0 right-0 w-20 h-20 text-folk-red opacity-20 pointer-events-none transform rotate-180" />
                                                <div className="relative z-10">
                                                    <h4 className="text-2xl font-serif font-bold text-folk-red mb-3">{t(occasion.key)}</h4>
                                                    <p className="text-sm text-text-dark-secondary mb-5">{t(occasion.descriptionKey)}</p>
                                                    <a
                                                        href="#reservation"
                                                        className="inline-flex items-center justify-center px-6 py-2 mt-2 text-base font-semibold text-black bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-md shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-out"
                                                    >
                                                        {t('book_now')}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </AnimatedSection>

            {/* Competition Section - Nederlandse Horeca Prijzen */}
            <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-4 border-amber-300 shadow-2xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-5">
                        <div className="absolute top-4 left-4 w-16 h-16 bg-amber-400 rounded-full animate-pulse"></div>
                        <div className="absolute top-12 right-8 w-12 h-12 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                        <div className="absolute bottom-8 left-12 w-20 h-20 bg-orange-400 rounded-full animate-pulse delay-700"></div>
                        <div className="absolute bottom-4 right-4 w-14 h-14 bg-amber-400 rounded-full animate-pulse delay-500"></div>
                    </div>
                    
                    {/* Folklor corners */}
                    <FlowerArtCorner className="absolute top-0 left-0 w-24 h-24 text-amber-500 opacity-30 pointer-events-none" />
                    <FlowerArtCorner className="absolute top-0 right-0 w-24 h-24 text-amber-500 opacity-30 pointer-events-none transform rotate-90" />
                    <FlowerArtCorner className="absolute bottom-0 left-0 w-24 h-24 text-amber-500 opacity-30 pointer-events-none transform -rotate-90" />
                    <FlowerArtCorner className="absolute bottom-0 right-0 w-24 h-24 text-amber-500 opacity-30 pointer-events-none transform rotate-180" />

                    <div className="relative z-10 p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Text Content */}
                            <div className="text-center md:text-left">
                                <div className="inline-block glass-card px-6 py-2 rounded-full mb-6 backdrop-blur-md bg-amber-100/50 border border-amber-300">
                                    <span className="text-amber-800 font-semibold text-sm uppercase tracking-wider">
                                        🏆 Konkurs 2025/2026
                                    </span>
                                </div>
                                
                                <h2 className="text-3xl md:text-4xl font-bold text-amber-900 font-serif mb-4 leading-tight">
                                    {t('competition_title')}
                                </h2>
                                
                                <h3 className="text-xl md:text-2xl font-semibold text-amber-800 mb-6">
                                    {t('competition_subtitle')}
                                </h3>
                                
                                <p className="text-amber-700 leading-relaxed mb-8 text-lg">
                                    {t('competition_description')}
                                </p>
                                
                                <a
                                    href="https://www.horecaprijzen.nl/pools-restaurant-leniwa-baba"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 rounded-xl shadow-2xl shadow-amber-500/50 hover:shadow-amber-400/70 hover:scale-105 active:scale-95 transition-all duration-300 bg-size-200 hover:bg-pos-100 border-2 border-amber-400 hover:border-amber-500"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    {t('vote_now')}
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                            
                            {/* Competition Image */}
                            <div className="flex justify-center items-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                                    <img
                                        src="/images/konkurs.jpg"
                                        alt="Nederlandse Horeca Prijzen 2025/2026"
                                        className="relative w-80 h-80 object-contain rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            console.error('Failed to load competition image');
                                            e.currentTarget.style.backgroundColor = '#f59e0b';
                                            e.currentTarget.style.display = 'flex';
                                            e.currentTarget.style.alignItems = 'center';
                                            e.currentTarget.style.justifyContent = 'center';
                                            e.currentTarget.innerHTML = '<div style="color: white; text-align: center; font-family: serif; font-size: 18px; font-weight: bold;">🏆<br/>Nederlandse<br/>Horeca Prijzen<br/>2025/2026</div>';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Advertisements Section - Filmy reklamowe */}
            <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-block glass-card px-6 py-2 rounded-full mb-6 backdrop-blur-md">
                        <span className="text-folk-blue font-semibold text-sm uppercase tracking-wider">{t('our_videos')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-folk-blue font-serif mb-4">
                        Zobacz nasze reklamy
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-text-dark-secondary max-w-2xl mx-auto">
                        Odkryj magię polskiej kuchni w naszych filmach promocyjnych
                    </p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl">
                            {ADVERTISEMENTS_DATA.map((ad, index) => {
                                const offset = (index - currentAdIndex + ADVERTISEMENTS_DATA.length) % ADVERTISEMENTS_DATA.length;
                                const isCenter = offset === 0;
                                const isLeft = offset === ADVERTISEMENTS_DATA.length - 1;
                                const isRight = offset === 1;
                                const isVisible = isCenter || isLeft || isRight;

                                return (
                                    <div
                                        key={ad.id}
                                        className={`transition-all duration-700 transform ${
                                            !isVisible ? 'hidden md:block opacity-0 scale-75' : 
                                            isCenter ? 'opacity-100 scale-105 ring-4 ring-folk-blue shadow-2xl shadow-folk-blue/50' :
                                            'opacity-70 scale-95'
                                        } ${isCenter ? 'z-20' : 'z-10'}`}
                                        style={{
                                            transform: !isVisible ? 'scale(0.75)' :
                                                     isCenter ? 'scale(1.05)' : 'scale(0.95)'
                                        }}
                                    >
                                        <div 
                                            className="relative w-full max-w-sm mx-auto aspect-[9/16] sm:aspect-[3/4] rounded-lg overflow-hidden shadow-lg group cursor-pointer bg-gray-900"
                                            onClick={(e) => {
                                                const video = e.currentTarget.querySelector('video');
                                                if (video) handleVideoClick(ad.id, video);
                                            }}
                                        >
                                            <video 
                                                className="w-full h-full object-cover"
                                                poster={ad.thumbnailUrl}
                                                muted={!playingVideos.has(ad.id)}
                                                controls={playingVideos.has(ad.id)}
                                                loop
                                                playsInline
                                                onError={(e) => {
                                                    console.warn(`Video failed to load: ${ad.videoUrl}, falling back to thumbnail`);
                                                    e.currentTarget.style.display = 'none';
                                                    const fallbackImg = e.currentTarget.nextElementSibling as HTMLImageElement;
                                                    if (fallbackImg) {
                                                        fallbackImg.style.display = 'block';
                                                    }
                                                }}
                                            >
                                                <source src={ad.videoUrl} type="video/mp4" />
                                                Twoja przeglądarka nie obsługuje video.
                                            </video>
                                            
                                            {/* Fallback image */}
                                            <img 
                                                src={ad.thumbnailUrl} 
                                                alt={ad.title} 
                                                className="w-full h-full object-cover hidden" 
                                                onError={(e) => {
                                                    console.error(`Both video and thumbnail failed for: ${ad.title}`);
                                                    e.currentTarget.style.backgroundColor = '#1f2937';
                                                    e.currentTarget.style.display = 'flex';
                                                    e.currentTarget.style.alignItems = 'center';
                                                    e.currentTarget.style.justifyContent = 'center';
                                                    e.currentTarget.innerHTML = '<div style="color: #9ca3af; text-align: center;">Brak filmu</div>';
                                                }}
                                            />
                                            
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <h3 className="text-lg sm:text-xl font-bold font-serif mb-2 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
                                                    {ad.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
                                                    {ad.description}
                                                </p>
                                            </div>
                                            
                                            {/* Play button overlay */}
                                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playingVideos.has(ad.id) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                                <div className="bg-folk-blue/80 rounded-full p-4 backdrop-blur-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {ADVERTISEMENTS_DATA.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentAdIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentAdIndex 
                                        ? 'bg-folk-blue scale-125 ring-2 ring-white/50' 
                                        : 'bg-gray-400 hover:bg-gray-600'
                                }`}
                                aria-label={`Przejdź do reklamy ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </AnimatedSection>



        </div>
    );
};
