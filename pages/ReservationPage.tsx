import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { RESTAURANT_PHONE_INTL, RESTAURANT_PHONE, FACEBOOK_URL } from '../constants';
import { AnimatedSection } from '../components/AnimatedSection';
import { FolkArtFlourish, FolkArtCorner, FlowerArtCorner } from '../components/icons/FolkArtIcons';

interface PageProps {
  id: string;
}

interface FormErrors {
  date?: string;
  phone?: string;
}

const FaqItem: React.FC<{ q: string, a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 px-2 text-left rounded-md transition-all duration-300 hover:bg-slate-100/50 hover:ring-1 hover:ring-folk-blue/30"
            >
                <span className="text-lg font-semibold text-text-dark">{q}</span>
                <svg className={`w-6 h-6 text-folk-red transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <p className="pt-0 pb-4 text-text-dark-secondary">{a}</p>
                </div>
            </div>
        </div>
    );
};

const ClassicReservationForm: React.FC = () => {
    const { t } = useAppContext();
    const [formData, setFormData] = useState({
        date: '',
        time: '18:00',
        people: 2,
        phone: '',
        name: '',
        special: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        
        if (!formData.date) {
            newErrors.date = t('date_required');
        }
        
        if (!formData.phone) {
            newErrors.phone = t('phone_required');
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            const message = `${t('whatsapp_reservation_message')}\n\n` +
                `${t('date')}: ${formData.date}\n` +
                `${t('time')}: ${formData.time}\n` +
                `${t('people')}: ${formData.people}\n` +
                `${t('name')}: ${formData.name}\n` +
                `${t('form_phone')}: ${formData.phone}\n` +
                `${t('special_requests')}: ${formData.special || t('none')}`;
            
            const whatsappUrl = `https://wa.me/${RESTAURANT_PHONE_INTL}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            console.error('Error creating WhatsApp message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative space-y-6 p-4 sm:p-6 md:p-8 bg-white rounded-lg border-2 border-folk-red/30 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Folkowe dekoracje w rogach */}
            <FlowerArtCorner className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-folk-red/20 pointer-events-none" />
            <FlowerArtCorner className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-folk-blue/20 pointer-events-none transform rotate-90" />
            <FlowerArtCorner className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-folk-yellow/20 pointer-events-none transform -rotate-90" />
            <FlowerArtCorner className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-folk-pink/20 pointer-events-none transform rotate-180" />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-folk-red/5 via-transparent to-folk-blue/5 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
                    <FolkArtFlourish className="text-folk-red/60 w-6 h-6 sm:w-8 sm:h-8" />
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-folk-red font-serif">{t('reservation_form_title')}</h2>
                    <FolkArtFlourish className="text-folk-red/60 w-6 h-6 sm:w-8 sm:h-8 transform scale-x-[-1]" />
                </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="reservation-date" className="block text-sm font-medium text-text-dark mb-2">
                        {t('date')} *
                    </label>
                    <input
                        id="reservation-date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        aria-label={t('date')}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-folk-red/50 transition-all duration-300 bg-white ${
                            errors.date ? 'border-red-500 focus:ring-red-500' : 'border-folk-red/30 focus:border-folk-red hover:border-folk-red/50'
                        }`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                <div>
                    <label htmlFor="reservation-time" className="block text-sm font-medium text-text-dark mb-2">
                        {t('time')}
                    </label>
                    <select
                        id="reservation-time"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        aria-label={t('time')}
                        className="w-full px-4 py-3 border-2 border-folk-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-folk-blue/50 focus:border-folk-blue hover:border-folk-blue/50 transition-all duration-300 bg-white"
                    >
                        {Array.from({ length: 13 }, (_, i) => {
                            const hour = 12 + i;
                            const time = `${hour.toString().padStart(2, '0')}:00`;
                            return (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="reservation-people" className="block text-sm font-medium text-text-dark mb-2">
                        {t('number_of_people')}
                    </label>
                    <select
                        id="reservation-people"
                        value={formData.people}
                        onChange={(e) => handleInputChange('people', parseInt(e.target.value))}
                        aria-label={t('number_of_people')}
                        className="w-full px-4 py-3 border-2 border-folk-yellow/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-folk-yellow/50 focus:border-folk-yellow hover:border-folk-yellow/50 transition-all duration-300 bg-white"
                    >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? t('person') : t('people_plural')}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                        {t('form_phone')} *
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t('phone_placeholder')}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-folk-green/50 transition-all duration-300 bg-white ${
                            errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-folk-green/30 focus:border-folk-green hover:border-folk-green/50'
                        }`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                    {t('name')}
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t('name_placeholder')}
                    className="w-full px-4 py-3 border-2 border-folk-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-folk-pink/50 focus:border-folk-pink hover:border-folk-pink/50 transition-all duration-300 bg-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                    {t('special_requests')}
                </label>
                <textarea
                    value={formData.special}
                    onChange={(e) => handleInputChange('special', e.target.value)}
                    placeholder={t('special_requests_placeholder')}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-folk-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-folk-blue/50 focus:border-folk-blue hover:border-folk-blue/50 transition-all duration-300 bg-white"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full bg-gradient-to-r from-folk-green to-folk-green/80 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-lg text-base sm:text-lg hover:from-folk-green/90 hover:to-folk-green/70 transition-all duration-300 active:scale-95 hover:shadow-2xl hover:shadow-folk-green/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 overflow-hidden group"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    {isSubmitting ? t('sending') : t('reserve_via_whatsapp')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-folk-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            </div>
        </form>
    );
};

export const ReservationPage: React.FC<PageProps> = ({ id }) => {
    const { t } = useAppContext();

    return (
        <div id={id} className="min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
                <AnimatedSection className="text-center mb-8 sm:mb-12 md:mb-16">
                    <div className="flex justify-center items-center gap-2 sm:gap-4 mb-6">
                        <FolkArtFlourish className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-folk-red" />
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-folk-red font-serif">{t('reservation_title')}</h1>
                        <FolkArtFlourish className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-folk-red transform scale-x-[-1]" />
                    </div>
                    <p className="text-xl text-text-dark-secondary max-w-2xl mx-auto">
                        {t('reservation_subtitle')}
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Form */}
                    <div className="lg:col-span-3">
                        <ClassicReservationForm />
                    </div>

                    {/* Info & FAQ */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <p className="text-center p-4 bg-blue-100 text-blue-900 border border-blue-200 rounded-lg font-semibold">{t('reservation_confirmation_info')}</p>
                            <p className="mt-4 text-center p-4 bg-yellow-100 text-yellow-900 border border-yellow-200 rounded-lg font-semibold">{t('reservation_large_group_info')}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-folk-red mb-4">{t('faq_title')}</h3>
                            <FaqItem q={t('faq1_q')} a={t('faq1_a')} />
                            <FaqItem q={t('faq2_q')} a={t('faq2_a')} />
                            <FaqItem q={t('faq3_q')} a={t('faq3_a')} />
                        </div>
                        <div className="space-y-4">
                            <a href={`tel:${RESTAURANT_PHONE}`} className="block w-full text-center bg-folk-green text-white font-bold py-3 px-4 rounded-md text-lg hover:bg-folk-green/80 transition-all duration-300 active:scale-95 hover:shadow-lg hover:shadow-folk-green/40">{t('call_now')}</a>
                            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-folk-blue text-white font-bold py-3 px-4 rounded-md text-lg hover:bg-folk-blue/80 transition-all duration-300 active:scale-95 hover:shadow-lg hover:shadow-folk-blue/40">{t('view_daily_menu_facebook')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationPage;
