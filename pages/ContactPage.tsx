import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { RESTAURANT_PHONE, FACEBOOK_URL, RESTAURANT_PHONE_INTL } from '../constants';
import { AnimatedSection } from '../components/AnimatedSection';
import { FolkArtFlourish, FlowerArtCorner } from '../components/icons/FolkArtIcons';
import { FacebookIcon } from '../components/icons/SocialIcons';

interface PageProps {
  id: string;
}

const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-folk-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-folk-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-folk-green" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-folk-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>


const ContactCard: React.FC<{ icon: React.ReactElement, title: string, children: React.ReactNode }> = ({ icon, title, children }) => {
    return (
        <div className="relative overflow-hidden bg-secondary-light p-4 sm:p-6 rounded-lg border border-slate-200 backdrop-blur-sm flex items-center space-x-3 sm:space-x-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-folk-blue/20 hover:-translate-y-1 hover:ring-2 hover:ring-folk-blue/50">
            <FlowerArtCorner className="absolute top-0 left-0 w-16 h-16 text-folk-red opacity-10 pointer-events-none" />
            <FlowerArtCorner className="absolute top-0 right-0 w-16 h-16 text-folk-red opacity-10 pointer-events-none transform rotate-90" />
            <FlowerArtCorner className="absolute bottom-0 left-0 w-16 h-16 text-folk-red opacity-10 pointer-events-none transform -rotate-90" />
            <FlowerArtCorner className="absolute bottom-0 right-0 w-16 h-16 text-folk-red opacity-10 pointer-events-none transform rotate-180" />
            <div className="relative flex-shrink-0">{icon}</div>
            <div className="relative">
                <h3 className="text-xl font-bold text-text-dark">{title}</h3>
                <div className="text-text-dark-secondary">{children}</div>
            </div>
        </div>
    );
};


export const ContactPage: React.FC<PageProps> = ({ id }) => {
    const { t } = useAppContext();
    const address = "Fahrenheitstraat 22, 2561 EC Den Haag";

    return (
        <div id={id} className="py-12 sm:py-16 md:py-24 bg-primary-light text-text-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center mb-8 sm:mb-12 md:mb-16">
                    <div className="flex justify-center items-center gap-4">
                        <FolkArtFlourish className="text-folk-red/50 hidden md:block" />
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-folk-red font-serif">{t('contact_title')}</h1>
                        <FolkArtFlourish className="text-folk-red/50 transform scale-x-[-1] hidden md:block" />
                    </div>
                    <p className="mt-4 text-xl text-text-dark-secondary max-w-3xl mx-auto">{t('contact_subtitle')}</p>
                </AnimatedSection>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Details & Hours */}
                    <div className="space-y-8">
                        <AnimatedSection>
                            <div className="space-y-6">
                                <ContactCard icon={<LocationIcon/>} title={t('address')}>
                                    <p>{address}</p>
                                </ContactCard>
                                <ContactCard icon={<PhoneIcon/>} title={t('phone')}>
                                    <a href={'tel:' + RESTAURANT_PHONE} className="hover:text-folk-red transition-colors">{RESTAURANT_PHONE}</a>
                                </ContactCard>
                                <ContactCard icon={<WhatsAppIcon/>} title={t('whatsapp')}>
                                    <a href={'https://wa.me/' + RESTAURANT_PHONE_INTL} target="_blank" rel="noopener noreferrer" className="hover:text-folk-red transition-colors">{t('whatsapp_click_to_chat')}</a>
                                </ContactCard>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection delay="duration-700">
                             <ContactCard icon={<ClockIcon/>} title={t('opening_hours')}>
                                <div className="text-sm sm:text-base md:text-lg space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-slate-200 w-full">
                                    <div className="flex justify-between items-center">
                                        <span>{t('monday_sunday')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>{t('opening_hours_restaurant')}</span>
                                        <span className="font-semibold">16:00 – 22:00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>{t('opening_hours_kitchen')}</span>
                                        <span className="font-semibold">{t('kitchen_hours_close')}</span>
                                    </div>
                                </div>
                             </ContactCard>
                        </AnimatedSection>
                    </div>

                    {/* Map */}
                    <AnimatedSection delay="duration-700">
                        <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden border-2 border-folk-red/30 shadow-xl">
                           <FlowerArtCorner className="absolute top-0 left-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none z-10" />
                            <FlowerArtCorner className="absolute top-0 right-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none transform rotate-90 z-10" />
                            <FlowerArtCorner className="absolute bottom-0 left-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none transform -rotate-90 z-10" />
                            <FlowerArtCorner className="absolute bottom-0 right-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none transform rotate-180 z-10" />
                           <iframe
                                src={'https://maps.google.com/maps?q=' + encodeURIComponent(address) + '&t=&z=15&ie=UTF8&iwloc=&output=embed'}
                                width="100%"
                                height="100%"
                                className="border-0"
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Mapa lokalizacji restauracji Leniwa Baba"
                                aria-label="Interaktywna mapa Google z lokalizacją restauracji"
                            ></iframe>
                        </div>
                    </AnimatedSection>
                </div>
                
                {/* CTA Buttons */}
                <AnimatedSection className="mt-16">
                    <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">
                         <a href={'tel:' + RESTAURANT_PHONE} className="text-center bg-folk-green text-white font-bold py-4 px-6 rounded-lg text-xl hover:bg-folk-green/80 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-folk-green/40">
                            {t('call_now')}
                        </a>
                        <a href={'https://wa.me/' + RESTAURANT_PHONE_INTL} target="_blank" rel="noopener noreferrer" className="text-center bg-teal-500 text-white font-bold py-4 px-6 rounded-lg text-xl hover:bg-teal-400 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-teal-400/40">
                             {t('whatsapp')}
                        </a>
                    </div>
                    <div 
                        className="text-center mt-12 p-8 rounded-lg shadow-lg border border-slate-200 relative overflow-hidden bg-cover bg-center bg-no-repeat"
                        style={{backgroundImage: "url('/images/TŁO FACEBOOK .jpg')"}}
                    >
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/60 rounded-lg"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">{t('daily_menu_facebook')}</h2>
                            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-folk-blue text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-folk-blue/80 transform active:scale-95 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-folk-blue/40">
                                <FacebookIcon className="w-6 h-6" />
                                {t('view_daily_menu_facebook')}
                            </a>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};